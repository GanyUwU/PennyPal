from google import genai
from google.genai import types
import os
from datetime import datetime, timedelta
from app.utils.supabase_client import SupabaseManager

class PaymentAgent:
    def __init__(self, supabase_manager: SupabaseManager):
        self.supabase_manager = supabase_manager
        self.client = genai.Client(api_key=os.getenv("GOOGLE_API_KEY"))
        
        self.system_prompt = """You are the **PennyPal Payment Agent**, an intelligent bill payment assistant.

Your responsibilities:
1. IMMEDIATELY check pending bills using get_pending_bills
2. Check available budget using get_available_budget
3. If surplus budget > 40% AND there are bills to pay, pay them using pay_bill
4. If budget is too low, inform the user they don't have enough surplus
5. NEVER ask for user information - it's already provided

CRITICAL RULES:
- DO NOT ask "What is your user ID?" - you already have it
- IMMEDIATELY call get_pending_bills and get_available_budget
- Only pay bills if surplus > 40% of total budget
- Prioritize: Overdue → Due within 3 days → Regular bills
- Provide clear, direct responses about what bills were paid or why payment wasn't possible
- Be concise and actionable in your responses
"""
        
        self.tools = [
            types.Tool(
                function_declarations=[
                    types.FunctionDeclaration(
                        name="get_pending_bills",
                        description="Get list of unpaid bills with due dates and amounts",
                        parameters=types.Schema(
                            type=types.Type.OBJECT,
                            properties={
                                "auth_id": types.Schema(type=types.Type.STRING, description="User ID")
                            },
                            required=["auth_id"]
                        )
                    ),
                    types.FunctionDeclaration(
                        name="pay_bill",
                        description="Pay a specific bill and update its status",
                        parameters=types.Schema(
                            type=types.Type.OBJECT,
                            properties={
                                "bill_id": types.Schema(type=types.Type.STRING, description="Bill ID to pay"),
                                "amount": types.Schema(type=types.Type.NUMBER, description="Amount to pay")
                            },
                            required=["bill_id", "amount"]
                        )
                    ),
                    types.FunctionDeclaration(
                        name="get_available_budget",
                        description="Get current available budget (budget - spent)",
                        parameters=types.Schema(
                            type=types.Type.OBJECT,
                            properties={
                                "auth_id": types.Schema(type=types.Type.STRING, description="User ID")
                            },
                            required=["auth_id"]
                        )
                    )
                ]
            )
        ]
        self.model = "gemini-2.5-flash"

    async def process_bills(self, auth_id: str, available_budget: float):
        """Main method to check and pay bills"""
        prompt = f"""Check pending bills for user and determine which bills to pay.
Available budget: ₹{available_budget}
Only pay bills if it's safe (won't leave budget too low).
Prioritize by due date and importance."""
        
        try:
            response = self.client.models.generate_content(
                model=self.model,
                contents=prompt,
                config=types.GenerateContentConfig(
                    system_instruction=self.system_prompt,
                    tools=self.tools
                )
            )
            
            # Handle tool calls
            if response.candidates and response.candidates[0].content.parts:
                for part in response.candidates[0].content.parts:
                    if hasattr(part, 'function_call') and part.function_call:
                        tool_name = part.function_call.name
                        tool_args = dict(part.function_call.args)
                        
                        # Execute tool
                        result = await self.execute_tool(tool_name, tool_args, auth_id)
                        
                        # Send result back to model for final decision
                        final_response = self.client.models.generate_content(
                            model=self.model,
                            contents=[
                                types.Content(role="user", parts=[types.Part(text=prompt)]),
                                types.Content(role="model", parts=[part]),
                                types.Content(role="user", parts=[types.Part(
                                    function_response=types.FunctionResponse(
                                        name=tool_name,
                                        response={"result": result}
                                    )
                                )])
                            ],
                            config=types.GenerateContentConfig(system_instruction=self.system_prompt)
                        )
                        return final_response.text
            
            return response.text if response.text else "No bills need payment at this time."
            
        except Exception as e:
            print(f"Payment Agent Error: {e}")
            import traceback
            traceback.print_exc()
            return f"Error processing bills: {str(e)}"

    async def execute_tool(self, name, args, auth_id):
        """Execute tools called by the agent"""
        if name == "get_pending_bills":
            return await self.get_pending_bills(auth_id)
        elif name == "pay_bill":
            return await self.pay_bill(args.get("bill_id"), args.get("amount"), auth_id)
        elif name == "get_available_budget":
            return await self.get_available_budget(auth_id)
        return {"error": "Unknown tool"}

    async def get_pending_bills(self, auth_id: str):
        """Fetch pending bills from payments table"""
        try:
            # Get ALL active bills (not just autopay-enabled)
            today = datetime.now().date()
            three_days_later = today + timedelta(days=3)
            
            result = self.supabase_manager.supabase.table("payments")\
                .select("*")\
                .eq("auth_id", auth_id)\
                .eq("status", "active")\
                .execute()
            
            if not result.data:
                return {"bills": [], "message": "No pending bills"}
            
            # Process all active bills
            pending_bills = []
            for bill in result.data:
                due_date = datetime.strptime(bill.get("due_date"), "%Y-%m-%d").date() if bill.get("due_date") else None
                
                # Determine priority based on due date
                is_overdue = due_date < today if due_date else False
                is_due_soon = due_date <= three_days_later if due_date else False
                
                if is_overdue:
                    priority = "high"
                elif is_due_soon:
                    priority = "medium"
                else:
                    priority = "low"
                
                pending_bills.append({
                    "id": bill["id"],
                    "name": bill["payment_name"],
                    "amount": float(bill["amount"]) if bill["amount"] else 0,
                    "due_date": str(due_date) if due_date else "N/A",
                    "category": bill.get("category", "Other"),
                    "priority": priority,
                    "is_overdue": is_overdue,
                    "autopay": bill.get("autopay") or bill.get("auto_payment_enabled", False)
                })
            
            # Sort by priority: overdue first, then by due date
            pending_bills.sort(key=lambda x: (not x["is_overdue"], x["due_date"]))
            
            return {
                "bills": pending_bills,
                "total_amount": sum(b["amount"] for b in pending_bills),
                "count": len(pending_bills)
            }
            
        except Exception as e:
            print(f"Error fetching pending bills: {e}")
            import traceback
            traceback.print_exc()
            return {"error": str(e), "bills": []}

    async def pay_bill(self, bill_id: str, amount: float, auth_id: str):
        """Pay a bill and update its status"""
        try:
            today = datetime.now().date()
            
            # Update payment record
            update_data = {
                "last_payment_date": str(today),
                "status": "completed"
            }
            
            # If it's a recurring payment, calculate next payment date
            bill_result = self.supabase_manager.supabase.table("payments")\
                .select("frequency, due_date")\
                .eq("id", bill_id)\
                .single()\
                .execute()
            
            if bill_result.data:
                frequency = bill_result.data.get("frequency", "").lower()
                if frequency in ["monthly", "weekly", "yearly"]:
                    # Calculate next payment date
                    if frequency == "monthly":
                        next_date = today + timedelta(days=30)
                    elif frequency == "weekly":
                        next_date = today + timedelta(days=7)
                    elif frequency == "yearly":
                        next_date = today + timedelta(days=365)
                    
                    update_data["next_payment_date"] = str(next_date)
                    update_data["status"] = "active"  # Keep active for recurring
            
            # Update the payment record
            result = self.supabase_manager.supabase.table("payments")\
                .update(update_data)\
                .eq("id", bill_id)\
                .execute()
            
            # Record the payment in spends table
            spend_record = {
                "auth_id": auth_id,
                "category": "Bill Payment",
                "spent_amt": amount,
                "description": f"Auto-paid bill #{bill_id}"
            }
            
            self.supabase_manager.supabase.table("spends").insert(spend_record).execute()
            
            return {
                "success": True,
                "bill_id": bill_id,
                "amount": amount,
                "paid_date": str(today),
                "message": f"Successfully paid ₹{amount}"
            }
            
        except Exception as e:
            print(f"Error paying bill: {e}")
            import traceback
            traceback.print_exc()
            return {"success": False, "error": str(e)}

    async def get_available_budget(self, auth_id: str):
        """Calculate available budget"""
        try:
            # Get spending data
            result = self.supabase_manager.supabase.table("spends")\
                .select("spent_amt, week_budget")\
                .eq("auth_id", auth_id)\
                .execute()
            
            total_spent = 0
            budget_limit = 0
            
            if result.data:
                total_spent = sum(row.get("spent_amt", 0) for row in result.data)
                budgets = [row.get("week_budget", 0) for row in result.data if row.get("week_budget", 0) > 0]
                budget_limit = budgets[-1] if budgets else 2000
            
            available = budget_limit - total_spent
            percentage_remaining = (available / budget_limit * 100) if budget_limit > 0 else 0
            
            return {
                "available": available,
                "budget": budget_limit,
                "spent": total_spent,
                "percentage_remaining": round(percentage_remaining, 1),
                "safe_to_pay": percentage_remaining > 40
            }
            
        except Exception as e:
            print(f"Error getting budget: {e}")
            return {"available": 0, "safe_to_pay": False, "error": str(e)}

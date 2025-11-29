from google import genai
from google.genai import types
import os
from app.utils.supabase_client import SupabaseManager

class BudgetAgent:
    def __init__(self, supabase_manager: SupabaseManager):
        self.supabase_manager = supabase_manager
        self.client = genai.Client(api_key=os.getenv("GOOGLE_API_KEY"))
        
        self.system_prompt = """You are PennyPal Budget Agent. 
NEVER ask for input. When checking budget, use get_current_spending with category='overall' and period='month'.
Give a 1-sentence friendly summary."""
        
        self.tools = [
            types.Tool(
                function_declarations=[
                    types.FunctionDeclaration(
                        name="get_current_spending",
                        description="Get spending and budget",
                        parameters=types.Schema(
                            type=types.Type.OBJECT,
                            properties={
                                "category": types.Schema(type=types.Type.STRING),
                                "period": types.Schema(type=types.Type.STRING)
                            },
                            required=["category", "period"]
                        )
                    )
                ]
            )
        ]
        self.model = "gemini-2.0-flash"

    async def check_budget_status(self, auth_id: str):
        """Check budget and return summary"""
        prompt = "Check overall spending for this month."

        try:
            response = self.client.models.generate_content(
                model=self.model,
                contents=prompt,
                config=types.GenerateContentConfig(
                    system_instruction=self.system_prompt,
                    tools=self.tools
                )
            )

            # If Gemini calls a tool
            if response.candidates and response.candidates[0].content.parts:
                for part in response.candidates[0].content.parts:
                    if hasattr(part, "function_call") and part.function_call:
                        tool_name = part.function_call.name

                        # Execute tool and get real spending
                        result = await self.execute_tool(tool_name, {}, auth_id)

                        # Send the returned data back to Gemini
                        final = self.client.models.generate_content(
                            model=self.model,
                            contents=[
                                types.Content(role="user", parts=[types.Part(text=prompt)]),
                                types.Content(role="model", parts=[part]),
                                types.Content(
                                    role="user",
                                    parts=[types.Part(
                                        function_response=types.FunctionResponse(
                                            name=tool_name,
                                            response={"result": result}
                                        )
                                    )]
                                )
                            ],
                            config=types.GenerateContentConfig(system_instruction=self.system_prompt)
                        )

                        # If Gemini replied, use it — otherwise fallback dynamic text
                        return final.text or f"📊 You've spent ₹{result['spent']} of ₹{result['limit']} ({result['percentage']}%)."
            
            # No function call → return plain Gemini text
            return response.text or "No AI response received."

        except Exception as e:
            print(f"Agent Error: {e}")
            return "⚠️ Could not check your budget. Try again later."

    async def autonomous_budget_check(self, auth_id: str):
        return await self.check_budget_status(auth_id)

    async def execute_tool(self, name, args, auth_id):
        if name == "get_current_spending":
            try:
                # Get actual spending from Supabase 'spends' table
                result = self.supabase_manager.supabase.table("spends")\
                    .select("spent_amt, total_spent")\
                    .eq("auth_id", auth_id)\
                    .execute()
                
                # Calculate total spent (use total_spent if available, otherwise sum spent_amt)
                if result.data:
                    # Try to get the latest total_spent value
                    total_spent = result.data[-1].get("total_spent", 0) if result.data else 0
                    # If total_spent is None or 0, sum all spent_amt
                    if not total_spent or total_spent == 0:
                        spent_values = [row.get("spent_amt", 0) for row in result.data if row.get("spent_amt") is not None]
                        total_spent = sum(spent_values) if spent_values else 0
                else:
                    total_spent = 0
                
                # Ensure total_spent is never None
                total_spent = total_spent or 0
                
                # Get user's budget from 'spends' table (week_budget column)
                budget_result = self.supabase_manager.supabase.table("spends")\
                    .select("week_budget")\
                    .eq("auth_id", auth_id)\
                    .limit(1)\
                    .execute()
                
                # Use week_budget from spends table, or default to 2000
                budget_limit = budget_result.data[0].get("week_budget", 2000) if budget_result.data else 2000
                
                return {
                    "spent": total_spent,
                    "limit": budget_limit,
                    "currency": "₹",
                    "percentage": round((total_spent / budget_limit * 100) if budget_limit > 0 else 0, 1)
                }
            except Exception as e:
                print(f"Error fetching spending data: {e}")
                import traceback
                traceback.print_exc()
                # Fallback to mock data if query fails
                return {"spent": 0, "limit": 2000, "currency": "₹", "percentage": 0}
        
        return {"error": "Unknown tool"}


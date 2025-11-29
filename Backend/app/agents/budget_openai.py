import json
from openai import OpenAI
import os

class BudgetAgentOpenAI:
    """OpenAI-powered Budget Agent for PennyPal"""
    
    def __init__(self, supabase_manager):
        self.supabase_manager = supabase_manager
        self.client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
        
        self.system_prompt = """
You are PennyPal: A helpful financial budgeting assistant.

Your job is to:
- Track user spending,
- Compare against budget,
- Warn if the user is close to overspending,
- Encourage good habits.

RULES:
1. NEVER invent numbers. Always call the required tool first.
2. If spending >= 75% of budget, send a warning.
3. If spending > budget, trigger a CRITICAL alert.
4. Tone: friendly, supportive, short sentences.
5. If user logs spending, store it then evaluate budget again.
"""
        
        self.tools = [
            {
                "type": "function",
                "function": {
                    "name": "get_spending_summary",
                    "description": "Retrieve user's spending + budget data.",
                    "parameters": {
                        "type": "object",
                        "properties": {
                            "auth_id": {"type": "string"}
                        },
                        "required": ["auth_id"]
                    }
                },
            },
            {
                "type": "function",
                "function": {
                    "name": "send_budget_alert",
                    "description": "Notify the user when overspending.",
                    "parameters": {
                        "type": "object",
                        "properties": {
                            "auth_id": {"type": "string"},
                            "message": {"type": "string"}
                        },
                        "required": ["auth_id", "message"]
                    }
                }
            }
        ]
    
    async def get_spending_summary(self, auth_id: str):
        """Fetch spending total + budget limit from Supabase."""
        try:
            # Get spending data from your 'spend' table
            result = self.supabase_manager.supabase.table("spend")\
                .select("spent_amt")\
                .eq("auth_id", auth_id)\
                .execute()
            
            # Get budget from 'users' table (assuming week_budget field exists)
            budget_row = self.supabase_manager.supabase.table("users")\
                .select("week_budget")\
                .eq("auth_id", auth_id)\
                .single()\
                .execute()
            
            total_spent = sum(expense["spent_amt"] for expense in result.data) if result.data else 0
            budget_limit = budget_row.data["week_budget"] * 4 if budget_row.data else 0  # Monthly budget
            
            return { 
                "spent": total_spent,
                "limit": budget_limit,
                "currency": "₹"
            }
        except Exception as e:
            print(f"Error fetching spending summary: {e}")
            return {"spent": 0, "limit": 0, "currency": "₹"}
    
    async def send_budget_alert(self, auth_id: str, message: str):
        """Send budget alert to user."""
        print(f"🚨 ALERT FOR {auth_id}: {message}")
        return {"status": "alert_sent", "message": message}
    
    async def check_budget_status(self, auth_id: str):
        """Main method called by FastAPI endpoint"""
        try:
            response = self.client.chat.completions.create(
                model="gpt-4o-mini",  # Fixed model name
                messages=[
                    {"role": "system", "content": self.system_prompt},
                    {"role": "user", "content": f"Check my current budget status. My user ID is {auth_id}"}
                ],
                tools=self.tools,
                tool_choice="auto"
            )
            
            message = response.choices[0].message
            
            # If LLM calls tools
            if message.tool_calls:
                for call in message.tool_calls:
                    fn_name = call.function.name
                    args = json.loads(call.function.arguments)
                    
                    # Execute tool
                    if fn_name == "get_spending_summary":
                        result = await self.get_spending_summary(**args)
                    elif fn_name == "send_budget_alert":
                        result = await self.send_budget_alert(**args)
                    else:
                        result = {"error": "Unknown tool"}
                    
                    # Send tool response back to agent
                    followup = self.client.chat.completions.create(
                        model="o3-mini",
                        messages=[
                            {"role": "system", "content": self.system_prompt},
                            message,
                            {"role": "tool", "content": json.dumps(result), "tool_call_id": call.id}
                        ]
                    )
                    return followup.choices[0].message.content
            
            # If no tools required
            return message.content
            
        except Exception as e:
            return f"Error: {str(e)}"
    
    async def autonomous_budget_check(self, auth_id: str):
        """Autonomous budget monitoring (called by background task)"""
        return await self.check_budget_status(auth_id)

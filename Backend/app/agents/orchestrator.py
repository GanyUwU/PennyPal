from app.utils.supabase_client import SupabaseManager
from app.agents.budget_agent import BudgetAgent
from app.agents.payment_agent import PaymentAgent

class NLPAgent:
    """Mock NLP Agent for processing expenses."""
    async def process_expense_data(self, expense_data: dict, auth_id: str):
        # In a real app, this would use Gemini to extract structured data from text
        return expense_data

class DecisionOrchestrator:
    def __init__(self, supabase_manager: SupabaseManager):
        self.supabase_manager = supabase_manager
        self.budget_agent = None
        self.payment_agent = None
        self.nlp_agent = None

    async def initialize_agents(self):
        """Initializes all AI agents."""
        print("Initializing AI Agents...")
        self.budget_agent = BudgetAgent(self.supabase_manager)
        self.payment_agent = PaymentAgent(self.supabase_manager)
        self.nlp_agent = NLPAgent()
        print("✅ Budget Agent, Payment Agent, and NLP Agent Initialized.")

    async def process_message(self, auth_id: str, message_text: str):
        """
        Process an incoming message and route to appropriate agent.
        """
        # Simple routing logic
        if "budget" in message_text.lower() or "spent" in message_text.lower():
            response = await self.budget_agent.check_budget_status(auth_id)
            return {"response": response}
        elif "pay" in message_text.lower() or "bill" in message_text.lower():
            response = await self.check_and_pay_bills(auth_id)
            return {"response": response}
        else:
            return {"response": "I can help you with your budget and bills. Try asking 'How is my budget?' or 'Pay my bills'"}

    async def check_and_pay_bills(self, auth_id: str):
        """
        Coordinate between Budget and Payment agents to pay bills.
        1. Check budget surplus with Budget Agent
        2. If surplus > 40%, trigger Payment Agent
        """
        try:
            # Get available budget
            budget_info = await self.payment_agent.get_available_budget(auth_id)
            
            if not budget_info.get("safe_to_pay", False):
                return {
                    "action": "no_surplus",
                    "message": f"Not enough surplus to pay bills. Available: ₹{budget_info.get('available', 0)} ({budget_info.get('percentage_remaining', 0)}% remaining)",
                    "budget_info": budget_info
                }
            
            # Trigger Payment Agent to process bills
            payment_result = await self.payment_agent.process_bills(
                auth_id, 
                budget_info.get("available", 0)
            )
            
            return {
                "action": "bills_processed",
                "budget_info": budget_info,
                "payment_result": payment_result
            }
            
        except Exception as e:
            print(f"Error in check_and_pay_bills: {e}")
            return {
                "action": "error",
                "message": f"Error processing bills: {str(e)}"
            }

    async def generate_dashboard_insights(self, auth_id: str):
        """Generates AI insights for the dashboard."""
        # Mock insights
        return [
            {"type": "tip", "text": "You're doing great on your savings goal!"},
            {"type": "warning", "text": "Dining expenses are 10% higher than last month."}
        ]

    async def get_agent_status(self, auth_id: str):
        """Returns the health status of agents."""
        # Check if Payment Agent has pending bills
        try:
            pending_bills = await self.payment_agent.get_pending_bills(auth_id)
            bills_count = pending_bills.get("count", 0)
        except:
            bills_count = 0
        
        return {
            "budget_agent": "active",
            "payment_agent": "active",
            "nlp_agent": "active",
            "orchestrator": "online",
            "pending_bills": bills_count
        }


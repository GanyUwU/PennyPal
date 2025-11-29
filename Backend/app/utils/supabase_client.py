from supabase import create_client, Client
import os
from typing import Dict, List, Any, Optional

class SupabaseManager:
    def __init__(self):
        self.supabase: Client = create_client(
            os.getenv("SUPABASE_URL"),
            os.getenv("SUPABASE_ANON_KEY")
        )
    
    # User Operations
    async def get_user_profile(self, auth_id: str) -> Dict[str, Any]:
        result = self.supabase.table("users").select("*").eq("auth_id", auth_id).single().execute()
        return result.data
    
    async def update_user_ai_preferences(self, auth_id: str, preferences: Dict[str, Any]):
        self.supabase.table("users").update({
            "ai_preferences": preferences,
            "last_active": "now()"
        }).eq("auth_id", auth_id).execute()
    
    # Expense Operations with AI Enhancement
    async def save_expense_with_ai(self, expense_data: Dict[str, Any]) -> Dict[str, Any]:
        # Enhanced expense saving with AI metadata
        result = self.supabase.table("spend").insert({
            **expense_data,
            "auto_categorized": expense_data.get("auto_categorized", False),
            "confidence_score": expense_data.get("confidence_score", 0.0),
            "predicted_category": expense_data.get("predicted_category")
        }).execute()
        return result.data[0]
    
    # Agent Learning Operations
    async def save_agent_learning(self, auth_id: str, agent_type: str, learning_data: Dict[str, Any], confidence: float):
        self.supabase.table("agent_learning").insert({
            "auth_id": auth_id,
            "agent_type": agent_type,
            "learning_data": learning_data,
            "confidence_score": confidence
        }).execute()
    
    async def get_user_learning_patterns(self, auth_id: str, agent_type: str) -> List[Dict[str, Any]]:
        result = self.supabase.table("agent_learning").select("*")\
            .eq("auth_id", auth_id)\
            .eq("agent_type", agent_type)\
            .order("created_at", desc=True)\
            .limit(50).execute()
        return result.data
    
    # Decision Logging
    async def log_autonomous_decision(self, auth_id: str, decision_type: str, 
                                    input_data: Dict[str, Any], decision: Dict[str, Any], 
                                    confidence: float) -> str:
        result = self.supabase.table("autonomous_decisions").insert({
            "auth_id": auth_id,
            "decision_type": decision_type,
            "input_data": input_data,
            "decision_made": decision,
            "confidence_score": confidence
        }).execute()
        return result.data[0]["id"]
    
    # Budget Operations
    async def get_user_spending_summary(self, auth_id: str) -> Dict[str, Any]:
        # Get current month spending
        result = self.supabase.rpc("get_monthly_spending_summary", {
            "user_auth_id": auth_id
        }).execute()
        return result.data
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import os
from dotenv import load_dotenv

load_dotenv()
from app.agents.orchestrator import DecisionOrchestrator
from app.utils.supabase_client import SupabaseManager

app = FastAPI(title="PennyPal Budget Agent API", version="1.0.0")

# CORS for React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize global components
supabase_manager = SupabaseManager()
decision_orchestrator = DecisionOrchestrator(supabase_manager)

@app.on_event("startup")
async def startup_event():
    """Initialize AI agents on startup"""
    await decision_orchestrator.initialize_agents()
    print("✅ All agents initialized successfully")

# API Endpoints for React Frontend

@app.get("/api/user/{auth_id}/dashboard")
async def get_user_dashboard(auth_id: str):
    """Get user dashboard data with real spending and budget"""
    try:
        # Fetch spending data from 'spends' table
        result = supabase_manager.supabase.table("spends")\
            .select("spent_amt, week_budget")\
            .eq("auth_id", auth_id)\
            .execute()
            
        total_spent = 0
        budget_limit = 0
        
        if result.data:
            # Calculate total spent
            total_spent = sum(row.get("spent_amt", 0) for row in result.data)
            
            # Find the latest budget set
            budgets = [row.get("week_budget", 0) for row in result.data if row.get("week_budget", 0) > 0]
            if budgets:
                budget_limit = budgets[-1]
            else:
                budget_limit = 2000
        
        return {
            "user": {"name": "User", "auth_id": auth_id},
            "spending": {
                "total": total_spent, 
                "budget": budget_limit,
                "percentage": round((total_spent / budget_limit * 100) if budget_limit > 0 else 0, 1)
            },
            "ai_insights": [
                {"type": "tip", "text": "Click 'CHECK MY BUDGET' to analyze your spending!"}
            ]
        }
    except Exception as e:
        print(f"Dashboard error: {e}")
        return {"user": {"name": "User"}, "spending": {"total": 0, "budget": 0}, "ai_insights": []}

@app.post("/api/user/{auth_id}/expense")
async def add_expense_via_api(auth_id: str, expense_data: dict):
    """Add expense through React UI - saves to 'spends' table"""
    try:
        spend_record = {
            "auth_id": auth_id,
            "category": expense_data.get("category", "Other"),
            "spent_amt": expense_data.get("amount", 0),
            "description": expense_data.get("payment_name", ""),
        }
        
        result = supabase_manager.supabase.table("spends").insert(spend_record).execute()
        alerts = await decision_orchestrator.budget_agent.check_budget_status(auth_id)
        
        return {
            "success": True,
            "expense": result.data[0] if result.data else {},
            "alerts": alerts
        }
    except Exception as e:
        print(f"Expense error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/user/{auth_id}/budget")
async def set_user_budget(auth_id: str, budget_data: dict):
    """Set weekly budget in spends table"""
    try:
        record = {
            "auth_id": auth_id,
            "category": "Budget Set",
            "description": "Weekly Budget Updated",
            "week_budget": budget_data.get("week_budget", 0),
            "spent_amt": 0
        }
        
        result = supabase_manager.supabase.table("spends").insert(record).execute()
        return {"success": True, "data": result.data}
    except Exception as e:
        print(f"Budget set error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/user/{auth_id}/ai-status")
async def get_ai_agent_status(auth_id: str):
    """Get status of all agents"""
    try:
        status = await decision_orchestrator.get_agent_status(auth_id)
        return status
    except Exception as e:
        return {"budget_agent": "active", "payment_agent": "active", "status": "ok"}

@app.post("/api/user/{auth_id}/budget-check")
async def check_budget_with_agent(auth_id: str):
    """Directly call the Budget Agent to analyze current budget status"""
    try:
        agent_response = await decision_orchestrator.budget_agent.check_budget_status(auth_id)
        
        return {
            "status": "success",
            "agent_response": agent_response,
            "timestamp": "now"
        }
    except Exception as e:
        print(f"Budget check error: {e}")
        raise HTTPException(status_code=500, detail=f"Agent error: {str(e)}")

@app.post("/api/user/{auth_id}/check-payments")
async def check_and_pay_bills(auth_id: str):
    """Trigger Payment Agent to check and pay bills if surplus budget available"""
    try:
        result = await decision_orchestrator.check_and_pay_bills(auth_id)
        return {
            "status": "success",
            "result": result
        }
    except Exception as e:
        print(f"Payment check error: {e}")
        raise HTTPException(status_code=500, detail=f"Payment error: {str(e)}")

@app.get("/api/user/{auth_id}/pending-bills")
async def get_pending_bills(auth_id: str):
    """Get list of pending bills"""
    try:
        bills = await decision_orchestrator.payment_agent.get_pending_bills(auth_id)
        return {
            "status": "success",
            "bills": bills
        }
    except Exception as e:
        print(f"Error fetching bills: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/user/{auth_id}/payment-status")
async def get_payment_status(auth_id: str):
    """Get Payment Agent status and pending bills count"""
    try:
        status = await decision_orchestrator.get_agent_status(auth_id)
        budget_info = await decision_orchestrator.payment_agent.get_available_budget(auth_id)
        
        return {
            "status": "success",
            "agent_status": status,
            "budget_info": budget_info
        }
    except Exception as e:
        print(f"Error getting payment status: {e}")
        raise HTTPException(status_code=500, detail=str(e))
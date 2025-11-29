# PennyPal  — Agentic AI Fintech Assistant

**PennyPal** is an AI-powered personal finance assistant built to help students and young professionals track expenses, manage budgets, and receive proactive budgeting advice — all through a simple chat / app interface.  

---

##  Project Overview

- **What it does:** Lets users log expenses, track spending, compare spending vs budget, and receive intelligent suggestions/warnings when they are close to overspending.  
- **Why it matters:** Students and early-career individuals often struggle with financial discipline. PennyPal aims to give them a *smart, friendly budget coach* rather than a complex financial app.  
- **How it works:** Behind the scenes, a backend agent (using AI + database) handles expense logging, computes totals vs budgets, and reasons about budget health. The front-end connects via API calls, enabling seamless interaction.  

---

##  Features

-  Natural-language expense logging (e.g. “Log ₹250 food”)  
-  Real-time budget analysis and spending summary  
-  Budget alerts when user crosses warning/critical thresholds  
-  Database persistence (expenses, budgets) — powered by Supabase  
-  Easy frontend-backend integration (REST API endpoints)  
-  Modular agent architecture — easy to extend (add wallets, subscriptions, forecasting)  
-  Hackathon-ready code structure, easy to deploy  

---

##  Tech Stack

| Layer | Technology |
|-------|-----------|
| Backend | Python, FastAPI, Supabase (PostgreSQL) |
| AI / Agent | OpenAI / alternative LLM + custom “Budget Agent” |
| Frontend | React (Vite) or Next.js (depending on setup) |
| DB & Auth | Supabase (tables for users, expenses, budgets) |
| Integration | REST API between frontend and backend |

---

##  Getting Started (Local Setup)

1. Clone the repo  
   ```bash
   git clone https://github.com/GanyUwU/PennyPal.git
   cd PennyPal
2. Setup environment variables
  OPENAI_API_KEY=your_openai_key  
  SUPABASE_URL=your_supabase_url  
  SUPABASE_KEY=your_supabase_anon_or_service_key

3.Install backend dependencies and start server
  ```bash
  cd Backend
  pip install -r requirements.txt
  uvicorn app.main:app --reload
  ```
4. Start frontend
 ```bash
  cd ../public       
  npm install
  npm run dev
 ```
If you're a student, developer, or early-career professional struggling with money management — PennyPal is built to simplify it.
Run it locally, test it out, experiment, and help evolve it — together, we can turn it into a real budgeting companion.
Happy budgeting!



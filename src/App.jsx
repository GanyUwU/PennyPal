"use client"

import { use, useState, useEffect } from "react"
import supabase from "./config/supabaseClient.js"
import "./App.css"
import {
  Button,
  Input,
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  Home,
  BarChart3,
  DollarSign,
  Settings,
  User,
  PieChart,
  Utensils,
  GraduationCap,
  Edit,
  Trash2,
  Filter,
  TrendingUp,
  Target,
  Moon,
  Sun,
  Bot,
} from "./components/ui/ui.jsx"
import { useAuth } from "./Authcontext.jsx"
import { useNavigate } from "react-router-dom"
import AddPaymentForm from "./components/addPayment.jsx"

function App() {
  const [activeTab, setActiveTab] = useState("DASHBOARD")
  const [isLoading, setIsLoading] = useState(false)
  const [darkMode, setDarkMode] = useState(false)
  const [aiAgents, setAiAgents] = useState([])
  const [dashboardData, setDashboardData] = useState(null)

  const { session, signOut } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDashboard = async () => {
      if (!session?.user?.id) return;

      try {
        // Use the auth_id from the session. 
        // Note: In a real app, you might use the user's UUID from Supabase auth.
        // Here we assume session.user.id is the auth_id expected by the backend.
        const response = await fetch(`http://localhost:8000/api/user/${session.user.id}/dashboard`);
        if (response.ok) {
          const data = await response.json();
          setDashboardData(data);
          // Transform backend insights/agents to frontend format if needed
          // For now, we'll assume the backend returns a list of agents/insights
          // Or we can mock the transformation here if the backend structure differs
          if (data.ai_insights) {
            // This is a placeholder. You might need to adjust based on actual backend response structure
            // For this demo, we will keep the mock agents if backend is empty, 
            // or merge them.
            console.log("Fetched dashboard data:", data);
          }
        }
      } catch (error) {
        console.error("Error fetching dashboard:", error);
      }
    };

    fetchDashboard();
  }, [session]);

  const handleTabChange = (tabId) => {
    if (tabId !== activeTab) {
      setIsLoading(true)
      setTimeout(() => {
        setActiveTab(tabId)
        setIsLoading(false)
      }, 300)
    }
  }
  console.log(supabase)

  const toggleDarkMode = () => {
    setDarkMode(!darkMode)
  }

  const tabs = [
    { id: "DASHBOARD", label: "DASHBOARD", icon: <Home className="w-5 h-5" /> },
    { id: "SPENDING", label: "SPENDING", icon: <BarChart3 className="w-5 h-5" /> },
    { id: "PAYMENTS", label: "PAYMENTS", icon: <DollarSign className="w-5 h-5" /> },
    { id: "CALENDAR", label: "BUDGET PLANNER", icon: <PieChart className="w-5 h-5" /> },
    { id: "SETTINGS", label: "SETTINGS", icon: <Settings className="w-5 h-5" /> },
  ]

  return (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? "dark bg-gray-900" : "bg-white"}`}>
      {/* Header */}
      <header
        className={`border-b-4 border-black p-4 transition-all duration-300 hover:shadow-lg ${darkMode ? "bg-gray-800" : "bg-blue-600"
          }`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div
              className={`w-12 h-12 border-4 border-black rounded-full flex items-center justify-center animate-pulse ${darkMode ? "bg-blue-600" : "bg-white"
                }`}
            >
              <div className={`w-6 h-6 rounded-full ${darkMode ? "bg-yellow-400" : "bg-blue-600"}`}></div>
            </div>
            <div>
              <h1 className="text-white font-black text-2xl tracking-tight">Penny Pal</h1>
              <p className={`font-bold text-sm ${darkMode ? "text-gray-300" : "text-blue-100"}`}>
                AUTONOMOUS LIFE MANAGEMENT
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className={`px-4 py-2 border-4 border-black ${darkMode ? "bg-gray-700" : "bg-white"}`}>
              <p className={`font-black text-sm ${darkMode ? "text-white" : "text-black"}`}>
                {session?.user?.email?.split("@")[0]?.toUpperCase() || "GUEST"}
              </p>
            </div>
            <Button
              className={`border-4 border-black font-black ${darkMode
                ? "bg-gray-700 text-white hover:bg-gray-600"
                : "bg-white text-black hover:bg-gray-100"
                }`}
            >
              <Settings className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className={`border-b-4 p-4 m-2 border-black ${darkMode ? "bg-gray-800" : "bg-gray-100"}`}>
        <div className="flex">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
              className={`px-6 py-4 font-black text-sm border-r-4 border-black transition-all duration-300 flex items-center gap-2 ${activeTab === tab.id
                ? `${darkMode ? "bg-blue-500" : "bg-blue-600"} text-white transform translate-y-[-2px] shadow-lg`
                : `${darkMode ? "bg-gray-700 text-white hover:bg-gray-600" : "bg-white text-black hover:bg-gray-50"} hover:transform hover:translate-y-[-1px]`
                }`}
            >
              <span className={`transition-transform duration-300 ${activeTab === tab.id ? "rotate-12" : ""}`}>
                {tab.icon}
              </span>
              {tab.label}
            </button>
          ))}
        </div>
      </nav>

      {/* Main Content */}
      <main className="p-6">
        <div className={`transition-all duration-500 ${isLoading ? "opacity-50 blur-sm" : "opacity-100"}`}>
          {activeTab === "DASHBOARD" && <DashboardContent darkMode={darkMode} aiAgents={aiAgents.length > 0 ? aiAgents : undefined} session={session} />}
          {activeTab === "SPENDING" && <SpendingContent darkMode={darkMode} />}
          {activeTab === "PAYMENTS" && <PaymentsContent darkMode={darkMode} />}
          {activeTab === "CALENDAR" && <BudgetPlannerContent darkMode={darkMode} />}
          {activeTab === "SETTINGS" && <SettingsContent darkMode={darkMode} toggleDarkMode={toggleDarkMode} />}
        </div>

        {isLoading && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-20 z-50">
            <div className="w-16 h-16 border-8 border-black border-t-blue-600 rounded-full animate-spin"></div>
          </div>
        )}
      </main>
    </div>
  )
}

// Payment Agent Card Component
function PaymentAgentCard({ darkMode, session }) {
  const [paymentStatus, setPaymentStatus] = useState(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [paymentResponse, setPaymentResponse] = useState("")

  useEffect(() => {
    const fetchPaymentStatus = async () => {
      if (!session?.user?.id) return
      try {
        const response = await fetch(`http://localhost:8000/api/user/${session.user.id}/payment-status`)
        const data = await response.json()
        if (data.status === "success") {
          setPaymentStatus(data)
        }
      } catch (error) {
        console.error("Error fetching payment status:", error)
      }
    }
    fetchPaymentStatus()
  }, [session])

  const triggerPayments = async () => {
    if (!session?.user?.id) {
      alert("Please log in to process payments")
      return
    }

    setIsProcessing(true)
    setPaymentResponse("Payment Agent is checking your bills...")

    try {
      const response = await fetch(`http://localhost:8000/api/user/${session.user.id}/check-payments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      })

      if (response.ok) {
        const data = await response.json()
        const result = data.result

        if (result.action === "bills_processed") {
          setPaymentResponse(`✅ ${result.payment_result}`)
        } else if (result.action === "no_surplus") {
          setPaymentResponse(`⚠️ ${result.message}`)
        } else {
          setPaymentResponse(result.message || "Payment check complete")
        }
      } else {
        setPaymentResponse("Failed to process payments")
      }
    } catch (error) {
      setPaymentResponse("❌ Error connecting to Payment Agent")
      console.error("Payment error:", error)
    } finally {
      setIsProcessing(false)
    }
  }

  const pendingBills = paymentStatus?.agent_status?.pending_bills || 0
  const budgetInfo = paymentStatus?.budget_info || {}
  const safeToPay = budgetInfo.safe_to_pay || false

  return (
    <div className={`border-4 border-black p-6 ${darkMode ? "bg-gradient-to-r from-green-900 to-teal-900 text-white" : "bg-gradient-to-r from-green-500 to-teal-500 text-white"}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center animate-pulse">
            <DollarSign className="w-10 h-10 text-green-600" />
          </div>
          <div>
            <h2 className="font-black text-2xl">PAYMENT AGENT (Gemini)</h2>
            <p className="font-bold text-sm opacity-90">AI-Powered Bill Payment</p>
            <div className="flex gap-4 mt-2">
              <span className="text-xs font-bold bg-white bg-opacity-20 px-2 py-1 rounded">
                {pendingBills} Pending Bills
              </span>
              <span className={`text-xs font-bold px-2 py-1 rounded ${safeToPay ? "bg-green-300 text-green-900" : "bg-yellow-300 text-yellow-900"}`}>
                {safeToPay ? "Surplus Available" : "Low Budget"}
              </span>
            </div>
          </div>
        </div>
        <Button
          onClick={triggerPayments}
          disabled={isProcessing}
          className="bg-white text-green-600 border-4 border-black font-black px-6 py-3 hover:bg-gray-100 disabled:opacity-50"
        >
          {isProcessing ? "PROCESSING..." : "PAY BILLS NOW"}
        </Button>
      </div>

      {paymentResponse && (
        <div className="mt-4 bg-white border-4 border-black p-4 rounded">
          <p className="font-bold text-lg text-black">{paymentResponse}</p>
        </div>
      )}
    </div>
  )
}

function DashboardContent({ darkMode, aiAgents: propAiAgents, session }) {

  const defaultAiAgents = [
    {
      id: "auto-pay",
      name: "AUTO-PAY AGENT",
      status: "Active",
      icon: <DollarSign className="w-6 h-6" />,
      description: "Automatically manages rent, utilities, and subscription payments",
      lastAction: "Paid rent ₹15,000 - 3 days early to avoid late fees",
      saved: "₹1,200",
    },
    {
      id: "budget-optimizer",
      name: "BUDGET OPTIMIZER",
      status: "Active",
      icon: <Target className="w-6 h-6" />,
      description: "Analyzes spending patterns and optimizes your budget allocation",
      lastAction: "Identified ₹2,500 in potential monthly savings",
      saved: "₹8,200",
    },
    {
      id: "assignment-scheduler",
      name: "ASSIGNMENT SCHEDULER",
      status: "Processing",
      icon: <GraduationCap className="w-6 h-6" />,
      description: "Manages deadlines and creates optimal study schedules",
      lastAction: "Created schedule for 5 upcoming assignments",
      saved: "₹0",
    },
    {
      id: "meal-planner",
      name: "MEAL PLANNER",
      status: "Active",
      icon: <Utensils className="w-6 h-6" />,
      description: "Plans nutritious, budget-friendly meals and grocery lists",
      lastAction: "Generated weekly meal plan - ₹1,800 grocery budget",
      saved: "₹3,200",
    },
    {
      id: "scholarship-hunter",
      name: "SCHOLARSHIP HUNTER",
      status: "Active",
      icon: <TrendingUp className="w-6 h-6" />,
      description: "Finds and applies to relevant scholarships automatically",
      lastAction: "Applied to 3 new scholarships worth ₹50,000 total",
      saved: "₹0",
    },
    {
      id: "housing-optimizer",
      name: "HOUSING OPTIMIZER",
      status: "Inactive",
      icon: <Home className="w-6 h-6" />,
      description: "Monitors housing market for better deals and manages utilities",
      lastAction: "Found 2 cheaper housing options - ₹3,000/month savings",
      saved: "₹4,500",
    },
  ]

  const aiAgents = propAiAgents || defaultAiAgents;

  const recentActivity = [
    {
      type: "RENT AUTOPAY",
      description: "Monthly rent payment processed automatically",
      amount: "+₹15,000",
      time: "2 hours ago",
      color: "green",
    },
    {
      type: "BUDGET OPTIMIZATION",
      description: "Found potential savings in subscription services",
      amount: "+₹850",
      time: "4 hours ago",
      color: "blue",
    },
    {
      type: "ASSIGNMENT REMINDER",
      description: "Physics homework due in 2 days - priority adjusted",
      amount: "",
      time: "6 hours ago",
      color: "purple",
    },
    {
      type: "GROCERY OPTIMIZATION",
      description: "Meal planner reduced weekly grocery cost",
      amount: "+₹450",
      time: "1 day ago",
      color: "green",
    },
  ]

  const [budgetAgentResponse, setBudgetAgentResponse] = useState("")
  const [isCheckingBudget, setIsCheckingBudget] = useState(false)

  const checkBudgetWithAgent = async () => {
    if (!session?.user?.id) {
      alert("Please log in to check your budget")
      return
    }

    setIsCheckingBudget(true)
    setBudgetAgentResponse("Budget Agent is analyzing your spending...")

    try {
      // Call the dedicated budget check endpoint
      const response = await fetch(`http://localhost:8000/api/user/${session.user.id}/budget-check`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (response.ok) {
        const data = await response.json()
        setBudgetAgentResponse(` ${data.agent_response}`)
      } else {
        setBudgetAgentResponse("Failed to get budget analysis")
      }
    } catch (error) {
      setBudgetAgentResponse(" Error connecting to Budget Agent. Check if backend is running.")
      console.error("Budget check error:", error)
    } finally {
      setIsCheckingBudget(false)
    }
  }

  return (

    <div className="space-y-8">
      {/* Budget Agent Status Card */}
      <div className={`border-4 border-black p-6 ${darkMode ? "bg-gradient-to-r from-blue-900 to-purple-900 text-white" : "bg-gradient-to-r from-blue-500 to-purple-500 text-white"}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center animate-pulse">
              <span className="text-4xl">bud</span>
            </div>
            <div>
              <h2 className="font-black text-2xl">BUDGET AGENT (Gemini)</h2>
              <p className="font-bold text-sm opacity-90">AI-Powered Budget Monitoring</p>
            </div>
          </div>
          <Button
            onClick={checkBudgetWithAgent}
            disabled={isCheckingBudget}
            className="bg-white text-blue-600 border-4 border-black font-black px-6 py-3 hover:bg-gray-100 disabled:opacity-50"
          >
            {isCheckingBudget ? "ANALYZING..." : "CHECK MY BUDGET"}
          </Button>
        </div>

        {budgetAgentResponse && (
          <div className="mt-4 bg-white bg-opacity-20 border-2 border-white p-4 rounded">
            <p className="font-bold text-lg">{budgetAgentResponse}</p>
          </div>
        )}
      </div>

      {/* Payment Agent Status Card */}
      <PaymentAgentCard darkMode={darkMode} session={session} />

      <div className="flex gap-4 border-4 p-4 border-black">
        <h1 >Wallet</h1>
        <p>Budget This Week</p>
        <p>Spent</p>

      </div>

      {/* AI Agents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {aiAgents.map((agent, index) => (
          <div
            key={agent.id}
            className={`border-4 border-black p-6 transition-all duration-500 hover:shadow-xl hover:transform hover:translate-y-[-4px] ${darkMode ? "bg-gray-800 text-white" : "bg-white"
              }`}
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div
                  className={`p-2 border-2 border-black ${darkMode ? "bg-gray-700 text-white" : "bg-black text-white"}`}
                >
                  {agent.icon}
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={`w-3 h-3 rounded-full ${agent.status === "Active"
                      ? "bg-green-500 animate-pulse"
                      : agent.status === "Processing"
                        ? "bg-yellow-500 animate-pulse"
                        : "bg-gray-400"
                      }`}
                  ></span>
                  <span className={`text-xs font-bold ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                    {agent.status}
                  </span>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="border-2 border-black hover:bg-blue-600 hover:text-white transition-all duration-300 bg-transparent"
                >
                  <Settings className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <h3 className="font-black text-lg mb-2">{agent.name}</h3>
            <p className={`text-sm font-bold mb-4 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
              {agent.description}
            </p>

            <div className="space-y-2">
              <div>
                <p className={`text-xs font-bold ${darkMode ? "text-gray-400" : "text-gray-600"}`}>LAST ACTION:</p>
                <p className="text-sm font-bold">{agent.lastAction}</p>
              </div>

              {agent.saved !== "₹0" && (
                <div className="bg-blue-600 text-white p-2 border-2 border-black">
                  <p className="text-xs font-bold">SAVED: {agent.saved}</p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <div className={`lg:col-span-1 border-8 border-black p-6 ${darkMode ? "bg-gray-800 text-white" : "bg-white"}`}>
          <h3 className="font-black text-xl mb-4 border-b-4 border-black pb-2">RECENT ACTIVITY</h3>
          <div className="space-y-4">
            {recentActivity.map((activity, index) => (
              <div
                key={index}
                className={`flex items-start gap-3 p-3 border-2 transition-all duration-300 hover:border-black ${darkMode ? "border-gray-600" : "border-gray-200"
                  }`}
              >
                <div
                  className={`w-3 h-3 rounded-full mt-2 ${activity.color === "green"
                    ? "bg-green-500"
                    : activity.color === "blue"
                      ? "bg-blue-500"
                      : "bg-purple-500"
                    }`}
                ></div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <p className="font-black text-sm">{activity.type}</p>
                    {activity.amount && <span className="text-green-600 font-black text-sm">{activity.amount}</span>}
                  </div>
                  <p className={`text-xs font-bold ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                    {activity.description}
                  </p>
                  <p className={`text-xs mt-1 ${darkMode ? "text-gray-500" : "text-gray-500"}`}>{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Monthly Budget */}
        <div className={`lg:col-span-2 border-8 border-black p-6 ${darkMode ? "bg-gray-800 text-white" : "bg-white"}`}>
          <h3 className="font-black text-xl mb-4 border-b-4 border-black pb-2">MONTHLY BUDGET</h3>
          <div className="space-y-4">
            {[
              { category: "RENT", spent: 15000, budget: 15000, color: "bg-red-500" },
              { category: "FOOD", spent: 8500, budget: 9000, color: "bg-green-500" },
              { category: "TRANSPORTATION", spent: 3200, budget: 4000, color: "bg-blue-500" },
              { category: "ENTERTAINMENT", spent: 2800, budget: 3500, color: "bg-purple-500" },
              { category: "UTILITIES", spent: 2500, budget: 3000, color: "bg-yellow-500" },
              { category: "MISCELLANEOUS", spent: 1800, budget: 2500, color: "bg-pink-500" },
            ].map((item, index) => {
              const percentage = (item.spent / item.budget) * 100
              const remaining = ((item.budget - item.spent) / item.budget) * 100
              return (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-black text-sm">{item.category}</span>
                    <span className="font-black text-sm">
                      ₹{item.spent} / ₹{item.budget}
                    </span>
                  </div>
                  <div className="flex border-4 border-black h-6">
                    <div
                      className={`${item.color} transition-all duration-1000`}
                      style={{ width: `${percentage}%` }}
                    ></div>
                    <div
                      className={`${darkMode ? "bg-gray-600" : "bg-gray-200"}`}
                      style={{ width: `${remaining}%` }}
                    ></div>
                  </div>
                  <p className={`text-xs font-bold ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                    {Math.round(remaining)}% REMAINING
                  </p>
                </div>
              )
            })}
          </div>

          <div className="mt-6 bg-blue-600 text-white p-4 border-4 border-black">
            <h4 className="font-black text-sm mb-2">AI OPTIMIZATION SUGGESTIONS:</h4>
            <ul className="text-xs font-bold space-y-1">
              <li>• REDUCE FOOD SPENDING BY ₹1,500/MONTH</li>
              <li>• SWITCH TO CHEAPER PHONE PLAN: SAVE ₹400</li>
              <li>• CANCEL UNUSED SUBSCRIPTIONS: SAVE ₹850</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

function SpendingContent({ darkMode }) {
  const [spendingData, setSpendingData] = useState({ total: 0, budget: 0, percentage: 0 })
  const [loading, setLoading] = useState(true)
  const [agentStatus, setAgentStatus] = useState(null)
  const { session } = useAuth()

  useEffect(() => {
    const fetchSpendingData = async () => {
      if (!session?.user?.id) return
      try {
        const response = await fetch(`http://localhost:8000/api/user/${session.user.id}/dashboard`)
        const data = await response.json()
        if (data.spending) {
          setSpendingData(data.spending)
        }
      } catch (error) {
        console.error("Error fetching spending data:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchSpendingData()
  }, [session])

  const checkBudget = async () => {
    setAgentStatus("Analyzing your budget...")
    try {
      const response = await fetch(`http://localhost:8000/api/user/${session.user.id}/budget-check`, {
        method: 'POST'
      })
      const data = await response.json()
      setAgentStatus(data.agent_response)
    } catch (error) {
      setAgentStatus("Error connecting to agent")
    }
  }

  return (
    <div className="space-y-6">
      <div className="border-b-4 border-black p-6">
        <div className="flex items-center justify-between">
          <h2 className={`text-3xl font-black pb-2 ${darkMode ? "text-white" : ""}`}>
            SPENDING ANALYTICS
          </h2>
          <div className="flex gap-4">
            <Button
              onClick={checkBudget}
              className="bg-purple-600 border-4 border-black font-black hover:bg-purple-700 animate-pulse"
            >
              <Bot className="w-4 h-4 mr-2" />
              CHECK MY BUDGET
            </Button>
            <Select defaultValue="this-month">
              <SelectTrigger className="w-40 border-4 border-black font-black">
                <SelectValue placeholder="THIS MONTH" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="this-month">THIS MONTH</SelectItem>
                <SelectItem value="last-month">LAST MONTH</SelectItem>
                <SelectItem value="last-3-months">LAST 3 MONTHS</SelectItem>
              </SelectContent>
            </Select>
            <Button className="bg-blue-600 border-4 border-black font-black hover:bg-blue-700">
              <Filter className="w-4 h-4 mr-2" />
              FILTER
            </Button>
          </div>
        </div>

        {/* Agent Status Alert */}
        {agentStatus && (
          <div className="mt-4 p-4 bg-yellow-100 border-4 border-black flex items-start gap-3">
            <Bot className="w-6 h-6 text-black" />
            <div>
              <p className="font-black text-sm">BUDGET AGENT SAYS:</p>
              <p className="font-bold text-lg">{agentStatus}</p>
            </div>
          </div>
        )}

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-6">
          <div className={`p-6 border-8 border-black ${darkMode ? "bg-gray-800 text-white" : "bg-black text-white"}`}>
            <p className="font-black text-sm mb-2">TOTAL SPENT</p>
            <p className="font-black text-3xl">₹{spendingData.total.toLocaleString()}</p>
          </div>
          <div className="bg-blue-600 text-white p-6 border-8 border-black">
            <p className="font-black text-sm mb-2">BUDGET LIMIT</p>
            <p className="font-black text-3xl">₹{spendingData.budget.toLocaleString()}</p>
          </div>
          <div className={`p-6 border-8 border-black ${darkMode ? "bg-gray-700 text-white" : "bg-white"}`}>
            <p className="font-black text-sm mb-2">BUDGET USED</p>
            <p className="font-black text-3xl">{spendingData.percentage}%</p>
          </div>
          <div className="bg-green-500 text-white p-6 border-8 border-black">
            <p className="font-black text-sm mb-2">REMAINING</p>
            <p className="font-black text-3xl">₹{(spendingData.budget - spendingData.total).toLocaleString()}</p>
          </div>
        </div>
      </div>

      {/* Category Breakdown and Monthly Trend */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className={`border-8 border-black p-6 ${darkMode ? "bg-gray-800 text-white" : "bg-white"}`}>
          <h3 className="font-black text-xl mb-4">CATEGORY BREAKDOWN</h3>
          <div className="space-y-4">
            {[
              { name: "Rent", amount: 15000, percentage: 45, transactions: 1, color: "bg-red-500" },
              { name: "Food", amount: 8500, percentage: 25, transactions: 47, color: "bg-green-500" },
              { name: "Transportation", amount: 3200, percentage: 9, transactions: 23, color: "bg-blue-500" },
              { name: "Entertainment", amount: 3000, percentage: 8, transactions: 15, color: "bg-purple-500" },
              { name: "Utilities", amount: 2500, percentage: 7, transactions: 4, color: "bg-yellow-500" },
              { name: "Education", amount: 2000, percentage: 6, transactions: 8, color: "bg-pink-500" },
            ].map((category, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-black text-sm flex items-center gap-2">
                    <div className={`w-4 h-4 ${category.color}`}></div>
                    {category.name}
                  </span>
                  <span className="font-black text-sm">₹{category.amount.toLocaleString()}</span>
                </div>
                <div className="flex border-4 border-black h-4">
                  <div className={`${category.color}`} style={{ width: `${category.percentage}%` }}></div>
                  <div className="bg-gray-200" style={{ width: `${100 - category.percentage}%` }}></div>
                </div>
                <div className="flex justify-between text-xs font-bold text-gray-600">
                  <span>{category.percentage}% OF TOTAL</span>
                  <span>{category.transactions} TRANSACTIONS</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className={`border-8 border-black p-6 ${darkMode ? "bg-gray-800 text-white" : "bg-white"}`}>
          <h3 className="font-black text-xl mb-4">MONTHLY TREND</h3>
          <div className="space-y-3">
            {[
              { month: "Jan", amount: 32000 },
              { month: "Feb", amount: 28500 },
              { month: "Mar", amount: 34000 },
              { month: "Apr", amount: 31200 },
              { month: "May", amount: 29800 },
              { month: "Jun", amount: 34000 },
            ].map((data, index) => (
              <div key={index} className="flex items-center gap-4">
                <span className="font-black text-sm w-8">{data.month}</span>
                <div className="flex-1 h-8 bg-gray-100 border-4 border-black relative">
                  <div
                    className="h-full bg-blue-500 absolute top-0 left-0"
                    style={{ width: `${(data.amount / 40000) * 100}%` }}
                  ></div>
                </div>
                <span className="font-black text-sm w-16 text-right">₹{(data.amount / 1000).toFixed(1)}k</span>
              </div>
            ))}
          </div>

          <div className="mt-6 bg-blue-600 text-white p-4 border-4 border-black">
            <h4 className="font-black text-sm mb-2">AI INSIGHTS:</h4>
            <ul className="text-xs font-bold space-y-1">
              <li>• SPENDING INCREASED 12% FROM LAST MONTH</li>
              <li>• FOOD EXPENSES UP 15% - CONSIDER MEAL PREP</li>
              <li>• TRANSPORTATION DOWN 8% - GOOD PROGRESS!</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

function PaymentsContent({ darkMode }) {
  const [activePaymentTab, setActivePaymentTab] = useState("AUTO-PAYMENTS")
  const [autoPayments, setAutoPayments] = useState([])
  const [loading, setLoading] = useState(true)

  const { session } = useAuth();

  useEffect(() => {
    const fetchAutoPayments = async () => {
      if (!session?.user?.id) return
      try {
        const response = await fetch(`http://localhost:8000/api/user/${session.user.id}/pending-bills`)
        const data = await response.json()
        if (data.status === "success" && data.bills) {
          // Filter only autopay-enabled bills
          const autopayBills = data.bills.bills.filter(bill => bill.autopay)
          setAutoPayments(autopayBills)
        }
      } catch (error) {
        console.error("Error fetching autopayments:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchAutoPayments()
  }, [session])

  const totalAutopay = autoPayments.reduce((sum, payment) => sum + payment.amount, 0)
  const activeCount = autoPayments.filter(p => p.priority !== 'completed').length
  const highPriority = autoPayments.filter(p => p.is_overdue || p.priority === 'high').length

  return (
    <div className="space-y-6">
      <h2 className={`text-3xl font-black border-b-4 border-black pb-2 ${darkMode ? "text-white" : ""}`}>
        PAYMENT MANAGEMENT
      </h2>

      {/* Payment Tabs */}
      <div className="flex gap-2">
        {["AUTO-PAYMENTS", "DUE ITEMS", "+ ADD NEW"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActivePaymentTab(tab)}
            className={`px-6 py-3 font-black text-sm border-4 border-black transition-all duration-300 ${activePaymentTab === tab
              ? "bg-blue-600 text-white"
              : `${darkMode ? "bg-gray-700 text-white hover:bg-gray-600" : "bg-white text-black hover:bg-gray-50"}`
              }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className={`p-6 border-8 border-black ${darkMode ? "bg-gray-800 text-white" : "bg-black text-white"}`}>
          <p className="font-black text-sm mb-2">MONTHLY AUTO-PAY</p>
          <p className="font-black text-3xl">₹{totalAutopay.toLocaleString()}</p>
        </div>
        <div className="bg-blue-600 text-white p-6 border-8 border-black">
          <p className="font-black text-sm mb-2">ACTIVE PAYMENTS</p>
          <p className="font-black text-3xl">{activeCount}</p>
        </div>
        <div className={`p-6 border-8 border-black ${darkMode ? "bg-gray-700 text-white" : "bg-white"}`}>
          <p className="font-black text-sm mb-2">HIGH PRIORITY DUES</p>
          <p className="font-black text-3xl">{highPriority}</p>
        </div>
      </div>

      {/* Payment Content */}
      {activePaymentTab === "AUTO-PAYMENTS" && (
        <div className={`border-8 border-black p-6 ${darkMode ? "bg-gray-800 text-white" : "bg-white"}`}>
          <h3 className="font-black text-xl mb-4">AUTOMATED PAYMENTS</h3>
          {loading ? (
            <p className="text-center py-8 font-bold">Loading payments...</p>
          ) : autoPayments.length === 0 ? (
            <p className="text-center py-8 font-bold">No autopay bills found. Enable autopay when adding a new payment!</p>
          ) : (
            <div className="space-y-4">
              {autoPayments.map((payment, index) => (
                <div key={index} className="border-4 border-black p-4 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <span className="font-black text-lg">{payment.name}</span>
                      <span className={`px-2 py-1 text-xs font-black ${payment.is_overdue ? 'bg-red-500' : 'bg-green-500'} text-white`}>
                        {payment.is_overdue ? 'OVERDUE' : 'ACTIVE'}
                      </span>
                    </div>
                  </div>
                  <div className="grid grid-cols-4 gap-8 flex-1 ml-8">
                    <div>
                      <p className="text-xs font-bold text-gray-600">AMOUNT:</p>
                      <p className="font-black">₹{payment.amount.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-600">DUE DATE:</p>
                      <p className="font-black">{payment.due_date}</p>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-600">CATEGORY:</p>
                      <p className="font-black">{payment.category}</p>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-600">PRIORITY:</p>
                      <p className="font-black uppercase">{payment.priority}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" className="bg-red-500 border-2 border-black font-black hover:bg-red-600">
                      DISABLE
                    </Button>
                    <Button size="sm" variant="outline" className="border-2 border-black font-black bg-transparent">
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="outline" className="border-2 border-black font-black bg-transparent">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* RUPALI WORK HERE*/}
      {activePaymentTab === "+ ADD NEW" && (
        <AddPaymentForm darkMode={darkMode}></AddPaymentForm>
      )}
    </div>
  )
}


// BDUGET PLANNER CONTENT

function BudgetPlannerContent({ darkMode }) {
  const [budget, setBudget] = useState("")
  const { session } = useAuth()

  const handleSetBudget = async (e) => {
    e.preventDefault()
    try {
      const response = await fetch(`http://localhost:8000/api/user/${session.user.id}/budget`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ week_budget: parseFloat(budget) })
      })
      if (response.ok) {
        alert("Budget updated successfully!")
        setBudget("")
      } else {
        alert("Failed to update budget")
      }
    } catch (error) {
      console.error("Error setting budget:", error)
      alert("Error setting budget")
    }
  }

  return (
    <div className="space-y-6">
      <h2 className={`text-3xl font-black border-b-4 border-black pb-2 ${darkMode ? "text-white" : ""}`}>
        BUDGET PLANNER
      </h2>
      <div className={`border-8 border-black p-6 ${darkMode ? "bg-gray-800 text-white" : "bg-white"}`}>
        <h3 className="font-black text-xl mb-4">SET WEEKLY BUDGET</h3>
        <form onSubmit={handleSetBudget} className="space-y-4">
          <div>
            <label className="block font-black text-sm mb-2">WEEKLY LIMIT (₹)</label>
            <input
              type="number"
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              className="w-full border-4 border-black p-2 font-bold text-black"
              placeholder="e.g. 5000"
              required
            />
          </div>
          <button type="submit" className="bg-green-600 text-white px-6 py-3 border-4 border-black font-black hover:bg-green-700">
            SAVE BUDGET
          </button>
        </form>
      </div>
    </div>
  )
}

function SettingsContent({ darkMode, toggleDarkMode }) {
  const { session } = useAuth()

  return (
    <div className="space-y-6">
      <h2 className={`text-3xl font-black border-b-4 border-black pb-2 ${darkMode ? "text-white" : ""}`}>SETTINGS</h2>
      <div className={`border-8 border-black p-6 ${darkMode ? "bg-gray-800 text-white" : "bg-white"}`}>
        <div className="space-y-6">
          {/* Dark Mode Toggle */}
          <div className={`flex items-center justify-between p-6 border-4 ${darkMode ? "border-gray-600 bg-gray-700" : "border-black bg-gray-50"}`}>
            <div>
              <h3 className="font-black text-lg">DARK MODE</h3>
              <p className={`text-sm font-bold ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
                Toggle between light and dark themes
              </p>
            </div>
            <Button
              onClick={toggleDarkMode}
              className={`font-black transition-all duration-300 ${darkMode
                ? "bg-yellow-500 text-black hover:bg-yellow-400 border-yellow-600"
                : "bg-gray-800 text-white hover:bg-gray-700"
                }`}
            >
              {darkMode ? (
                <>
                  <Sun className="w-4 h-4 mr-2" />
                  LIGHT MODE
                </>
              ) : (
                <>
                  <Moon className="w-4 h-4 mr-2" />
                  DARK MODE
                </>
              )}
            </Button>
          </div>

          {/* User Info */}
          <div className={`p-6 border-4 ${darkMode ? "border-gray-600 bg-gray-700" : "border-black bg-blue-50"}`}>
            <h3 className="font-black text-lg mb-4">ACCOUNT INFORMATION</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <User className="w-5 h-5" />
                <div>
                  <p className={`text-xs font-bold ${darkMode ? "text-gray-400" : "text-gray-500"}`}>USER ID</p>
                  <p className="font-black text-sm">{session?.user?.id?.slice(0, 20)}...</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <DollarSign className="w-5 h-5" />
                <div>
                  <p className={`text-xs font-bold ${darkMode ? "text-gray-400" : "text-gray-500"}`}>EMAIL</p>
                  <p className="font-black text-sm">{session?.user?.email || "Not available"}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Settings Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className={`p-6 border-4 ${darkMode ? "border-gray-600 bg-gray-700 hover:bg-gray-650" : "border-black bg-white hover:bg-gray-50"} transition-colors cursor-pointer`}>
              <h4 className="font-black text-md mb-2">NOTIFICATIONS</h4>
              <p className={`text-sm font-bold ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
                Manage your notification preferences
              </p>
              <div className="mt-4 space-y-2">
                <label className="flex items-center gap-2">
                  <input type="checkbox" defaultChecked className="w-4 h-4" />
                  <span className="text-sm font-bold">Budget Alerts</span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" defaultChecked className="w-4 h-4" />
                  <span className="text-sm font-bold">Payment Reminders</span>
                </label>
              </div>
            </div>

            <div className={`p-6 border-4 ${darkMode ? "border-gray-600 bg-gray-700 hover:bg-gray-650" : "border-black bg-white hover:bg-gray-50"} transition-colors cursor-pointer`}>
              <h4 className="font-black text-md mb-2">PRIVACY & SECURITY</h4>
              <p className={`text-sm font-bold ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
                Update your profile and security settings
              </p>
              <div className="mt-4">
                <Button className={`w-full ${darkMode ? "bg-blue-600 hover:bg-blue-700" : "bg-blue-500 hover:bg-blue-600"} text-white font-black`}>
                  CHANGE PASSWORD
                </Button>
              </div>
            </div>

            <div className={`p-6 border-4 ${darkMode ? "border-gray-600 bg-gray-700 hover:bg-gray-650" : "border-black bg-white hover:bg-gray-50"} transition-colors cursor-pointer`}>
              <h4 className="font-black text-md mb-2">DATA & EXPORT</h4>
              <p className={`text-sm font-bold ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
                Download your spending data
              </p>
              <div className="mt-4">
                <Button className={`w-full ${darkMode ? "bg-green-600 hover:bg-green-700" : "bg-green-500 hover:bg-green-600"} text-white font-black`}>
                  EXPORT DATA
                </Button>
              </div>
            </div>

            <div className={`p-6 border-4 ${darkMode ? "border-gray-600 bg-gray-700 hover:bg-gray-650" : "border-black bg-white hover:bg-gray-50"} transition-colors cursor-pointer`}>
              <h4 className="font-black text-md mb-2">ABOUT</h4>
              <p className={`text-sm font-bold ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
                App version and information
              </p>
              <div className="mt-4">
                <p className="text-xs font-bold">Version 1.0.0</p>
                <p className={`text-xs font-bold ${darkMode ? "text-gray-400" : "text-gray-500"}`}>© 2024 PennyPal</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App

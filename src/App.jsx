"use client"

import { use, useState } from "react"
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
} from "./components/ui/ui.jsx"
import { useAuth } from "./Authcontext.jsx"
import { useNavigate } from "react-router-dom"
import AddPaymentForm from "./components/addPayment.jsx"

function App() {
  const [activeTab, setActiveTab] = useState("DASHBOARD")
  const [isLoading, setIsLoading] = useState(false)
  const [darkMode, setDarkMode] = useState(false)

  const {session, signOut} = useAuth();
  const navigate = useNavigate(); 

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
        className={`border-b-4 border-black p-4 transition-all duration-300 hover:shadow-lg ${
          darkMode ? "bg-gray-800" : "bg-blue-600"
        }`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div
              className={`w-12 h-12 border-2 border-black rounded-full flex items-center justify-center animate-pulse ${
                darkMode ? "bg-gray-700" : "bg-white"
              }`}
            >
              <div className={`w-6 h-6 rounded-full ${darkMode ? "bg-blue-400" : "bg-blue-600"}`}></div>
            </div>
            <div>
              <h1 className="text-white font-black text-2xl tracking-tight">Penny Pal</h1>
              <p className={`font-bold text-sm ${darkMode ? "text-gray-300" : "text-blue-100"}`}>
                AUTONOMOUS LIFE MANAGEMENT
              </p>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="text-right">
              <p className={`font-bold text-sm ${darkMode ? "text-gray-300" : "text-blue-100"}`}>TOTAL AI SAVINGS</p>
              <p className="text-white font-black text-2xl transition-all duration-500 hover:scale-110">₹42,150</p>
            </div>
            <div
              className={`flex items-center gap-2 border-2 border-black px-4 py-2 transition-all duration-300 hover:shadow-lg hover:translate-y-[-2px] ${
                darkMode ? "bg-gray-700 text-white" : "bg-white"
              }`}
            >
              <User className="w-5 h-5" />
              <div>
                <p className="font-black text-sm">{session?.user?.user_metadata?.name}</p>
                <p className={`text-xs font-bold ${darkMode ? "text-gray-400" : "text-gray-600"}`}>{session?.user?.user_metadata?.occupation}</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className={`text-white border-2 border-white transition-all duration-300 hover:scale-110 ${
                darkMode ? "hover:bg-gray-700" : "hover:bg-blue-700"
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
              className={`px-6 py-4 font-black text-sm border-r-4 border-black transition-all duration-300 flex items-center gap-2 ${
                activeTab === tab.id
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
          {activeTab === "DASHBOARD" && <DashboardContent darkMode={darkMode} />}
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

function DashboardContent({ darkMode }) {
 
  const aiAgents = [
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

  return (

    <div className="space-y-8">
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
            className={`border-4 border-black p-6 transition-all duration-500 hover:shadow-xl hover:transform hover:translate-y-[-4px] ${
              darkMode ? "bg-gray-800 text-white" : "bg-white"
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
                    className={`w-3 h-3 rounded-full ${
                      agent.status === "Active"
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
                  <p className="text-xs font-bold">💰 SAVED: {agent.saved}</p>
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
                className={`flex items-start gap-3 p-3 border-2 transition-all duration-300 hover:border-black ${
                  darkMode ? "border-gray-600" : "border-gray-200"
                }`}
              >
                <div
                  className={`w-3 h-3 rounded-full mt-2 ${
                    activity.color === "green"
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
  return (
    <div className="space-y-6">
      <div className="border-b-4 border-black p-6">
      <div className="flex items-center justify-between">
        <h2 className={`text-3xl font-black pb-2 ${darkMode ? "text-white" : ""}`}>
          SPENDING ANALYTICS
        </h2>
        <div className="flex gap-4">
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

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className={`p-6 border-8 border-black ${darkMode ? "bg-gray-800 text-white" : "bg-black text-white"}`}>
          <p className="font-black text-sm mb-2">TOTAL SPENT</p>
          <p className="font-black text-3xl">₹34,000</p>
        </div>
        <div className="bg-blue-600 text-white p-6 border-8 border-black">
          <p className="font-black text-sm mb-2">DAILY AVERAGE</p>
          <p className="font-black text-3xl">₹1,133</p>
        </div>
        <div className={`p-6 border-8 border-black ${darkMode ? "bg-gray-700 text-white" : "bg-white"}`}>
          <p className="font-black text-sm mb-2">TRANSACTIONS</p>
          <p className="font-black text-3xl">98</p>
        </div>
        <div className="bg-green-500 text-white p-6 border-8 border-black">
          <p className="font-black text-sm mb-2">AI SAVED</p>
          <p className="font-black text-3xl">₹5,200</p>
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
                <div className="flex-1 flex border-4 border-black h-8">
                  <div
                    className="bg-blue-600 transition-all duration-1000"
                    style={{ width: `${(data.amount / 35000) * 100}%` }}
                  ></div>
                  <div className="bg-gray-200" style={{ width: `${100 - (data.amount / 35000) * 100}%` }}></div>
                </div>
                <span className="font-black text-sm w-20">₹{data.amount.toLocaleString()}</span>
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
 
  const {handleAddPayment} = useAuth();

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
            className={`px-6 py-3 font-black text-sm border-4 border-black transition-all duration-300 ${
              activePaymentTab === tab
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
          <p className="font-black text-3xl">₹17,000</p>
        </div>
        <div className="bg-blue-600 text-white p-6 border-8 border-black">
          <p className="font-black text-sm mb-2">ACTIVE PAYMENTS</p>
          <p className="font-black text-3xl">3</p>
        </div>
        <div className={`p-6 border-8 border-black ${darkMode ? "bg-gray-700 text-white" : "bg-white"}`}>
          <p className="font-black text-sm mb-2">HIGH PRIORITY DUES</p>
          <p className="font-black text-3xl">2</p>
        </div>
      </div>

      {/* Payment Content */}
      {activePaymentTab === "AUTO-PAYMENTS" && (
        <div className={`border-8 border-black p-6 ${darkMode ? "bg-gray-800 text-white" : "bg-white"}`}>
          <h3 className="font-black text-xl mb-4">AUTOMATED PAYMENTS</h3>
          <div className="space-y-4">
            {[
              {
                name: "Monthly Rent",
                status: "ACTIVE",
                amount: "₹15,000",
                dueDate: "1 of every month",
                nextPayment: "1 Jul 2024",
                method: "HDFC Bank ****1234",
              },
              {
                name: "Electricity Bill",
                status: "ACTIVE",
                amount: "₹1,200",
                dueDate: "5 of every month",
                nextPayment: "5 Jul 2024",
                method: "SBI Bank ****5678",
              },
              {
                name: "Internet Bill",
                status: "ACTIVE",
                amount: "₹800",
                dueDate: "10 of every month",
                nextPayment: "10 Jul 2024",
                method: "HDFC Bank ****1234",
              },
            ].map((payment, index) => (
              <div key={index} className="border-4 border-black p-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <span className="font-black text-lg">{payment.name}</span>
                    <span className="bg-green-500 text-white px-2 py-1 text-xs font-black">{payment.status}</span>
                  </div>
                </div>
                <div className="grid grid-cols-4 gap-8 flex-1 ml-8">
                  <div>
                    <p className="text-xs font-bold text-gray-600">AMOUNT:</p>
                    <p className="font-black">{payment.amount}</p>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-600">DUE DATE:</p>
                    <p className="font-black">{payment.dueDate}</p>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-600">NEXT PAYMENT:</p>
                    <p className="font-black">{payment.nextPayment}</p>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-600">PAYMENT METHOD:</p>
                    <p className="font-black">{payment.method}</p>
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
  return (
    <div className="space-y-6">
      <h2 className={`text-3xl font-black border-b-4 border-black pb-2 ${darkMode ? "text-white" : ""}`}>
        BUDGET PLANNER
      </h2>
      <div className={`border-8 border-black p-6 ${darkMode ? "bg-gray-800 text-white" : "bg-white"}`}>
        <h1>Add budget</h1>
      </div>
    </div>
  )
}

function SettingsContent({ darkMode, toggleDarkMode }) {
  return (
    <div className="space-y-6">
      <h2 className={`text-3xl font-black border-b-4 border-black pb-2 ${darkMode ? "text-white" : ""}`}>SETTINGS</h2>
      <div className={`border-8 border-black p-6 ${darkMode ? "bg-gray-800 text-white" : "bg-white"}`}>
        <div className="space-y-6">
          <div className="flex items-center justify-between p-4 border-4 border-black">
            <div>
              <h3 className="font-black text-lg">DARK MODE</h3>
              <p className={`text-sm font-bold ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                Toggle between light and dark themes
              </p>
            </div>
            <Button
              onClick={toggleDarkMode}
              className={`font-black transition-all duration-300 ${
                darkMode ? "bg-yellow-500 text-black hover:bg-yellow-400" : "bg-gray-800 text-white hover:bg-gray-700"
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-4 border-4 border-black">
              <h4 className="font-black text-md mb-2">NOTIFICATIONS</h4>
              <p className={`text-sm font-bold ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                Manage your notification preferences
              </p>
            </div>
            <div className="p-4 border-4 border-black">
              <h4 className="font-black text-md mb-2">ACCOUNT</h4>
              <p className={`text-sm font-bold ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                Update your profile and security settings
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App

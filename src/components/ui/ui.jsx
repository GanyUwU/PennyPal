"use client"

// Improved Button component with proper variants and styling
const Button = ({
  children,
  className = "",
  variant = "default",
  size = "default",
  onClick,
  disabled = false,
  ...props
}) => {
  const baseStyles =
    "inline-flex items-center justify-center font-bold border-4 border-black transition-all duration-200 cursor-pointer select-none"

  const variants = {
    default: "bg-white text-black hover:bg-gray-100 active:translate-x-1 active:translate-y-1",
    primary: "bg-blue-500 text-white hover:bg-blue-600 active:translate-x-1 active:translate-y-1",
    destructive: "bg-red-500 text-white hover:bg-red-600 active:translate-x-1 active:translate-y-1",
    outline: "bg-transparent border-black hover:bg-black hover:text-white active:translate-x-1 active:translate-y-1",
    ghost: "border-transparent hover:bg-gray-100 hover:border-black active:translate-x-1 active:translate-y-1",
  }

  const sizes = {
    default: "px-4 py-2 text-base",
    sm: "px-3 py-1 text-sm",
    lg: "px-6 py-3 text-lg",
    icon: "p-2",
  }

  const disabledStyles = disabled
    ? "opacity-50 cursor-not-allowed hover:bg-current active:translate-x-0 active:translate-y-0"
    : ""

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${disabledStyles} ${className}`}
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  )
}

// Improved Input component with proper styling
const Input = ({ className = "", type = "text", placeholder, ...props }) => (
  <input
    type={type}
    placeholder={placeholder}
    className={`w-full px-4 py-2 border-4 border-black bg-white text-black placeholder-gray-500 focus:outline-none focus:ring-0 focus:border-blue-500 transition-colors duration-200 ${className}`}
    {...props}
  />
)

// Improved Select component with proper dropdown functionality
const Select = ({ children, defaultValue, onValueChange, className = "" }) => {
  return (
    <select
      defaultValue={defaultValue}
      onChange={(e) => onValueChange && onValueChange(e.target.value)}
      className={`w-full px-4 py-2 border-4 border-black bg-white text-black focus:outline-none focus:ring-0 focus:border-blue-500 transition-colors duration-200 cursor-pointer ${className}`}
    >
      {children}
    </select>
  )
}

const SelectTrigger = ({ children, className = "" }) => <div className={`select-trigger ${className}`}>{children}</div>

const SelectValue = ({ placeholder }) => <span>{placeholder}</span>

const SelectContent = ({ children }) => <div className="select-content">{children}</div>

const SelectItem = ({ value, children }) => <option value={value}>{children}</option>

const Home = ({ className = "", size = 20 }) => (
  <svg
    className={className}
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    <polyline points="9,22 9,12 15,12 15,22" />
  </svg>
)

const BarChart3 = ({ className = "", size = 20 }) => (
  <svg
    className={className}
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="M3 3v18h18" />
    <path d="m19 9-5 5-4-4-3 3" />
  </svg>
)

const DollarSign = ({ className = "", size = 20 }) => (
  <svg
    className={className}
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <line x1="12" y1="1" x2="12" y2="23" />
    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
  </svg>
)

const Settings = ({ className = "", size = 20 }) => (
  <svg
    className={className}
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <circle cx="12" cy="12" r="3" />
    <path d="m12 1 1.68 2.32L16 4l.68 2.32L19 8l-.32 1.68L20 12l-1.32 1.68L19 16l-2.32.68L15 19l-1.68-.32L12 20l-1.68-1.32L9 19l-.68-2.32L6 16l.32-1.68L5 12l1.32-1.68L6 8l2.32-.68L9 5l1.68.32L12 1z" />
  </svg>
)

const User = ({ className = "", size = 20 }) => (
  <svg
    className={className}
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
)

const PieChart = ({ className = "", size = 20 }) => (
  <svg
    className={className}
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="M21.21 15.89A10 10 0 1 1 8 2.83" />
    <path d="m22 12-10-10v10z" />
  </svg>
)

const Utensils = ({ className = "", size = 20 }) => (
  <svg
    className={className}
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="m12 11 4-4a2 2 0 0 1 3 3l-4 4" />
    <path d="m21 3-6.5 6.5a2.5 2.5 0 0 1-3.5 0L8 6.5a2.5 2.5 0 0 1 0-3.5L14.5 3a2.5 2.5 0 0 1 3.5 0L21 3z" />
    <path d="M5 21a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h3" />
  </svg>
)

const GraduationCap = ({ className = "", size = 20 }) => (
  <svg
    className={className}
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
    <path d="M6 12v5c3 3 9 3 12 0v-5" />
  </svg>
)

const Edit = ({ className = "", size = 20 }) => (
  <svg
    className={className}
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
    <path d="m18.5 2.5 3 3L12 15l-4 1 1-4 9.5-9.5z" />
  </svg>
)

const Trash2 = ({ className = "", size = 20 }) => (
  <svg
    className={className}
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="m3 6 18 0" />
    <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
    <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
    <line x1="10" y1="11" x2="10" y2="17" />
    <line x1="14" y1="11" x2="14" y2="17" />
  </svg>
)

const Filter = ({ className = "", size = 20 }) => (
  <svg
    className={className}
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <polygon points="22,3 2,3 10,12.46 10,19 14,21 14,12.46" />
  </svg>
)

const TrendingUp = ({ className = "", size = 20 }) => (
  <svg
    className={className}
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <polyline points="22,7 13.5,15.5 8.5,10.5 2,17" />
    <polyline points="16,7 22,7 22,13" />
  </svg>
)

const Target = ({ className = "", size = 20 }) => (
  <svg
    className={className}
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <circle cx="12" cy="12" r="10" />
    <circle cx="12" cy="12" r="6" />
    <circle cx="12" cy="12" r="2" />
  </svg>
)

const Calendar = ({ className = "", size = 20 }) => (
  <svg
    className={className}
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </svg>
)

const Moon = ({ className = "", size = 20 }) => (
  <svg
    className={className}
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
  </svg>
)

const Sun = ({ className = "", size = 20 }) => (
  <svg
    className={className}
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <circle cx="12" cy="12" r="5" />
    <line x1="12" y1="1" x2="12" y2="3" />
    <line x1="12" y1="21" x2="12" y2="23" />
    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
    <line x1="1" y1="12" x2="3" y2="12" />
    <line x1="21" y1="12" x2="23" y2="12" />
    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
  </svg>
)

const Plus = ({ className = "", size = 20 }) => (
  <svg
    className={className}
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
)

const Check = ({ className = "", size = 20 }) => (
  <svg
    className={className}
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <polyline points="20,6 9,17 4,12" />
  </svg>
)

export {
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
  Calendar,
  Moon,
  Sun,
  Plus,
  Check,
  Bot,
}

const Bot = ({ className = "", size = 20 }) => (
  <svg
    className={className}
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="M12 2a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2 2 2 0 0 1-2-2V4a2 2 0 0 1 2-2z" />
    <rect width="18" height="12" x="3" y="6" rx="2" />
    <path d="M11 10h2" />
    <path d="M11 14h2" />
    <path d="M8 10h.01" />
    <path d="M16 10h.01" />
  </svg>
)

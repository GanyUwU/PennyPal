import React from "react"
import ReactDOM from "react-dom/client"
import "./App.css"
import { Route, RouterProvider } from "react-router-dom"
import { router } from "./router"
import { AuthProvider } from "./Authcontext"

const root = ReactDOM.createRoot(document.getElementById("root"))
root.render(
  <React.StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </React.StrictMode>,
)
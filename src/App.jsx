import React from "react"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import Dashboard from './pages/Dashboard'
import Register from './pages/Register'
import ApplyLoanPage from './pages/ApplyLoanPage'
import MyLoansPage from './pages/MyLoansPage'
import RepaymentPage from './pages/RepaymentPage'
import AdminDashboard from './pages/AdminDashboard'
import AdminLoanDetails from "./pages/AdminLoanDetails"
import ForgotPassword from "./pages/ForgotPassword"
import ResetPassword from "./pages/ResetPassword"
import Profile from "./pages/Profile"
import LandingPage from "./pages/LandingPage"
import About from "./pages/About"



function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route index element={<LandingPage />} />
          <Route path="/login" element={<Register />}/>
          <Route path="/home" element={<Dashboard />} />
          <Route path="/apply" element={<ApplyLoanPage />}/>
          <Route path="/myloans" element={<MyLoansPage />}/>
          <Route path="/repay" element={<RepaymentPage />}/>
          <Route path="/admin/dashboard" element={<AdminDashboard />}/>
          <Route path="/admin/loandetails" element={<AdminLoanDetails />}/>
          <Route path="/forgotPassword" element={<ForgotPassword />}/>
          <Route path="/resetPassword/:resetToken" element={<ResetPassword />}/>
          <Route path="/profile" element={<Profile />}/>
          <Route path="/about" element={<About />}/>
        </Routes>
     </BrowserRouter>
    </>
  
  )
}

export default App
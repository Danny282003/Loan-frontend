import React, { useEffect, useState } from 'react'
import { 
  DollarSign, 
  Menu, 
  X, 
  Home, 
  CreditCard, 
  History, 
  User, 
  LogOut,
  Bell,
  Search,
  TrendingUp,
  Clock,
  CheckCircle,
  XCircle,
  ArrowRight,
  Plus,
  Calendar,
  Wallet
} from 'lucide-react';

import { NavLink } from "react-router-dom";


 

function Sidebar({ sidebarOpen, setSidebarOpen}) {

    // const [sidebarOpen, setSidebarOpen] = useState(false);
  return (
    <div>
        <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-xl transform transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}>
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-green-600 rounded-xl flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-xl font-bold text-gray-800">LoanApp</h1>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden">
            <X className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        <nav className="p-4 space-y-2">
          <NavLink
            to='/home'
            className={({ isActive }) => `w-full flex items-center px-4 py-3 rounded-lg transition-all ${
              isActive
                ? "bg-green-600 text-white"
                : "text-gray-700 hover:bg-green-50"
            }`}
          >
            <Home className="w-5 h-5 inline mr-[10px]" />
            Dashboard
          </NavLink>
          {/* <button className="w-full flex items-center space-x-3 px-4 py-3 text-white bg-green-600 rounded-lg">
            <a href="/home" className='flex items-center justify-center'>
                
                <span className="font-medium ml-[10px]">Dashboard</span>
            </a>
       
          </button> */}
            <NavLink
            to='/apply'
            className={({ isActive }) => `w-full flex items-center px-4 py-3 rounded-lg transition-all ${
              isActive
                ? "bg-green-600 text-white"
                : "text-gray-700 hover:bg-green-50"
            }`}
          >
            <Plus className="w-5 h-5 inline mr-[10px]" />
            Apply for loan
          </NavLink>

             <NavLink
            to='/myloans'
            className={({ isActive }) => `w-full flex items-center px-4 py-3 rounded-lg transition-all ${
              isActive
                ? "bg-green-600 text-white"
                : "text-gray-700 hover:bg-green-50"
            }`}
          >
            <CreditCard className="w-5 h-5 inline mr-[10px]" />
            My loans
          </NavLink>
          
          <NavLink
            to='/repay'
            className={({ isActive }) => `w-full flex items-center px-4 py-3 rounded-lg transition-all ${
              isActive
                ? "bg-green-600 text-white"
                : "text-gray-700 hover:bg-green-50"
            }`}
          >
            <History className="w-5 h-5 inline mr-[10px]" />
            Repay Loan
          </NavLink>


                <NavLink
            to='/profile'
            className={({ isActive }) => `w-full flex items-center px-4 py-3 rounded-lg transition-all ${
              isActive
                ? "bg-green-600 text-white"
                : "text-gray-700 hover:bg-green-50"
            }`}
          >
            <User className="w-5 h-5 inline mr-[10px]" />
            Profile
          </NavLink>
        </nav>

        <div className="absolute bottom-0 w-full p-4 border-t border-gray-200">
          <button className="w-full flex items-center space-x-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-all">
            <a href="/login">
                <LogOut className="w-5 h-5 inline" />
                <span className="font-medium ml-[10px]">Logout</span>
            </a>
       
          </button>
        </div>
      </aside>
    </div>
  )
}

export default Sidebar
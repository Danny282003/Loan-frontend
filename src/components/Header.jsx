import React, { useEffect, useState } from 'react';
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
import { useContext } from "react";
import { UserContext } from "../context/UserContext";


function Header({ setSidebarOpen}) {
      const { loansDetails } = useContext(UserContext);

     const name = loansDetails?.user?.name || "Loading...";
    const email = loansDetails?.user?.email || "";

    console.log(loansDetails)
  
  return (
    <div>
         <header className="bg-white shadow-sm sticky top-0 z-40">
          <div className="flex items-center justify-between p-4">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden">
              <Menu className="w-6 h-6 text-gray-600" />
            </button>

            <div className="flex-1 max-w-xl mx-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search loans..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                />
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <button className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
                <Bell className="w-6 h-6" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-semibold">JD</span>
                </div>
                <div className="hidden md:block">
                  <p className="text-sm font-semibold text-gray-800">{name}</p>
                  <p className="text-xs text-gray-500">{email}</p>
                </div>
              </div>
            </div>
          </div>
        </header>
    </div>
  )
}

export default Header
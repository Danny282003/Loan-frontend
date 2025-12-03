import React from "react";
import { NavLink } from "react-router-dom";
import { 
  Shield, X, LayoutDashboard, FileText, Users, Settings, LogOut
} from 'lucide-react';

function AdminSidebar({ sidebarOpen, setSidebarOpen }) {
  return (
    <aside
      className={`fixed inset-y-0 left-0 z-50 w-64 bg-gradient-to-b from-gray-900 to-gray-800 shadow-2xl transform transition-transform duration-300 
      ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}
    >
      <div className="flex items-center justify-between p-6 border-b border-gray-700">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-green-600 rounded-xl flex items-center justify-center">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-white">LoanApp</h1>
            <p className="text-xs text-gray-400">Admin Portal</p>
          </div>
        </div>
        <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-white-400">
          <X className="w-6 h-6 text-white" />
        </button>
      </div>

      {/* Navigation */}
      <nav className="p-4 space-y-2">

        {/* DASHBOARD */}
        <NavLink
          to="/admin/dashboard"
          className={({ isActive }) =>
            `w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all
            ${isActive ? "bg-green-600 text-white" : "text-gray-300 hover:bg-gray-700 hover:text-white"}`
          }
        >
          <LayoutDashboard className="w-5 h-5" />
          <span className="font-medium">Dashboard</span>
        </NavLink>

        {/* MANAGE LOANS */}
        <NavLink
          to="/admin/loandetails"
          className={({ isActive }) =>
            `w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all
            ${isActive ? "bg-green-600 text-white" : "text-gray-300 hover:bg-gray-700 hover:text-white"}`
          }
        >
          <FileText className="w-5 h-5" />
          <span className="font-medium">Manage Loans</span>
        </NavLink>

        {/* USERS */}
        <NavLink
          to="/admin/users"
          className={({ isActive }) =>
            `w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all
            ${isActive ? "bg-green-600 text-white" : "text-gray-300 hover:bg-gray-700 hover:text-white"}`
          }
        >
          <Users className="w-5 h-5" />
          <span className="font-medium">Users</span>
        </NavLink>

        {/* SETTINGS */}
        <NavLink
          to="/admin/settings"
          className={({ isActive }) =>
            `w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all
            ${isActive ? "bg-green-600 text-white" : "text-gray-300 hover:bg-gray-700 hover:text-white"}`
          }
        >
          <Settings className="w-5 h-5" />
          <span className="font-medium">Settings</span>
        </NavLink>

      </nav>

      {/* Bottom Admin Profile */}
      <div className="absolute bottom-0 w-full p-4 border-t border-gray-700">
        <div className="bg-gray-700 rounded-lg p-3 mb-3">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center">
              <span className="text-white font-semibold text-sm">AD</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-white truncate">Admin User</p>
              <p className="text-xs text-gray-400 truncate">admin@loanapp.com</p>
            </div>
          </div>
        </div>

          <NavLink to='/login'>
            <button className="w-full flex items-center space-x-3 px-4 py-3 text-red-400 hover:bg-red-900 hover:bg-opacity-20 rounded-lg transition-all">
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Logout</span>
        </button>
          </NavLink>
   
      </div>
    </aside>
  );
}

export default AdminSidebar;

import React from 'react'
import {
  Menu,
  X,
  Search,
  FileText,
  Users,
  Settings,
  LogOut,
  Bell,
  CheckCircle,
  Clock,
  XCircle,
  DollarSign,
  LayoutDashboard,
} from "lucide-react";
import { Link } from 'react-router-dom';

function AdminHeader({ setQuery, setSidebarOpen, setSortBy, query, sortBy}) {
  return (
    <div>
        <header className="flex items-center justify-between p-4 border-b border-black/30 bg-transparent sticky top-0 z-40">
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-gray-300">
              <Menu />
            </button>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search loans, user email, id..."
                className="pl-10 pr-4 py-2 rounded-md bg-[#071422] border border-black/20 text-gray-200 text-sm outline-none w-72"
              />
            </div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="ml-3 bg-[#071422] border border-black/20 text-gray-200 text-sm rounded-md px-3 py-2"
            >
              <option value="newest">Newest</option>
              <option value="amount">Amount (high → low)</option>
              <option value="status">Status</option>
            </select>
          </div>

          <div className="flex items-center gap-3">
            <button className="p-2 rounded-md bg-black/20">
              <Bell className="w-4 h-4 text-gray-200" />
            </button>

            <Link to='/login'>
                <button className="p-2 rounded-md bg-black/20">
              <LogOut className="w-4 h-4 text-gray-200" />
            </button>
            </Link>
           
          </div>
        </header>
    </div>
  )
}

export default AdminHeader
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
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import { Link } from 'react-router-dom';

export default function Dashboard() {
   const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loansDetails, setLoanDetails] = useState(null);
  const [loading, setLoading] = useState(true)
  

  const navigate = useNavigate();

  useEffect(()=>{
    let fetcher = async()=>{
      try{
        setLoading(true)
        let response = await fetch("http://localhost:3000/api/dashboard", {
          method: 'GET',
          credentials: 'include'
        });

        if (!response.ok) {
        const errorData = await response.json();
        console.log('Error response:', errorData);

        if (response.status === 401) {
          console.log('Not authenticated, redirecting to login...');
          navigate('/login');
          return;
        }

        throw new Error(errorData.message || 'Failed to load dashboard');
      }

        let data = await response.json()
        console.log(data)
        setLoanDetails(data);
        setLoading(false)
      } catch(err){
        console.log(err)
      }
    }
    fetcher()
  },[navigate])

if (loading) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <div className="w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
      <p className="mt-4 text-green-700 font-semibold animate-pulse text-lg">
        Loading...
      </p>
    </div>
  );
}



if (!loansDetails || !loansDetails.user) {
  return <p>Error loading dashboard data...</p>;
}


  
  // Sample data - will be replaced with API data
  const stats = {
    totalLoans: loansDetails.stats.totalLoans ,
    activeLoans: loansDetails.stats.activeLoans,
    pendingLoans: loansDetails.stats.pendingLoans,
    completedLoans: loansDetails.stats.completedLoans || 0,
    totalBorrowed: loansDetails.financial.totalBorrowed,
    totalRepaid: loansDetails.financial.totalRepaid,
    remainingBalance: loansDetails.financial.remainingBalance
  };

  const recentLoans = loansDetails.recentLoans?.map(loan => ({
  ...loan,
  status: loan.status.toLowerCase()
}));


  const recentPayments = loansDetails.recentPayments

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'active':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'completed':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'rejected':
        return 'bg-red-100 text-red-700 border-red-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getStatusIcon = (status) => {
    switch (status.toLowerCase()) {
      case 'active':
        return <TrendingUp className="w-4 h-4" />;
      case 'pending':
        return <Clock className="w-4 h-4" />;
      case 'completed':
        return <CheckCircle className="w-4 h-4" />;
      case 'rejected':
        return <XCircle className="w-4 h-4" />;
      default:
        return null;
    }
  };
const percentage = stats.totalBorrowed > 0 ? ((stats.totalRepaid / stats.totalBorrowed) * 100).toFixed(0) : 0;
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-100">
      {/* Sidebar */}
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />


      {/* Main Content */}
      <div className="lg:ml-64">
        {/* Top Navigation */}
  
      <Header setSidebarOpen={setSidebarOpen} />
        {/* Dashboard Content */}
        <main className="p-6 space-y-6">
          {/* Welcome Section */}
          <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-2xl p-6 md:p-8 text-white">
            <h1 className="text-2xl md:text-3xl font-bold mb-2"> Welcome back, {loansDetails.user.name}</h1>
            <p className="text-green-100 mb-6">Here's an overview of your loan portfolio</p>
            
            <Link to="/apply">
              <button className="bg-white text-green-600 px-6 cursor-pointer py-3 rounded-lg font-semibold hover:bg-green-50 transition-all flex items-center space-x-2">
              <Plus className="w-5 h-5" />
              <span>Apply for New Loan</span>
              </button>
            </Link>
            
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Active Loans */}
            <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-green-500">
              <div className="flex items-center justify-between mb-2">
                <TrendingUp className="w-8 h-8 text-green-600" />
                <span className="text-2xl font-bold text-green-600">{stats.activeLoans}</span>
              </div>
              <p className="text-gray-600 font-medium">Active Loans</p>
              <p className="text-sm text-gray-500 mt-1">Currently repaying</p>
            </div>

            {/* Pending Loans */}
            <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-yellow-500">
              <div className="flex items-center justify-between mb-2">
                <Clock className="w-8 h-8 text-yellow-600" />
                <span className="text-2xl font-bold text-yellow-600">{stats.pendingLoans}</span>
              </div>
              <p className="text-gray-600 font-medium">Pending Approval</p>
              <p className="text-sm text-gray-500 mt-1">Awaiting review</p>
            </div>
          
            {/* Completed Loans */}
            <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-blue-500">
              <div className="flex items-center justify-between mb-2">
                <CheckCircle className="w-8 h-8 text-blue-600" />
                <span className="text-2xl font-bold text-blue-600">{stats.completedLoans}</span>
              </div>
              <p className="text-gray-600 font-medium">Completed</p>
              <p className="text-sm text-gray-500 mt-1">Fully repaid</p>
            </div>

            {/* Total Borrowed */}
            <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-purple-500">
              <div className="flex items-center justify-between mb-2">
                <Wallet className="w-8 h-8 text-purple-600" />
                <span className="text-2xl font-bold text-purple-600">₦{stats.totalBorrowed.toLocaleString()}</span>
              </div>
              <p className="text-gray-600 font-medium">Total Borrowed</p>
              <p className="text-sm text-gray-500 mt-1">Lifetime amount</p>
            </div>
          </div>

          {/* Financial Overview */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800">Total Repaid</h3>
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <p className="text-3xl font-bold text-green-600">₦{stats.totalRepaid.toLocaleString()}</p>
              <div className="mt-4 flex items-center text-sm text-gray-600">
                <span className="text-green-600 font-medium mr-1">
                  {percentage}%
                </span>
                of total borrowed
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800">Remaining Balance</h3>
                <TrendingUp className="w-6 h-6 text-orange-600" />
              </div>
              <p className="text-3xl font-bold text-orange-600">₦{stats.remainingBalance.toLocaleString()}</p>
              <div className="mt-4 flex items-center text-sm text-gray-600">
                <span className="text-orange-600 font-medium mr-1">
                  {((stats.remainingBalance / stats.totalBorrowed) * 100).toFixed(0)}%
                </span>
                still outstanding
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800">Credit Score</h3>
                <TrendingUp className="w-6 h-6 text-blue-600" />
              </div>
              <p className="text-3xl font-bold text-blue-600">750</p>
              <div className="mt-4 flex items-center text-sm text-gray-600">
                <span className="text-green-600 font-medium mr-1">Excellent</span>
                repayment history
              </div>
            </div>
          </div>

          {/* Recent Loans */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-800">Recent Loans</h2>
              <button className="text-green-600 hover:text-green-700 font-medium flex items-center space-x-1">
                <span>View All</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4">
              {recentLoans.map((loan) => (
                <div key={loan._id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-800">{loan.purpose}</h3>
                      <p className="text-sm text-gray-500">Applied: {loan.createdAt 
  ? new Date(loan.createdAt).toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'short',
      day: 'numeric'
    })
  : "N/A"}
</p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-gray-800">₦{loan.amount.toLocaleString()}</p>
                      <span className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(loan.status)}`}>
                        {getStatusIcon(loan.status)}
                        <span className="capitalize">{loan.status}</span>
                      </span>
                    </div>
                  </div>

                  {loan.status === 'active' && (
                    <div>
                      <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                        <span>Repayment Progress</span>
                        <span className="font-medium">{loan.progress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-green-600 h-2 rounded-full transition-all"
                          style={{ width: `${loan.progress}%` }}
                        ></div>
                      </div>
                      <div className="flex items-center justify-between text-xs text-gray-500 mt-2">
                        <span className="flex items-center">
                          <Calendar className="w-3 h-3 mr-1" />
               Due: {loan.dueDate
  ? new Date(loan.dueDate).toLocaleDateString("en-US", {
      weekday: "long",
      month: "short",
      day: "numeric"
    })
  : "N/A"}


                        </span>
                        <button className="text-green-600 hover:text-green-700 font-medium">
                          Make Payment
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Recent Payments */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-800">Recent Payments</h2>
              <button className="text-green-600 hover:text-green-700 font-medium flex items-center space-x-1">
                <span>View All</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              {recentPayments.map((payment) => (
                <div key={payment._id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-all">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800">₦{payment.amount.toLocaleString()}</p>
                      <p className="text-sm text-gray-500">{payment.reference}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">{new Date(payment.createdAt).toLocaleDateString("en-US", {
      weekday: "long",
      month: "short",
      day: "numeric"
    })}</p>
                    <span className="text-xs text-green-600 font-medium">Completed</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>

      {/* Overlay for mobile sidebar */}
      {sidebarOpen && (
      <div
  className="fixed inset-0 bg-black/10 backdrop-blur-sm z-40 lg:hidden"
  onClick={() => setSidebarOpen(false)}
></div>
      )}
    </div>
  );
}
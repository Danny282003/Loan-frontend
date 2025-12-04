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
  Plus,
  Filter,
  TrendingUp,
  Clock,
  CheckCircle,
  XCircle,
  Eye,
  Calendar,
  ArrowUpDown,
  Download,
  RefreshCw
} from 'lucide-react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import { useNavigate } from 'react-router-dom';
import { NavLink } from 'react-router-dom';

export default function MyLoansPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [searchTerm, setSearchTerm] = useState('');
  const [pageDetails, setPageDetails] = useState(null)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const [selectedLoan, setSelectedLoan] = useState(null);
  const [showModal, setShowModal] = useState(false);


  // Sample loans data - will be replaced with API data

  useEffect(()=>{
    let fetcher = async()=>{
      try{
        setLoading(true)

        let response = await fetch("http://localhost:3000/api/loan/myLoans", {
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
 
        setPageDetails(data);
        setLoading(false)

      } catch(err){
        console.log(err)
      }
    }
    fetcher()
  },[]);

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


  const loans = pageDetails || []
  

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

  const calculateProgress = (paid, total) => {
    if (!total || total === 0) return 0;
    return Math.round((paid / total) * 100);
  };

  // Filter and sort loans
  const filteredLoans = loans
    .filter((loan) => {
      if (filterStatus !== 'all' && loan.status.toLowerCase() !== filterStatus) return false;
      if (searchTerm && !loan.purpose.toLowerCase().includes(searchTerm.toLowerCase()) && 
          !loan.reference.toLowerCase().includes(searchTerm.toLowerCase())) return false;
      return true;
    })
    .sort((a, b) => {
  if (sortBy === "date") {
    const dateA = new Date(a.createdAt ?? a.appliedDate ?? 0);
    const dateB = new Date(b.createdAt ?? b.appliedDate ?? 0);
    return dateB - dateA;
  }

  if (sortBy === "amount") {
    return b.amount - a.amount;
  }

  return 0;
})


  // Calculate stats
  const stats = {
    total: loans.length,
    active: loans.filter(l => l.status.toLowerCase() === 'active').length,
    pending: loans.filter(l => l.status.toLowerCase() === 'pending').length,
    completed: loans.filter(l => l.status.toLowerCase() === 'completed').length,
    rejected: loans.filter(l => l.status.toLowerCase() === 'rejected').length
  };
  'Apply for a New Loan'

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-100">
      {/* Sidebar */}
        <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* Main Content */}
      <div className="lg:ml-64">
        {/* Top Navigation */}
           <Header setSidebarOpen={setSidebarOpen} />

        {/* Page Content */}
        <main className="p-6 space-y-6">
          {/* Page Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">My Loans</h1>
              <p className="text-gray-600">View and manage all your loan applications</p>
            </div>
            <NavLink to='/apply'>

           
            <button className="bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-3 rounded-lg transition-all flex items-center space-x-2 shadow-lg hover:shadow-xl">
              <Plus className="w-5 h-5" />
              <span>Apply for New Loan</span>
            </button>
             </NavLink>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="bg-white rounded-xl shadow-md p-4 border-l-4 border-gray-400">
              <p className="text-sm text-gray-600 mb-1">Total Loans</p>
              <p className="text-2xl font-bold text-gray-800">{stats.total}</p>
            </div>
            <div className="bg-white rounded-xl shadow-md p-4 border-l-4 border-green-500">
              <p className="text-sm text-gray-600 mb-1">Active</p>
              <p className="text-2xl font-bold text-green-600">{stats.active}</p>
            </div>
            <div className="bg-white rounded-xl shadow-md p-4 border-l-4 border-yellow-500">
              <p className="text-sm text-gray-600 mb-1">Pending</p>
              <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
            </div>
            <div className="bg-white rounded-xl shadow-md p-4 border-l-4 border-blue-500">
              <p className="text-sm text-gray-600 mb-1">Completed</p>
              <p className="text-2xl font-bold text-blue-600">{stats.completed}</p>
            </div>
            <div className="bg-white rounded-xl shadow-md p-4 border-l-4 border-red-500">
              <p className="text-sm text-gray-600 mb-1">Rejected</p>
              <p className="text-2xl font-bold text-red-600">{stats.rejected}</p>
            </div>
          </div>

          {/* Filters and Actions */}
          <div className="bg-white rounded-xl shadow-md p-4">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              {/* Filter Buttons */}
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setFilterStatus('all')}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    filterStatus === 'all'
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  All ({stats.total})
                </button>
                <button
                  onClick={() => setFilterStatus('active')}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    filterStatus === 'active'
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Active ({stats.active})
                </button>
                <button
                  onClick={() => setFilterStatus('pending')}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    filterStatus === 'pending'
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Pending ({stats.pending})
                </button>
                <button
                  onClick={() => setFilterStatus('completed')}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    filterStatus === 'completed'
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Completed ({stats.completed})
                </button>
                <button
                  onClick={() => setFilterStatus('rejected')}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    filterStatus === 'rejected'
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Rejected ({stats.rejected})
                </button>
              </div>

              {/* Sort and Export */}
              <div className="flex items-center gap-2">
                <div className="relative">
                  <ArrowUpDown className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none appearance-none bg-white text-sm"
                  >
                    <option value="date">Sort by Date</option>
                    <option value="amount">Sort by Amount</option>
                  </select>
                </div>
                <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-all">
                  <Download className="w-4 h-4" />
                  <span className="hidden md:inline text-sm font-medium">Export</span>
                </button>
                <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-all">
                  <RefreshCw className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Loans List */}
          <div className="space-y-4">
            {filteredLoans.length === 0 ? (
              <div className="bg-white rounded-xl shadow-md p-12 text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CreditCard className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">No loans found</h3>
                <p className="text-gray-600 mb-6">
                  {filterStatus !== 'all' 
                    ? `You don't have any ${filterStatus} loans yet.`
                    : 'Start by applying for your first loan.'}
                </p>
                <NavLink to='/apply'>
                <button className="bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-3 rounded-lg transition-all inline-flex items-center space-x-2">
                  <Plus className="w-5 h-5" />
                  <span>Apply for Loan</span>
                </button>
                </NavLink>
              </div>
            ) : (
              filteredLoans.map((loan) => (
                <div key={loan._id} className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all overflow-hidden">
                  <div className="p-6">
                    {/* Header */}
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-xl font-bold text-gray-800">{loan.purpose}</h3>
                          <span className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(loan.status)}`}>
                            {getStatusIcon(loan.status)}
                            <span className="capitalize">{loan.status}</span>
                          </span>
                        </div>
                        <p className="text-sm text-gray-500">Reference: {loan.reference}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-gray-800">₦{loan.amount.toLocaleString()}</p>
                        {loan.status === 'active' && (
                          <p className="text-sm text-gray-500">Total: ₦{loan.totalDue.toLocaleString()}</p>
                        )}
                      </div>
                    </div>

                    {/* Details Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Applied Date</p>
                        <p className="text-sm font-medium text-gray-800 flex items-center">
                          <Calendar className="w-3 h-3 mr-1" />
                          {loan.createdAt
  ? new Date(loan.createdAt).toLocaleDateString("en-US", {
      weekday: "long",
      month: "short",
      day: "numeric",
    })
  : "N/A"}

                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Duration</p>
                        <p className="text-sm font-medium text-gray-800">{loan.duration} months</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Interest Rate</p>
                        <p className="text-sm font-medium text-gray-800">{loan.interestRate}% per month</p>
                      </div>
                      {loan.dueDate && (
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Due Date</p>
                          <p className="text-sm font-medium text-gray-800">
                            {new Date(loan.dueDate).toLocaleDateString()}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Progress Bar (Active Loans) */}
                    {loan.status === 'active' && (
                      <div className="mb-4">
                        <div className="flex items-center justify-between text-sm mb-2">
                          <span className="text-gray-600">Repayment Progress</span>
                          <span className="font-semibold text-gray-800">
                            ₦{loan.amountPaid.toLocaleString()} / ₦{loan.totalDue.toLocaleString()} 
                            <span className="text-green-600 ml-2">({calculateProgress(loan.amountPaid, loan.totalDue)}%)</span>
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-3">
                          <div
                            className="bg-green-600 h-3 rounded-full transition-all"
                            style={{ width: `${calculateProgress(loan.amountPaid, loan.totalDue)}%` }}
                          ></div>
                        </div>
                      </div>
                    )}

                    {/* Status Messages */}
                    {loan.status === 'pending' && (
                      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
                        <p className="text-sm text-yellow-800">
                          <Clock className="w-4 h-4 inline mr-1" />
                          Your application is under review. You'll be notified once it's processed.
                        </p>
                      </div>
                    )}

                    {loan.status === 'rejected' && (
                      <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
                        <p className="text-sm text-red-800">
                          <XCircle className="w-4 h-4 inline mr-1" />
                          This application was not approved. Please contact support for more details.
                        </p>
                      </div>
                    )}

                    {loan.status === 'completed' && (
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
                        <p className="text-sm text-blue-800">
                          <CheckCircle className="w-4 h-4 inline mr-1" />
                          Congratulations! This loan has been fully repaid.
                        </p>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex flex-wrap gap-3">
                  <button
  onClick={() => {
    setSelectedLoan(loan);
    console.log('pop up', selectedLoan)
    setShowModal(true);
  }}
  className="flex items-center space-x-2 px-4 py-2 border-2 border-gray-300 rounded-lg hover:bg-gray-50 transition-all text-sm font-medium"
>
  <Eye className="w-4 h-4" />
  <span>View Details</span>
</button>


  {showModal && selectedLoan && (
  <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50 px-4">

    <div className="bg-white w-full max-w-lg rounded-2xl shadow-xl p-6 relative animate-fadeIn">

      {/* Close button */}
      <button
        onClick={() => setShowModal(false)}
        className="absolute top-3 right-3 text-gray-600 hover:text-gray-800"
      >
        <X className="w-6 h-6" />
      </button>

      <h2 className="text-xl font-bold mb-4">Loan Details</h2>

      {/* Loan Main Info */}
      <div className="space-y-3">
        <p className="text-gray-700">
          <strong>Purpose:</strong> {selectedLoan.purpose}
        </p>
        <p className="text-gray-700">
          <strong>Amount:</strong> ₦{selectedLoan.amount.toLocaleString()}
        </p>
        <p className="text-gray-700">
          <strong>Status:</strong>{" "}
          <span className="capitalize">{selectedLoan.status}</span>
        </p>
        <p className="text-gray-700">
          <strong>Duration:</strong> {selectedLoan.duration} months
        </p>
        <p className="text-gray-700">
          <strong>Applied on:</strong>{" "}
          {new Date(selectedLoan.createdAt).toLocaleDateString()}
        </p>
      </div>

      {/* Approval / Rejection Section */}
      <div className="mt-4 p-4 rounded-lg bg-gray-100">
        <h3 className="font-semibold mb-2">Approval Information</h3>

        {(selectedLoan.status.toLowerCase() === "active" || selectedLoan.status.toLowerCase() === 'completed') && (
          <p className="text-green-700">
            <CheckCircle className="inline w-4 h-4 mr-1" />
            Approved by <strong>{selectedLoan.approvedBy?.name || "Admin"}</strong>
            <p>Approved on <strong>
  {selectedLoan.approvedAt
    ? new Date(selectedLoan.approvedAt).toLocaleString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "N/A"}
</strong>
</p>
          </p>
        )}

        {selectedLoan.status === "rejected" && (
          <>
            <p className="text-red-700">
              <XCircle className="inline w-4 h-4 mr-1" />
              Rejected by{" "}
              <strong>{selectedLoan.rejectedBy?.name || "Admin"}</strong>
            </p>
            <p className="text-gray-700 mt-2">
              <strong>Reason:</strong>{" "}
              {selectedLoan.rejectionReason || "No reason provided"}
            </p>
            <p>Rejected on: <strong>
  {selectedLoan.rejectedAt
    ? new Date(selectedLoan.rejectedAt).toLocaleString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "N/A"}
</strong></p>
          </>
        )}

        {selectedLoan.status === "pending" && (
          <p className="text-yellow-700">
            <Clock className="inline w-4 h-4 mr-1" />
            Pending approval...
          </p>
        )}
      </div>

      {/* Payment History */}
      {selectedLoan?.length > 0 && (
        <div className="mt-4">
          <h3 className="font-semibold mb-2">Payment History</h3>

          <div className="space-y-2 max-h-40 overflow-y-auto pr-2">
            {selectedLoan.map((p, i) => (
              <div
                key={i}
                className="p-3 border rounded-lg flex justify-between bg-gray-50"
              >
                <span>₦{p.amountPaid.toLocaleString()}</span>
                <span>{new Date(p.updatedAt).toLocaleDateString()}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {!selectedLoan.amountPaid && (
        <p className="text-gray-500 mt-4">No payments made yet.</p>
      )}
    </div>
  </div>
)}


                      {loan.status === 'active' && (
                        <>
                        <NavLink to='/repay'>
                          <button className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all text-sm font-medium">
                            <DollarSign className="w-4 h-4" />
                            <span>Make Payment</span>
                          </button>
                        </NavLink>
                          <button className="flex items-center space-x-2 px-4 py-2 border-2 border-gray-300 rounded-lg hover:bg-gray-50 transition-all text-sm font-medium">
                            <Download className="w-4 h-4" />
                            <span>Download Statement</span>
                          </button>
                        </>
                      )}

                      {loan.status === 'completed' && (
                        <button className="flex items-center space-x-2 px-4 py-2 border-2 border-gray-300 rounded-lg hover:bg-gray-50 transition-all text-sm font-medium">
                          <Download className="w-4 h-4" />
                          <span>Download Certificate</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
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
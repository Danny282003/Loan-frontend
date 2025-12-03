import React, { useEffect, useState } from "react";
import { Search, Filter, CheckCircle, Clock, XCircle, DollarSign, User, TrendingUp, Eye, X, ChevronDown, AlertCircle } from "lucide-react";
import AdminHeader from "../components/AdminHeader";
import AdminSidebar from "../components/AdminSidebar";

 function AdminLoanDetails() {
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedLoan, setSelectedLoan] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [actionLoading, setActionLoading] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    fetchLoans();
  }, []);

  const fetchLoans = async () => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:3000/api/admin/loans", {
        credentials: "include",
      });
      const data = await response.json();
      setLoans(data.data || []);
    } catch (error) {
      console.error("Error fetching loans:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchLoanDetails = async (loanId) => {
    try {
      const response = await fetch(`http://localhost:3000/api/admin/loans/${loanId}`, {
        credentials: "include",
      });
      const data = await response.json();
      setSelectedLoan(data.data);
      setShowDetailModal(true);
    } catch (error) {
      console.error("Error fetching loan details:", error);
      alert("Failed to fetch loan details");
    }
  };

  const approveLoan = async (loanId) => {
    if (!window.confirm("Approve and disburse this loan?")) return;
    setActionLoading(loanId);
    try {
      const response = await fetch(`http://localhost:3000/api/admin/approve/${loanId}`, {
        method: "PATCH",
        credentials: "include",
      });
      const data = await response.json();
      
      if (response.ok) {
        alert(data.message);
        fetchLoans();
        if (selectedLoan?._id === loanId) {
          fetchLoanDetails(loanId);
        }
      } else {
        alert(data.message || "Failed to approve loan");
      }
    } catch (error) {
      alert("Error approving loan");
    } finally {
      setActionLoading(null);
    }
  };

  const rejectLoan = async (loanId) => {
    const reason = window.prompt("Enter rejection reason:");
    if (!reason) {
      alert("Rejection reason is required");
      return;
    }
    
    setActionLoading(loanId);
    try {
      const response = await fetch(`http://localhost:3000/api/admin/reject/${loanId}`, {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rejectionReason: reason }),
      });
      const data = await response.json();
      
      if (response.ok) {
        alert(data.message);
        fetchLoans();
        if (selectedLoan?._id === loanId) {
          fetchLoanDetails(loanId);
        }
      } else {
        alert(data.message || "Failed to reject loan");
      }
    } catch (error) {
      alert("Error rejecting loan");
    } finally {
      setActionLoading(null);
    }
  };

  const filteredLoans = loans.filter((loan) => {
    const matchesSearch =
      loan.user?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      loan.user?.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      loan.purpose?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus =
      statusFilter === "all" || loan.status?.toLowerCase() === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status) => {
    const statusLower = status?.toLowerCase() || "";
    if (statusLower === "active" || statusLower === "approved") {
      return {
        label: "Approved",
        classes: "bg-green-500/20 text-green-400 border-green-500/30",
        icon: <CheckCircle className="w-4 h-4" />,
      };
    }
    if (statusLower === "pending") {
      return {
        label: "Pending",
        classes: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
        icon: <Clock className="w-4 h-4" />,
      };
    }
    if (statusLower === "rejected") {
      return {
        label: "Rejected",
        classes: "bg-red-500/20 text-red-400 border-red-500/30",
        icon: <XCircle className="w-4 h-4" />,
      };
    }
    return {
      label: status || "Unknown",
      classes: "bg-gray-500/20 text-gray-400 border-gray-500/30",
      icon: <AlertCircle className="w-4 h-4" />,
    };
  };

  const stats = {
    total: loans.length,
    pending: loans.filter((l) => l.status?.toLowerCase() === "pending").length,
    approved: loans.filter((l) =>
      ["active", "approved"].includes(l.status?.toLowerCase())
    ).length,
    rejected: loans.filter((l) => l.status?.toLowerCase() === "rejected").length,
    totalDisbursed: loans
      .filter((l) => ["active", "approved"].includes(l.status?.toLowerCase()))
      .reduce((sum, l) => sum + (l.amount || 0), 0),
  };

  return (

  <>
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
    <AdminSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

    <div className="lg:ml-64 p-6 transition-all">
    <AdminHeader
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Loan Management
          </h1>
          <p className="text-gray-400">Manage and monitor all loan applications</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-400">Total Loans</p>
              <DollarSign className="w-5 h-5 text-blue-400" />
            </div>
            <p className="text-2xl font-bold">{stats.total}</p>
          </div>

          <div className="bg-yellow-500/10 backdrop-blur-sm border border-yellow-500/30 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-yellow-400">Pending</p>
              <Clock className="w-5 h-5 text-yellow-400" />
            </div>
            <p className="text-2xl font-bold text-yellow-400">{stats.pending}</p>
          </div>

          <div className="bg-green-500/10 backdrop-blur-sm border border-green-500/30 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-green-400">Approved</p>
              <CheckCircle className="w-5 h-5 text-green-400" />
            </div>
            <p className="text-2xl font-bold text-green-400">{stats.approved}</p>
          </div>

          <div className="bg-red-500/10 backdrop-blur-sm border border-red-500/30 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-red-400">Rejected</p>
              <XCircle className="w-5 h-5 text-red-400" />
            </div>
            <p className="text-2xl font-bold text-red-400">{stats.rejected}</p>
          </div>

          <div className="bg-blue-500/10 backdrop-blur-sm border border-blue-500/30 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-blue-400">Disbursed</p>
              <TrendingUp className="w-5 h-5 text-blue-400" />
            </div>
            <p className="text-2xl font-bold text-blue-400">
              ₦{stats.totalDisbursed.toLocaleString()}
            </p>
          </div>
        </div>

        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by user name, email, or purpose..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-slate-900/50 border border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
              />
            </div>

            <div className="relative">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="pl-10 pr-8 py-2 bg-slate-900/50 border border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white appearance-none cursor-pointer"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="active">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
          </div>
        </div>

        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl overflow-hidden">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
              <p className="text-gray-400">Loading loans...</p>
            </div>
          ) : filteredLoans.length === 0 ? (
            <div className="text-center py-20 text-gray-400">
              <DollarSign className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p>No loans found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-900/50 border-b border-slate-700">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase">User</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase">Purpose</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase">Amount</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase">Status</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase">Date Applied</th>
                    <th className="px-6 py-4 text-right text-xs font-semibold text-gray-400 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700">
                  {filteredLoans.map((loan) => {
                    const badge = getStatusBadge(loan.status);
                    return (
                      <tr key={loan._id} className="hover:bg-slate-700/30 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                              <User className="w-5 h-5" />
                            </div>
                            <div>
                              <p className="font-medium">{loan.user?.name || "Unknown"}</p>
                              <p className="text-sm text-gray-400">{loan.user?.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm">{loan.purpose}</td>
                        <td className="px-6 py-4 font-semibold">₦{loan.amount?.toLocaleString()}</td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium border ${badge.classes}`}>
                            {badge.icon}{badge.label}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-400">{new Date(loan.createdAt).toLocaleDateString()}</td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-end gap-2">
                            {loan.status?.toLowerCase() === "pending" && (
                              <>
                                <button
                                  onClick={() => approveLoan(loan._id)}
                                  disabled={actionLoading === loan._id}
                                  className="px-3 py-1.5 bg-green-500 hover:bg-green-600 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
                                >
                                  {actionLoading === loan._id ? "..." : "Approve"}
                                </button>
                                <button
                                  onClick={() => rejectLoan(loan._id)}
                                  disabled={actionLoading === loan._id}
                                  className="px-3 py-1.5 bg-red-500/20 hover:bg-red-500/30 border border-red-500 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
                                >
                                  Reject
                                </button>
                              </>
                            )}
                            <button
                              onClick={() => fetchLoanDetails(loan._id)}
                              className="px-3 py-1.5 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500 rounded-lg text-sm font-medium transition-colors flex items-center gap-1"
                            >
                              <Eye className="w-4 h-4" />
                              View
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {showDetailModal && selectedLoan && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50" onClick={() => setShowDetailModal(false)}>
          <div className="bg-slate-800 border border-slate-700 rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="sticky top-0 bg-slate-800 border-b border-slate-700 p-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold">Loan Details</h2>
              <button onClick={() => setShowDetailModal(false)} className="p-2 hover:bg-slate-700 rounded-lg transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div className="bg-slate-900/50 rounded-xl p-4 border border-slate-700">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <User className="w-5 h-5 text-blue-400" />
                  Borrower Information
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-400">Name</p>
                    <p className="font-medium">{selectedLoan.user?.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Email</p>
                    <p className="font-medium">{selectedLoan.user?.email}</p>
                  </div>
                </div>
              </div>

              <div className="bg-slate-900/50 rounded-xl p-4 border border-slate-700">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-green-400" />
                  Loan Information
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-400">Amount</p>
                    <p className="text-xl font-bold text-green-400">₦{selectedLoan.amount?.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Status</p>
                    {(() => {
                      const badge = getStatusBadge(selectedLoan.status);
                      return (
                        <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium border ${badge.classes} mt-1`}>
                          {badge.icon}{badge.label}
                        </span>
                      );
                    })()}
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Purpose</p>
                    <p className="font-medium">{selectedLoan.purpose}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Repayment Period</p>
                    <p className="font-medium">{selectedLoan.repaymentPeriod} months</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Interest Rate</p>
                    <p className="font-medium">{selectedLoan.interestRate}%</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Applied On</p>
                    <p className="font-medium">{new Date(selectedLoan.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>

              {(selectedLoan.approvedBy || selectedLoan.rejectedBy) && (
                <div className="bg-slate-900/50 rounded-xl p-4 border border-slate-700">
                  <h3 className="text-lg font-semibold mb-4">Decision Details</h3>
                  {selectedLoan.approvedBy && (
                    <div className="space-y-2">
                      <div>
                        <p className="text-sm text-gray-400">Approved By</p>
                        <p className="font-medium">Admin ID: {selectedLoan.approvedBy}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-400">Approved At</p>
                        <p className="font-medium">{new Date(selectedLoan.approvedAt).toLocaleString()}</p>
                      </div>
                    </div>
                  )}
                  {selectedLoan.rejectedBy && (
                    <div className="space-y-2">
                      <div>
                        <p className="text-sm text-gray-400">Rejected By</p>
                        <p className="font-medium">Admin ID: {selectedLoan.rejectedBy}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-400">Rejected At</p>
                        <p className="font-medium">{new Date(selectedLoan.rejectedAt).toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-400">Rejection Reason</p>
                        <p className="font-medium text-red-400">{selectedLoan.rejectionReason}</p>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {selectedLoan.status?.toLowerCase() === "pending" && (
                <div className="flex gap-3">
                  <button
                    onClick={() => approveLoan(selectedLoan._id)}
                    disabled={actionLoading === selectedLoan._id}
                    className="flex-1 px-4 py-3 bg-green-500 hover:bg-green-600 rounded-lg font-semibold transition-colors disabled:opacity-50"
                  >
                    {actionLoading === selectedLoan._id ? "Processing..." : "Approve Loan"}
                  </button>
                  <button
                    onClick={() => rejectLoan(selectedLoan._id)}
                    disabled={actionLoading === selectedLoan._id}
                    className="flex-1 px-4 py-3 bg-red-500/20 hover:bg-red-500/30 border border-red-500 rounded-lg font-semibold transition-colors disabled:opacity-50"
                  >
                    Reject Loan
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      </div>
    </div>
      </>
  );
};


export default AdminLoanDetails
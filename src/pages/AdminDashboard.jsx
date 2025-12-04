import React, { useEffect, useMemo, useState } from "react";
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
import { useNavigate } from "react-router-dom";
import AdminSidebar from "../components/AdminSidebar";
import AdminHeader from "../components/AdminHeader";

/**
 * AdminDashboard
 * - Fetches /api/admin/loans
 * - Approve: POST /api/admin/loans/:loanId/approve
 * - Reject:  POST /api/admin/loans/:loanId/reject  (body: { rejectionReason })
 *
 * Notes:
 * - All fetch calls include credentials: 'include' so cookies are sent.
 * - Make sure backend CORS allows credentials and origin.
 */

export default function AdminDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [sortBy, setSortBy] = useState("newest"); // newest | amount | status
  const [actionLoading, setActionLoading] = useState(null); // loanId under action
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const render = "https://quickcredit-wxnq.onrender.com"

  // Fetch loans
  useEffect(() => {
    let mounted = true;
    const load = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${render}/api/admin/loans`, {
          method: "GET",
          credentials: "include",
        });

        if (!res.ok) {
          const errJson = await res.json().catch(() => ({}));
          if (res.status === 401) {
            // Not authenticated
            navigate("/login");
            return;
          }
          throw new Error(errJson.message || "Failed to fetch loans");
        }

        const json = await res.json();
        // backend returned { success, count, data } in your code sample
        const payload = json.data ?? json; // support either shape
        if (mounted) {
          setLoans(Array.isArray(payload) ? payload : []);
          setError(null);
        }
      } catch (e) {
        console.error("Error fetching admin loans:", e);
        if (mounted) setError(e.message || "Error fetching loans");
      } finally {
        if (mounted) setLoading(false);
      }
    };
    load();
    return () => (mounted = false);
  }, [navigate]);



 

  // Helpers
  const getStatusBadge = (status) => {
    // adapt to your backend statuses: 'Pending', 'Active', 'Rejected', 'Approved'
    const s = (status || "").toLowerCase();
    if (s === "active" || s === "approved") {
      return { label: "Approved", classes: "bg-green-800 text-green-300" , icon: <CheckCircle className="inline-block w-4 h-4 mr-1" />};
    }
    if (s === "pending") {
      return { label: "Pending", classes: "bg-yellow-800 text-yellow-300" , icon: <Clock className="inline-block w-4 h-4 mr-1" />};
    }
    if (s === "rejected") {
      return { label: "Rejected", classes: "bg-red-800 text-red-300" , icon: <XCircle className="inline-block w-4 h-4 mr-1" />};
    }
    return { label: status || "Unknown", classes: "bg-gray-800 text-gray-300", icon: null };
  };

  const approveLoan = async (loanId) => {
    if (!window.confirm("Approve and disburse this loan?")) return;
    setActionLoading(loanId);
    try {
      const res = await fetch(`${render}/api/admin/approve/${loanId}`, {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      });

      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        alert(json.message || "Failed to approve loan");
        return;
      }

      // update local state (optimistic)
      setLoans((prev) => prev.map(l => l._id === loanId ? { ...l, status: "Active", approvedBy: json.data?.loan?.approvedBy ?? l.approvedBy } : l));
    } catch (e) {
      console.error("Approve error:", e);
      alert("Error approving loan");
    } finally {
      setActionLoading(null);
    }
  };

  const rejectLoan = async (loanId) => {
    const reason = window.prompt("Reason for rejection (required):");
    if (!reason) {
      alert("Rejection reason required.");
      return;
    }
    setActionLoading(loanId);
    try {
      const res = await fetch(`${render}/api/admin/reject/${loanId}`, {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rejectionReason: reason }),
      });

      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        alert(json.message || "Failed to reject loan");
        return;
      }

      // update UI
      setLoans((prev) => prev.map(l => l._id === loanId ? { ...l, status: "Rejected", rejectionReason: reason } : l));
    } catch (e) {
      console.error("Reject error:", e);
      alert("Error rejecting loan");
    } finally {
      setActionLoading(null);
    }
  };

  // derived lists: filtered & sorted
  const visibleLoans = useMemo(() => {
    let filtered = loans;

    // show only relevant statuses if you want — admin likely needs all; but to show only pending, you could filter here
    // filtered = filtered.filter(l => l.status?.toLowerCase() === 'pending');

    if (query) {
      const q = query.toLowerCase();
      filtered = filtered.filter(
        (l) =>
          (l.purpose && l.purpose.toLowerCase().includes(q)) ||
          (l.user && (l.user.name || l.user.email || "").toLowerCase().includes(q)) ||
          (l._id && l._id.toString().includes(q))
      );
    }

    if (sortBy === "amount") {
      filtered = filtered.slice().sort((a, b) => (b.amount || 0) - (a.amount || 0));
    } else if (sortBy === "status") {
      filtered = filtered.slice().sort((a, b) => (a.status || "").localeCompare(b.status || ""));
    } else {
      // newest — by createdAt if available
      filtered = filtered.slice().sort((a, b) => new Date(b.createdAt || b.updatedAt || 0) - new Date(a.createdAt || a.updatedAt || 0));
    }

    return filtered;
  }, [loans, query, sortBy]);


   if (loading) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <div className="w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
      <p className="mt-4 text-green-700 font-semibold animate-pulse text-lg">
        Loading loans...
      </p>
    </div>
  );
}
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0b1020] via-[#0b1224] to-[#08101a] text-gray-200">
      {/* sidebar (simple) */}
      <AdminSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen}/>

      {/* main */}
      <div className="lg:ml-64">
        <AdminHeader setSidebarOpen={setSidebarOpen} setQuery={setQuery} setSortBy={setSortBy} query={query} sortBy={sortBy}/>

        <main className="p-6">
          {/* Top metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="p-4 rounded-xl bg-gradient-to-br from-[#071429]/70 to-[#06202b]/60 border border-black/20">
              <p className="text-sm text-gray-400">Total Loans</p>
              <h2 className="text-2xl font-bold text-white">{loans.length}</h2>
              <p className="text-xs text-gray-400 mt-1">All applications</p>
            </div>

            <div className="p-4 rounded-xl bg-gradient-to-br from-[#071429]/70 to-[#06202b]/60 border border-black/20">
              <p className="text-sm text-gray-400">Pending</p>
              <h2 className="text-2xl font-bold text-amber-300">{loans.filter(l => (l.status || '').toLowerCase() === 'pending').length}</h2>
              <p className="text-xs text-gray-400 mt-1">Needs review</p>
            </div>

            <div className="p-4 rounded-xl bg-gradient-to-br from-[#071429]/70 to-[#06202b]/60 border border-black/20">
              <p className="text-sm text-gray-400">Approved</p>
              <h2 className="text-2xl font-bold text-green-300">{loans.filter(l => ['active','approved'].includes((l.status||'').toLowerCase())).length}</h2>
              <p className="text-xs text-gray-400 mt-1">Disbursed</p>
            </div>
          </div>

          {/* Table */}
          <div className="bg-[#061018] border border-black/30 rounded-xl overflow-hidden shadow-lg">
            <div className="p-4 border-b border-black/20 flex items-center justify-between">
              <h3 className="text-lg font-semibold">Recent Applications</h3>
              <div className="text-sm text-gray-400">You can approve or reject loans</div>
            </div>

            {loading ? (
              <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <div className="w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
      <p className="mt-4 text-green-700 font-semibold animate-pulse text-lg">
        Loading loans...
      </p>
    </div>
            ) : error ? (
              <div className="p-8 text-center text-red-400">{error}</div>
            ) : visibleLoans.length === 0 ? (
              <div className="p-8 text-center text-gray-400">No loans found.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-black/20">
                  <thead className="bg-[#071a24]">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs text-gray-400">User</th>
                      <th className="px-4 py-3 text-left text-xs text-gray-400">Purpose</th>
                      <th className="px-4 py-3 text-left text-xs text-gray-400">Amount</th>
                      <th className="px-4 py-3 text-left text-xs text-gray-400">Status</th>
                      <th className="px-4 py-3 text-left text-xs text-gray-400">Applied</th>
                      <th className="px-4 py-3 text-right text-xs text-gray-400">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-[#051218] divide-y divide-black/20">
                    {visibleLoans.map((loan) => {
                      const badge = getStatusBadge(loan.status);
                      return (
                        <tr key={loan._id}>
                          <td className="px-4 py-3">
                            <div className="text-sm font-medium">{loan.user?.name ?? "Unknown"}</div>
                            <div className="text-xs text-gray-400">{loan.user?.email ?? loan.user}</div>
                          </td>
                          <td className="px-4 py-3 text-sm">{loan.purpose}</td>
                          <td className="px-4 py-3 text-sm">₦{(loan.amount || 0).toLocaleString()}</td>
                          <td className="px-4 py-3">
                            <span className={`inline-flex items-center px-2 py-1 rounded ${badge.classes} text-xs`}>
                              {badge.icon}{badge.label}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-400">{new Date(loan.createdAt || loan.updatedAt || Date.now()).toLocaleDateString()}</td>
                          <td className="px-4 py-3 text-right">
                            <div className="flex justify-end gap-2 items-center">
                              {((loan.status || "").toLowerCase() === "pending") && (
                                <>
                                  <button
                                    disabled={actionLoading === loan._id}
                                    onClick={() => approveLoan(loan._id)}
                                    className="px-3 py-1 rounded bg-green-600 text-black font-semibold text-sm hover:brightness-110 disabled:opacity-60"
                                  >
                                    {actionLoading === loan._id ? "..." : "Approve"}
                                  </button>

                                  <button
                                    disabled={actionLoading === loan._id}
                                    onClick={() => rejectLoan(loan._id)}
                                    className="px-3 py-1 rounded border border-red-600 text-red-300 text-sm hover:bg-red-800/30 disabled:opacity-60"
                                  >
                                    Reject
                                  </button>
                                </>
                              )}

                              {/* Always allow inspect / open details */}
                              <button
                                onClick={() => {
                                  // open loan detail page if exists
                                  navigate(`/admin/loan/${loan._id}`);
                                }}
                                className="px-3 py-1 rounded bg-black/20 text-sm text-gray-200 hover:bg-black/10"
                              >
                                Inspect
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
        </main>
      </div>

      {sidebarOpen && (
      <div
  className="fixed inset-0 bg-black/10 backdrop-blur-sm z-40 lg:hidden"
  onClick={() => setSidebarOpen(false)}
></div>
      )}
    </div>
  );
}

import React, { useState, useEffect } from "react";
import { User, Mail, Phone, Calendar, DollarSign, TrendingUp, Clock, CheckCircle, XCircle, Edit, Camera, CreditCard, FileText, Activity, AlertCircle, LogOut } from "lucide-react";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import { useNavigate } from "react-router-dom";
import { NavLink } from "react-router-dom";


export default function Profile() {
  const [user, setUser] = useState(null);
  const [loans, setLoans] = useState([]);
  const [repayments, setRepayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false);
const [editForm, setEditForm] = useState({
  name: "",
  email: "",
  phone: "",
});

  const navigate = useNavigate();

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      const userResponse = await fetch("http://localhost:3000/api/user/profile", {
        method: 'GET',
        credentials: "include",
      });
      const userData = await userResponse.json();

      const loansResponse = await fetch("http://localhost:3000/api/loan/myLoans", {
        method: 'GET',
        credentials: "include",
      });
      const loansData = await loansResponse.json();

      const repaymentsResponse = await fetch("http://localhost:3000/api/repay/paymentHistory", {
        method: 'GET',
        credentials: "include",
      });
      const repaymentsData = await repaymentsResponse.json();

      if(loansResponse.status === 401){
        navigate('/login')
      }
      console.log('This the user data', userData)
      console.log('This is the loan data',loansData)
      console.log('This is thr repayment',repaymentsData)
      setUser(userData.data || userData);
      setLoans(Array.isArray(loansData.data)? loansData.data : Array.isArray(loansData.loans)? loansData.loans : Array.isArray(loansData) ? loansData : []);
      setRepayments(repaymentsData.repayments);
    } catch (error) {
      console.error("Error fetching user data:", error);
    } finally {
      setLoading(false);
    }
  };

  console.log(repayments)
  
  const getStatusBadge = (status) => {
    const statusLower = status?.toLowerCase() || "";
    if (statusLower === "active" || statusLower === "approved") {
      return { label: "Active", classes: "bg-green-500/20 text-green-400 border-green-500/30", icon: <CheckCircle className="w-3 h-3" /> };
    }
    if (statusLower === "pending") {
      return { label: "Pending", classes: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30", icon: <Clock className="w-3 h-3" /> };
    }
    if (statusLower === "rejected") {
      return { label: "Rejected", classes: "bg-red-500/20 text-red-400 border-red-500/30", icon: <XCircle className="w-3 h-3" /> };
    }
    if (statusLower === "completed") {
      return { label: "Completed", classes: "bg-blue-500/20 text-blue-400 border-blue-500/30", icon: <CheckCircle className="w-3 h-3" /> };
    }
    return { label: status || "Unknown", classes: "bg-gray-500/20 text-gray-400 border-gray-500/30", icon: <AlertCircle className="w-3 h-3" /> };
  };

  const calculateTotalBorrowed = () => {
    return loans.filter((l) => ["active", "approved", "completed"].includes(l.status?.toLowerCase())).reduce((sum, l) => sum + (l.amount || 0), 0);
  };

  const calculateTotalRepaid = () => {
    return repayments.reduce((sum, r) => sum + (r.amount || 0), 0);
  };

  const calculateOutstanding = () => {
    const activeLoan = loans.find((l) => l.status?.toLowerCase() === "active");
    return activeLoan?.remainingBalance || 0;
  };

  const openEditModal = () => {
  setEditForm({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
  });
  setShowEditModal(true);
};

const updateProfile = async (e) => {
  e.preventDefault();

  try {
    const res = await fetch("http://localhost:3000/api/user/updateProfile", {
      method: "PATCH",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editForm),
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.message || "Failed to update profile");
      return;
    }

    alert("Profile updated successfully!");

    // Refresh the profile
    fetchUserData();

    setShowEditModal(false);

  } catch (err) {
    console.error("Update failed:", err);
    alert("Error updating profile");
  }
};


  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-gray-400">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
   <div className="min-h-screen bg-gray-100 text-gray-900">
        <div className="lg:ml-64">
  <Header setSidebarOpen={setSidebarOpen} />
</div>


        <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

     <div className="lg:ml-64 max-w-7xl mx-auto p-6">

        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">My Profile</h1>
          <p className="text-gray-400">Manage your account and view your activity</p>
        </div>

        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-8 mb-6">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            <div className="relative">
              <div className="w-32 h-32 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-4xl font-bold">
                {user?.name?.charAt(0).toUpperCase() || "U"}
              </div>
              <button className="absolute bottom-0 right-0 w-10 h-10 bg-blue-500 hover:bg-blue-600 rounded-full flex items-center justify-center transition-colors">
                <Camera className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-3 mb-2">
                <h2 className="text-3xl font-bold">{user?.name || "User Name"}</h2>
                <button onClick={openEditModal} className="p-2 hover:bg-slate-700 rounded-lg transition-colors">
                  <Edit className="w-5 h-5 text-gray-400" />
                </button>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex items-center justify-center md:justify-start gap-2 text-black">
                  <Mail className="w-4 h-4" />
                  <span>{user?.email || "email@example.com"}</span>
                </div>
                <div className="flex items-center justify-center md:justify-start gap-2 text-black">
                  <Phone className="w-4 h-4" />
                  <span>{user?.phone || "Not provided"}</span>
                </div>
                <div className="flex items-center justify-center md:justify-start gap-2 text-black">
                  <Calendar className="w-4 h-4" />
                  <span>Joined {new Date(user?.createdAt || Date.now()).toLocaleDateString()}</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                <span className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-sm border border-blue-500/30">
                  {user?.role || "User"}
                </span>
                <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm border border-green-500/30">Verified Account</span>
              </div>
            </div>

            <div className="flex flex-col gap-2">
             <button
  onClick={openEditModal}
  className="px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg font-medium transition-colors flex items-center gap-2"
>

                <Edit className="w-4 h-4" />
                Edit Profile
              </button>

 {showEditModal && (
  <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
    <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">Edit Profile</h2>

      <form onSubmit={updateProfile} className="space-y-4">

        <div>
          <label className="text-sm font-medium text-gray-700">Name</label>
          <input
            type="text"
            value={editForm.name}
            onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
            className="w-full p-2 mt-1 border rounded-lg bg-gray-100"
          />
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            value={editForm.email}
            onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
            className="w-full p-2 mt-1 border rounded-lg bg-gray-100"
          />
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700">Phone</label>
          <input
            type="text"
            value={editForm.phone}
            onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
            className="w-full p-2 mt-1 border rounded-lg bg-gray-100"
          />
        </div>

        <div className="flex justify-end gap-3 mt-4">
          <button
            type="button"
            onClick={() => setShowEditModal(false)}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
          >
            Cancel
          </button>

          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Save Changes
          </button>
        </div>

      </form>
    </div>
  </div>
)}

            <NavLink to='/login'>
                <button className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 border border-red-500 rounded-lg font-medium transition-colors flex items-center gap-2 text-red-400">
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </NavLink>
            
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
       <div className="bg-white border border-gray-200 shadow-sm rounded-xl p-4">

            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-400">Total Borrowed</p>
              <DollarSign className="w-5 h-5 text-blue-400" />
            </div>
            <p className="text-2xl font-bold text-blue-400">₦{calculateTotalBorrowed().toLocaleString()}</p>
          </div>

          <div className="bg-white border border-gray-200 shadow-sm rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-400">Total Repaid</p>
              <CheckCircle className="w-5 h-5 text-green-400" />
            </div>
            <p className="text-2xl font-bold text-green-400">₦{calculateTotalRepaid().toLocaleString()}</p>
          </div>

          <div className="bg-white border border-gray-200 shadow-sm rounded-xl p-4">

            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-400">Outstanding</p>
              <TrendingUp className="w-5 h-5 text-yellow-400" />
            </div>
            <p className="text-2xl font-bold text-yellow-400">₦{calculateOutstanding().toLocaleString()}</p>
          </div>

          <div className="bg-white border border-gray-200 shadow-sm rounded-xl p-4">

            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-400">Active Loans</p>
              <FileText className="w-5 h-5 text-purple-400" />
            </div>
            <p className="text-2xl font-bold text-purple-400">{loans.filter((l) => l.status?.toLowerCase() === "active").length}</p>
          </div>
        </div>

        <div className="bg-white border border-gray-200 shadow-sm rounded-xl overflow-hidden mb-6">

          <div className="flex border-b border-slate-700">
            <button onClick={() => setActiveTab("overview")} className={`flex-1 px-6 py-4 font-medium transition-colors flex items-center justify-center gap-2 ${activeTab === "overview" ? "bg-blue-500/20 text-blue-700 border-b-2 border-blue-500" : "text-black hover:bg-slate-500/50"}`}>
              <Activity className="w-5 h-5" />
              Overview
            </button>
            <button onClick={() => setActiveTab("loans")} className={`flex-1 px-6 py-4 font-medium transition-colors flex items-center justify-center gap-2 ${activeTab === "loans" ? "bg-blue-500/20 text-blue-700 border-b-2 border-blue-500" : "text-black hover:bg-slate-500/50"}`}>
              <CreditCard className="w-5 h-5" />
              My Loans
            </button>
            <button onClick={() => setActiveTab("repayments")} className={`flex-1 px-6 py-4 font-medium transition-colors flex items-center justify-center gap-2 ${activeTab === "repayments" ? "bg-blue-500/20 text-blue-700 border-b-2 border-blue-500" : "text-black hover:bg-slate-500/50"}`}>
              <DollarSign className="w-5 h-5" />
              Repayments
            </button>
          </div>

          <div className="p-6">
            {activeTab === "overview" && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold mb-4">Recent Activity</h3>
                  <div className="space-y-3">
                    {[...loans, ...repayments].sort((a, b) => new Date(b.createdAt || b.date) - new Date(a.createdAt || a.date)).slice(0, 5).map((item, index) => (
                      <div key={index} className="bg-slate-900/50 border border-slate-700 rounded-lg p-4 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${item.amount && item.purpose ? "bg-blue-500/20" : "bg-green-500/20"}`}>
                            {item.amount && item.purpose ? <FileText className="w-5 h-5 text-blue-400" /> : <DollarSign className="w-5 h-5 text-green-400" />}
                          </div>
                          <div>
                            <p className="font-medium">{item.purpose ? `Loan Application: ${item.purpose}` : `Repayment Made`}</p>
                            <p className="text-sm text-gray-400">{new Date(item.createdAt || item.date).toLocaleDateString()}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold">₦{item.amount?.toLocaleString()}</p>
                          {item.status && (
                            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs border ${getStatusBadge(item.status).classes}`}>
                              {getStatusBadge(item.status).icon}
                              {getStatusBadge(item.status).label}
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-semibold mb-4">Account Balance</h3>
                  <div className="bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl p-6">
                    <p className="text-sm mb-2 opacity-90">Available Balance</p>
                    <p className="text-4xl font-bold mb-4">₦{(user?.balance || 0).toLocaleString()}</p>
                    <button className="px-4 py-2 bg-white text-blue-600 rounded-lg font-medium hover:bg-gray-100 transition-colors">Withdraw Funds</button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "loans" && (
              <div>
                <h3 className="text-xl font-semibold mb-4">My Loans</h3>
                {loans.length === 0 ? (
                  <div className="text-center py-12 text-gray-400">
                    <FileText className="w-16 h-16 mx-auto mb-4 opacity-50" />
                    <p>No loans yet</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {loans.map((loan) => {
                      const badge = getStatusBadge(loan.status);
                      return (
                        <div key={loan._id} className="bg-slate-900/50 border border-slate-700 rounded-lg p-4">
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <h4 className="font-semibold text-lg">{loan.purpose}</h4>
                              <p className="text-sm text-gray-400">Applied on {new Date(loan.createdAt).toLocaleDateString()}</p>
                            </div>
                            <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm border ${badge.classes}`}>
                              {badge.icon}
                              {badge.label}
                            </span>
                          </div>
                          <div className="grid grid-cols-3 gap-4">
                            <div>
                              <p className="text-xs text-gray-400">Loan Amount</p>
                              <p className="font-bold text-lg">₦{loan.amount?.toLocaleString()}</p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-400">Interest Rate</p>
                              <p className="font-bold text-lg">{loan.interestRate}%</p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-400">Repayment Period</p>
                              <p className="font-bold text-lg">{loan.repaymentPeriod} months</p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {activeTab === "repayments" && (
              <div>
                <h3 className="text-xl font-semibold mb-4">Repayment History</h3>
                {repayments.length === 0 ? (
                  <div className="text-center py-12 text-gray-400">
                    <DollarSign className="w-16 h-16 mx-auto mb-4 opacity-50" />
                    <p>No repayments yet</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {repayments.map((repayment, index) => (
                      <div key={index} className="bg-slate-900/50 border border-slate-700 rounded-lg p-4 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-green-500/20 rounded-full flex items-center justify-center">
                            <CheckCircle className="w-5 h-5 text-green-400" />
                          </div>
                          <div>
                            <p className="font-medium">Payment #{index + 1}</p>
                            <p className="text-sm text-gray-400">{new Date(repayment.date || repayment.createdAt).toLocaleDateString()}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-lg text-green-400">₦{repayment.amount?.toLocaleString()}</p>
                          <p className="text-xs text-gray-400">{repayment.method || "Bank Transfer"}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
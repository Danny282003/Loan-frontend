import React, { useEffect, useState } from "react";
import {
  DollarSign,
  ArrowLeft,
  Plus,
  Calendar,
  TrendingUp,
  Wallet,
  CheckCircle,
  X as XIcon,
} from "lucide-react";

import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import { useNavigate } from "react-router-dom";

export default function RepaymentPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loans, setLoans] = useState([]);
  const [selectedLoan, setSelectedLoan] = useState(null);
  const [repaymentInfo, setRepaymentInfo] = useState(null);

  const [paymentData, setPaymentData] = useState({
    amount: "",
    paymentMethod: "bank_transfer",
  });

  // Past payments filters
  const [sortOption, setSortOption] = useState("newest");
  const [filterDate, setFilterDate] = useState("");
  const [page, setPage] = useState(1);
  const itemsPerPage = 5;

  const navigate = useNavigate();

  // ----------------------------
  // Load user's loans
  // ----------------------------
  useEffect(() => {
    const fetchLoans = async () => {
      try {
        const res = await fetch("http://localhost:3000/api/loan/myLoans", {
          method: "GET",
          credentials: "include",
        });

        if (res.status === 401) {
          navigate("/login");
          return;
        }

        const data = await res.json();

        // Only loans the user can repay (active loans)
        const approved = data.filter(
          (loan) => loan.status.toLowerCase() === "active"
        );

        setLoans(approved);
        setLoading(false);
      } catch (err) {
        console.error("Error loading loans:", err);
        setLoading(false);
      }
    };

    fetchLoans();
  }, []);

  // ----------------------------
  // Load repayment details for selected loan
  // ----------------------------
  const loadRepaymentDetails = async (loanId) => {
    setSelectedLoan(loanId);
    setRepaymentInfo(null);

    try {
      const res = await fetch(
        `http://localhost:3000/api/repay/details/${loanId}`,
        {
          method: "GET",
          credentials: "include",
        }
      );

      const data = await res.json();
      setRepaymentInfo(data);
    } catch (err) {
      console.error("Error loading repayment details:", err);
    }
  };

  // ----------------------------
  // Submit payment
  // ----------------------------
  const submitPayment = async () => {
    try {
      const res = await fetch(
        `http://localhost:3000/api/repay/pay/${selectedLoan}`,
        {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(paymentData),
        }
      );

      const data = await res.json();

      if (!res.ok) return alert(data.message);

      alert("Payment successful!");

      // Refresh repayment info
      loadRepaymentDetails(selectedLoan);
    } catch (err) {
      console.error(err);
    }
  };

  // ----------------------------
  // Payment history – filtering & sorting
  // ----------------------------
  const payments = repaymentInfo?.repayments || [];

  // Filter by date
  let filteredPayments = payments.filter((p) => {
    if (!filterDate) return true;
    return p.date.startsWith(filterDate);
  });

  // Sorting
  filteredPayments = filteredPayments.sort((a, b) => {
    if (sortOption === "newest") return new Date(b.date) - new Date(a.date);
    if (sortOption === "oldest") return new Date(a.date) - new Date(b.date);
    if (sortOption === "high") return b.amount - a.amount;
    if (sortOption === "low") return a.amount - b.amount;
  });

  // Pagination
  const totalPages = Math.ceil(filteredPayments.length / itemsPerPage);
  const start = (page - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  const paginatedPayments = filteredPayments.slice(start, end);

  const nextPage = () => page < totalPages && setPage(page + 1);
  const prevPage = () => page > 1 && setPage(page - 1);

  // Download receipt
  const downloadReceipt = (p) => {
    const content = `
Loan Payment Receipt

Reference: ${p.reference}
Amount Paid: ₦${p.amount.toLocaleString()}
Date: ${new Date(p.date).toLocaleString()}
Status: Completed

Thank you for your payment.
`;

    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `receipt-${p.reference}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // -----------------------------------
  // UI START
  // -----------------------------------

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
// console.log(paginatedPayments)
  return (
    <div className="min-h-screen bg-green-50">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <div className="lg:ml-64">
        <Header setSidebarOpen={setSidebarOpen} />

        <main className="p-6 space-y-6">
          {/* Back Button */}
          <button
            onClick={() => navigate("/myloans")}
            className="text-gray-600 hover:text-gray-800 flex items-center space-x-2"
          >
            <ArrowLeft className="w-4" />
            <span>Back</span>
          </button>

          <h1 className="text-3xl font-bold text-gray-800">Repay a Loan</h1>
          <p className="text-gray-600">Select a loan to proceed</p>

          {/* ------------------------------
              1. Select Loan Section
              ------------------------------ */}
          <div className="bg-white p-6 rounded-xl shadow-md">
            <h2 className="text-lg font-semibold mb-4">Your Active Loans</h2>

            {loans.length === 0 && (
              <p className="text-gray-600">You have no active loans.</p>
            )}

            <div className="space-y-3">
              {loans.map((loan) => (
                <div
                  key={loan._id}
                  onClick={() => loadRepaymentDetails(loan._id)}
                  className={`p-4 border rounded-lg cursor-pointer hover:bg-green-50 transition-all ${
                    selectedLoan === loan._id &&
                    "border-green-600 bg-green-50"
                  }`}
                >
                  <p className="font-bold text-gray-800">
                    {loan.purpose} — ₦{loan.amount.toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-500">Status: {loan.status}</p>
                </div>
              ))}
            </div>
          </div>

          {/* ------------------------------
              2. Repayment Summary
              ------------------------------ */}
          {repaymentInfo && (
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-xl shadow-lg">
                <h2 className="text-xl font-bold text-gray-800 mb-4">
                  Repayment Summary
                </h2>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-gray-500">Total Due</p>
                    <p className="font-semibold text-lg">
                      ₦{repaymentInfo.financial.totalDue.toLocaleString()}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500">Paid</p>
                    <p className="font-semibold text-lg">
                      ₦{repaymentInfo.financial.amountPaid.toLocaleString()}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500">Remaining</p>
                    <p className="font-semibold text-lg">
                      ₦
                      {repaymentInfo.financial.remainingBalance.toLocaleString()}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500">Paid %</p>
                    <p className="font-semibold text-lg">
                      {repaymentInfo.financial.percentagePaid}%
                    </p>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
                  <div
                    className="bg-green-600 h-3 rounded-full"
                    style={{
                      width: `${repaymentInfo.financial.percentagePaid}%`,
                    }}
                  ></div>
                </div>
              </div>

              {/* ------------------------------
                  3. Make Payment Section
                  ------------------------------ */}
              <div className="bg-white p-6 rounded-xl shadow-lg">
                <h3 className="text-xl font-bold mb-4">Make a Payment</h3>

                <div className="mb-3">
                  <label className="text-sm text-gray-700">Amount</label>
                  <input
                    type="number"
                    value={paymentData.amount}
                    name="amount"
                    onChange={(e) =>
                      setPaymentData({
                        ...paymentData,
                        amount: e.target.value,
                      })
                    }
                    className="w-full p-3 border rounded-lg mt-1"
                    placeholder="Enter amount"
                  />
                </div>

                <button
                  onClick={submitPayment}
                  className="bg-green-600 text-white w-full py-3 rounded-lg mt-3 hover:bg-green-700"
                >
                  Pay Now
                </button>
              </div>

              {/* ------------------------------
                  4. Past Payments (Advanced)
                  ------------------------------ */}
              <div className="bg-white p-6 rounded-xl shadow-lg">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
                  <h3 className="text-xl font-bold flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    Past Payments
                  </h3>

                  <div className="flex gap-3 mt-3 md:mt-0">
                    {/* Sort */}
                    <select
                      value={sortOption}
                      onChange={(e) => setSortOption(e.target.value)}
                      className="px-3 py-2 border rounded-lg bg-gray-50"
                    >
                      <option value="newest">Newest → Oldest</option>
                      <option value="oldest">Oldest → Newest</option>
                      <option value="high">Amount: High → Low</option>
                      <option value="low">Amount: Low → High</option>
                    </select>

                    {/* Filter Date */}
                    <input
                      type="date"
                      value={filterDate}
                      onChange={(e) => setFilterDate(e.target.value)}
                      className="px-3 py-2 border rounded-lg bg-gray-50"
                    />
                  </div>
                </div>

                {/* Empty */}
                {filteredPayments.length === 0 ? (
                  <div className="text-center py-10">
                    <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-3">
                      <XIcon className="w-7 h-7 text-gray-400" />
                    </div>
                    <p className="text-gray-600">
                      No payments match your filters.
                    </p>
                  </div>
                ) : (
                  <>
                    <div className="space-y-3">
                      {paginatedPayments.map((p) => (
                        <div
                          key={p.id}
                          className="border rounded-lg p-4 flex justify-between items-center hover:bg-gray-50 transition-all"
                        >
                          <div>
                            <p className="font-semibold text-lg text-gray-800">
                              ₦{p.amount.toLocaleString()}
                            </p>
                            <p className="text-sm text-gray-500">
                              {p.reference}
                            </p>
                          </div>

                          <div className="text-right">
                            <p className="text-sm font-medium text-gray-700">
                              {new Date(p.date).toLocaleDateString("en-US", {
                                weekday: "short",
                                month: "short",
                                day: "numeric",
                              })}
                            </p>

                            <button
                              onClick={() => downloadReceipt(p)}
                              className="text-xs text-blue-600 hover:text-blue-700 font-medium underline"
                            >
                              Receipt
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Pagination */}
                    <div className="flex items-center justify-between pt-4">
                      <button
                        onClick={prevPage}
                        disabled={page === 1}
                        className={`px-4 py-2 border rounded-lg ${
                          page === 1 ? "opacity-40" : "hover:bg-gray-100"
                        }`}
                      >
                        Prev
                      </button>

                      <p className="text-sm font-medium">
                        Page {page} of {totalPages}
                      </p>

                      <button
                        onClick={nextPage}
                        disabled={page === totalPages}
                        className={`px-4 py-2 border rounded-lg ${
                          page === totalPages
                            ? "opacity-40"
                            : "hover:bg-gray-100"
                        }`}
                      >
                        Next
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

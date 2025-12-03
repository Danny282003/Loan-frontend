import React, { useState } from 'react';
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
  ArrowLeft,
  Calculator,
  Calendar,
  FileText,
  Briefcase,
  TrendingUp,
  Info,
  CheckCircle
} from 'lucide-react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import { useNavigate } from 'react-router-dom';


export default function ApplyLoanPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    amount: '',
    purpose: '',
    duration: '',
    income: '',
    employmentStatus: '',
    businessName: '',
    accountNumber: '',
    bankName: ''
  });
  const navigate = useNavigate()

  const loanPurposes = [
    'Business Expansion',
    'Education',
    'Medical Emergency',
    'Home Renovation',
    'Debt Consolidation',
    'Vehicle Purchase',
    'Wedding',
    'Other'
  ];

  const employmentOptions = [
    'Employed (Full-time)',
    'Employed (Part-time)',
    'Self-employed',
    'Business Owner',
    'Unemployed',
    'Student'
  ];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const calculateInterest = () => {
    const amount = parseFloat(formData.amount) || 0;
    const duration = parseInt(formData.duration) || 0;
    const interestRate = 0.1; // 10% per month
    const interest = amount * interestRate * duration;
    const totalDue = amount + interest;
    const monthlyPayment = duration > 0 ? totalDue / duration : 0;
    
    return { interest, totalDue, monthlyPayment };
  };

  const { interest, totalDue, monthlyPayment } = calculateInterest();


      let handleSubmit = async (e) => {
      e.preventDefault();
 
    
      try {
        setLoading(true);

        const numericData = {
          ...formData,
          amount: Number(formData.amount),
          duration: Number(formData.duration),
          income: Number(formData.income)
        }
        let url = "http://localhost:3000/api/loan/apply"
    
        let response = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include", // IMPORTANT for cookies
          body: JSON.stringify(numericData),
        });
        setLoading(false)
        let data = await response.json(); // ✅ Now data always exists
    
         console.log('Response:', response.status)
    
        if (!response.ok) {
          alert(data.message || "Something went wrong");
          setLoading(false);
          return;
        }
       
        alert(data.message)

        if(response.status === 401){
          navigate('/login')
        }

        if(data.message === 'Loan Application Successful'){
          navigate('/apply')
        }
        
          'View Details'
          'loan'
      
        // SUCCESS
        // alert(data.message)
    
        // Redirect user based on role
    
          // return alert(data.message)
    
      } catch (err) {
        console.error("Internal Server Error");
        console.log(err);
      }
      }
    // Will be replaced with API call
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
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-100">
      {/* Sidebar */}
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* Main Content */}
      <div className="lg:ml-64">
        {/* Top Navigation */}
        <Header setSidebarOpen={setSidebarOpen} />

        {/* Page Content */}
        <main className="p-6">
          {/* Back Button */}
          <button className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 mb-6">
            <a href="/home" className=' inline'>
              <ArrowLeft className="w-5 h-5 inline" />
              <span className="font-medium">Back to dashboard</span>
            </a>
          </button>

          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Apply for a Loan</h1>
            <p className="text-gray-600">Fill out the form below to submit your loan application</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Form */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
                {/* Progress Steps */}
                <div className="mb-8">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`flex items-center space-x-2 ${currentStep >= 1 ? 'text-green-600' : 'text-gray-400'}`}>
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep >= 1 ? 'bg-green-600 text-white' : 'bg-gray-200'}`}>
                        1
                      </div>
                      <span className="hidden md:inline font-medium">Loan Details</span>
                    </div>
                    <div className="flex-1 h-1 mx-4 bg-gray-200 rounded">
                      <div className={`h-1 rounded transition-all ${currentStep >= 2 ? 'bg-green-600 w-full' : 'w-0'}`}></div>
                    </div>
                    <div className={`flex items-center space-x-2 ${currentStep >= 2 ? 'text-green-600' : 'text-gray-400'}`}>
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep >= 2 ? 'bg-green-600 text-white' : 'bg-gray-200'}`}>
                        2
                      </div>
                      <span className="hidden md:inline font-medium">Personal Info</span>
                    </div>
                    <div className="flex-1 h-1 mx-4 bg-gray-200 rounded">
                      <div className={`h-1 rounded transition-all ${currentStep >= 3 ? 'bg-green-600 w-full' : 'w-0'}`}></div>
                    </div>
                    <div className={`flex items-center space-x-2 ${currentStep >= 3 ? 'text-green-600' : 'text-gray-400'}`}>
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep >= 3 ? 'bg-green-600 text-white' : 'bg-gray-200'}`}>
                        3
                      </div>
                      <span className="hidden md:inline font-medium">Review</span>
                    </div>
                  </div>
                </div>

                {/* Step 1: Loan Details */}
                {currentStep === 1 && (
                  <div className="space-y-6">
                    <h2 className="text-xl font-bold text-gray-800 mb-4">Loan Details</h2>

                    {/* Loan Amount */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Loan Amount (₦)
                      </label>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                          type="number"
                          name="amount"
                          value={formData.amount}
                          onChange={handleChange}
                          placeholder="e.g. 50000"
                          className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                        />
                      </div>
                      <p className="text-xs text-gray-500 mt-1">Minimum: ₦5,000 | Maximum: ₦500,000</p>
                    </div>

                    {/* Loan Purpose */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Purpose of Loan
                      </label>
                      <div className="relative">
                        <FileText className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <select
                          name="purpose"
                          value={formData.purpose}
                          onChange={handleChange}
                          className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none appearance-none bg-white"
                        >
                          <option value="">Select purpose</option>
                          {loanPurposes.map((purpose) => (
                            <option key={purpose} value={purpose}>
                              {purpose}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                          
                    {/* Repayment Duration */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Repayment Duration (Months)
                      </label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <select
                          name="duration"
                          value={formData.duration}
                          onChange={handleChange}
                          className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none appearance-none bg-white"
                        >
                          <option value="">Select duration</option>
                          <option value="1">1 month</option>
                          <option value="2">2 months</option>
                          <option value="3">3 months</option>
                          <option value="6">6 months</option>
                          <option value="12">12 months</option>
                          <option value="18">18 months</option>
                          <option value="24">24 months</option>
                        </select>
                      </div>
                    </div>

                    {/* Navigation Buttons */}
                    <div className="flex justify-end pt-4">
                      <button
                        onClick={() => setCurrentStep(2)}
                        className="bg-green-600 hover:bg-green-700 text-white font-semibold px-8 py-3 rounded-lg transition-all shadow-lg hover:shadow-xl"
                      >
                        Next Step
                      </button>
                    </div>
                  </div>
                )}

                {/* Step 2: Personal Information */}
                {currentStep === 2 && (
                  <div className="space-y-6">
                    <h2 className="text-xl font-bold text-gray-800 mb-4">Personal Information</h2>

                    {/* Monthly Income */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Monthly Income (₦)
                      </label>
                      <div className="relative">
                        <TrendingUp className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                          type="number"
                          name="income"
                          value={formData.income}
                          onChange={handleChange}
                          placeholder="e.g. 150000"
                          className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                        />
                      </div>
                    </div>

                    {/* Employment Status */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Employment Status
                      </label>
                      <div className="relative">
                        <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <select
                          name="employmentStatus"
                          value={formData.employmentStatus}
                          onChange={handleChange}
                          className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none appearance-none bg-white"
                        >
                          <option value="">Select status</option>
                          {employmentOptions.map((status) => (
                            <option key={status} value={status}>
                              {status}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Business Name (if self-employed or business owner) */}
                    {(formData.employmentStatus === 'Self-employed' || formData.employmentStatus === 'Business Owner') && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Business Name
                        </label>
                        <input
                          type="text"
                          name="businessName"
                          value={formData.businessName}
                          onChange={handleChange}
                          placeholder="Your business name"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                        />
                      </div>
                    )}

                    {/* Bank Account Number */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Bank Account Number
                      </label>
                      <input
                        type="text"
                        name="accountNumber"
                        value={formData.accountNumber}
                        onChange={handleChange}
                        placeholder="1234567890"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                      />
                    </div>

                    {/* Bank Name */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Bank Name
                      </label>
                      <input
                        type="text"
                        name="bankName"
                        value={formData.bankName}
                        onChange={handleChange}
                        placeholder="e.g. Access Bank"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                      />
                    </div>

                    {/* Navigation Buttons */}
                    <div className="flex justify-between pt-4">
                      <button
                        onClick={() => setCurrentStep(1)}
                        className="border-2 border-gray-300 text-gray-700 font-semibold px-8 py-3 rounded-lg hover:bg-gray-50 transition-all"
                      >
                        Previous
                      </button>
                      <button
                        onClick={() => setCurrentStep(3)}
                        className="bg-green-600 hover:bg-green-700 text-white font-semibold px-8 py-3 rounded-lg transition-all shadow-lg hover:shadow-xl"
                      >
                        Review Application
                      </button>
                    </div>
                  </div>
                )}

                {/* Step 3: Review */}
                {currentStep === 3 && (
                  <div className="space-y-6">
                    <h2 className="text-xl font-bold text-gray-800 mb-4">Review Your Application</h2>

                    <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                      <div className="flex items-start space-x-3">
                        <Info className="w-5 h-5 text-green-600 mt-0.5" />
                        <p className="text-sm text-green-800">
                          Please review your information carefully before submitting. Your application will be reviewed within 24 hours.
                        </p>
                      </div>
                    </div>

                    {/* Loan Details Summary */}
                    <div className="border border-gray-200 rounded-lg p-6 space-y-4">
                      <h3 className="font-semibold text-gray-800 mb-3">Loan Details</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-500">Amount</p>
                          <p className="font-semibold text-gray-800">₦{parseFloat(formData.amount || 0).toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Purpose</p>
                          <p className="font-semibold text-gray-800">{formData.purpose || 'Not specified'}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Duration</p>
                          <p className="font-semibold text-gray-800">{formData.duration || '0'} months</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Monthly Income</p>
                          <p className="font-semibold text-gray-800">₦{parseFloat(formData.income || 0).toLocaleString()}</p>
                        </div>
                      </div>
                    </div>

                    {/* Personal Info Summary */}
                    <div className="border border-gray-200 rounded-lg p-6 space-y-4">
                      <h3 className="font-semibold text-gray-800 mb-3">Personal Information</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-500">Employment Status</p>
                          <p className="font-semibold text-gray-800">{formData.employmentStatus || 'Not specified'}</p>
                        </div>
                        {formData.businessName && (
                          <div>
                            <p className="text-sm text-gray-500">Business Name</p>
                            <p className="font-semibold text-gray-800">{formData.businessName}</p>
                          </div>
                        )}
                        <div>
                          <p className="text-sm text-gray-500">Account Number</p>
                          <p className="font-semibold text-gray-800">{formData.accountNumber || 'Not specified'}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Bank</p>
                          <p className="font-semibold text-gray-800">{formData.bankName || 'Not specified'}</p>
                        </div>
                      </div>
                    </div>

                    {/* Terms and Conditions */}
                    <div className="flex items-start space-x-3">
                      <input
                        type="checkbox"
                        className="w-5 h-5 text-green-600 border-gray-300 rounded focus:ring-green-500 mt-0.5"
                      />
                      <label className="text-sm text-gray-600">
                        I agree to the terms and conditions and confirm that all information provided is accurate.
                      </label>
                    </div>

                    {/* Navigation Buttons */}
                    <div className="flex justify-between pt-4">
                      <button
                        onClick={() => setCurrentStep(2)}
                        className="border-2 border-gray-300 text-gray-700 font-semibold px-8 py-3 rounded-lg hover:bg-gray-50 transition-all"
                      >
                        Previous
                      </button>
                      <button
                        onClick={handleSubmit}
                        className="bg-green-600 hover:bg-green-700 text-white font-semibold px-8 py-3 rounded-lg transition-all shadow-lg hover:shadow-xl flex items-center space-x-2"
                      >
                        <CheckCircle className="w-5 h-5" />
                        <span>Submit Application</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Sidebar Calculator */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-24">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <Calculator className="w-6 h-6 text-green-600" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-800">Loan Calculator</h3>
                </div>

                <div className="space-y-4">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-sm text-gray-600 mb-1">Principal Amount</p>
                    <p className="text-2xl font-bold text-gray-800">₦{parseFloat(formData.amount || 0).toLocaleString()}</p>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-sm text-gray-600 mb-1">Interest (10% per month)</p>
                    <p className="text-xl font-bold text-orange-600">₦{interest.toLocaleString()}</p>
                  </div>

                  <div className="bg-green-50 rounded-lg p-4 border-2 border-green-200">
                    <p className="text-sm text-gray-600 mb-1">Total Amount Due</p>
                    <p className="text-2xl font-bold text-green-600">₦{totalDue.toLocaleString()}</p>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-sm text-gray-600 mb-1">Monthly Payment</p>
                    <p className="text-xl font-bold text-gray-800">₦{monthlyPayment.toLocaleString()}</p>
                    {formData.duration && (
                      <p className="text-xs text-gray-500 mt-1">for {formData.duration} months</p>
                    )}
                  </div>
                </div>

                <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-start space-x-2">
                    <Info className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                    <p className="text-xs text-blue-800">
                      Interest rates are calculated monthly. Actual rates may vary based on your credit score and application review.
                    </p>
                  </div>
                </div>
              </div>
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
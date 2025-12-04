import React, { useState } from "react";
import { Lock, Eye, EyeOff, ArrowLeft, CheckCircle, AlertCircle } from "lucide-react";
import { useParams } from "react-router-dom";

export default function ResetPassword() {
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [passwordStrength, setPasswordStrength] = useState({ score: 0, text: "", color: "" });
  const params = useParams()
  const render = "https://quickcredit-wxnq.onrender.com"

  const getTokenFromUrl = () => {
    const params = new URLSearchParams(window.location.search);
    return params.get("resetToken") || "demo-token";
  };

  const calculatePasswordStrength = (password) => {
    let score = 0;
    if (password.length >= 8) score++;
    if (password.length >= 12) score++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++;
    if (/\d/.test(password)) score++;
    if (/[^a-zA-Z\d]/.test(password)) score++;

    if (score <= 2) return { score, text: "Weak", color: "text-red-400" };
    if (score <= 3) return { score, text: "Medium", color: "text-yellow-400" };
    return { score, text: "Strong", color: "text-green-400" };
  };

  const handlePasswordChange = (value) => {
    setFormData((prev) => ({ ...prev, password: value }));
    setPasswordStrength(calculatePasswordStrength(value));
  };

  const handleSubmit = async () => {
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters long");
      return;
    }

    setLoading(true);

    try {
      // const token = getTokenFromUrl();
      const response = await fetch(`${render}/api/user/reset-password/${params.resetToken}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(true);
      } else {
        setError(data.message || "Failed to reset password");
      }
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-8 text-center">
            <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-400" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Password Reset Successful!</h2>
            <p className="text-gray-400 mb-6">
              Your password has been successfully reset. You can now log in with your new password.
            </p>
            <button
              onClick={() => window.location.href = "/login"}
              className="w-full py-3 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 rounded-lg font-semibold transition-all text-white"
            >
              Go to Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Lock className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Reset Your Password</h1>
          <p className="text-gray-400">
            Enter your new password below to reset your account password.
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-8">
          <div className="space-y-6">
            {error && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-400">{error}</p>
              </div>
            )}

            {/* New Password */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                New Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={(e) => handlePasswordChange(e.target.value)}
                  placeholder="Enter new password"
                  className="w-full pl-10 pr-12 py-3 bg-slate-900/50 border border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-gray-500"
                />
                <button
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>

              {/* Password Strength Indicator */}
              {formData.password && (
                <div className="mt-2">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-gray-400">Password Strength:</span>
                    <span className={`text-xs font-medium ${passwordStrength.color}`}>
                      {passwordStrength.text}
                    </span>
                  </div>
                  <div className="h-2 bg-slate-900/50 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-300 ${
                        passwordStrength.score <= 2
                          ? "bg-red-500"
                          : passwordStrength.score <= 3
                          ? "bg-yellow-500"
                          : "bg-green-500"
                      }`}
                      style={{ width: `${(passwordStrength.score / 5) * 100}%` }}
                    ></div>
                  </div>
                </div>
              )}

              <p className="text-xs text-gray-500 mt-2">
                Must be at least 8 characters with letters, numbers, and symbols
              </p>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Confirm New Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData((prev) => ({ ...prev, confirmPassword: e.target.value }))}
                  placeholder="Confirm new password"
                  className="w-full pl-10 pr-12 py-3 bg-slate-900/50 border border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-gray-500"
                  onKeyPress={(e) => e.key === "Enter" && formData.password && formData.confirmPassword && handleSubmit()}
                />
                <button
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300"
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>

              {/* Password Match Indicator */}
              {formData.confirmPassword && (
                <p
                  className={`text-xs mt-2 ${
                    formData.password === formData.confirmPassword
                      ? "text-green-400"
                      : "text-red-400"
                  }`}
                >
                  {formData.password === formData.confirmPassword
                    ? "✓ Passwords match"
                    : "✗ Passwords do not match"}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <button
              onClick={handleSubmit}
              disabled={loading || !formData.password || !formData.confirmPassword}
              className="w-full py-3 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 rounded-lg font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed text-white"
            >
              {loading ? "Resetting Password..." : "Reset Password"}
            </button>

            {/* Back to Login */}
            <button
              onClick={() => window.location.href = "/login"}
              className="w-full py-3 bg-slate-700/50 hover:bg-slate-700 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2 text-white"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Login
            </button>
          </div>
        </div>

        {/* Additional Help */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-400">
            Having trouble?{" "}
            <a href="/contact" className="text-blue-400 hover:text-blue-300 font-medium">
              Contact support
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
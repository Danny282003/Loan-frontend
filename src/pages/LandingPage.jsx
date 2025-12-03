import React, { useState } from "react";
import { DollarSign, TrendingUp, Shield, Clock, CheckCircle, Menu, X, ArrowRight, Users, Award, Zap, ChevronRight } from "lucide-react";
import { NavLink } from "react-router-dom";

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const features = [
    {
      icon: <Clock className="w-8 h-8" />,
      title: "Quick Approval",
      description: "Get approved in minutes with our streamlined application process",
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Secure & Safe",
      description: "Bank-level security to protect your personal and financial data",
      color: "from-purple-500 to-pink-500"
    },
    {
      icon: <DollarSign className="w-8 h-8" />,
      title: "Low Interest Rates",
      description: "Competitive rates starting from 5% to help you save money",
      color: "from-green-500 to-emerald-500"
    },
    {
      icon: <TrendingUp className="w-8 h-8" />,
      title: "Flexible Terms",
      description: "Choose repayment terms that work best for your budget",
      color: "from-orange-500 to-red-500"
    }
  ];

  const steps = [
    { number: "01", title: "Create Account", description: "Sign up in under 2 minutes with basic information" },
    { number: "02", title: "Apply for Loan", description: "Fill out a simple application with your loan details" },
    { number: "03", title: "Get Approved", description: "Receive instant approval and funds in your account" },
    { number: "04", title: "Repay Easily", description: "Make flexible repayments on your schedule" }
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Small Business Owner",
      content: "This platform helped me get the capital I needed to expand my business. The process was fast and transparent!",
      rating: 5,
      avatar: "SJ"
    },
    {
      name: "Michael Chen",
      role: "Freelancer",
      content: "I was skeptical at first, but the low interest rates and flexible terms made it perfect for my needs.",
      rating: 5,
      avatar: "MC"
    },
    {
      name: "Aisha Okonkwo",
      role: "Student",
      content: "Getting a loan for my education was seamless. The customer support team was incredibly helpful!",
      rating: 5,
      avatar: "AO"
    }
  ];

  const stats = [
    { value: "₦50M+", label: "Loans Disbursed" },
    { value: "10K+", label: "Happy Customers" },
    { value: "99.9%", label: "Approval Rate" },
    { value: "24/7", label: "Support Available" }
  ];

  return (
    <div className="bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-slate-900/80 backdrop-blur-lg border-b border-slate-800 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                <DollarSign className="w-6 h-6" />
              </div>
              <span className="text-xl font-bold">LoanApp</span>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center gap-8">
              {/* <a href="#features" className="text-gray-300 hover:text-white transition-colors">Features</a>
              <a href="#how-it-works" className="text-gray-300 hover:text-white transition-colors">How It Works</a>
              <a href="#testimonials" className="text-gray-300 hover:text-white transition-colors">Testimonials</a> */}
              <NavLink to="/login" className="text-gray-300 hover:text-white transition-colors">Login</NavLink>
              <NavLink to="/login" className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg font-semibold hover:opacity-90 transition-opacity">
                Get Started
              </NavLink>
            </div>

            {/* Mobile Menu Button */}
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden">
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden mt-4 pb-4 space-y-4">
              {/* <a href="#features" className="block text-gray-300 hover:text-white transition-colors">Features</a>
              <a href="#how-it-works" className="block text-gray-300 hover:text-white transition-colors">How It Works</a>
              <a href="#testimonials" className="block text-gray-300 hover:text-white transition-colors">Testimonials</a> */}
              <NavLink to="/login" className="block text-gray-300 hover:text-white transition-colors">Login</NavLink>
              <NavLink to="/login" className="block px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg font-semibold text-center">
                Get Started
              </NavLink>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/20 border border-blue-500/30 rounded-full mb-6">
                <Zap className="w-4 h-4 text-blue-400" />
                <span className="text-sm text-blue-400">Fast & Reliable Loans</span>
              </div>
              <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
                Get Your Loan <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Approved</span> in Minutes
              </h1>
              <p className="text-xl text-gray-400 mb-8">
                Access quick, secure loans with competitive rates. No hidden fees, no hassle. Just simple, transparent lending.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <NavLink to="/login" className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg font-semibold hover:opacity-90 transition-opacity flex items-center justify-center gap-2">
                  Apply Now
                  <ArrowRight className="w-5 h-5" />
                </NavLink>
                {/* <button className="px-8 py-4 bg-slate-800 hover:bg-slate-700 rounded-lg font-semibold transition-colors">
                  Learn More
                </button> */}
              </div>
            </div>

            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl blur-3xl opacity-20"></div>
              <div className="relative bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-8">
                <div className="space-y-6">
                  <div className="flex items-center justify-between p-4 bg-slate-900/50 rounded-xl">
                    <span className="text-gray-400">Loan Amount</span>
                    <span className="text-2xl font-bold text-green-400">₦500,000</span>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-slate-900/50 rounded-xl">
                    <span className="text-gray-400">Interest Rate</span>
                    <span className="text-2xl font-bold text-blue-400">5%</span>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-slate-900/50 rounded-xl">
                    <span className="text-gray-400">Approval Time</span>
                    <span className="text-2xl font-bold text-purple-400">2 mins</span>
                  </div>
                  {/* <button className="w-full py-4 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl font-semibold hover:opacity-90 transition-opacity">
                    Calculate My Loan
                  </button> */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-6 bg-slate-900/50">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-2">
                  {stat.value}
                </div>
                <div className="text-gray-400">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Why Choose Us</h2>
            <p className="text-xl text-gray-400">Everything you need for a seamless loan experience</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div key={index} className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6 hover:border-slate-600 transition-all hover:-translate-y-1">
                <div className={`w-16 h-16 bg-gradient-to-br ${feature.color} rounded-xl flex items-center justify-center mb-4`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 px-6 bg-slate-900/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">How It Works</h2>
            <p className="text-xl text-gray-400">Get your loan in 4 simple steps</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((step, index) => (
              <div key={index} className="relative">
                <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6">
                  <div className="text-6xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-4">
                    {step.number}
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                  <p className="text-gray-400">{step.description}</p>
                </div>
                {index < steps.length - 1 && (
                  <ChevronRight className="hidden lg:block absolute top-1/2 -right-3 w-6 h-6 text-blue-400" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">What Our Customers Say</h2>
            <p className="text-xl text-gray-400">Join thousands of satisfied borrowers</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6">
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <CheckCircle key={i} className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-300 mb-6 italic">"{testimonial.content}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center font-bold">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <div className="font-semibold">{testimonial.name}</div>
                    <div className="text-sm text-gray-400">{testimonial.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl p-12 text-center">
            <h2 className="text-4xl font-bold mb-4">Ready to Get Started?</h2>
            <p className="text-xl mb-8 opacity-90">
              Join thousands of satisfied customers and get your loan approved today
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <NavLink to="/login" className="px-8 py-4 bg-white text-blue-600 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                Apply Now
              </NavLink>
              <a href="/contact" className="px-8 py-4 bg-transparent border-2 border-white rounded-lg font-semibold hover:bg-white/10 transition-colors">
                Contact Us
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 bg-slate-900/80 border-t border-slate-800">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                  <DollarSign className="w-5 h-5" />
                </div>
                <span className="text-lg font-bold">LoanApp</span>
              </div>
              <p className="text-gray-400 text-sm">
                Your trusted partner for quick and secure loans. Empowering financial freedom.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <div className="space-y-2 text-sm text-gray-400">
                <div><NavLink to="/about" className="hover:text-white transition-colors">About Us</NavLink></div>
                {/* <div><a href="/careers" className="hover:text-white transition-colors">Careers</a></div>
                <div><a href="/blog" className="hover:text-white transition-colors">Blog</a></div> */}
              </div>
            </div>

            {/* <div>
              <h4 className="font-semibold mb-4">Resources</h4>
              <div className="space-y-2 text-sm text-gray-400">
                <div><a href="/faq" className="hover:text-white transition-colors">FAQ</a></div>
                <div><a href="/support" className="hover:text-white transition-colors">Support</a></div>
                <div><a href="/terms" className="hover:text-white transition-colors">Terms of Service</a></div>
              </div>
            </div> */}

            <div>
              <h4 className="font-semibold mb-4">Contact</h4>
              <div className="space-y-2 text-sm text-gray-400">
                <div>biggiie01@gmail.com</div>
                <div>+234 80 5470 3592</div>
                <div>Lagos, Nigeria</div>
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-slate-800 text-center text-sm text-gray-400">
            <p>© 2025 LoanApp. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
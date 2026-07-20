import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { User, Mail, Lock, Eye, EyeOff, ArrowRight, ArrowLeft, Check, AlertCircle, RefreshCw } from "lucide-react";
import { UserProfile } from "../types";

interface RegisterPageProps {
  onRegisterSuccess: (user: UserProfile, token: string) => void;
  onNavigate: (page: string) => void;
}

export function RegisterPage({ onRegisterSuccess, onNavigate }: RegisterPageProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Live registration validations
  const isEmailValid = email.includes("@") && email.includes(".");
  
  // Requirement 1: Length >= 6
  const reqLength = password.length >= 6;
  // Requirement 2: Has a number or special char
  const reqNumberOrSpecial = /[0-9!@#$%^&*(),.?":{}|<>]/.test(password);
  // Requirement 3: Matches confirm password
  const reqMatch = password.length > 0 && password === confirmPassword;

  // Compute password strength rating: 0 (empty) to 3 (strong)
  let strengthScore = 0;
  if (password.length > 0) {
    strengthScore = 1; // Weak
    if (reqLength && reqNumberOrSpecial) {
      strengthScore = 3; // Strong
    } else if (reqLength || reqNumberOrSpecial) {
      strengthScore = 2; // Fair
    }
  }

  const getStrengthLabel = () => {
    switch (strengthScore) {
      case 1: return { text: "Weak", color: "text-rose-500", barColor: "bg-rose-500", count: 1 };
      case 2: return { text: "Fair", color: "text-amber-500", barColor: "bg-amber-500", count: 2 };
      case 3: return { text: "Strong", color: "text-emerald-500", barColor: "bg-emerald-500", count: 3 };
      default: return { text: "", color: "text-slate-300", barColor: "bg-slate-200", count: 0 };
    }
  };

  const strength = getStrengthLabel();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!name.trim()) {
      setError("Please enter your full name.");
      return;
    }
    if (!isEmailValid) {
      setError("Please enter a valid email address.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password })
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        setError(errData.error || "Failed to create account. Please check credentials.");
        setIsLoading(false);
        return;
      }

      const data = await res.json();
      localStorage.setItem("zenithplan_jwt", data.token);
      onRegisterSuccess(data.user, data.token);
      onNavigate("home");
    } catch (err) {
      // Local fallback for registration
      const registerUser: UserProfile = {
        email,
        name,
        role: "Eco Explorer",
        likes: [],
        savedItineraries: []
      };
      localStorage.setItem("zenithplan_jwt", "mock-register-token-999");
      onRegisterSuccess(registerUser, "mock-register-token-999");
      onNavigate("home");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div id="register-page-container" className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-slate-50 relative overflow-hidden">
      {/* Decorative ambient background spots */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-100/40 rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-teal-100/40 rounded-full blur-3xl -z-10" />

      <div className="max-w-md w-full space-y-8 relative">
        {/* Navigation back header */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => onNavigate("home")}
            className="group flex items-center gap-2 text-xs font-black text-slate-500 hover:text-emerald-600 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
            Back to Home
          </button>
          <span className="text-[10px] bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full font-black uppercase tracking-widest">
            Zenith Portal
          </span>
        </div>

        {/* Central Card */}
        <div className="bg-white rounded-[2.5rem] border border-slate-100 p-8 shadow-2xl space-y-6">
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">
              Join ZenithPlan
            </h1>
            <p className="text-slate-400 text-xs">
              Create an Ambassador account to log activities and save custom trails.
            </p>
          </div>

          {/* Form Tabs */}
          <div className="grid grid-cols-2 bg-slate-50 p-1.5 rounded-2xl border border-slate-150">
            <button
              onClick={() => onNavigate("login")}
              className="py-2.5 text-xs font-bold text-slate-500 hover:text-slate-800 transition-colors"
            >
              Sign In
            </button>
            <button
              onClick={() => {}}
              className="py-2.5 text-xs font-black text-emerald-700 bg-white rounded-xl shadow-sm transition-all"
            >
              Create Account
            </button>
          </div>

          {/* Alert Banners */}
          <AnimatePresence mode="wait">
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="p-4 bg-rose-50 border border-rose-100 text-rose-800 rounded-2xl text-xs font-semibold flex items-start gap-3"
              >
                <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                <span>{error}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Form */}
          <form onSubmit={handleRegister} className="space-y-4">
            {/* Full Name input */}
            <div className="space-y-1.5">
              <label className="block text-[11px] font-black text-slate-600 uppercase tracking-wider">
                Full Name
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400">
                  <User className="w-4 h-4" />
                </span>
                <input
                  type="text"
                  required
                  disabled={isLoading}
                  placeholder="Alex Green"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 focus:border-emerald-500 focus:ring-emerald-500 focus:ring-1 rounded-xl py-3 pl-11 pr-4 text-xs font-semibold text-slate-800 transition-all focus:bg-white outline-none"
                />
              </div>
            </div>

            {/* Email Address input */}
            <div className="space-y-1.5">
              <label className="block text-[11px] font-black text-slate-600 uppercase tracking-wider">
                Email Address
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400">
                  <Mail className="w-4 h-4" />
                </span>
                <input
                  type="email"
                  required
                  disabled={isLoading}
                  placeholder="alex@greenmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`w-full bg-slate-50 border ${
                    email ? (isEmailValid ? "border-emerald-300 focus:border-emerald-500 focus:ring-emerald-500" : "border-rose-300 focus:border-rose-500 focus:ring-rose-500") : "border-slate-200 focus:border-emerald-500 focus:ring-emerald-500"
                  } focus:ring-1 rounded-xl py-3 pl-11 pr-4 text-xs font-semibold text-slate-800 transition-all focus:bg-white outline-none`}
                />
              </div>
            </div>

            {/* Password input */}
            <div className="space-y-1.5">
              <label className="block text-[11px] font-black text-slate-600 uppercase tracking-wider">
                Password
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400">
                  <Lock className="w-4 h-4" />
                </span>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  disabled={isLoading}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 focus:border-emerald-500 focus:ring-emerald-500 focus:ring-1 rounded-xl py-3 pl-11 pr-11 text-xs font-semibold text-slate-800 transition-all focus:bg-white outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {/* Password Strength Meter */}
              {password && (
                <div className="pt-1.5 space-y-1.5">
                  <div className="flex justify-between items-center text-[10px]">
                    <span className="text-slate-400 font-bold uppercase tracking-wider">Password Strength:</span>
                    <span className={`font-black ${strength.color}`}>{strength.text}</span>
                  </div>
                  <div className="grid grid-cols-3 gap-1">
                    <div className={`h-1.5 rounded-full ${strength.count >= 1 ? strength.barColor : "bg-slate-100"}`} />
                    <div className={`h-1.5 rounded-full ${strength.count >= 2 ? strength.barColor : "bg-slate-100"}`} />
                    <div className={`h-1.5 rounded-full ${strength.count >= 3 ? strength.barColor : "bg-slate-100"}`} />
                  </div>
                </div>
              )}
            </div>

            {/* Confirm Password input */}
            <div className="space-y-1.5">
              <label className="block text-[11px] font-black text-slate-600 uppercase tracking-wider">
                Confirm Password
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400">
                  <Lock className="w-4 h-4" />
                </span>
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  required
                  disabled={isLoading}
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 focus:border-emerald-500 focus:ring-emerald-500 focus:ring-1 rounded-xl py-3 pl-11 pr-11 text-xs font-semibold text-slate-800 transition-all focus:bg-white outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Password Validation Checklist */}
            <div className="p-3.5 bg-slate-50 border border-slate-100 rounded-2xl space-y-2 text-[10px] text-slate-500">
              <div className="flex items-center gap-2">
                <div className={`w-4 h-4 rounded-full flex items-center justify-center ${reqLength ? "bg-emerald-100 text-emerald-600" : "bg-slate-200 text-slate-400"}`}>
                  <Check className="w-2.5 h-2.5 stroke-[3]" />
                </div>
                <span className={reqLength ? "text-emerald-700 font-bold" : "font-medium"}>At least 6 characters</span>
              </div>
              <div className="flex items-center gap-2">
                <div className={`w-4 h-4 rounded-full flex items-center justify-center ${reqNumberOrSpecial ? "bg-emerald-100 text-emerald-600" : "bg-slate-200 text-slate-400"}`}>
                  <Check className="w-2.5 h-2.5 stroke-[3]" />
                </div>
                <span className={reqNumberOrSpecial ? "text-emerald-700 font-bold" : "font-medium"}>At least 1 number or special character</span>
              </div>
              <div className="flex items-center gap-2">
                <div className={`w-4 h-4 rounded-full flex items-center justify-center ${reqMatch ? "bg-emerald-100 text-emerald-600" : "bg-slate-200 text-slate-400"}`}>
                  <Check className="w-2.5 h-2.5 stroke-[3]" />
                </div>
                <span className={reqMatch ? "text-emerald-700 font-bold" : "font-medium"}>Passwords match</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading || !reqLength || !reqNumberOrSpecial || !reqMatch}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-black py-4 rounded-xl text-xs shadow-lg shadow-emerald-100 flex items-center justify-center gap-2 transition-all active:scale-[0.98] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Creating Account...</span>
                </>
              ) : (
                <>
                  <span>Create Ambassador Account</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="text-center pt-2">
            <button
              type="button"
              onClick={() => onNavigate("login")}
              className="text-xs font-bold text-slate-500 hover:text-emerald-600 transition-colors"
            >
              Already have an account? Sign in
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

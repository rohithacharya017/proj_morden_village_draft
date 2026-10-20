import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Shield, Eye, EyeOff, CheckCircle2, AlertCircle, ArrowRight, UserCheck } from 'lucide-react';

export default function VillagerAuthPage({ onNavigate }) {
  const { registerVillager, loginVillager, loginAsDemoVillager } = useAuth();
  const [isLogin, setIsLogin] = useState(false);

  // Form Fields
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Errors & UI state
  const [errors, setErrors] = useState({});
  const [authError, setAuthError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Validation function
  const validateForm = () => {
    const errs = {};

    if (!isLogin && !fullName.trim()) {
      errs.fullName = 'Full name is required';
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) {
      errs.email = 'Email address is required';
    } else if (!emailRegex.test(email.trim())) {
      errs.email = 'Please enter a valid email address';
    }

    // Indian mobile number validation (10 digits starting with 6-9)
    if (!isLogin) {
      const cleanedMobile = mobileNumber.replace(/[\s\-\+]/g, '');
      const mobileRegex = /^(?:(?:\+|0{0,2})91(\s*[\-]\s*)?|[0]?)?[6789]\d{9}$/;
      if (!mobileNumber.trim()) {
        errs.mobileNumber = 'Mobile number is required';
      } else if (!mobileRegex.test(cleanedMobile)) {
        errs.mobileNumber = 'Please enter a valid 10-digit Indian mobile number';
      }
    }

    // Password validation (8 chars, upper, lower, number, special)
    if (!password) {
      errs.password = 'Password is required';
    } else if (!isLogin) {
      if (password.length < 8) {
        errs.password = 'Password must be at least 8 characters long';
      } else if (!/[A-Z]/.test(password)) {
        errs.password = 'Must contain at least one uppercase letter (A-Z)';
      } else if (!/[a-z]/.test(password)) {
        errs.password = 'Must contain at least one lowercase letter (a-z)';
      } else if (!/[0-9]/.test(password)) {
        errs.password = 'Must contain at least one number (0-9)';
      } else if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
        errs.password = 'Must contain at least one special character (!@#$%...)';
      }

      if (password !== confirmPassword) {
        errs.confirmPassword = 'Passwords do not match';
      }
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setAuthError('');

    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      if (isLogin) {
        const res = await loginVillager(email, password);
        if (res.success) {
          onNavigate('villager_dashboard');
        }
      } else {
        const res = await registerVillager({
          fullName,
          email,
          mobileNumber,
          password
        });
        if (res.success) {
          onNavigate('villager_dashboard');
        }
      }
    } catch (err) {
      setAuthError(err.message || 'Authentication failed. Please check credentials.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDemoLogin = () => {
    loginAsDemoVillager();
    onNavigate('villager_dashboard');
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-8 sm:py-12 animate-fade-in">
      <div className="bg-white rounded-3xl shadow-xl border border-slate-200/80 p-6 sm:p-10">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center mx-auto mb-3 shadow-inner">
            <Shield className="w-7 h-7" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            {isLogin ? 'Villager Sign In' : 'Villager Registration'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            {isLogin
              ? 'Access your citizen dashboard and track reported complaints'
              : 'Register to report village issues directly to the Gram Panchayat'}
          </p>

          {/* Quick Demo Fill Button */}
          <div className="mt-4">
            <button
              type="button"
              onClick={handleDemoLogin}
              className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-bold rounded-xl border border-emerald-200 transition shadow-xs"
            >
              <UserCheck className="w-4 h-4 text-emerald-600" />
              <span>Instant Demo Login (Rameshwar Patel)</span>
            </button>
          </div>
        </div>

        {/* Global Error Banner */}
        {authError && (
          <div className="mb-6 p-4 rounded-2xl bg-rose-50 border border-rose-200 flex items-center gap-3 text-rose-700 text-xs animate-fade-in">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{authError}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-left">
          {!isLogin && (
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Full Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g. Rameshwar Patel"
                className={`w-full text-sm px-4 py-2.5 rounded-xl border ${
                  errors.fullName ? 'border-rose-400 bg-rose-50/30' : 'border-slate-300'
                } focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 outline-none transition`}
              />
              {errors.fullName && (
                <p className="text-[11px] text-rose-600 mt-1">{errors.fullName}</p>
              )}
            </div>
          )}

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">
              Email Address <span className="text-rose-500">*</span>
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. rameshwar@villager.in"
              className={`w-full text-sm px-4 py-2.5 rounded-xl border ${
                errors.email ? 'border-rose-400 bg-rose-50/30' : 'border-slate-300'
              } focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 outline-none transition`}
            />
            {errors.email && (
              <p className="text-[11px] text-rose-600 mt-1">{errors.email}</p>
            )}
          </div>

          {!isLogin && (
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Indian Mobile Number <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-xs text-slate-400 font-semibold">
                  +91
                </span>
                <input
                  type="tel"
                  maxLength={10}
                  value={mobileNumber}
                  onChange={(e) => setMobileNumber(e.target.value.replace(/\D/g, ''))}
                  placeholder="9876543210"
                  className={`w-full text-sm pl-11 pr-4 py-2.5 rounded-xl border ${
                    errors.mobileNumber ? 'border-rose-400 bg-rose-50/30' : 'border-slate-300'
                  } focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 outline-none transition font-mono`}
                />
              </div>
              {errors.mobileNumber && (
                <p className="text-[11px] text-rose-600 mt-1">{errors.mobileNumber}</p>
              )}
            </div>
          )}

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">
              Password <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className={`w-full text-sm px-4 py-2.5 pr-10 rounded-xl border ${
                  errors.password ? 'border-rose-400 bg-rose-50/30' : 'border-slate-300'
                } focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 outline-none transition`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {errors.password && (
              <p className="text-[11px] text-rose-600 mt-1 leading-tight">{errors.password}</p>
            )}
            {!isLogin && (
              <p className="text-[10px] text-slate-400 mt-1">
                Minimum 8 characters with uppercase, lowercase, number, and special character.
              </p>
            )}
          </div>

          {!isLogin && (
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Confirm Password <span className="text-rose-500">*</span>
              </label>
              <input
                type={showPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className={`w-full text-sm px-4 py-2.5 rounded-xl border ${
                  errors.confirmPassword ? 'border-rose-400 bg-rose-50/30' : 'border-slate-300'
                } focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 outline-none transition`}
              />
              {errors.confirmPassword && (
                <p className="text-[11px] text-rose-600 mt-1">{errors.confirmPassword}</p>
              )}
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 px-6 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md shadow-emerald-700/20 transition flex items-center justify-center gap-2 mt-2 disabled:opacity-50"
          >
            {isSubmitting ? (
              <span>Authenticating...</span>
            ) : (
              <>
                <span>{isLogin ? 'Sign In to Dashboard' : 'Register Account'}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Toggle between Login and Register */}
        <div className="mt-6 pt-6 border-t border-slate-100 text-center text-xs text-slate-500">
          {isLogin ? (
            <p>
              Don't have a villager account yet?{' '}
              <button
                type="button"
                onClick={() => {
                  setIsLogin(false);
                  setErrors({});
                  setAuthError('');
                }}
                className="font-bold text-emerald-700 hover:underline"
              >
                Register here
              </button>
            </p>
          ) : (
            <p>
              Already registered?{' '}
              <button
                type="button"
                onClick={() => {
                  setIsLogin(true);
                  setErrors({});
                  setAuthError('');
                }}
                className="font-bold text-emerald-700 hover:underline"
              >
                Log in here
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

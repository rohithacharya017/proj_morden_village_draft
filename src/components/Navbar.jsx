import React from 'react';
import { useAuth } from '../context/AuthContext';
import NotificationDropdown from './NotificationDropdown';
import {
  Shield,
  Home,
  FilePlus,
  ListFilter,
  BarChart3,
  LogOut,
  User,
  Building2,
  Search,
  Sparkles
} from 'lucide-react';

export default function Navbar({ onNavigate, currentPage, onOpenTracker, onSelectComplaint }) {
  const { currentUser, isVillager, isPanchayat, logout, loginAsDemoVillager, loginAsDemoPanchayat } = useAuth();

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-4">
          {/* Brand Logo & Title */}
          <div
            onClick={() => onNavigate('landing')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-tr from-emerald-700 via-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-md shadow-emerald-700/20 group-hover:scale-105 transition-transform">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-lg sm:text-xl text-slate-900 tracking-tight">
                  Modern Village
                </span>
                <span className="hidden md:inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded-full">
                  <Sparkles className="w-2.5 h-2.5" /> AI Powered
                </span>
              </div>
              <p className="text-[11px] sm:text-xs text-slate-500 font-medium">
                Your Village. Your Voice. Our Responsibility.
              </p>
            </div>
          </div>

          {/* Navigation Items based on role */}
          <nav className="hidden lg:flex items-center gap-1 text-sm font-semibold text-slate-600">
            <button
              onClick={() => onNavigate('landing')}
              className={`px-3 py-1.5 rounded-xl transition ${
                currentPage === 'landing' ? 'text-emerald-700 bg-emerald-50' : 'hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              Home
            </button>

            {isVillager && (
              <>
                <button
                  onClick={() => onNavigate('villager_dashboard')}
                  className={`px-3 py-1.5 rounded-xl transition ${
                    currentPage === 'villager_dashboard' ? 'text-emerald-700 bg-emerald-50' : 'hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  My Dashboard
                </button>
                <button
                  onClick={() => onNavigate('report_problem')}
                  className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold transition shadow-sm flex items-center gap-1.5"
                >
                  <FilePlus className="w-4 h-4" />
                  <span>Report a Problem</span>
                </button>
              </>
            )}

            {isPanchayat && (
              <>
                <button
                  onClick={() => onNavigate('panchayat_dashboard')}
                  className={`px-3 py-1.5 rounded-xl transition ${
                    currentPage === 'panchayat_dashboard' ? 'text-emerald-700 bg-emerald-50' : 'hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  Complaints Desk
                </button>
                <button
                  onClick={() => onNavigate('panchayat_reports')}
                  className={`px-3 py-1.5 rounded-xl transition flex items-center gap-1.5 ${
                    currentPage === 'panchayat_reports' ? 'text-emerald-700 bg-emerald-50' : 'hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <BarChart3 className="w-4 h-4" />
                  <span>Reports & Analytics</span>
                </button>
              </>
            )}

            <button
              onClick={onOpenTracker}
              className="px-3 py-1.5 rounded-xl hover:text-emerald-700 hover:bg-emerald-50 transition flex items-center gap-1 text-slate-500 font-medium"
            >
              <Search className="w-3.5 h-3.5" />
              <span>Track Ticket</span>
            </button>
          </nav>

          {/* Right Action Icons & User Profile */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Quick Demo Switchers (Always accessible for easy testing) */}
            <div className="hidden xl:flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-semibold">
              <span className="text-[10px] text-slate-400 px-1 font-bold">DEMO:</span>
              <button
                onClick={loginAsDemoVillager}
                className={`px-2 py-1 rounded-lg transition ${
                  isVillager ? 'bg-white text-emerald-700 shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'
                }`}
                title="Switch to Villager Demo Account"
              >
                Villager
              </button>
              <button
                onClick={loginAsDemoPanchayat}
                className={`px-2 py-1 rounded-lg transition ${
                  isPanchayat ? 'bg-white text-blue-700 shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'
                }`}
                title="Switch to Panchayat Official Account"
              >
                Panchayat
              </button>
            </div>

            {/* Notification Bell */}
            {currentUser && (
              <NotificationDropdown onSelectComplaint={onSelectComplaint} />
            )}

            {/* User Profile Pill or Login CTA */}
            {currentUser ? (
              <div className="flex items-center gap-2">
                <div
                  onClick={() => onNavigate(isVillager ? 'villager_dashboard' : 'panchayat_dashboard')}
                  className="flex items-center gap-2.5 p-1.5 sm:px-3 sm:py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200/80 cursor-pointer transition"
                >
                  <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center text-white text-xs font-bold ${
                      isPanchayat ? 'bg-blue-600' : 'bg-emerald-600'
                    }`}
                  >
                    {isPanchayat ? <Building2 className="w-4 h-4" /> : <User className="w-4 h-4" />}
                  </div>
                  <div className="hidden sm:block text-left">
                    <p className="text-xs font-bold text-slate-800 leading-tight">
                      {currentUser.full_name}
                    </p>
                    <span className="text-[10px] text-slate-500 capitalize block leading-tight">
                      {isPanchayat ? (currentUser.designation || 'Panchayat Official') : 'Citizen Resident'}
                    </span>
                  </div>
                </div>

                <button
                  onClick={logout}
                  className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition"
                  title="Sign Out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onNavigate('villager_auth')}
                  className="px-3.5 py-1.5 text-xs sm:text-sm font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-xl transition"
                >
                  Villager Login
                </button>
                <button
                  onClick={() => onNavigate('panchayat_login')}
                  className="px-3.5 py-1.5 text-xs sm:text-sm font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition shadow-xs"
                >
                  Panchayat Official
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

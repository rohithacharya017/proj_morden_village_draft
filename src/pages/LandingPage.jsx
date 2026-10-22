import React from 'react';
import { COMPLAINT_CATEGORIES } from '../types';
import {
  Users,
  Building2,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  Camera,
  MapPin,
  CheckCircle2,
  Clock,
  Search,
  Zap,
  TrendingUp,
  Award
} from 'lucide-react';

export default function LandingPage({ onNavigate, onOpenTracker }) {
  return (
    <div className="space-y-16 sm:space-y-24 pb-12 animate-fade-in">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-6 sm:pt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6 text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold tracking-wide shadow-xs">
                <Sparkles className="w-4 h-4 text-emerald-600 animate-spin-slow" />
                <span>AI-POWERED GRAM PANCHAYAT COMPLAINT SYSTEM</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.12]">
                Your Village. <br />
                <span className="text-emerald-700">Your Voice.</span> <br />
                Our Responsibility.
              </h1>

              <p className="text-base sm:text-lg text-slate-600 max-w-xl leading-relaxed">
                Empowering villagers to report civic issues in seconds with photograph and GPS location,
                while helping Gram Panchayat officials prioritize, dispatch, and resolve problems transparently.
              </p>

              {/* Quick Tracker Search Input */}
              <div className="max-w-md pt-2">
                <div
                  onClick={onOpenTracker}
                  className="flex items-center gap-3 p-3.5 bg-white rounded-2xl border border-slate-200 shadow-md hover:border-emerald-500 cursor-pointer transition group"
                >
                  <Search className="w-5 h-5 text-slate-400 group-hover:text-emerald-600 transition" />
                  <span className="text-sm text-slate-400 font-medium flex-1">
                    Have a complaint ID? Click to track status...
                  </span>
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg">
                    Track
                  </span>
                </div>
              </div>

              {/* Trust Indicators */}
              <div className="flex flex-wrap items-center gap-6 pt-3 text-xs font-medium text-slate-500">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Verified Citizen Authentication</span>
                </div>
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-teal-600" />
                  <span>Instant AI Priority Triage</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-blue-600" />
                  <span>Under 24h Emergency Response</span>
                </div>
              </div>
            </div>

            {/* Right Media Banner */}
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-slate-100 bg-gradient-to-tr from-emerald-900 to-slate-900 aspect-4/3 group">
                <video
                  src="/assets/hero-village.mp4"
                  poster="/assets/hero-village.jpg"
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-90"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />
                <div className="absolute bottom-5 left-5 right-5 text-white">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-300 block mb-1">
                    DIGITAL GRAM PANCHAYAT
                  </span>
                  <p className="font-extrabold text-base leading-snug">
                    Kandavara Smart Panchayat Model
                  </p>
                  <p className="text-xs text-slate-300 mt-0.5">
                    100% Digital Grievance Redressal across all 12 Wards.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TWO PROMINENT ROLE OPTIONS (Villager & Panchayat) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider block mb-2">
            CHOOSE YOUR PORTAL
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            How would you like to continue?
          </h2>
          <p className="text-sm text-slate-500 mt-2">
            Select your role to access your personalized citizen service desk or administrative workspace.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* OPTION 1: VILLAGER */}
          <div
            onClick={() => onNavigate('villager_auth')}
            className="group relative bg-white rounded-3xl p-8 sm:p-10 border-2 border-emerald-100 hover:border-emerald-500 shadow-xl shadow-emerald-700/5 hover:shadow-2xl hover:shadow-emerald-700/10 cursor-pointer transition-all duration-300 flex flex-col justify-between"
          >
            <div>
              <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-emerald-600 group-hover:text-white transition-all">
                <Users className="w-8 h-8" />
              </div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 block mb-1">
                Citizen Portal
              </span>
              <h3 className="text-2xl font-extrabold text-slate-900 mb-3">
                Continue as Villager
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed mb-6">
                Report village problems like broken streetlights, contaminated water, or damaged roads in minutes.
                Track resolution progress and receive notifications directly from the Panchayat.
              </p>

              <div className="space-y-2 mb-8 text-xs text-slate-500">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Capture photo directly from mobile camera</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Automatic GPS location tagging</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Visual 4-stage resolution tracking</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => onNavigate('villager_auth')}
              className="w-full py-3.5 px-6 rounded-2xl bg-emerald-600 group-hover:bg-emerald-700 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-md shadow-emerald-700/20 transition"
            >
              <span>Continue as Villager</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          {/* OPTION 2: PANCHAYAT */}
          <div
            onClick={() => onNavigate('panchayat_login')}
            className="group relative bg-white rounded-3xl p-8 sm:p-10 border-2 border-slate-200 hover:border-slate-800 shadow-xl shadow-slate-900/5 hover:shadow-2xl hover:shadow-slate-900/10 cursor-pointer transition-all duration-300 flex flex-col justify-between"
          >
            <div>
              <div className="w-16 h-16 rounded-2xl bg-slate-100 text-slate-800 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-slate-900 group-hover:text-white transition-all">
                <Building2 className="w-8 h-8" />
              </div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-1">
                Official Administration
              </span>
              <h3 className="text-2xl font-extrabold text-slate-900 mb-3">
                Continue as Panchayat
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed mb-6">
                Manage complaints, review AI priority classifications, dispatch field teams,
                acknowledge requests, mark completed work, and notify villagers with official updates.
              </p>

              <div className="space-y-2 mb-8 text-xs text-slate-500">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-slate-700" />
                  <span>Automated HIGH priority triage & sorting</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-slate-700" />
                  <span>One-click Acknowledgement & Work Done verification</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-slate-700" />
                  <span>Comprehensive reports and resolution metrics</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => onNavigate('panchayat_login')}
              className="w-full py-3.5 px-6 rounded-2xl bg-slate-900 group-hover:bg-slate-800 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-md transition"
            >
              <span>Continue as Panchayat</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS LIFECYCLE */}
      <section className="bg-slate-100/70 border-y border-slate-200/80 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider block mb-2">
              HOW IT WORKS
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              The Transparent Complaint Lifecycle
            </h2>
            <p className="text-sm text-slate-600 mt-2">
              From problem capture to verified completion — fast, accountable, and citizen-first.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200/80 flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-lg mb-4">
                <Camera className="w-6 h-6" />
              </div>
              <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-wide">
                Step 1
              </span>
              <h4 className="font-bold text-base text-slate-900 mt-1 mb-2">
                1. Snap & Geo-Tag
              </h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Take a photograph on your phone and tag the exact GPS coordinates in one tap.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200/80 flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center font-bold text-lg mb-4">
                <Sparkles className="w-6 h-6" />
              </div>
              <span className="text-[11px] font-bold text-teal-700 uppercase tracking-wide">
                Step 2
              </span>
              <h4 className="font-bold text-base text-slate-900 mt-1 mb-2">
                2. AI Priority Triage
              </h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Safety algorithms instantly assign HIGH, MEDIUM, or LOW priority based on hazard context.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200/80 flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-lg mb-4">
                <Building2 className="w-6 h-6" />
              </div>
              <span className="text-[11px] font-bold text-blue-700 uppercase tracking-wide">
                Step 3
              </span>
              <h4 className="font-bold text-base text-slate-900 mt-1 mb-2">
                3. Panchayat Dispatches
              </h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Officials acknowledge the complaint, assign local field engineers, and start physical repair work.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200/80 flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-lg mb-4">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-wide">
                Step 4
              </span>
              <h4 className="font-bold text-base text-slate-900 mt-1 mb-2">
                4. Resolution Notified
              </h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                The official marks work done with notes, and the citizen receives an instant resolution notification.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 10 MAJOR CATEGORIES PREVIEW */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider block mb-2">
            PUBLIC AMENITIES & CIVIC SERVICES
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            What Can You Report?
          </h2>
          <p className="text-sm text-slate-500 mt-2">
            Every issue is categorized and routed directly to the concerned Gram Panchayat department.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {COMPLAINT_CATEGORIES.map((cat, i) => (
            <div
              key={cat.id}
              onClick={() => onNavigate('villager_auth')}
              className="bg-white p-4 rounded-2xl border border-slate-200/70 hover:border-emerald-400 hover:shadow-md transition-all cursor-pointer group text-left flex flex-col justify-between"
            >
              <div>
                <span className="text-xs font-bold text-slate-400">0{i + 1}</span>
                <h4 className="font-bold text-sm text-slate-900 mt-1 group-hover:text-emerald-700 transition">
                  {cat.name}
                </h4>
                <p className="text-[11px] text-slate-500 line-clamp-2 mt-1 leading-snug">
                  {cat.description}
                </p>
              </div>
              <span className="text-[10px] font-semibold text-emerald-600 mt-3 flex items-center gap-1">
                Report Issue →
              </span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

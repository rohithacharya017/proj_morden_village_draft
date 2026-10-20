import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useComplaints } from '../context/ComplaintContext';
import PriorityBadge from '../components/PriorityBadge';
import StatusBadge from '../components/StatusBadge';
import {
  FilePlus,
  Clock,
  CheckCircle2,
  AlertTriangle,
  FolderOpen,
  ArrowRight,
  Eye,
  Calendar,
  MapPin,
  Sparkles
} from 'lucide-react';

export default function VillagerDashboard({ onNavigate, onSelectComplaint }) {
  const { currentUser } = useAuth();
  const { villagerComplaints } = useComplaints();
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Counts
  const totalCount = villagerComplaints.length;
  const pendingCount = villagerComplaints.filter(c => c.status === 'PENDING').length;
  const inProgressCount = villagerComplaints.filter(c => c.status === 'IN_PROGRESS' || c.status === 'ACKNOWLEDGED').length;
  const resolvedCount = villagerComplaints.filter(c => c.status === 'COMPLETED').length;

  const filtered = villagerComplaints.filter(c => {
    if (statusFilter === 'ALL') return true;
    if (statusFilter === 'PENDING') return c.status === 'PENDING';
    if (statusFilter === 'IN_PROGRESS') return c.status === 'IN_PROGRESS' || c.status === 'ACKNOWLEDGED';
    if (statusFilter === 'RESOLVED') return c.status === 'COMPLETED';
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in">
      {/* Top Banner / Welcome */}
      <div className="bg-gradient-to-r from-emerald-700 via-emerald-600 to-teal-600 rounded-3xl p-6 sm:p-10 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-800/60 text-emerald-200 text-xs font-semibold mb-3">
            <span>Citizen Dashboard</span>
            <span>•</span>
            <span>{currentUser?.village_name || 'Rampur Gram Panchayat'}</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
            Namaste, {currentUser?.full_name || 'Citizen'}! 🙏
          </h2>
          <p className="text-emerald-100 text-sm mt-1 max-w-xl">
            Welcome to your Modern Village grievance dashboard. Report village issues, track your active tickets, and inspect official Panchayat action updates.
          </p>
        </div>

        <button
          onClick={() => onNavigate('report_problem')}
          className="px-6 py-3.5 bg-white hover:bg-emerald-50 text-emerald-800 font-extrabold text-sm rounded-2xl shadow-lg transition flex items-center justify-center gap-2 shrink-0 group"
        >
          <FilePlus className="w-5 h-5 text-emerald-600 group-hover:scale-110 transition-transform" />
          <span>+ Report a Problem</span>
        </button>
      </div>

      {/* Summary Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div
          onClick={() => setStatusFilter('ALL')}
          className={`p-5 rounded-2xl bg-white border cursor-pointer transition shadow-xs ${
            statusFilter === 'ALL' ? 'border-emerald-500 ring-2 ring-emerald-100' : 'border-slate-200/80 hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500 uppercase">My Complaints</span>
            <FolderOpen className="w-4 h-4 text-slate-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900">{totalCount}</div>
          <span className="text-[11px] text-slate-400 mt-1 block">Total reported tickets</span>
        </div>

        <div
          onClick={() => setStatusFilter('PENDING')}
          className={`p-5 rounded-2xl bg-white border cursor-pointer transition shadow-xs ${
            statusFilter === 'PENDING' ? 'border-blue-500 ring-2 ring-blue-100' : 'border-slate-200/80 hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-blue-600 uppercase">Pending</span>
            <Clock className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900">{pendingCount}</div>
          <span className="text-[11px] text-slate-400 mt-1 block">Awaiting Panchayat review</span>
        </div>

        <div
          onClick={() => setStatusFilter('IN_PROGRESS')}
          className={`p-5 rounded-2xl bg-white border cursor-pointer transition shadow-xs ${
            statusFilter === 'IN_PROGRESS' ? 'border-amber-500 ring-2 ring-amber-100' : 'border-slate-200/80 hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-amber-600 uppercase">In Progress</span>
            <AlertTriangle className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900">{inProgressCount}</div>
          <span className="text-[11px] text-slate-400 mt-1 block">Field work dispatched</span>
        </div>

        <div
          onClick={() => setStatusFilter('RESOLVED')}
          className={`p-5 rounded-2xl bg-white border cursor-pointer transition shadow-xs ${
            statusFilter === 'RESOLVED' ? 'border-emerald-500 ring-2 ring-emerald-100' : 'border-slate-200/80 hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-emerald-600 uppercase">Resolved</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900">{resolvedCount}</div>
          <span className="text-[11px] text-slate-400 mt-1 block">Verified & completed</span>
        </div>
      </div>

      {/* Complaints Section */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-md overflow-hidden">
        <div className="p-5 sm:p-6 border-b border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h3 className="font-extrabold text-lg text-slate-900">
              My Reported Problems ({filtered.length})
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Showing tickets associated with your registered citizen account
            </p>
          </div>

          <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl text-xs font-bold">
            <button
              onClick={() => setStatusFilter('ALL')}
              className={`px-3 py-1.5 rounded-lg transition ${
                statusFilter === 'ALL' ? 'bg-white text-emerald-800 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setStatusFilter('PENDING')}
              className={`px-3 py-1.5 rounded-lg transition ${
                statusFilter === 'PENDING' ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Pending
            </button>
            <button
              onClick={() => setStatusFilter('IN_PROGRESS')}
              className={`px-3 py-1.5 rounded-lg transition ${
                statusFilter === 'IN_PROGRESS' ? 'bg-white text-amber-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              In Progress
            </button>
            <button
              onClick={() => setStatusFilter('RESOLVED')}
              className={`px-3 py-1.5 rounded-lg transition ${
                statusFilter === 'RESOLVED' ? 'bg-white text-emerald-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Resolved
            </button>
          </div>
        </div>

        {/* Complaints List */}
        {filtered.length === 0 ? (
          <div className="p-12 text-center text-slate-400">
            <FolderOpen className="w-12 h-12 mx-auto mb-3 opacity-30 text-emerald-600" />
            <h4 className="font-bold text-slate-700 text-sm">No complaints found in this view</h4>
            <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
              {statusFilter === 'ALL'
                ? "You haven't submitted any complaints yet. Report a village problem to get started."
                : `There are no ${statusFilter.toLowerCase()} complaints to display.`}
            </p>
            <button
              onClick={() => onNavigate('report_problem')}
              className="mt-4 px-4 py-2 bg-emerald-600 text-white text-xs font-bold rounded-xl hover:bg-emerald-700 shadow-sm transition"
            >
              + Report a New Problem
            </button>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {filtered.map((c) => (
              <div
                key={c.id}
                className="p-5 sm:p-6 hover:bg-slate-50/70 transition flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
              >
                <div className="space-y-1.5 max-w-2xl">
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <span className="font-mono text-xs font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded-md">
                      {c.complaint_number}
                    </span>
                    <PriorityBadge
                      priority={c.priority}
                      reason={c.priority_reason}
                      source={c.priority_source}
                    />
                    <StatusBadge status={c.status} />
                    <span className="text-xs text-slate-400">• {c.category}</span>
                  </div>

                  <h4 className="font-bold text-base text-slate-900 hover:text-emerald-700 transition cursor-pointer"
                    onClick={() => onSelectComplaint(c.id)}
                  >
                    {c.title}
                  </h4>

                  <p className="text-xs text-slate-500 line-clamp-2">
                    {c.description}
                  </p>

                  <div className="flex items-center gap-4 text-[11px] text-slate-400 pt-1">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      Reported: {new Date(c.created_at).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {c.location_address || c.village_name || 'Rampur'}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0 self-end md:self-center">
                  <button
                    onClick={() => onSelectComplaint(c.id)}
                    className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 text-slate-700 font-bold text-xs transition flex items-center gap-1.5 shadow-xs"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>View Status</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useComplaints } from '../context/ComplaintContext';
import PriorityBadge from '../components/PriorityBadge';
import StatusBadge from '../components/StatusBadge';
import { PRIORITY_TYPES } from '../types';
import {
  Building2,
  FolderOpen,
  AlertOctagon,
  Clock,
  PlayCircle,
  CheckCircle2,
  Search,
  Filter,
  Eye,
  Check,
  CheckSquare,
  Square,
  Sparkles,
  BarChart3,
  Calendar,
  User,
  Phone,
  RefreshCw
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function PanchayatDashboard({ onNavigate, onSelectComplaint }) {
  const { currentUser } = useAuth();
  const {
    complaints,
    acknowledgeComplaint,
    completeComplaint,
    refreshComplaints
  } = useComplaints();

  // Active Sidebar / Tab Filter
  const [activeTab, setActiveTab] = useState('ALL'); // ALL, HIGH, MEDIUM, LOW, IN_PROGRESS, COMPLETED
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Work done prompt state
  const [completingId, setCompletingId] = useState(null);
  const [completionRemarks, setCompletionRemarks] = useState('');

  // Calculate live database counts
  const totalCount = complaints.length;
  const highPriorityCount = complaints.filter(c => c.priority === 'HIGH' && c.status !== 'COMPLETED').length;
  const mediumPriorityCount = complaints.filter(c => c.priority === 'MEDIUM' && c.status !== 'COMPLETED').length;
  const lowPriorityCount = complaints.filter(c => c.priority === 'LOW' && c.status !== 'COMPLETED').length;
  const pendingCount = complaints.filter(c => c.status === 'PENDING').length;
  const inProgressCount = complaints.filter(c => c.status === 'IN_PROGRESS' || c.status === 'ACKNOWLEDGED').length;
  const completedCount = complaints.filter(c => c.status === 'COMPLETED').length;

  // Filter & Priority Sort Implementation:
  // Requirements: HIGH first, then MEDIUM, then LOW. Within each priority, oldest unresolved first.
  const filteredAndSortedComplaints = [...complaints]
    .filter(c => {
      // Tab filter
      if (activeTab === 'HIGH' && c.priority !== 'HIGH') return false;
      if (activeTab === 'MEDIUM' && c.priority !== 'MEDIUM') return false;
      if (activeTab === 'LOW' && c.priority !== 'LOW') return false;
      if (activeTab === 'IN_PROGRESS' && c.status !== 'IN_PROGRESS' && c.status !== 'ACKNOWLEDGED') return false;
      if (activeTab === 'COMPLETED' && c.status !== 'COMPLETED') return false;

      // Status dropdown filter
      if (statusFilter !== 'ALL' && c.status !== statusFilter) return false;

      // Category filter
      if (categoryFilter !== 'ALL' && c.category !== categoryFilter) return false;

      // Search query (complaint number, title, category, village, reporter)
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const match =
          c.complaint_number.toLowerCase().includes(q) ||
          c.title.toLowerCase().includes(q) ||
          c.category.toLowerCase().includes(q) ||
          (c.village_name && c.village_name.toLowerCase().includes(q)) ||
          (c.reporter_name_snapshot && c.reporter_name_snapshot.toLowerCase().includes(q));
        if (!match) return false;
      }
      return true;
    })
    .sort((a, b) => {
      // 1. Sort by Priority (HIGH -> MEDIUM -> LOW)
      const pOrderA = PRIORITY_TYPES[a.priority]?.sortOrder || 2;
      const pOrderB = PRIORITY_TYPES[b.priority]?.sortOrder || 2;
      if (pOrderA !== pOrderB) return pOrderA - pOrderB;

      // 2. Within each priority, show oldest unresolved first
      const dateA = new Date(a.created_at).getTime();
      const dateB = new Date(b.created_at).getTime();
      return dateA - dateB;
    });

  // Handle Acknowledgement
  const handleAcknowledgeClick = async (complaint) => {
    if (complaint.status !== 'PENDING') return;
    await acknowledgeComplaint(complaint.id, currentUser?.full_name || 'Panchayat Official');
  };

  // Complete work modal
  const handleCompleteSubmit = async (e) => {
    e.preventDefault();
    if (!completingId) return;

    await completeComplaint(
      completingId,
      currentUser?.full_name || 'Panchayat Official',
      completionRemarks || 'Work verified and completed by Panchayat staff.'
    );

    confetti({ particleCount: 70, spread: 80, origin: { y: 0.6 } });
    setCompletingId(null);
    setCompletionRemarks('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in text-left">
      {/* Header Bar */}
      <div className="bg-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800 text-emerald-400 text-xs font-bold mb-2">
            <Building2 className="w-3.5 h-3.5" />
            <span>{currentUser?.panchayat_name || 'Rampur Gram Panchayat (Wards 1-12)'}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Panchayat Grievance Desk
          </h2>
          <p className="text-slate-400 text-xs sm:text-sm mt-1 max-w-xl">
            Logged in as <strong>{currentUser?.full_name}</strong> ({currentUser?.designation || 'Secretary'}). Triage, acknowledge, and resolve village complaints transparently.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate('panchayat_reports')}
            className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs rounded-xl transition flex items-center gap-2 border border-slate-700"
          >
            <BarChart3 className="w-4 h-4 text-emerald-400" />
            <span>Reports & Analytics</span>
          </button>
          <button
            onClick={refreshComplaints}
            className="p-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl transition border border-slate-700"
            title="Refresh Complaints"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Summary Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        {/* Total */}
        <div
          onClick={() => setActiveTab('ALL')}
          className={`p-4 rounded-2xl bg-white border cursor-pointer transition shadow-xs ${
            activeTab === 'ALL' ? 'border-slate-800 ring-2 ring-slate-200' : 'border-slate-200/80 hover:border-slate-300'
          }`}
        >
          <span className="text-[10px] font-bold text-slate-400 uppercase block">Total</span>
          <div className="text-2xl font-extrabold text-slate-900 mt-1">{totalCount}</div>
          <span className="text-[10px] text-slate-400 mt-0.5 block">All records</span>
        </div>

        {/* High Priority */}
        <div
          onClick={() => setActiveTab('HIGH')}
          className={`p-4 rounded-2xl bg-red-50/60 border cursor-pointer transition shadow-xs ${
            activeTab === 'HIGH' ? 'border-red-500 ring-2 ring-red-100' : 'border-red-200 hover:border-red-300'
          }`}
        >
          <span className="text-[10px] font-bold text-red-700 uppercase block flex items-center justify-between">
            <span>High Priority</span>
            <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
          </span>
          <div className="text-2xl font-extrabold text-red-700 mt-1">{highPriorityCount}</div>
          <span className="text-[10px] text-red-600 font-medium mt-0.5 block">Urgent Action</span>
        </div>

        {/* Medium Priority */}
        <div
          onClick={() => setActiveTab('MEDIUM')}
          className={`p-4 rounded-2xl bg-amber-50/60 border cursor-pointer transition shadow-xs ${
            activeTab === 'MEDIUM' ? 'border-amber-500 ring-2 ring-amber-100' : 'border-amber-200 hover:border-amber-300'
          }`}
        >
          <span className="text-[10px] font-bold text-amber-700 uppercase block">Medium</span>
          <div className="text-2xl font-extrabold text-amber-700 mt-1">{mediumPriorityCount}</div>
          <span className="text-[10px] text-amber-600 font-medium mt-0.5 block">Standard repair</span>
        </div>

        {/* Low Priority */}
        <div
          onClick={() => setActiveTab('LOW')}
          className={`p-4 rounded-2xl bg-emerald-50/60 border cursor-pointer transition shadow-xs ${
            activeTab === 'LOW' ? 'border-emerald-500 ring-2 ring-emerald-100' : 'border-emerald-200 hover:border-emerald-300'
          }`}
        >
          <span className="text-[10px] font-bold text-emerald-700 uppercase block">Low</span>
          <div className="text-2xl font-extrabold text-emerald-700 mt-1">{lowPriorityCount}</div>
          <span className="text-[10px] text-emerald-600 font-medium mt-0.5 block">Routine</span>
        </div>

        {/* In Progress */}
        <div
          onClick={() => setActiveTab('IN_PROGRESS')}
          className={`p-4 rounded-2xl bg-blue-50/60 border cursor-pointer transition shadow-xs ${
            activeTab === 'IN_PROGRESS' ? 'border-blue-500 ring-2 ring-blue-100' : 'border-blue-200 hover:border-blue-300'
          }`}
        >
          <span className="text-[10px] font-bold text-blue-700 uppercase block">In Progress</span>
          <div className="text-2xl font-extrabold text-blue-700 mt-1">{inProgressCount}</div>
          <span className="text-[10px] text-blue-600 font-medium mt-0.5 block">Field Dispatched</span>
        </div>

        {/* Completed */}
        <div
          onClick={() => setActiveTab('COMPLETED')}
          className={`p-4 rounded-2xl bg-white border cursor-pointer transition shadow-xs ${
            activeTab === 'COMPLETED' ? 'border-emerald-600 ring-2 ring-emerald-100' : 'border-slate-200/80 hover:border-slate-300'
          }`}
        >
          <span className="text-[10px] font-bold text-slate-600 uppercase block">Completed</span>
          <div className="text-2xl font-extrabold text-slate-900 mt-1">{completedCount}</div>
          <span className="text-[10px] text-emerald-600 font-bold mt-0.5 block">100% Verified</span>
        </div>
      </div>

      {/* Main Table Card */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-md overflow-hidden">
        {/* Search & Filter Toolbar */}
        <div className="p-5 border-b border-slate-100 bg-slate-50/70 flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
          {/* Search Box */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by ID, title, village, or reporter name..."
              className="w-full text-xs pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 bg-white focus:border-slate-800 outline-none"
            />
          </div>

          {/* Filter Dropdowns */}
          <div className="flex flex-wrap items-center gap-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="text-xs px-3 py-2 rounded-xl border border-slate-300 bg-white font-semibold text-slate-700 outline-none"
            >
              <option value="ALL">All Statuses</option>
              <option value="PENDING">Pending Only</option>
              <option value="ACKNOWLEDGED">Acknowledged Only</option>
              <option value="IN_PROGRESS">In Progress Only</option>
              <option value="COMPLETED">Completed Only</option>
            </select>

            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="text-xs px-3 py-2 rounded-xl border border-slate-300 bg-white font-semibold text-slate-700 outline-none max-w-[180px]"
            >
              <option value="ALL">All Categories</option>
              <option value="Electrical Problems">Electrical Problems</option>
              <option value="Water Supply">Water Supply</option>
              <option value="Roads and Transportation">Roads and Transportation</option>
              <option value="Waste Management and Sanitation">Waste Management</option>
              <option value="Streetlights and Public Lighting">Streetlights</option>
              <option value="Drainage and Sewage">Drainage</option>
              <option value="Public Property Damage">Property Damage</option>
              <option value="Parks and Public Spaces">Parks</option>
              <option value="Animal-Related Public Issues">Animals</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </div>

        {/* Priority Ordering Explanation Banner */}
        <div className="px-5 py-2.5 bg-emerald-50/60 border-b border-emerald-100 flex items-center justify-between text-[11px] text-emerald-900">
          <div className="flex items-center gap-1.5 font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
            <span>Triage Sorting Active: HIGH priority first, then MEDIUM, then LOW. Oldest unresolved requests prioritized.</span>
          </div>
          <span className="text-slate-400 font-medium">
            Showing {filteredAndSortedComplaints.length} of {totalCount} records
          </span>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-100/80 text-slate-500 font-bold uppercase tracking-wider border-b border-slate-200">
                <th className="py-3.5 px-4 w-32">Complaint No.</th>
                <th className="py-3.5 px-4 w-28">Priority</th>
                <th className="py-3.5 px-4">Problem Details & Category</th>
                <th className="py-3.5 px-4 w-28">Date</th>
                <th className="py-3.5 px-4 w-28">Status</th>
                <th className="py-3.5 px-4 w-32 text-center">Acknowledged</th>
                <th className="py-3.5 px-4 w-32 text-center">Work Done</th>
                <th className="py-3.5 px-4 w-20 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredAndSortedComplaints.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400">
                    <FolderOpen className="w-8 h-8 mx-auto mb-2 opacity-30" />
                    <p className="font-semibold text-slate-700">No complaints found</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">Try clearing your search query or filters.</p>
                  </td>
                </tr>
              ) : (
                filteredAndSortedComplaints.map((c) => {
                  const isAck = ['ACKNOWLEDGED', 'IN_PROGRESS', 'COMPLETED'].includes(c.status);
                  const isDone = c.status === 'COMPLETED';

                  return (
                    <tr
                      key={c.id}
                      className="hover:bg-slate-50/80 transition-colors group"
                    >
                      {/* Complaint No. */}
                      <td className="py-3.5 px-4 font-mono font-bold text-slate-800">
                        {c.complaint_number}
                      </td>

                      {/* Priority */}
                      <td className="py-3.5 px-4">
                        <PriorityBadge priority={c.priority} />
                      </td>

                      {/* Problem Details */}
                      <td className="py-3.5 px-4">
                        <div
                          onClick={() => onSelectComplaint(c.id)}
                          className="font-bold text-slate-900 hover:text-emerald-700 cursor-pointer transition line-clamp-1"
                        >
                          {c.title}
                        </div>
                        <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-0.5">
                          <span className="font-semibold text-slate-600">{c.category}</span>
                          <span>•</span>
                          <span>{c.village_name || 'Rampur'}</span>
                          <span>•</span>
                          <span>By: {c.reporter_name_snapshot}</span>
                        </div>
                      </td>

                      {/* Date */}
                      <td className="py-3.5 px-4 text-slate-500 whitespace-nowrap">
                        {new Date(c.created_at).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4">
                        <StatusBadge status={c.status} />
                      </td>

                      {/* Acknowledged Checkbox */}
                      <td className="py-3.5 px-4 text-center">
                        <button
                          type="button"
                          onClick={() => handleAcknowledgeClick(c)}
                          disabled={isAck}
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold transition ${
                            isAck
                              ? 'bg-blue-50 text-blue-700 border border-blue-200 cursor-default'
                              : 'bg-slate-100 hover:bg-blue-100 text-slate-600 hover:text-blue-800 border border-slate-200'
                          }`}
                          title={isAck ? `Acknowledged by ${c.acknowledged_by || 'Official'}` : 'Click to Acknowledge'}
                        >
                          {isAck ? <CheckSquare className="w-3.5 h-3.5 text-blue-600" /> : <Square className="w-3.5 h-3.5" />}
                          <span>{isAck ? 'Ack' : 'Ack'}</span>
                        </button>
                      </td>

                      {/* Work Done Checkbox */}
                      <td className="py-3.5 px-4 text-center">
                        <button
                          type="button"
                          onClick={() => {
                            if (!isDone) setCompletingId(c.id);
                          }}
                          disabled={isDone}
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold transition ${
                            isDone
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 cursor-default'
                              : 'bg-slate-100 hover:bg-emerald-100 text-slate-600 hover:text-emerald-800 border border-slate-200'
                          }`}
                          title={isDone ? `Resolved by ${c.completed_by || 'Official'}` : 'Click to Mark Work Done'}
                        >
                          {isDone ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> : <Square className="w-3.5 h-3.5" />}
                          <span>{isDone ? 'Done' : 'Done'}</span>
                        </button>
                      </td>

                      {/* View Details */}
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => onSelectComplaint(c.id)}
                          className="p-1.5 hover:bg-slate-200 text-slate-500 hover:text-slate-900 rounded-lg transition"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Completion Confirmation Modal Prompt */}
      {completingId && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 animate-fade-in space-y-4">
            <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-2xl flex items-center justify-center">
              <CheckCircle2 className="w-7 h-7" />
            </div>

            <div>
              <h3 className="font-extrabold text-lg text-slate-900">
                Confirm Work Completion
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Please enter a completion note. The original citizen reporter will be notified automatically upon confirmation.
              </p>
            </div>

            <form onSubmit={handleCompleteSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Completion Remarks / Resolution Summary:
                </label>
                <textarea
                  value={completionRemarks}
                  onChange={(e) => setCompletionRemarks(e.target.value)}
                  rows={3}
                  placeholder="e.g. Broken pipe repaired by Junior Engineer team, water pressure restored."
                  required
                  className="w-full text-xs p-3 rounded-xl border border-slate-300 focus:border-emerald-600 outline-none leading-relaxed"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setCompletingId(null)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-md transition"
                >
                  Confirm & Notify Villager
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ComplaintProvider, useComplaints } from './context/ComplaintContext';

// Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ComplaintDetailModal from './components/ComplaintDetailModal';
import QuickTrackerModal from './components/QuickTrackerModal';

// Pages
import LandingPage from './pages/LandingPage';
import VillagerAuthPage from './pages/VillagerAuthPage';
import VillagerDashboard from './pages/VillagerDashboard';
import ReportProblemPage from './pages/ReportProblemPage';
import PanchayatLoginPage from './pages/PanchayatLoginPage';
import PanchayatDashboard from './pages/PanchayatDashboard';
import PanchayatReports from './pages/PanchayatReports';

function AppContent() {
  const { isVillager, isPanchayat } = useAuth();
  const { complaints } = useComplaints();

  const [currentPage, setCurrentPage] = useState('landing');
  const [selectedComplaintId, setSelectedComplaintId] = useState(null);
  const [isTrackerOpen, setIsTrackerOpen] = useState(false);

  // Selected complaint object
  const selectedComplaint = selectedComplaintId
    ? complaints.find((c) => c.id === selectedComplaintId)
    : null;

  // Navigation router
  const navigate = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectComplaint = (id) => {
    setSelectedComplaintId(id);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800 antialiased font-sans">
      {/* Top Navbar */}
      <Navbar
        onNavigate={navigate}
        currentPage={currentPage}
        onOpenTracker={() => setIsTrackerOpen(true)}
        onSelectComplaint={handleSelectComplaint}
      />

      {/* Main Page View */}
      <main className="flex-1">
        {currentPage === 'landing' && (
          <LandingPage
            onNavigate={navigate}
            onOpenTracker={() => setIsTrackerOpen(true)}
          />
        )}

        {currentPage === 'villager_auth' && (
          <VillagerAuthPage onNavigate={navigate} />
        )}

        {currentPage === 'villager_dashboard' && (
          <VillagerDashboard
            onNavigate={navigate}
            onSelectComplaint={handleSelectComplaint}
          />
        )}

        {currentPage === 'report_problem' && (
          <ReportProblemPage
            onNavigate={navigate}
            onSelectComplaint={handleSelectComplaint}
          />
        )}

        {currentPage === 'panchayat_login' && (
          <PanchayatLoginPage onNavigate={navigate} />
        )}

        {currentPage === 'panchayat_dashboard' && (
          <PanchayatDashboard
            onNavigate={navigate}
            onSelectComplaint={handleSelectComplaint}
          />
        )}

        {currentPage === 'panchayat_reports' && (
          <PanchayatReports onNavigate={navigate} />
        )}
      </main>

      {/* Footer */}
      <Footer
        onNavigate={navigate}
        onOpenTracker={() => setIsTrackerOpen(true)}
      />

      {/* Modals */}
      {selectedComplaint && (
        <ComplaintDetailModal
          complaint={selectedComplaint}
          onClose={() => setSelectedComplaintId(null)}
          onSelectComplaint={handleSelectComplaint}
        />
      )}

      <QuickTrackerModal
        isOpen={isTrackerOpen}
        onClose={() => setIsTrackerOpen(false)}
        onSelectComplaint={handleSelectComplaint}
      />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <ComplaintProvider>
        <AppContent />
      </ComplaintProvider>
    </AuthProvider>
  );
}

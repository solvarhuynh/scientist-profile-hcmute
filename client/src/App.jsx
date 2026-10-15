import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ProfileProvider, useProfile } from './context/ProfileContext';

// Layout
import Navbar from './components/layout/Navbar';
import Sidebar from './components/layout/Sidebar';

// Sections
import BasicInfoSection from './components/sections/BasicInfoSection';
import ExtraInfoSection from './components/sections/ExtraInfoSection';
import EducationSection from './components/sections/EducationSection';
import WorkHistorySection from './components/sections/WorkHistorySection';
import ProjectsSection from './components/sections/ProjectsSection';
import PublicationsSection from './components/sections/PublicationsSection';
import AwardsSection from './components/sections/AwardsSection';

// Admin
import AdminDashboard from './components/admin/AdminDashboard';
import AdminManagementModal from './components/modals/AdminManagementModal';

// Modals
import CvExportModal from './components/modals/CvExportModal';
import CvImportModal from './components/modals/CvImportModal';

function MainContent() {
  const { activeSection, profile, toast } = useProfile();
  const [viewMode, setViewMode] = useState('user'); // 'user' or 'admin'

  // Modals state
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [isImportOpen, setIsImportOpen] = useState(false);
  const [isAdminMgmtOpen, setIsAdminMgmtOpen] = useState(false);
  const [exportProfileTarget, setExportProfileTarget] = useState(null);

  const handleOpenExportForSelf = () => {
    setExportProfileTarget(profile);
    setIsExportOpen(true);
  };

  const handleOpenExportForCandidate = (cand) => {
    setExportProfileTarget(cand);
    setIsExportOpen(true);
  };

  const renderSection = () => {
    switch (activeSection) {
      case 'basic': return <BasicInfoSection />;
      case 'extra': return <ExtraInfoSection />;
      case 'education': return <EducationSection />;
      case 'work': return <WorkHistorySection />;
      case 'projects': return <ProjectsSection />;
      case 'publications': return <PublicationsSection />;
      case 'awards': return <AwardsSection />;
      default: return <BasicInfoSection />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col text-slate-800">
      
      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 animate-bounce">
          <div className={`px-4 py-3 rounded-2xl shadow-xl text-xs font-bold border flex items-center space-x-2 ${
            toast.type === 'error'
              ? 'bg-rose-600 text-white border-rose-700'
              : 'bg-emerald-600 text-white border-emerald-700'
          }`}>
            <span>{toast.message}</span>
          </div>
        </div>
      )}

      {/* Navigation Bar */}
      <Navbar
        onOpenExport={handleOpenExportForSelf}
        onOpenImport={() => setIsImportOpen(true)}
        viewMode={viewMode}
        setViewMode={setViewMode}
        onOpenAdminMgmt={() => setIsAdminMgmtOpen(true)}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {viewMode === 'admin' ? (
          <AdminDashboard onSelectCandidateForExport={handleOpenExportForCandidate} />
        ) : (
          <div className="flex flex-col lg:flex-row gap-6">
            <Sidebar />
            <div className="flex-1 min-w-0">
              {renderSection()}
            </div>
          </div>
        )}
      </main>

      {/* Modals */}
      <CvExportModal
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        profile={exportProfileTarget || profile}
      />

      <CvImportModal
        isOpen={isImportOpen}
        onClose={() => setIsImportOpen(false)}
      />

      <AdminManagementModal
        isOpen={isAdminMgmtOpen}
        onClose={() => setIsAdminMgmtOpen(false)}
      />

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-6 mt-12 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4">
          <div className="font-semibold text-slate-700">Trường Đại Học Sư Phạm Kỹ Thuật TP. Hồ Chí Minh (HCMUTE)</div>
          <div className="text-[11px] text-slate-400 mt-1">
            Cổng Thông Tin Lý Lịch Khoa Học & Quản Lý Giảng Viên • Chuẩn Phụ Lục III Thông Tư 09/2017/TT-BGDĐT
          </div>
        </div>
      </footer>

    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <ProfileProvider>
        <MainContent />
      </ProfileProvider>
    </AuthProvider>
  );
}

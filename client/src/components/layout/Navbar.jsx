import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useProfile } from '../../context/ProfileContext';
import { Download, Upload, Save, ShieldCheck, User, LogOut, CheckCircle } from 'lucide-react';

export default function Navbar({ onOpenExport, onOpenImport, viewMode, setViewMode, onOpenAdminMgmt }) {
  const { user, role, logout } = useAuth();
  const { saveProfile, saving } = useProfile();

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          
          {/* Logo & Brand */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-700 to-sky-500 flex items-center justify-center text-white font-black text-xl shadow-md shadow-blue-500/20">
              H
            </div>
            <div>
              <div className="text-xs uppercase tracking-wider font-bold text-blue-700">HCMUTE PORTAL</div>
              <h1 className="text-sm sm:text-base font-bold text-slate-900 leading-tight">
                Lý Lịch Khoa Học & Quản Lý Giảng Viên
              </h1>
            </div>
          </div>

          {/* Action Tools */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* View Mode Toggle: User vs Admin */}
            {role === 'admin' && (
              <div className="bg-slate-100 p-1 rounded-xl flex items-center text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => setViewMode('user')}
                  className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                    viewMode === 'user' ? 'bg-white text-blue-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <User className="w-3.5 h-3.5" />
                  Hồ sơ của tôi
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('admin')}
                  className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                    viewMode === 'admin' ? 'bg-blue-700 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Quản trị Admin
                </button>
              </div>
            )}

            {/* Quick Actions for User View */}
            {viewMode === 'user' && (
              <>
                <button
                  type="button"
                  onClick={onOpenImport}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition"
                  title="Nhập dữ liệu từ file JSON hoặc Word DOCX"
                >
                  <Upload className="w-4 h-4 text-emerald-600" />
                  <span className="hidden md:inline">Nhập file</span>
                </button>

                <button
                  type="button"
                  onClick={onOpenExport}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition"
                  title="Xuất CV Phụ lục III chuẩn mẫu Word/PDF"
                >
                  <Download className="w-4 h-4 text-blue-600" />
                  <span className="hidden md:inline">Xuất Phụ lục III</span>
                </button>

                <button
                  type="button"
                  onClick={saveProfile}
                  disabled={saving}
                  className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-bold text-white bg-blue-700 hover:bg-blue-800 shadow-sm shadow-blue-700/20 transition disabled:opacity-60"
                >
                  <Save className="w-4 h-4" />
                  <span>{saving ? 'Đang lưu...' : 'Lưu hồ sơ'}</span>
                </button>
              </>
            )}

            {/* Admin Management Button (only in admin view) */}
            {viewMode === 'admin' && (
              <button
                type="button"
                onClick={onOpenAdminMgmt}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold text-purple-700 bg-purple-50 hover:bg-purple-100 border border-purple-200 transition"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Phân quyền Admin</span>
              </button>
            )}

            {/* User Profile avatar */}
            <div className="pl-2 border-l border-slate-200 flex items-center space-x-2">
              <div className="w-8 h-8 rounded-full bg-blue-100 border border-blue-200 flex items-center justify-center text-blue-700 font-bold text-xs">
                {user?.full_name ? user.full_name.charAt(0) : 'U'}
              </div>
              <div className="hidden xl:block text-left text-xs">
                <div className="font-semibold text-slate-800">{user?.full_name || 'Người dùng'}</div>
                <div className="text-slate-400 text-[10px]">{user?.email}</div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </header>
  );
}


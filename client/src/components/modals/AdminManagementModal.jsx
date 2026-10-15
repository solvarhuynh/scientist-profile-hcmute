import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { X, ShieldCheck, UserPlus, Trash2, Mail, User } from 'lucide-react';

export default function AdminManagementModal({ isOpen, onClose }) {
  const { user } = useAuth();
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newEmail, setNewEmail] = useState('');
  const [newName, setNewName] = useState('');
  const [notice, setNotice] = useState(null);

  const fetchAdmins = async () => {
    setLoading(true);
    try {
      const res = await api.getAdmins();
      if (res.success) {
        setAdmins(res.admins || []);
      }
    } catch (err) {
      console.warn('Error fetching admins:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchAdmins();
      setNotice(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleAddAdmin = async (e) => {
    e.preventDefault();
    if (!newEmail.trim()) return;

    try {
      const res = await api.addAdmin({ email: newEmail.trim(), full_name: newName.trim(), role: 'admin' });
      if (res.success) {
        setNotice({ type: 'success', text: res.message });
        setNewEmail('');
        setNewName('');
        fetchAdmins();
      }
    } catch (err) {
      setNotice({ type: 'error', text: err.message });
    }
  };

  const handleRemoveAdmin = async (email) => {
    if (!window.confirm(`Xác nhận thu hồi quyền Quản trị viên của ${email}?`)) return;

    try {
      const res = await api.removeAdmin(email);
      if (res.success) {
        setNotice({ type: 'success', text: res.message });
        fetchAdmins();
      }
    } catch (err) {
      setNotice({ type: 'error', text: err.message });
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl overflow-hidden border border-slate-200">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-purple-50/50">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-purple-100 text-purple-700 rounded-xl">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Quản Lý Phân Quyền Quản Trị Viên</h3>
              <p className="text-xs text-slate-500">Cấp quyền duyệt hồ sơ và tra cứu ứng viên toàn trường</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          {/* Notice */}
          {notice && (
            <div className={`p-3 rounded-xl text-xs font-semibold ${
              notice.type === 'success' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-rose-50 text-rose-800 border border-rose-200'
            }`}>
              {notice.text}
            </div>
          )}

          {/* Add form */}
          <form onSubmit={handleAddAdmin} className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-3">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-700">Thêm Quản Trị Viên Mới</div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div>
                <input
                  type="email"
                  required
                  placeholder="Email HCMUTE (VD: user@hcmute.edu.vn)"
                  value={newEmail}
                  onChange={e => setNewEmail(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 focus:outline-none focus:border-purple-600 bg-white"
                />
              </div>
              <div>
                <input
                  type="text"
                  placeholder="Họ và tên quản trị viên"
                  value={newName}
                  onChange={e => setNewName(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 focus:outline-none focus:border-purple-600 bg-white"
                />
              </div>
            </div>
            <div className="flex justify-end">
              <button
                type="submit"
                className="px-4 py-2 rounded-lg bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs transition flex items-center gap-1.5 shadow-sm shadow-purple-700/20"
              >
                <UserPlus className="w-3.5 h-3.5" />
                Cấp quyền Admin
              </button>
            </div>
          </form>

          {/* List */}
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
              Danh sách quản trị viên hiện tại ({admins.length}):
            </div>
            <div className="space-y-2 max-h-56 overflow-y-auto">
              {admins.map(adm => (
                <div key={adm.id} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <div className="flex items-center space-x-2.5">
                    <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center font-bold text-xs">
                      {adm.full_name ? adm.full_name.charAt(0) : 'A'}
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-800">{adm.full_name || adm.email}</div>
                      <div className="text-[11px] text-slate-400">{adm.email} • {adm.role || 'admin'}</div>
                    </div>
                  </div>
                  {adm.email !== 'admin@hcmute.edu.vn' && (
                    <button
                      type="button"
                      onClick={() => handleRemoveAdmin(adm.email)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 transition"
                      title="Thu hồi quyền"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-200 bg-slate-50 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-200 transition"
          >
            Đóng
          </button>
        </div>

      </div>
    </div>
  );
}


import React, { useState } from 'react';
import { useProfile } from '../../context/ProfileContext';
import { Compass, Plus, Trash2, BookOpen, Lightbulb, CheckSquare } from 'lucide-react';

export default function ExtraInfoSection() {
  const { profile, updatePreferences, updateProfileField } = useProfile();
  const prefs = profile.preferences || {};

  // Teaching subjects local inputs
  const [newSubjectMajor, setNewSubjectMajor] = useState('');
  const [newSubjectName, setNewSubjectName] = useState('');

  // Research direction local inputs
  const [newDirectionMajor, setNewDirectionMajor] = useState('');
  const [newDirectionName, setNewDirectionName] = useState('');

  const handleAddSubject = () => {
    if (!newSubjectName.trim()) return;
    const current = profile.teaching_subjects || [];
    const updated = [
      ...current,
      {
        id: 'ts-' + Date.now(),
        major: newSubjectMajor.trim() || 'Chuyên ngành',
        name: newSubjectName.trim(),
        description: ''
      }
    ];
    updateProfileField('teaching_subjects', updated);
    setNewSubjectMajor('');
    setNewSubjectName('');
  };

  const handleRemoveSubject = (id) => {
    const updated = (profile.teaching_subjects || []).filter(s => s.id !== id);
    updateProfileField('teaching_subjects', updated);
  };

  const handleAddDirection = () => {
    if (!newDirectionName.trim()) return;
    const current = profile.research_directions || [];
    const updated = [
      ...current,
      {
        id: 'rd-' + Date.now(),
        major: newDirectionMajor.trim() || 'Lĩnh vực',
        name: newDirectionName.trim(),
        description: ''
      }
    ];
    updateProfileField('research_directions', updated);
    setNewDirectionMajor('');
    setNewDirectionName('');
  };

  const handleRemoveDirection = (id) => {
    const updated = (profile.research_directions || []).filter(d => d.id !== id);
    updateProfileField('research_directions', updated);
  };

  return (
    <div className="space-y-6">
      {/* 1. Preferences & Cooperation */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm">
        <div className="flex items-center space-x-3 pb-4 border-b border-slate-100">
          <div className="p-2.5 bg-blue-50 text-blue-700 rounded-xl">
            <Compass className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900">II. Nguyện Vọng Hợp Tác & Chuyên Môn</h2>
            <p className="text-xs text-slate-500">Các hình thức hợp tác giảng dạy, nghiên cứu khoa học và kết nối doanh nghiệp</p>
          </div>
        </div>

        <div className="mt-5 space-y-3">
          <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
            Nguyện vọng tham gia các hoạt động:
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {[
              { key: 'thinh_giang', label: 'Giảng dạy thỉnh giảng' },
              { key: 'nghien_cuu', label: 'Hợp tác nghiên cứu KH&CN' },
              { key: 'hoi_dong', label: 'Tham gia hội đồng đánh giá' },
              { key: 'huong_dan', label: 'Hướng dẫn học viên cao học & NCS' },
              { key: 'doanh_nghiep', label: 'Hợp tác chuyển giao doanh nghiệp' }
            ].map(item => (
              <label
                key={item.key}
                className={`flex items-center space-x-3 p-3 rounded-xl border cursor-pointer select-none transition ${
                  prefs[item.key]
                    ? 'border-blue-500 bg-blue-50/60 text-blue-900 font-semibold shadow-sm'
                    : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                }`}
              >
                <input
                  type="checkbox"
                  checked={!!prefs[item.key]}
                  onChange={e => updatePreferences(item.key, e.target.checked)}
                  className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
                />
                <span className="text-xs">{item.label}</span>
              </label>
            ))}
          </div>

          <div className="mt-4">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Ghi chú thêm về định hướng chuyên môn
            </label>
            <textarea
              rows={3}
              value={prefs.ghi_chu || ''}
              onChange={e => updatePreferences('ghi_chu', e.target.value)}
              placeholder="VD: Sẵn sàng tham gia các hội đồng đánh giá chuyên ngành AI, thị giác máy tính và hợp tác triển khai dự án công nghiệp..."
              className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-blue-600"
            />
          </div>
        </div>
      </div>

      {/* 2. Teaching Subjects */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-emerald-50 text-emerald-700 rounded-xl">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Môn Học Giảng Dạy</h3>
              <p className="text-xs text-slate-500">Các môn chuyên ngành và môn phụ trách</p>
            </div>
          </div>
          <span className="text-xs font-bold px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-full">
            {profile.teaching_subjects?.length || 0} môn
          </span>
        </div>

        {/* Input Add */}
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-12 gap-2">
          <div className="sm:col-span-4">
            <input
              type="text"
              placeholder="Ngành / Chuyên ngành"
              value={newSubjectMajor}
              onChange={e => setNewSubjectMajor(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-600"
            />
          </div>
          <div className="sm:col-span-6">
            <input
              type="text"
              placeholder="Tên môn học (VD: Trí tuệ nhân tạo nâng cao)"
              value={newSubjectName}
              onChange={e => setNewSubjectName(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-600"
            />
          </div>
          <div className="sm:col-span-2">
            <button
              type="button"
              onClick={handleAddSubject}
              className="w-full py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-1 transition"
            >
              <Plus className="w-3.5 h-3.5" /> Thêm
            </button>
          </div>
        </div>

        {/* List */}
        <div className="mt-4 space-y-2">
          {(profile.teaching_subjects || []).map((s) => (
            <div key={s.id} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100 hover:bg-slate-100/60 transition">
              <div>
                <div className="text-xs font-bold text-slate-800">{s.name}</div>
                <div className="text-[11px] text-slate-500 font-medium">Ngành: {s.major}</div>
              </div>
              <button
                type="button"
                onClick={() => handleRemoveSubject(s.id)}
                className="text-slate-400 hover:text-rose-600 p-1 rounded-lg transition"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
          {(!profile.teaching_subjects || profile.teaching_subjects.length === 0) && (
            <div className="text-center py-4 text-xs text-slate-400 italic">Chưa có môn học nào được thêm</div>
          )}
        </div>
      </div>

      {/* 3. Research Directions */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-indigo-50 text-indigo-700 rounded-xl">
              <Lightbulb className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Hướng Nghiên Cứu Chính</h3>
              <p className="text-xs text-slate-500">Các hướng nghiên cứu mũi nhọn và lĩnh vực công nghệ</p>
            </div>
          </div>
          <span className="text-xs font-bold px-2.5 py-1 bg-indigo-50 text-indigo-700 rounded-full">
            {profile.research_directions?.length || 0} hướng
          </span>
        </div>

        {/* Input Add */}
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-12 gap-2">
          <div className="sm:col-span-4">
            <input
              type="text"
              placeholder="Lĩnh vực (VD: Trí tuệ nhân tạo)"
              value={newDirectionMajor}
              onChange={e => setNewDirectionMajor(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-600"
            />
          </div>
          <div className="sm:col-span-6">
            <input
              type="text"
              placeholder="Hướng nghiên cứu (VD: Học sâu & Thị giác máy tính)"
              value={newDirectionName}
              onChange={e => setNewDirectionName(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-600"
            />
          </div>
          <div className="sm:col-span-2">
            <button
              type="button"
              onClick={handleAddDirection}
              className="w-full py-2 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center justify-center gap-1 transition"
            >
              <Plus className="w-3.5 h-3.5" /> Thêm
            </button>
          </div>
        </div>

        {/* List */}
        <div className="mt-4 space-y-2">
          {(profile.research_directions || []).map((d) => (
            <div key={d.id} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100 hover:bg-slate-100/60 transition">
              <div>
                <div className="text-xs font-bold text-slate-800">{d.name}</div>
                <div className="text-[11px] text-slate-500 font-medium">Lĩnh vực: {d.major}</div>
              </div>
              <button
                type="button"
                onClick={() => handleRemoveDirection(d.id)}
                className="text-slate-400 hover:text-rose-600 p-1 rounded-lg transition"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
          {(!profile.research_directions || profile.research_directions.length === 0) && (
            <div className="text-center py-4 text-xs text-slate-400 italic">Chưa có hướng nghiên cứu nào được thêm</div>
          )}
        </div>
      </div>
    </div>
  );
}

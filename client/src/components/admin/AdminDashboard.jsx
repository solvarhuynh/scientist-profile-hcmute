import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { 
  Users, 
  Search, 
  Filter, 
  GraduationCap, 
  Award, 
  Download, 
  Eye, 
  RefreshCw,
  Building
} from 'lucide-react';

export default function AdminDashboard({ onSelectCandidateForExport }) {
  const [candidates, setCandidates] = useState([]);
  const [stats, setStats] = useState({ totalProfiles: 0, professors: 0, doctors: 0, masters: 0 });
  const [loading, setLoading] = useState(false);

  // Filters
  const [keyword, setKeyword] = useState('');
  const [department, setDepartment] = useState('');
  const [highestDegree, setHighestDegree] = useState('');
  const [academicTitle, setAcademicTitle] = useState('');

  // Selected candidate detail preview modal
  const [selectedCandidate, setSelectedCandidate] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [candRes, statRes] = await Promise.all([
        api.getCandidates({
          keyword,
          department,
          highest_degree: highestDegree,
          academic_title: academicTitle
        }),
        api.getStats()
      ]);

      if (candRes.success) setCandidates(candRes.candidates || []);
      if (statRes.success) setStats(statRes.stats || {});
    } catch (err) {
      console.warn('Error fetching candidates:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [department, highestDegree, academicTitle]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchData();
  };

  return (
    <div className="space-y-6">
      
      {/* 1. Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-slate-400">Tổng Số Hồ Sơ</div>
            <div className="text-2xl font-black text-slate-900 mt-1">{stats.totalProfiles || candidates.length}</div>
            <div className="text-[11px] text-slate-500 mt-0.5">Giảng viên & Nhà khoa học</div>
          </div>
          <div className="p-3 bg-blue-50 text-blue-700 rounded-xl">
            <Users className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-slate-400">Giáo Sư / PGS</div>
            <div className="text-2xl font-black text-blue-700 mt-1">{stats.professors}</div>
            <div className="text-[11px] text-slate-500 mt-0.5">Chức danh khoa học cao nhất</div>
          </div>
          <div className="p-3 bg-blue-50 text-blue-700 rounded-xl">
            <Award className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-slate-400">Tiến Sĩ (PhD)</div>
            <div className="text-2xl font-black text-emerald-700 mt-1">{stats.doctors}</div>
            <div className="text-[11px] text-slate-500 mt-0.5">Trình độ sau đại học</div>
          </div>
          <div className="p-3 bg-emerald-50 text-emerald-700 rounded-xl">
            <GraduationCap className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-slate-400">Thạc Sĩ (Master)</div>
            <div className="text-2xl font-black text-sky-700 mt-1">{stats.masters}</div>
            <div className="text-[11px] text-slate-500 mt-0.5">Trình độ cao học</div>
          </div>
          <div className="p-3 bg-sky-50 text-sky-700 rounded-xl">
            <GraduationCap className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* 2. Filter & Search Controls */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
        <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          
          {/* Keyword Search */}
          <div className="lg:col-span-2 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Tìm theo họ tên, email, từ khóa..."
              value={keyword}
              onChange={e => setKeyword(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-blue-600 bg-white"
            />
          </div>

          {/* Department Filter */}
          <div>
            <select
              value={department}
              onChange={e => setDepartment(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-blue-600 bg-white"
            >
              <option value="">-- Tất cả Khoa / Đơn vị --</option>
              <option value="Công Nghệ Thông Tin">Khoa CNTT</option>
              <option value="Điện - Điện Tử">Khoa Điện - Điện tử</option>
              <option value="Cơ Khí Chế Tạo Máy">Khoa Cơ khí Chế tạo máy</option>
              <option value="Kinh Tế">Khoa Kinh tế</option>
              <option value="Ngoại Ngữ">Khoa Ngoại ngữ</option>
            </select>
          </div>

          {/* Degree Filter */}
          <div>
            <select
              value={highestDegree}
              onChange={e => setHighestDegree(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-blue-600 bg-white"
            >
              <option value="">-- Tất cả Học vị --</option>
              <option value="Tiến sĩ">Tiến sĩ (PhD)</option>
              <option value="Thạc sĩ">Thạc sĩ</option>
              <option value="Cử nhân">Cử nhân / Kỹ sư</option>
            </select>
          </div>

          {/* Search Button */}
          <div className="flex space-x-2">
            <button
              type="submit"
              className="flex-1 py-2 px-3 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition shadow-sm shadow-blue-700/20"
            >
              <Search className="w-3.5 h-3.5" />
              <span>Tìm kiếm</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setKeyword('');
                setDepartment('');
                setHighestDegree('');
                setAcademicTitle('');
                fetchData();
              }}
              className="p-2 rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-100 transition"
              title="Đặt lại bộ lọc"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>

        </form>
      </div>

      {/* 3. Candidate Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-700">
            Danh Sách Giảng Viên & Ứng Viên ({candidates.length})
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 text-[11px] font-bold uppercase tracking-wider text-slate-500 bg-slate-50/50">
                <th className="py-3 px-4">Họ và tên</th>
                <th className="py-3 px-4">Học vị & Chức danh</th>
                <th className="py-3 px-4">Đơn vị công tác</th>
                <th className="py-3 px-4">Liên hệ</th>
                <th className="py-3 px-4 text-right">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {candidates.map((cand) => (
                <tr key={cand.id} className="hover:bg-slate-50/80 transition">
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-slate-900 text-sm">{cand.full_name}</div>
                    <div className="text-[11px] text-slate-400">{cand.position || 'Giảng viên'}</div>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="font-semibold text-blue-700">
                      {cand.academic_title ? `${cand.academic_title}. ` : ''}
                      {cand.highest_degree || '—'}
                    </div>
                    {cand.degree_conferred_year && (
                      <div className="text-[11px] text-slate-400">Năm {cand.degree_conferred_year} ({cand.degree_country || 'Việt Nam'})</div>
                    )}
                  </td>
                  <td className="py-3.5 px-4 max-w-xs truncate text-slate-700 font-medium">
                    {cand.department || '—'}
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="text-slate-800 font-medium">{cand.email}</div>
                    <div className="text-[11px] text-slate-500">{cand.mobile_phone || '—'}</div>
                  </td>
                  <td className="py-3.5 px-4 text-right space-x-2 flex-shrink-0">
                    <button
                      type="button"
                      onClick={() => onSelectCandidateForExport(cand)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-xs transition"
                      title="Xuất Phụ lục III cho giảng viên này"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Xuất CV</span>
                    </button>
                  </td>
                </tr>
              ))}
              {candidates.length === 0 && (
                <tr>
                  <td colSpan={5} className="text-center py-8 text-xs text-slate-400 italic">
                    Không tìm thấy giảng viên hoặc ứng viên phù hợp với bộ lọc
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}


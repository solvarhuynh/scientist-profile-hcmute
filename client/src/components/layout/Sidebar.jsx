import React from 'react';
import { useProfile } from '../../context/ProfileContext';
import { 
  User, 
  Compass, 
  GraduationCap, 
  Briefcase, 
  FlaskConical, 
  BookOpen, 
  Award,
  ChevronRight
} from 'lucide-react';

const SECTIONS = [
  { id: 'basic', label: '1. Thông tin cơ bản', icon: User, desc: 'Lý lịch sơ lược, CCCD, chức vụ' },
  { id: 'extra', label: '2. Thông tin bổ sung', icon: Compass, desc: 'Nguyện vọng & Môn giảng dạy' },
  { id: 'education', label: '3. Quá trình đào tạo', icon: GraduationCap, desc: 'Đại học, Thạc sĩ, Tiến sĩ, Ngoại ngữ' },
  { id: 'work', label: '4. Quá trình công tác', icon: Briefcase, desc: 'Đơn vị, chức vụ & thời gian' },
  { id: 'projects', label: '5. Đề tài & Dự án NCKH', icon: FlaskConical, desc: 'Cấp Nhà nước, Bộ, Tỉnh, Trường' },
  { id: 'publications', label: '6. Công bố khoa học', icon: BookOpen, desc: 'Bài báo ISI/Scopus & Sách' },
  { id: 'awards', label: '7. Khen thưởng & Giải thưởng', icon: Award, desc: 'Giải thưởng KH&CN các cấp' },
];

export default function Sidebar() {
  const { activeSection, setActiveSection, profile } = useProfile();

  // Helper to count items in each section
  const getSectionBadge = (id) => {
    switch (id) {
      case 'education': return profile.degrees?.length || 0;
      case 'work': return profile.work_history?.length || 0;
      case 'projects': return profile.research_projects?.length || 0;
      case 'publications': return (profile.publications?.length || 0) + (profile.books?.length || 0);
      case 'awards': return profile.awards?.length || 0;
      default: return null;
    }
  };

  return (
    <aside className="w-full lg:w-72 flex-shrink-0">
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-3 sticky top-20">
        <div className="px-3 py-2 text-xs font-bold uppercase tracking-wider text-slate-400">
          Danh mục hồ sơ khoa học
        </div>
        <nav className="space-y-1 mt-1">
          {SECTIONS.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;
            const count = getSectionBadge(item.id);

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveSection(item.id)}
                className={`w-full text-left px-3.5 py-3 rounded-xl transition-all flex items-center justify-between group ${
                  isActive
                    ? 'bg-blue-50 text-blue-700 font-bold border border-blue-100 shadow-sm'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <div className="flex items-center space-x-3 min-w-0">
                  <div className={`p-2 rounded-lg transition-colors ${
                    isActive ? 'bg-blue-700 text-white' : 'bg-slate-100 text-slate-500 group-hover:bg-slate-200'
                  }`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="truncate">
                    <div className="text-xs font-bold leading-tight">{item.label}</div>
                    <div className="text-[11px] font-normal text-slate-400 truncate mt-0.5">{item.desc}</div>
                  </div>
                </div>

                <div className="flex items-center space-x-1.5 flex-shrink-0">
                  {count !== null && (
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      isActive ? 'bg-blue-200/80 text-blue-800' : 'bg-slate-100 text-slate-500'
                    }`}>
                      {count}
                    </span>
                  )}
                  <ChevronRight className={`w-3.5 h-3.5 transition-transform ${
                    isActive ? 'text-blue-700 translate-x-0.5' : 'text-slate-300 opacity-0 group-hover:opacity-100'
                  }`} />
                </div>
              </button>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}

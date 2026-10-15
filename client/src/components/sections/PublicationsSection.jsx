import React, { useState } from 'react';
import { useProfile } from '../../context/ProfileContext';
import { BookOpen, Book, Plus, Trash2, Edit2, ExternalLink } from 'lucide-react';

export default function PublicationsSection() {
  const { profile, updateProfileField } = useProfile();

  // Paper form state
  const [paperForm, setPaperForm] = useState({
    title: '',
    authors: '',
    journal_name: '',
    publication_year: '',
    volume_issue: '',
    index_type: 'ISI/Scopus',
    doi_url: ''
  });
  const [editingPaperId, setEditingPaperId] = useState(null);

  // Book form state
  const [bookForm, setBookForm] = useState({
    title: '',
    publisher: '',
    publication_year: '',
    role: 'Chủ biên',
    isbn: ''
  });
  const [editingBookId, setEditingBookId] = useState(null);

  // Paper Handlers
  const handlePaperChange = (e) => {
    const { name, value } = e.target;
    setPaperForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSavePaper = () => {
    if (!paperForm.title.trim() || !paperForm.journal_name.trim()) {
      alert('Vui lòng nhập tên công trình/bài báo và tên tạp chí');
      return;
    }

    const current = profile.publications || [];
    if (editingPaperId) {
      const updated = current.map(p => p.id === editingPaperId ? { ...paperForm, id: editingPaperId } : p);
      updateProfileField('publications', updated);
      setEditingPaperId(null);
    } else {
      const newPaper = {
        ...paperForm,
        id: 'pub-' + Date.now(),
        publication_year: paperForm.publication_year ? parseInt(paperForm.publication_year) : null
      };
      updateProfileField('publications', [...current, newPaper]);
    }

    setPaperForm({
      title: '',
      authors: '',
      journal_name: '',
      publication_year: '',
      volume_issue: '',
      index_type: 'ISI/Scopus',
      doi_url: ''
    });
  };

  const handleEditPaper = (p) => {
    setEditingPaperId(p.id);
    setPaperForm({
      title: p.title || '',
      authors: p.authors || '',
      journal_name: p.journal_name || '',
      publication_year: p.publication_year || '',
      volume_issue: p.volume_issue || '',
      index_type: p.index_type || 'ISI/Scopus',
      doi_url: p.doi_url || ''
    });
  };

  const handleRemovePaper = (id) => {
    const updated = (profile.publications || []).filter(p => p.id !== id);
    updateProfileField('publications', updated);
    if (editingPaperId === id) setEditingPaperId(null);
  };

  // Book Handlers
  const handleBookChange = (e) => {
    const { name, value } = e.target;
    setBookForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveBook = () => {
    if (!bookForm.title.trim() || !bookForm.publisher.trim()) {
      alert('Vui lòng nhập tên sách và nhà xuất bản');
      return;
    }

    const current = profile.books || [];
    if (editingBookId) {
      const updated = current.map(b => b.id === editingBookId ? { ...bookForm, id: editingBookId } : b);
      updateProfileField('books', updated);
      setEditingBookId(null);
    } else {
      const newBook = {
        ...bookForm,
        id: 'bk-' + Date.now(),
        publication_year: bookForm.publication_year ? parseInt(bookForm.publication_year) : null
      };
      updateProfileField('books', [...current, newBook]);
    }

    setBookForm({
      title: '',
      publisher: '',
      publication_year: '',
      role: 'Chủ biên',
      isbn: ''
    });
  };

  const handleEditBook = (b) => {
    setEditingBookId(b.id);
    setBookForm({
      title: b.title || '',
      publisher: b.publisher || '',
      publication_year: b.publication_year || '',
      role: b.role || 'Chủ biên',
      isbn: b.isbn || ''
    });
  };

  const handleRemoveBook = (id) => {
    const updated = (profile.books || []).filter(b => b.id !== id);
    updateProfileField('books', updated);
    if (editingBookId === id) setEditingBookId(null);
  };

  return (
    <div className="space-y-6">
      {/* 1. Scientific Articles & Publications */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-blue-50 text-blue-700 rounded-xl">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">VI. Công Trình Khoa Học Đã Công Bố</h2>
              <p className="text-xs text-slate-500">Các bài báo trên tạp chí khoa học quốc tế, tạp chí trong nước và hội nghị chuyên ngành</p>
            </div>
          </div>
          <span className="text-xs font-bold px-2.5 py-1 bg-blue-50 text-blue-700 rounded-full">
            {profile.publications?.length || 0} bài báo
          </span>
        </div>

        {/* Form Input */}
        <div className="mt-5 p-4 rounded-xl bg-slate-50 border border-slate-200/70">
          <div className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">
            {editingPaperId ? 'Chỉnh sửa bài báo khoa học' : 'Thêm công trình / bài báo mới'}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <div className="sm:col-span-4">
              <label className="block text-[11px] font-bold text-slate-600 mb-1">
                Tên công trình / Bài báo <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                name="title"
                value={paperForm.title}
                onChange={handlePaperChange}
                placeholder="VD: Deep Vision Transformer for Real-Time Medical Image Classification"
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 focus:outline-none focus:border-blue-600 bg-white font-medium"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-[11px] font-bold text-slate-600 mb-1">Tác giả (Authors)</label>
              <input
                type="text"
                name="authors"
                value={paperForm.authors}
                onChange={handlePaperChange}
                placeholder="VD: Nguyen Van An, Tran Minh Chau..."
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 focus:outline-none focus:border-blue-600 bg-white"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-[11px] font-bold text-slate-600 mb-1">
                Tên tạp chí / Kỷ yếu <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                name="journal_name"
                value={paperForm.journal_name}
                onChange={handlePaperChange}
                placeholder="VD: IEEE Transactions on Pattern Analysis and Machine Intelligence"
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 focus:outline-none focus:border-blue-600 bg-white"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">Phân loại</label>
              <select
                name="index_type"
                value={paperForm.index_type}
                onChange={handlePaperChange}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 focus:outline-none focus:border-blue-600 bg-white"
              >
                <option value="ISI/Scopus">ISI / Scopus</option>
                <option value="Trong nước">Tạp chí Trong nước (HĐGSNN)</option>
                <option value="Hội nghị quốc tế">Hội nghị quốc tế</option>
                <option value="Hội nghị trong nước">Hội nghị trong nước</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">Năm công bố</label>
              <input
                type="number"
                name="publication_year"
                value={paperForm.publication_year}
                onChange={handlePaperChange}
                placeholder="VD: 2023"
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 focus:outline-none focus:border-blue-600 bg-white"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">Tập, số, trang</label>
              <input
                type="text"
                name="volume_issue"
                value={paperForm.volume_issue}
                onChange={handlePaperChange}
                placeholder="VD: Vol. 45, No. 3, pp. 2100-2115"
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 focus:outline-none focus:border-blue-600 bg-white"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">Đường dẫn DOI / URL</label>
              <input
                type="text"
                name="doi_url"
                value={paperForm.doi_url}
                onChange={handlePaperChange}
                placeholder="VD: https://doi.org/10.1109/..."
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 focus:outline-none focus:border-blue-600 bg-white"
              />
            </div>
          </div>

          <div className="mt-3 flex justify-end space-x-2">
            {editingPaperId && (
              <button
                type="button"
                onClick={() => {
                  setEditingPaperId(null);
                  setPaperForm({ title: '', authors: '', journal_name: '', publication_year: '', volume_issue: '', index_type: 'ISI/Scopus', doi_url: '' });
                }}
                className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-100 transition"
              >
                Hủy
              </button>
            )}
            <button
              type="button"
              onClick={handleSavePaper}
              className="px-4 py-1.5 rounded-lg bg-blue-700 hover:bg-blue-800 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-sm shadow-blue-700/20"
            >
              <Plus className="w-3.5 h-3.5" />
              {editingPaperId ? 'Cập nhật' : 'Thêm bài báo'}
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="mt-5 overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 text-[11px] font-bold uppercase tracking-wider text-slate-500 bg-slate-50/50">
                <th className="py-2.5 px-3">TT</th>
                <th className="py-2.5 px-3">Tên công trình</th>
                <th className="py-2.5 px-3">Năm</th>
                <th className="py-2.5 px-3">Tạp chí & Phân loại</th>
                <th className="py-2.5 px-3 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {(profile.publications || []).map((pub, idx) => (
                <tr key={pub.id} className="hover:bg-slate-50/80 transition">
                  <td className="py-3 px-3 font-bold text-slate-400">{idx + 1}</td>
                  <td className="py-3 px-3">
                    <div className="font-semibold text-slate-800">{pub.title}</div>
                    {pub.authors && <div className="text-[11px] text-slate-500">Tác giả: {pub.authors}</div>}
                    {pub.doi_url && (
                      <a href={pub.doi_url} target="_blank" rel="noreferrer" className="text-[10px] text-blue-600 hover:underline flex items-center gap-1 mt-0.5">
                        <ExternalLink className="w-3 h-3" /> DOI Link
                      </a>
                    )}
                  </td>
                  <td className="py-3 px-3 font-semibold text-slate-700 whitespace-nowrap">{pub.publication_year || '—'}</td>
                  <td className="py-3 px-3">
                    <div className="text-slate-700 font-medium">{pub.journal_name}</div>
                    <span className="inline-block mt-0.5 px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-600">
                      {pub.index_type || 'Trong nước'}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right space-x-1 flex-shrink-0">
                    <button
                      type="button"
                      onClick={() => handleEditPaper(pub)}
                      className="p-1 text-slate-400 hover:text-blue-600 transition"
                      title="Chỉnh sửa"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleRemovePaper(pub.id)}
                      className="p-1 text-slate-400 hover:text-rose-600 transition"
                      title="Xóa"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
              {(!profile.publications || profile.publications.length === 0) && (
                <tr>
                  <td colSpan={5} className="text-center py-6 text-xs text-slate-400 italic">
                    Chưa có bài báo hoặc công trình khoa học nào được ghi nhận
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 2. Books & Textbooks */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-amber-50 text-amber-700 rounded-xl">
              <Book className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Sách & Giáo Trình Xuất Bản</h3>
              <p className="text-xs text-slate-500">Giáo trình, sách chuyên khảo và sách tham khảo phục vụ đào tạo</p>
            </div>
          </div>
          <span className="text-xs font-bold px-2.5 py-1 bg-amber-50 text-amber-700 rounded-full">
            {profile.books?.length || 0} cuốn
          </span>
        </div>

        {/* Input Add */}
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-12 gap-2">
          <div className="sm:col-span-4">
            <input
              type="text"
              placeholder="Tên sách, giáo trình"
              name="title"
              value={bookForm.title}
              onChange={handleBookChange}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-amber-600"
            />
          </div>
          <div className="sm:col-span-3">
            <input
              type="text"
              placeholder="Nhà xuất bản"
              name="publisher"
              value={bookForm.publisher}
              onChange={handleBookChange}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-amber-600"
            />
          </div>
          <div className="sm:col-span-2">
            <input
              type="number"
              placeholder="Năm XB"
              name="publication_year"
              value={bookForm.publication_year}
              onChange={handleBookChange}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-amber-600"
            />
          </div>
          <div className="sm:col-span-2">
            <select
              name="role"
              value={bookForm.role}
              onChange={handleBookChange}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-amber-600 bg-white"
            >
              <option value="Chủ biên">Chủ biên</option>
              <option value="Đồng tác giả">Đồng tác giả</option>
              <option value="Tham gia">Tham gia</option>
            </select>
          </div>
          <div className="sm:col-span-1">
            <button
              type="button"
              onClick={handleSaveBook}
              className="w-full py-2 px-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs flex items-center justify-center transition"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Books List */}
        <div className="mt-4 space-y-2">
          {(profile.books || []).map((b) => (
            <div key={b.id} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
              <div>
                <div className="text-xs font-bold text-slate-800">{b.title}</div>
                <div className="text-[11px] text-slate-500 font-medium">
                  {b.publisher} ({b.publication_year || '—'}) • Vai trò: <span className="text-amber-700 font-bold">{b.role}</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => handleRemoveBook(b.id)}
                className="text-slate-400 hover:text-rose-600 p-1 transition"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
          {(!profile.books || profile.books.length === 0) && (
            <div className="text-center py-4 text-xs text-slate-400 italic">Chưa có sách hoặc giáo trình nào</div>
          )}
        </div>
      </div>
    </div>
  );
}


import React, { useState, useMemo } from 'react';
import { generatePhuLucIIIHtml, exportCvToWord, printCvToPdf } from '../../services/cvExportService';
import { X, FileDown, Printer, CheckSquare, Eye } from 'lucide-react';

export default function CvExportModal({ isOpen, onClose, profile }) {
  const [includeBooks, setIncludeBooks] = useState(true);
  const [includeAwards, setIncludeAwards] = useState(true);

  const previewHtml = useMemo(() => {
    if (!profile) return '';
    return generatePhuLucIIIHtml(profile, { includeBooks, includeAwards });
  }, [profile, includeBooks, includeAwards]);

  if (!isOpen) return null;

  const handleExportWord = () => {
    exportCvToWord(profile, { includeBooks, includeAwards });
  };

  const handlePrint = () => {
    printCvToPdf();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[92vh] flex flex-col overflow-hidden border border-slate-200">
        
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 text-blue-700 rounded-xl">
              <Eye className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Xem Trước & Xuất Lý Lịch Khoa Học (Phụ Lục III)
              </h3>
              <p className="text-xs text-slate-500">
                Định dạng chuẩn Thông tư số 09/2017/TT-BGDĐT của Bộ Giáo dục và Đào tạo
              </p>
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

        {/* Modal Controls Bar */}
        <div className="px-6 py-3 bg-slate-100/70 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center space-x-4">
            <label className="flex items-center space-x-2 cursor-pointer font-semibold text-slate-700 select-none">
              <input
                type="checkbox"
                checked={includeBooks}
                onChange={e => setIncludeBooks(e.target.checked)}
                className="w-4 h-4 text-blue-600 rounded border-slate-300"
              />
              <span>Kèm Sách & Giáo trình (Mục V)</span>
            </label>

            <label className="flex items-center space-x-2 cursor-pointer font-semibold text-slate-700 select-none">
              <input
                type="checkbox"
                checked={includeAwards}
                onChange={e => setIncludeAwards(e.target.checked)}
                className="w-4 h-4 text-blue-600 rounded border-slate-300"
              />
              <span>Kèm Giải thưởng KH&CN (Mục VI)</span>
            </label>
          </div>

          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={handleExportWord}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-blue-700 hover:bg-blue-800 shadow-sm transition"
            >
              <FileDown className="w-4 h-4" />
              <span>Tải file Word (.docx)</span>
            </button>

            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 transition"
            >
              <Printer className="w-4 h-4" />
              <span>In ấn / Lưu PDF</span>
            </button>
          </div>
        </div>

        {/* Preview A4 Paper Box */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-8 bg-slate-200/50 flex justify-center">
          <div 
            id="a4CvPrintSection"
            className="w-full max-w-[210mm] min-h-[297mm] bg-white shadow-lg rounded-sm p-6 sm:p-12 text-slate-900 border border-slate-200/80"
            dangerouslySetInnerHTML={{ __html: previewHtml }}
          />
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-200 bg-slate-50 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-200 transition"
          >
            Đóng cửa sổ
          </button>
        </div>

      </div>
    </div>
  );
}

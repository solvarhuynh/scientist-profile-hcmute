import React, { useState } from 'react';
import { parseCvFile } from '../../services/cvImportService';
import { useProfile } from '../../context/ProfileContext';
import { X, Upload, FileText, CheckCircle2, AlertTriangle, ArrowRight } from 'lucide-react';

export default function CvImportModal({ isOpen, onClose }) {
  const { profile, setEntireProfile, showToast } = useProfile();

  const [selectedFile, setSelectedFile] = useState(null);
  const [extractedData, setExtractedData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  if (!isOpen) return null;

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setErrorMsg(null);
      setExtractedData(null);
    }
  };

  const handleStartExtraction = async () => {
    if (!selectedFile) {
      setErrorMsg('Vui lòng chọn một tệp tin .JSON hoặc .DOCX');
      return;
    }

    setLoading(true);
    setErrorMsg(null);

    try {
      const data = await parseCvFile(selectedFile);
      setExtractedData(data);
    } catch (err) {
      setErrorMsg(err.message || 'Lỗi khi trích xuất dữ liệu tệp tin');
    } finally {
      setLoading(false);
    }
  };

  const handleApplyOverwrite = () => {
    if (!extractedData) return;
    setEntireProfile({
      ...profile,
      ...extractedData
    });
    onClose();
  };

  const handleApplyMerge = () => {
    if (!extractedData) return;
    setEntireProfile({
      ...profile,
      ...extractedData,
      degrees: [...(profile.degrees || []), ...(extractedData.degrees || [])],
      foreign_languages: [...(profile.foreign_languages || []), ...(extractedData.foreign_languages || [])],
      work_history: [...(profile.work_history || []), ...(extractedData.work_history || [])],
      research_projects: [...(profile.research_projects || []), ...(extractedData.research_projects || [])],
      publications: [...(profile.publications || []), ...(extractedData.publications || [])],
      books: [...(profile.books || []), ...(extractedData.books || [])],
      awards: [...(profile.awards || []), ...(extractedData.awards || [])]
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden border border-slate-200">
        
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-emerald-100 text-emerald-700 rounded-xl">
              <Upload className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Nhập Dữ Liệu Lý Lịch Khoa Học
              </h3>
              <p className="text-xs text-slate-500">
                Hỗ trợ định dạng tệp tin .JSON (độ chuẩn xác 100%) hoặc .DOCX
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

        {/* Modal Body */}
        <div className="p-6 space-y-5">
          
          {/* File Picker */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Chọn tệp tin dữ liệu:
            </label>
            <div className="border-2 border-dashed border-slate-200 hover:border-blue-400 rounded-2xl p-6 text-center cursor-pointer bg-slate-50 transition">
              <input
                type="file"
                id="filePickerInput"
                accept=".json,.docx"
                onChange={handleFileChange}
                className="hidden"
              />
              <label htmlFor="filePickerInput" className="cursor-pointer">
                <FileText className="w-10 h-10 text-slate-400 mx-auto mb-2" />
                <div className="text-xs font-bold text-slate-800">
                  {selectedFile ? selectedFile.name : 'Nhấp để chọn tệp tin hoặc kéo thả vào đây'}
                </div>
                <div className="text-[11px] text-slate-400 mt-1">
                  Định dạng khuyến nghị: .json (100% cấu trúc đầy đủ) hoặc .docx
                </div>
              </label>
            </div>
          </div>

          {/* Action to extract */}
          {selectedFile && !extractedData && (
            <div className="flex justify-end">
              <button
                type="button"
                onClick={handleStartExtraction}
                disabled={loading}
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm transition disabled:opacity-50 flex items-center gap-2"
              >
                {loading ? 'Đang đọc nội dung tệp...' : 'Bắt đầu trích xuất dữ liệu'}
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Error notice */}
          {errorMsg && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-start gap-2.5">
              <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <div>{errorMsg}</div>
            </div>
          )}

          {/* Extracted Preview Card */}
          {extractedData && (
            <div className="p-4 rounded-xl bg-blue-50/60 border border-blue-200 space-y-3">
              <div className="flex items-center space-x-2 text-xs font-bold text-blue-900">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Trích xuất thành công! Xem trước dữ liệu tìm thấy:</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                <div className="bg-white p-2.5 rounded-lg border border-blue-100">
                  <div className="text-[10px] text-slate-400 uppercase font-bold">Họ và tên</div>
                  <div className="font-bold text-slate-800">{extractedData.full_name || '—'}</div>
                </div>
                <div className="bg-white p-2.5 rounded-lg border border-blue-100">
                  <div className="text-[10px] text-slate-400 uppercase font-bold">Email</div>
                  <div className="font-medium text-slate-700 truncate">{extractedData.email || '—'}</div>
                </div>
                <div className="bg-white p-2.5 rounded-lg border border-blue-100">
                  <div className="text-[10px] text-slate-400 uppercase font-bold">Văn bằng</div>
                  <div className="font-bold text-blue-700">{extractedData.degrees?.length || 0} bằng cấp</div>
                </div>
                <div className="bg-white p-2.5 rounded-lg border border-blue-100">
                  <div className="text-[10px] text-slate-400 uppercase font-bold">Quá trình công tác</div>
                  <div className="font-bold text-slate-800">{extractedData.work_history?.length || 0} mốc</div>
                </div>
                <div className="bg-white p-2.5 rounded-lg border border-blue-100">
                  <div className="text-[10px] text-slate-400 uppercase font-bold">Đề tài NCKH</div>
                  <div className="font-bold text-purple-700">{extractedData.research_projects?.length || 0} đề tài</div>
                </div>
                <div className="bg-white p-2.5 rounded-lg border border-blue-100">
                  <div className="text-[10px] text-slate-400 uppercase font-bold">Bài báo / Công bố</div>
                  <div className="font-bold text-emerald-700">{extractedData.publications?.length || 0} bài báo</div>
                </div>
              </div>

              {/* Merge or Overwrite Actions */}
              <div className="pt-2 flex flex-wrap gap-2 justify-end">
                <button
                  type="button"
                  onClick={handleApplyMerge}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-700 bg-white hover:bg-slate-100 border border-slate-300 transition"
                >
                  Hòa trộn vào hồ sơ hiện tại (Merge)
                </button>
                <button
                  type="button"
                  onClick={handleApplyOverwrite}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-blue-700 hover:bg-blue-800 shadow-sm transition"
                >
                  Ghi đè toàn bộ hồ sơ (Overwrite)
                </button>
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer */}
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

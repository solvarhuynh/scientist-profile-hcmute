// =========================================================================
// CV EXPORT ENGINE (PHỤ LỤC III - THÔNG TƯ 09/2017/TT-BGDĐT)
// Supports: A4 Live Preview, Word (.docx / .doc), PDF Print
// =========================================================================

function openExportModal() {
  var modal = document.getElementById('exportModal');
  if (modal) modal.style.display = 'flex';
  if (typeof renderA4CvPreview === 'function') {
    renderA4CvPreview();
  }
}

function resetExportBtn(btn, originalText) {
  if (btn) {
    btn.innerText = originalText;
    btn.disabled = false;
    btn.classList.remove('opacity-50', 'cursor-not-allowed');
  }
  if (typeof closeModal === 'function') { closeModal('exportModal'); }
}

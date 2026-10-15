// Utility Helpers
function stripVietnameseAccents(str) {
  if (!str) return '';
  return str.normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd').replace(/Đ/g, 'D')
    .toLowerCase();
}

function escapeImportHtml(str) {
  if (str === null || str === undefined) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function cleanImportField(val) {
  if (!val) return '';
  var s = String(val).trim();
  s = s.replace(/^[\:\-\–\—\s\.\,]+/, '').trim();
  s = s.replace(/^[\:\-\–\—\s\.\,]+/, '').trim();
  return s;
}

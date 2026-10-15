const fs = require('fs');
const path = require('path');

const indexHtml = fs.readFileSync(path.join(__dirname, '..', 'Index.html'), 'utf8');

// 1. Extract CSS styles from <style> tags
const styleMatches = indexHtml.match(/<style\b[^>]*>([\s\S]*?)<\/style>/gi) || [];
let mainCss = '';
let printCss = '';
styleMatches.forEach(tag => {
  const content = tag.replace(/<\/?style[^>]*>/gi, '').trim();
  if (content.includes('@media print') || content.includes('@page Section1')) {
    printCss += '\n' + content;
  } else {
    mainCss += '\n' + content;
  }
});
fs.writeFileSync(path.join(__dirname, '..', 'src', 'client', 'styles', 'main.css'), mainCss.trim());
fs.writeFileSync(path.join(__dirname, '..', 'src', 'client', 'styles', 'print-cv.css'), printCss.trim());

// 2. Write utils
const helpersJs = `// Utility Helpers
function stripVietnameseAccents(str) {
  if (!str) return '';
  return str.normalize('NFD')
    .replace(/[\\u0300-\\u036f]/g, '')
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
  s = s.replace(/^[\\:\\-\\–\\—\\s\\.\\,]+/, '').trim();
  s = s.replace(/^[\\:\\-\\–\\—\\s\\.\\,]+/, '').trim();
  return s;
}
`;
fs.writeFileSync(path.join(__dirname, '..', 'src', 'client', 'js', 'utils', 'helpers.js'), helpersJs);

const formattersJs = `// Formatting utilities
function enforcePhone10Digits(el) {
  if (!el) return;
  var raw = el.value.replace(/[^0-9]/g, '');
  if (raw.length > 0 && raw[0] !== '0') {
    raw = '0' + raw;
  }
  el.value = raw.slice(0, 10);
}

function enforceCccd12Digits(el) {
  if (!el) return;
  var raw = el.value.replace(/[^0-9]/g, '');
  el.value = raw.slice(0, 12);
}

function formatDateDMY(dStr) {
  if (!dStr) return '';
  var p = dStr.replace(/[-.]/g, '/').split('/');
  if (p.length >= 3) {
    if (p[0].length === 4) return p[2].padStart(2, '0') + '/' + p[1].padStart(2, '0') + '/' + p[0];
    return p[0].padStart(2, '0') + '/' + p[1].padStart(2, '0') + '/' + p[2];
  }
  return dStr;
}
`;
fs.writeFileSync(path.join(__dirname, '..', 'src', 'client', 'js', 'utils', 'formatters.js'), formattersJs);

// 3. Write state.js
const stateJs = `// Central Application State
var appData = {
  basicInfo: {
    name: "", dob: "", genderNam: true, genderNu: false,
    noiSinh: "", queQuan: "", danToc: "Kinh", chucVu: "", donVi: "",
    diaChi: "", cq: "", nr: "", dd: "", fax: "", email: "",
    soCCCD: "", ngayCap: "", noiCap: ""
  },
  daotao: {
    hocVi: [], hocHam: [], ngoaiNgu: []
  },
  daoTao: {
    hocVi: [], hocHam: [], ngoaiNgu: []
  },
  congTac: [],
  deTai: [],
  congBo: {
    baiBao: [], seminar: [], sach: []
  },
  giaiThuong: {
    khcn: [], chuyenGiao: []
  },
  bosung: {
    prefs: {
      thinhGiang: false, nghienCuu: false, hoiDong: false, huongDan: false, doanhNghiep: false
    },
    monHoc: [],
    huongNghienCuu: []
  }
};

window.currentActiveRole = 'user';
window.activeExportCandidate = null;
window.globalAdminData = null;
window.parsedImportDataCache = null;
`;
fs.writeFileSync(path.join(__dirname, '..', 'src', 'client', 'js', 'state.js'), stateJs);

console.log('Client base modules created successfully!');

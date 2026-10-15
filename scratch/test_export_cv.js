const fs = require('fs');
const vm = require('vm');

const html = fs.readFileSync('Index.html', 'utf8');

// 1. Verify that 'Mẫu Chuẩn Khổ Giấy A4' is gone from exportModal
if (html.includes('Bản Xem Trước Lý Lịch Khoa Học (Mẫu Chuẩn Khổ Giấy A4)')) {
  throw new Error('Title still contains (Mẫu Chuẩn Khổ Giấy A4)!');
}
if (!html.includes('<span>Bản Xem Trước Lý Lịch Khoa Học</span>')) {
  throw new Error('Missing new compact title: <span>Bản Xem Trước Lý Lịch Khoa Học</span>');
}

// 2. Setup DOM simulation to test renderA4CvPreview() logic
const domElements = {
  a4CvContent: { innerHTML: '' },
  nameInput: { value: 'NGUYỄN VĂN AN' },
  genderNu: { checked: false },
  genderNam: { checked: true },
  dobInput: { value: '15/10/1980' },
  noiSinhInput: { value: 'TP. Hồ Chí Minh' },
  queQuanInput: { value: 'TP. Hồ Chí Minh' },
  danTocInput: { value: 'Kinh' },
  chucVuInput: { value: 'Phó Trưởng Khoa, Giảng viên chính' },
  donViInput: { value: 'Trường Đại học Sư phạm Kỹ thuật TP.HCM' },
  diaChiInput: { value: 'Số 1 Võ Văn Ngân, TP. Thủ Đức' },
  cqInput: { value: '028.38968641' },
  ddInput: { value: '0901234567' },
  emailInput: { value: 'an.nguyen@hcmute.edu.vn' },
  exportOptionBooks: { checked: false },
  exportOptionAwards: { checked: false }
};

const appData = {
  basicInfo: { name: 'NGUYỄN VĂN AN' },
  daotao: {
    hocVi: [
      { hocVi: 'Đại học', bacHoc: 'Kỹ sư', nganh: 'Công nghệ Thông tin', noiDaoTao: 'Trường ĐH Sư phạm Kỹ thuật TP.HCM', nam: 2002, nuoc: 'Việt Nam' },
      { hocVi: 'Sau đại học', bacHoc: 'Thạc sĩ', nganh: 'Khoa học Máy tính', noiDaoTao: 'ĐH Bách Khoa TP.HCM', nam: 2007, nuoc: 'Việt Nam' },
      { hocVi: 'Sau đại học', bacHoc: 'Tiến sĩ', nganh: 'Khoa học Máy tính', noiDaoTao: 'ĐH Tokyo', nam: 2014, nuoc: 'Nhật Bản' }
    ],
    hocHam: [
      { chucDanh: 'Phó Giáo sư', nganh: 'Công nghệ Thông tin', nam: 2020 }
    ],
    ngoaiNgu: [
      { ngonNgu: 'Tiếng Anh', mucDo: 'Thành thạo (C1)' }
    ]
  },
  congTac: [
    { thoiGian: '2002 - 2007', donVi: 'Khoa CNTT - ĐH SPKT TP.HCM', chucVu: 'Giảng viên' },
    { thoiGian: '2014 - Nay', donVi: 'Khoa CNTT - ĐH SPKT TP.HCM', chucVu: 'Giảng viên chính' }
  ],
  deTai: [
    { ten: 'Nghiên cứu Deep Learning', capDeTai: 'Cấp bộ', batDau: '2022', nghiemThu: '2023', chucVu: 'Chủ nhiệm' }
  ],
  congBo: {
    baiBao: [
      { tenBaiBao: 'Deep Neural Network Optimization', namXuatBan: '2023', tapChi: 'IEEE Access' }
    ],
    sach: [
      { tenSach: 'Giáo trình Kỹ thuật Lập trình Nâng cao', nhaXuatBan: 'NXB ĐHQG', namXuatBan: '2021', vaiTro: 'Chủ biên' }
    ]
  },
  giaiThuong: [
    { ten: 'Giải thưởng VIFOTEC', coQuan: 'Bộ KH&CN', nam: '2022' }
  ]
};

// Extract JS code from Index.html
const scriptMatch = html.match(/<script\b[^>]*>([\s\S]*?)<\/script>/gi);
const fullJs = scriptMatch ? scriptMatch.map(s => s.replace(/<\/?script\b[^>]*>/gi, '')).join('\n') : '';

const sandbox = {
  document: {
    getElementById: (id) => domElements[id] || null,
    querySelector: () => null,
    querySelectorAll: () => [],
    createElement: () => ({ setAttribute: () => {}, appendChild: () => {}, style: {} }),
    body: { appendChild: () => {}, removeChild: () => {} },
    addEventListener: () => {}
  },
  window: {
    addEventListener: () => {}
  },
  sessionStorage: {
    getItem: () => null,
    setItem: () => {}
  },
  localStorage: {
    getItem: () => null,
    setItem: () => {}
  },
  appData: appData,
  console: console,
  URL: { createObjectURL: () => 'blob:test', revokeObjectURL: () => {} },
  Blob: function() {}
};

vm.createContext(sandbox);
vm.runInContext(fullJs, sandbox);

// TEST 1: Default (Neither Books nor Awards checked)
domElements.exportOptionBooks.checked = false;
domElements.exportOptionAwards.checked = false;
sandbox.renderA4CvPreview();
let output1 = domElements.a4CvContent.innerHTML;

if (!output1.includes('Phụ lục III') || !output1.includes('09/2017/TT-BGDĐT')) {
  throw new Error('Test 1 failed: Missing Phụ lục III header!');
}
if (!output1.includes('I. LÝ LỊCH SƠ LƯỢC') || !output1.includes('II. QUÁ TRÌNH ĐÀO TẠO') || !output1.includes('III. QUÁ TRÌNH CÔNG TÁC CHUYÊN MÔN') || !output1.includes('IV. QUÁ TRÌNH NGHIÊN CỨU KHOA HỌC')) {
  throw new Error('Test 1 failed: Missing main sections I-IV!');
}
if (output1.includes('V. SÁCH') || output1.includes('V. GIẢI THƯỞNG') || output1.includes('VI.')) {
  throw new Error('Test 1 failed: Should NOT have section V or VI when neither is checked!');
}
console.log('✓ TEST 1 PASSED: Default standard export has sections I, II, III, IV and no V/VI.');

// TEST 2: Only Books checked -> Part V: Sách
domElements.exportOptionBooks.checked = true;
domElements.exportOptionAwards.checked = false;
sandbox.renderA4CvPreview();
let output2 = domElements.a4CvContent.innerHTML;

if (!output2.includes('V. SÁCH VÀ GIÁO TRÌNH XUẤT BẢN')) {
  throw new Error('Test 2 failed: Missing V. SÁCH VÀ GIÁO TRÌNH XUẤT BẢN!');
}
if (output2.includes('VI.')) {
  throw new Error('Test 2 failed: Should not have section VI when only books is checked!');
}
console.log('✓ TEST 2 PASSED: Books checked -> Section V is Sách, no VI.');

// TEST 3: Only Awards checked -> Part V: Giải thưởng (user requirement)
domElements.exportOptionBooks.checked = false;
domElements.exportOptionAwards.checked = true;
sandbox.renderA4CvPreview();
let output3 = domElements.a4CvContent.innerHTML;

if (!output3.includes('V. GIẢI THƯỞNG KHOA HỌC VÀ CÔNG NGHỆ')) {
  throw new Error('Test 3 failed: Missing V. GIẢI THƯỞNG KHOA HỌC VÀ CÔNG NGHỆ!');
}
if (output3.includes('SÁCH VÀ GIÁO TRÌNH') || output3.includes('VI.')) {
  throw new Error('Test 3 failed: Should not have section VI or Sách when only awards is checked!');
}
console.log('✓ TEST 3 PASSED: Only Awards checked -> Section V is Giải thưởng, no Sách and no VI.');

// TEST 4: Both Books and Awards checked -> V: Sách, VI: Giải thưởng
domElements.exportOptionBooks.checked = true;
domElements.exportOptionAwards.checked = true;
sandbox.renderA4CvPreview();
let output4 = domElements.a4CvContent.innerHTML;

if (!output4.includes('V. SÁCH VÀ GIÁO TRÌNH XUẤT BẢN')) {
  throw new Error('Test 4 failed: Missing V. SÁCH VÀ GIÁO TRÌNH XUẤT BẢN!');
}
if (!output4.includes('VI. GIẢI THƯỞNG KHOA HỌC VÀ CÔNG NGHỆ')) {
  throw new Error('Test 4 failed: Missing VI. GIẢI THƯỞNG KHOA HỌC VÀ CÔNG NGHỆ!');
}
console.log('✓ TEST 4 PASSED: Both checked -> Section V is Sách, Section VI is Giải thưởng.');

console.log('\nALL 4 CV EXPORT TESTS PASSED PERFECTLY!');


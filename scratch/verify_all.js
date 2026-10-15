const fs = require('fs');
const vm = require('vm');
const assert = require('assert');

console.log('--- 1. CHECK CODE.GS SYNTAX ---');
const codeGs = fs.readFileSync('d:\\khanh\\Code.gs', 'utf8');
try {
  new vm.Script(codeGs);
  console.log('Code.gs syntax is VALID!');
} catch (e) {
  console.error('Code.gs syntax error:', e);
  process.exit(1);
}

console.log('\n--- 2. CHECK INDEX.HTML SCRIPT SYNTAX ---');
const indexHtml = fs.readFileSync('d:\\khanh\\Index.html', 'utf8');
const scriptMatches = indexHtml.match(/<script[\s\S]*?>([\s\S]*?)<\/script>/gi);
console.log('Found script tags:', scriptMatches ? scriptMatches.length : 0);

if (scriptMatches) {
  scriptMatches.forEach((tag, idx) => {
    // Strip tag
    const code = tag.replace(/<script[\s\S]*?>/i, '').replace(/<\/script>/i, '');
    try {
      new vm.Script(code);
      console.log(`Script tag #${idx + 1} syntax is VALID! (${code.length} chars)`);
    } catch (e) {
      console.error(`Script tag #${idx + 1} syntax error:`, e);
      process.exit(1);
    }
  });
}

console.log('\n--- 3. VERIFY HERO GREETING AND OVERVIEW CARD LOGIC ---');
// Extract functions from Index.html
const sandbox = {
  document: {
    getElementById: function(id) {
      if (!this._elements[id]) {
        this._elements[id] = {
          id: id,
          innerText: '',
          value: '',
          checked: false,
          style: {},
          classList: {
            contains: () => false,
            add: () => {},
            remove: () => {}
          }
        };
      }
      return this._elements[id];
    },
    querySelectorAll: function() { return []; },
    addEventListener: function() {},
    _elements: {}
  },
  sessionStorage: {
    getItem: (k) => '24133903@student.hcmute.edu.vn',
    setItem: () => {}
  },
  localStorage: {
    getItem: () => null,
    setItem: () => {}
  },
  console: console,
  setTimeout: setTimeout,
  window: {
    addEventListener: function() {}
  },
  appData: {
    basicInfo: {},
    bosung: { monHoc: [], huongNghienCuu: [], prefs: {} },
    daotao: { hocVi: [], hocHam: [], ngoaiNgu: [] },
    daoTao: { hocVi: [], hocHam: [], ngoaiNgu: [] },
    congTac: [],
    deTai: [],
    congBo: { baiBao: [], seminar: [], sach: [] },
  },
  addEventListener: function() {}
};
sandbox.window = sandbox;

// Run the script code in sandbox
const mainScript = scriptMatches[scriptMatches.length - 1]
  .replace(/<script[\s\S]*?>/i, '')
  .replace(/<\/script>/i, '');

// Test data simulating Google Sheet row
const serverData = {
  basicInfo: {
    email: '24133903@student.hcmute.edu.vn',
    name: 'Huỳnh Trung Nghĩa',
    gioiTinh: 'Nam',
    genderNam: true,
    genderNu: false,
    dob: '14/04/2004',
    noiSinh: 'TP. Hồ Chí Minh',
    queQuan: 'TP. Hồ Chí Minh',
    danToc: 'Kinh',
    chucVu: 'Giảng viên',
    donVi: 'Khoa Điện - Điện tử',
    diaChi: '1 Võ Văn Ngân, Linh Chiểu, Thủ Đức',
    cq: '0281234567',
    nr: '',
    dd: '0909999999',
    fax: '',
    cccd: '079204001234',
    ngayCap: '15/05/2021',
    noiCap: 'Cục Cảnh sát QLHC',
    trangThai: 'Bản nháp',
    khoa: 'Khoa Điện - Điện tử',
    boMon: 'Bộ môn Tự động hóa',
    donViKhoa: 'Khoa Điện - Điện tử',
    donViBoMon: 'Bộ môn Tự động hóa'
  },
  bosung: {
    prefs: { thinhGiang: true, nghienCuu: true, hoiDong: false, huongDan: true, doanhNghiep: false },
    monHoc: [{ major: 'Điện', name: 'Vi điều khiển', desc: 'Dạy thực hành' }],
    huongNghienCuu: []
  },
  daotao: {
    hocVi: [{ hocVi: 'Thạc sĩ', nganh: 'Điều khiển', noi: 'ĐH Bách Khoa', nam: '2022' }],
    hocHam: [],
    ngoaiNgu: []
  },
  congTac: [
    { tu: '09-2022', denLoai: 'HienTai', denNgay: '', noi: 'HCMUTE', chucDanh: 'Giảng viên', moTa: 'Công tác' }
  ],
  deTai: [
    { ten: 'Hệ thống IoT', batDau: '2023-01-01', nghiemThu: '2023-12-31', cap: 'Trường', xepHang: 'Tốt', chucVu: 'Chủ nhiệm', kinhPhi: '50tr', donVi: 'VND' }
  ],
  congBo: {
    baiBao: [{ ten: 'Paper 1', tacGia: 'Huỳnh Trung Nghĩa', thang: '10', nam: '2023', tapChi: 'IEEE', chiSo: 'Q1', filePdf: 'https://pdf-link' }],
    seminar: [],
    sach: []
  },
  giaiThuong: {
    khcn: [{ ten: 'Giải VIFOTEC', noi: 'Hà Nội', nam: '2023', noiDung: 'Giải Nhất' }],
    chuyenGiao: []
  }
};

vm.createContext(sandbox);

// Execute sandbox
vm.runInContext(mainScript, sandbox);

// Simulate data loading from sheet
sandbox.appData.basicInfo = Object.assign(sandbox.appData.basicInfo || {}, serverData.basicInfo);
sandbox.appData.bosung = serverData.bosung;
sandbox.appData.daotao = serverData.daotao;
sandbox.appData.daoTao = serverData.daotao;
sandbox.appData.congTac = serverData.congTac;
sandbox.appData.deTai = serverData.deTai;
sandbox.appData.congBo = serverData.congBo;
sandbox.appData.giaiThuong = serverData.giaiThuong;

sandbox.populateBasicInfo();
sandbox.updateWelcomeMessage();
sandbox.renderUserOverview();

const heroHonorific = sandbox.document.getElementById('userHeroGreetingHonorific').innerText;
const heroName = sandbox.document.getElementById('userHeroName').innerText;
const overviewName = sandbox.document.getElementById('userOverviewName').innerText;
const overviewAvatar = sandbox.document.getElementById('userOverviewAvatar').innerText;
const overviewDegree = sandbox.document.getElementById('userOverviewHighestDegree').innerText;
const overviewDept = sandbox.document.getElementById('userOverviewDept').innerText;
const overviewPhone = sandbox.document.getElementById('userOverviewPhone').innerText;
const nameInputVal = sandbox.document.getElementById('nameInput').value;

console.log('userHeroGreetingHonorific:', heroHonorific);
console.log('userHeroName:', heroName);
console.log('Full Greeting:', `Xin chào, ${heroHonorific}${heroName} !`);
console.log('userOverviewName:', overviewName);
console.log('userOverviewAvatar:', overviewAvatar);
console.log('userOverviewHighestDegree:', overviewDegree);
console.log('userOverviewDept:', overviewDept);
console.log('userOverviewPhone:', overviewPhone);
console.log('nameInput value:', nameInputVal);

assert.strictEqual(heroHonorific, 'Thầy');
assert.strictEqual(heroName, ' Huỳnh Trung Nghĩa');
assert.strictEqual(`Xin chào, ${heroHonorific}${heroName} !`, 'Xin chào, Thầy Huỳnh Trung Nghĩa !');
assert.strictEqual(overviewName, 'HUỲNH TRUNG NGHĨA');
assert.strictEqual(overviewAvatar, 'N');
assert.strictEqual(overviewDegree, 'Thạc sĩ');
assert.strictEqual(overviewDept, 'Khoa Điện - Điện tử');
assert.strictEqual(overviewPhone, '0909999999');
assert.strictEqual(nameInputVal, 'Huỳnh Trung Nghĩa');

console.log('\n========================================');
console.log('>>> ALL VERIFICATION TESTS PASSED 100%! <<<');
console.log('========================================');

const fs = require('fs');
const path = require('path');

const indexPath = path.join(__dirname, '..', 'Index.html');
const content = fs.readFileSync(indexPath, 'utf8');

console.log('=== VERIFYING ADMIN CANDIDATES & ADD ADMIN FEATURES ===');

// 1. Check for 5 preference pills in HTML
const requiredPills = [
  'id="catBtn_all"',
  'id="catBtn_thinhGiang"',
  'id="catBtn_nghienCuu"',
  'id="catBtn_hoiDong"',
  'id="catBtn_doanhNghiep"',
  'id="catBtn_huongDan"'
];

let allPillsFound = true;
requiredPills.forEach(pill => {
  if (content.includes(pill)) {
    console.log(`[PASS] Found pill: ${pill}`);
  } else {
    console.error(`[FAIL] Missing pill: ${pill}`);
    allPillsFound = false;
  }
});

// 2. Check that candidateFacultyFilter is removed
if (!content.includes('id="candidateFacultyFilter"')) {
  console.log('[PASS] candidateFacultyFilter has been removed from candidate view.');
} else {
  console.error('[FAIL] candidateFacultyFilter is still present!');
}

// 3. Check for wine red color theme in candidate view
if (content.includes('bg-[#7a1228]') && content.includes('border-rose-200')) {
  console.log('[PASS] Wine red / burgundy theme (#7a1228 / rose) is applied.');
} else {
  console.error('[FAIL] Wine red theme not found!');
}

// 4. Check for Thêm Admin button in admin sidebar (header button removed as requested by user)
if (content.includes('id="admin-menu-them-admin"') && content.includes('openAddAdminModal()')) {
  console.log('[PASS] Found "Phân quyền Admin" in admin sidebar.');
} else {
  console.error('[FAIL] Missing admin-menu-them-admin in sidebar!');
}

if (!content.includes('id="adminHeaderActionGroup"')) {
  console.log('[PASS] Confirmed redundant "+ Thêm Admin" button is removed from header.');
} else {
  console.error('[FAIL] adminHeaderActionGroup still found in header!');
}

// 5. Check viewCandidateCv implementation
if (content.includes('function viewCandidateCv(') && content.includes('window.activeExportCandidate')) {
  console.log('[PASS] viewCandidateCv and window.activeExportCandidate implemented.');
} else {
  console.error('[FAIL] Missing viewCandidateCv or window.activeExportCandidate!');
}

// 6. Test JS logic execution by extracting scripts
console.log('\n=== TESTING SCRIPT PARSING VIA NODE ===');
const vm = require('vm');
const scriptMatches = content.match(/<script[\s\S]*?<\/script>/gi);

// Extract the main JS code
let mainJs = '';
scriptMatches.forEach(tag => {
  if (!tag.includes('src=')) {
    const code = tag.replace(/<\/?script[^>]*>/gi, '');
    mainJs += '\n' + code;
  }
});

const sandbox = {
  window: {
    addEventListener: () => {},
    innerWidth: 1200
  },
  document: {
    getElementById: () => null,
    querySelectorAll: () => [],
    addEventListener: () => {}
  },
  localStorage: {
    getItem: () => null,
    setItem: () => {}
  },
  sessionStorage: {
    getItem: () => null,
    setItem: () => {}
  },
  console: console,
  appData: {
    basicInfo: {},
    bosung: { monHoc: [], huongNghienCuu: [], prefs: {} },
    daotao: { hocVi: [], hocHam: [], ngoaiNgu: [] },
    congTac: [],
    deTai: [],
    congBo: { baiBao: [], sach: [] },
    giaiThuong: { khcn: [], chuyenGiao: [] }
  },
  stripVietnameseAccents: (s) => s ? s.toLowerCase() : '',
  escapeImportHtml: (s) => s || ''
};
sandbox.window = sandbox;
sandbox.addEventListener = () => {};
sandbox.innerWidth = 1200;

try {
  vm.createContext(sandbox);
  // Execute dummy script to verify function definitions
  vm.runInContext(`
    ${mainJs}
  `, sandbox);
  console.log('[PASS] All JavaScript code parsed and executed successfully without syntax errors!');
  
  // Test candidate prefs
  const uTest = { email: "hung.nq@hcmute.edu.vn", name: "GS. TS. Nguyễn Quang Hùng" };
  const prefs = sandbox.getCandidatePrefs(uTest);
  console.log('[PASS] getCandidatePrefs for hung.nq@hcmute.edu.vn:', prefs);
  
  if (prefs.thinhGiang === true && prefs.nghienCuu === true) {
    console.log('[PASS] Preference matching verified!');
  }
} catch (e) {
  console.error('[FAIL] Script error:', e);
}

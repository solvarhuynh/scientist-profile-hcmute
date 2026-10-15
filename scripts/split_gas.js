const fs = require('fs');
const path = require('path');

const code = fs.readFileSync(path.join(__dirname, '..', 'Code.gs'), 'utf8');
const lines = code.split('\n');

// 1. Main.gs (lines 1 to 46)
const mainLines = lines.slice(0, 46).join('\n');
fs.writeFileSync(path.join(__dirname, '..', 'src', 'server', 'gas', 'Main.gs'), mainLines);

// 2. Auth.gs (lines 47 to 243)
const authLines = lines.slice(46, 243).join('\n');
fs.writeFileSync(path.join(__dirname, '..', 'src', 'server', 'gas', 'Auth.gs'), authLines);

// 3. Database.gs (lines 244 to 651 + lines 861 to 940)
const dbLinesPart1 = lines.slice(243, 651).join('\n');
const dbLinesPart2 = lines.slice(860, 940).join('\n');
fs.writeFileSync(path.join(__dirname, '..', 'src', 'server', 'gas', 'Database.gs'), dbLinesPart1 + '\n\n' + dbLinesPart2);

// 4. Candidates.gs (lines 652 to 860 + lines 941 to 1280)
const candLinesPart1 = lines.slice(651, 860).join('\n');
const candLinesPart2 = lines.slice(940).join('\n');
fs.writeFileSync(path.join(__dirname, '..', 'src', 'server', 'gas', 'Candidates.gs'), candLinesPart1 + '\n\n' + candLinesPart2);

// 5. Config.gs
const configContent = `// =========================================================================
// CONFIGURATION & DATABASE CONSTANTS
// =========================================================================

var CONFIG = {
  APP_NAME: 'Scientist Profile HCMUTE',
  APP_VERSION: '2.0.0',
  DEFAULT_TIMEZONE: 'GMT+7',
  MAX_FILE_SIZE_MB: 20,
  SHEETS: {
    BASIC_INFO: 'ThongTinCoBan',
    EXTRA_INFO: 'ThongTinBoSung',
    EDUCATION: 'QuaTrinhDaoTao',
    WORK_HISTORY: 'QuaTrinhCongTac',
    PROJECTS: 'DeTaiThamGia',
    PUBLICATIONS: 'CongBoKhoaHoc',
    AWARDS: 'GiaiThuong',
    ADMINS: 'Admins'
  },
  CATEGORIES: {
    THINH_GIANG: 'thinhGiang',
    NGHIEN_CUU: 'nghienCuu',
    HOI_DONG: 'hoiDong',
    DOANH_NGHIEP: 'doanhNghiep',
    HUONG_DAN: 'huongDan'
  }
};
`;
fs.writeFileSync(path.join(__dirname, '..', 'src', 'server', 'gas', 'Config.gs'), configContent);

console.log('GAS files modularized successfully!');

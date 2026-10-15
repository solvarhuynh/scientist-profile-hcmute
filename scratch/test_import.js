const fs = require('fs');

const html = fs.readFileSync('Index.html', 'utf8');

const keys = ['CoBan', 'DaoTao', 'CongTac', 'DeTai', 'CongBo', 'Sach', 'GiaiThuong'];

for (const k of keys) {
  if (!html.includes(`id="importDetail${k}"`)) {
    throw new Error(`Missing detail container: importDetail${k}`);
  }
  if (!html.includes(`toggleImportDetail('${k}'`)) {
    throw new Error(`Missing toggle button: toggleImportDetail('${k}')`);
  }
  if (!html.includes(`renderImportDetail${k}`)) {
    throw new Error(`Missing renderer: renderImportDetail${k}`);
  }
}

console.log('ALL CHECKS PASSED: 7/7 sections have toggle buttons, detail containers, and renderers!');


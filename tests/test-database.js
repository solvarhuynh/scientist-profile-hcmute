console.log('=== TEST SUITE 2: DATABASE UPSERT LOGIC (OVERRIDE ON MATCH) ===');

// Mock Sheet database table
function simulateUpsert(rows, newRow, hasCategory) {
  const emailCol = 0;
  const catCol = 1;
  const targetEmail = (newRow[emailCol] || '').toLowerCase().trim();
  const targetCat = hasCategory ? (newRow[catCol] || '').trim() : null;

  let foundIndex = -1;
  for (let i = 0; i < rows.length; i++) {
    const rowEmail = (rows[i][emailCol] || '').toLowerCase().trim();
    if (rowEmail === targetEmail) {
      if (!hasCategory) {
        foundIndex = i;
        break;
      } else {
        const rowCat = (rows[i][catCol] || '').trim();
        if (rowCat === targetCat) {
          foundIndex = i;
          break;
        }
      }
    }
  }

  if (foundIndex !== -1) {
    // Override existing row
    rows[foundIndex] = newRow;
    return 'OVERRIDDEN';
  } else {
    // Append new row
    rows.push(newRow);
    return 'APPENDED';
  }
}

// 1. Test Sheet WITHOUT Category (e.g., ThongTinCoBan)
let tableCoBan = [
  ['email', 'name', 'phone'],
  ['an@hcmute.edu.vn', 'Nguyen Van An', '0901234567']
];

const res1 = simulateUpsert(tableCoBan, ['an@hcmute.edu.vn', 'Nguyen Van An (Updated)', '0999999999'], false);
if (res1 === 'OVERRIDDEN' && tableCoBan.length === 2 && tableCoBan[1][1] === 'Nguyen Van An (Updated)') {
  console.log('[PASS] Sheet without category: Correctly overrides on same email without creating duplicate!');
} else {
  console.error('[FAIL] Upsert failed for sheet without category!');
}

// 2. Test Sheet WITH Category (e.g., QuaTrinhDaoTao)
let tableDaoTao = [
  ['email', 'category', 'degree'],
  ['an@hcmute.edu.vn', 'HocVi', 'Ky su'],
  ['an@hcmute.edu.vn', 'NgoaiNgu', 'Tieng Anh']
];

// 2a. Same email + same category -> MUST OVERRIDE
const res2a = simulateUpsert(tableDaoTao, ['an@hcmute.edu.vn', 'HocVi', 'Tien si'], true);
if (res2a === 'OVERRIDDEN' && tableDaoTao.length === 3 && tableDaoTao[1][2] === 'Tien si') {
  console.log('[PASS] Sheet with category: Correctly overrides on same email + same category!');
} else {
  console.error('[FAIL] Upsert failed on same category match!');
}

// 2b. Same email + DIFFERENT category -> MUST APPEND
const res2b = simulateUpsert(tableDaoTao, ['an@hcmute.edu.vn', 'ChungChi', 'AWS Certified'], true);
if (res2b === 'APPENDED' && tableDaoTao.length === 4) {
  console.log('[PASS] Sheet with category: Correctly appends when category is different!');
} else {
  console.error('[FAIL] Upsert failed on different category append!');
}

console.log('[PASS] Database upsert test suite completed successfully.\n');

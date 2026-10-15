const { execSync } = require('child_process');
const path = require('path');

console.log('================================================================');
console.log('🧪 RUNNING ALL AUTOMATED INTEGRATION & UNIT TESTS');
console.log('================================================================\n');

try {
  require('./test-import.js');
  require('./test-database.js');
  console.log('================================================================');
  console.log('🎉 ALL TESTS PASSED SUCCESSFULLY (100% GREEN)!');
  console.log('================================================================\n');
} catch (err) {
  console.error('\n❌ TEST RUNNER ERROR:', err.message);
  process.exit(1);
}

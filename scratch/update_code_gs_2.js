const fs = require('fs');
let c = fs.readFileSync('d:\\khanh\\Code.gs', 'utf8');
c = c.replace(
  'if (currentData[i - 1][0] === email)',
  'if (String(currentData[i - 1][0] || "").trim().toLowerCase() === String(email || "").trim().toLowerCase())'
);
fs.writeFileSync('d:\\khanh\\Code.gs', c, 'utf8');
console.log('Done 2');


/**
 * Build and Verification Script for HCMUTE Scientific CV Portal
 * Validates modular source files and ensures production compatibility with Google Apps Script.
 * Run: npm run build or node scripts/build.js
 */

const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ROOT_DIR = path.join(__dirname, '..');
const GAS_DIR = path.join(ROOT_DIR, 'src', 'server', 'gas');
const CLIENT_DIR = path.join(ROOT_DIR, 'src', 'client');

console.log('--- 1. VERIFYING MODULAR SERVER FILES (src/server/gas) ---');
let serverErrors = 0;
const gasFiles = ['Main.gs', 'Auth.gs', 'Database.gs', 'Candidates.gs', 'Config.gs'];
gasFiles.forEach(file => {
  const filePath = path.join(GAS_DIR, file);
  if (!fs.existsSync(filePath)) {
    console.warn(`[WARN] Missing ${file}`);
    return;
  }
  const content = fs.readFileSync(filePath, 'utf8');
  try {
    new vm.Script(content);
    const lineCount = content.split('\n').length;
    console.log(`[PASS] ${file.padEnd(16)} Syntax OK (${lineCount} lines)`);
  } catch (err) {
    console.error(`[FAIL] ${file} Syntax Error: ${err.message}`);
    serverErrors++;
  }
});

console.log('\n--- 2. VERIFYING CLIENT SCRIPTS (src/client/js) ---');
let clientErrors = 0;
function verifyJsRecursive(dir) {
  if (!fs.existsSync(dir)) return;
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      verifyJsRecursive(fullPath);
    } else if (entry.name.endsWith('.js')) {
      const content = fs.readFileSync(fullPath, 'utf8');
      try {
        new vm.Script(content);
        console.log(`[PASS] ${entry.name.padEnd(20)} Syntax OK`);
      } catch (err) {
        console.error(`[FAIL] ${entry.name} Syntax Error: ${err.message}`);
        clientErrors++;
      }
    }
  }
}
verifyJsRecursive(path.join(CLIENT_DIR, 'js'));

console.log('\n--- 3. VERIFYING PRODUCTION GAS ENTRYPOINTS ---');
const prodCodeGs = path.join(ROOT_DIR, 'Code.gs');
if (fs.existsSync(prodCodeGs)) {
  try {
    const code = fs.readFileSync(prodCodeGs, 'utf8');
    new vm.Script(code);
    console.log(`[PASS] Code.gs           Production Syntax OK (${(code.length / 1024).toFixed(1)} KB)`);
  } catch (e) {
    console.error(`[FAIL] Code.gs Syntax Error: ${e.message}`);
    serverErrors++;
  }
}

const prodIndexHtml = path.join(ROOT_DIR, 'Index.html');
if (fs.existsSync(prodIndexHtml)) {
  const html = fs.readFileSync(prodIndexHtml, 'utf8');
  const scriptRegex = /<script\b[^>]*>([\s\S]*?)<\/script>/gi;
  let match;
  let sIdx = 0;
  let htmlOk = true;
  while ((match = scriptRegex.exec(html)) !== null) {
    sIdx++;
    const sBody = match[1];
    if (!sBody || sBody.trim().length === 0) continue;
    try {
      new vm.Script(sBody);
    } catch (e) {
      console.error(`[FAIL] Index.html Script Block #${sIdx}: ${e.message}`);
      htmlOk = false;
      clientErrors++;
    }
  }
  if (htmlOk) {
    console.log(`[PASS] Index.html        All embedded script blocks valid (${(html.length / 1024).toFixed(1)} KB)`);
  }
}

console.log('\n================================================================');
if (serverErrors === 0 && clientErrors === 0) {
  console.log('✅ [BUILD SUCCESS] All modular and production files verified 100%!');
} else {
  console.error(`❌ [BUILD FAILED] Found ${serverErrors} server error(s) and ${clientErrors} client error(s).`);
  process.exit(1);
}
console.log('================================================================\n');

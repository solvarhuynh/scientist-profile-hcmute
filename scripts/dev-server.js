/**
 * Local Development Server for HCMUTE Scientific CV Portal
 * Zero external dependencies (uses standard Node.js http, fs, path).
 * Run: node scripts/dev-server.js
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const PORT = process.env.PORT || 3000;
const ROOT_DIR = path.join(__dirname, '..');
const MOCK_DB_PATH = path.join(ROOT_DIR, 'src', 'server', 'node', 'mock-db.json');

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.pdf': 'application/pdf',
  '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
};

function getMockDb() {
  try {
    if (fs.existsSync(MOCK_DB_PATH)) {
      return JSON.parse(fs.readFileSync(MOCK_DB_PATH, 'utf8'));
    }
  } catch (e) {
    console.error('Error reading mock db:', e);
  }
  return { candidates: [], stats: {}, admins: [] };
}

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;

  // CORS Headers for API
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  // --- API MOCK ENDPOINTS ---
  if (pathname === '/api/verifyLogin' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      try {
        const data = JSON.parse(body || '{}');
        const email = (data.email || '').trim().toLowerCase();
        const role = data.role || 'user';
        const db = getMockDb();
        const isAdmin = db.admins.some(a => a.email.toLowerCase() === email) || email.includes('admin') || email.includes('an');

        if (role === 'admin' && !isAdmin) {
          res.writeHead(403, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({
            success: false,
            error: 'Từ chối truy cập: Tài khoản không có quyền Quản trị viên!'
          }));
          return;
        }

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          success: true,
          email: email,
          role: isAdmin ? 'admin' : 'user',
          isAdmin: isAdmin
        }));
      } catch (err) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, error: err.message }));
      }
    });
    return;
  }

  if (pathname === '/api/admin/dashboard' && req.method === 'GET') {
    const db = getMockDb();
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(db));
    return;
  }

  if (pathname === '/api/syncAllData' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        success: true,
        msg: 'Đã lưu dữ liệu thành công (Local Dev Mock Server)'
      }));
    });
    return;
  }

  // --- STATIC FILE SERVING ---
  let filePath = path.join(ROOT_DIR, pathname === '/' ? 'Index.html' : pathname);

  // If requesting login
  if (pathname === '/login' || pathname === '/login.html') {
    filePath = path.join(ROOT_DIR, 'Login.html');
  }

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      // Fallback to Index.html for SPA-like experience
      filePath = path.join(ROOT_DIR, 'Index.html');
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    fs.readFile(filePath, (readErr, content) => {
      if (readErr) {
        res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
        res.end('Server Error: ' + readErr.message);
        return;
      }
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content);
    });
  });
});

server.listen(PORT, () => {
  console.log('================================================================');
  console.log(`🚀 [HCMUTE Scientific CV Portal] Local Dev Server is RUNNING!`);
  console.log(`📍 Web URL:   http://localhost:${PORT}`);
  console.log(`🔑 Login URL: http://localhost:${PORT}/login`);
  console.log(`📁 Workspace: ${ROOT_DIR}`);
  console.log('================================================================');
});

const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'hcmute_scientific_cv_secret_2026';

exports.requireAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: 'Yêu cầu token xác thực hợp lệ' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: 'Phiên làm việc hết hạn hoặc không hợp lệ' });
  }
};

exports.requireAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ success: false, message: 'Quyền truy cập bị từ chối: Yêu cầu quyền Quản trị viên (Admin)' });
  }
  next();
};

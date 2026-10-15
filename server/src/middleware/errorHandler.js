module.exports = (err, req, res, next) => {
  console.error('🔥 Server Error:', err);
  const status = err.status || 500;
  const message = err.message || 'Lỗi máy chủ nội bộ';
  
  res.status(status).json({
    success: false,
    message,
    error: process.env.NODE_ENV === 'production' ? undefined : err.stack
  });
};


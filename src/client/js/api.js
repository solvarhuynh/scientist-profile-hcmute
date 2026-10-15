// =========================================================================
// UNIVERSAL API CLIENT (DUAL-MODE: GOOGLE APPS SCRIPT RPC & LOCAL REST)
// =========================================================================

var ApiClient = (function() {
  var isGasEnvironment = typeof google !== 'undefined' && typeof google.script !== 'undefined' && typeof google.script.run !== 'undefined';

  return {
    isGas: function() {
      return isGasEnvironment;
    },

    // Kiểm tra quyền Admin & Xác thực đăng nhập
    verifyLogin: function(email, intendedRole, onSuccess, onFailure) {
      if (isGasEnvironment) {
        google.script.run
          .withSuccessHandler(onSuccess)
          .withFailureHandler(onFailure || console.error)
          .verifyLogin(email, intendedRole);
      } else {
        // Local Dev Mock API
        fetch('/api/verifyLogin', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: email, role: intendedRole })
        })
        .then(function(res) { return res.json(); })
        .then(onSuccess)
        .catch(function(err) {
          // Fallback offline mock
          var cleanEmail = (email || '').toLowerCase().trim();
          var isAdmin = cleanEmail.includes('admin') || cleanEmail.includes('an');
          onSuccess({
            success: true,
            isAdmin: isAdmin,
            role: (intendedRole === 'admin' && isAdmin) ? 'admin' : 'user',
            email: cleanEmail
          });
        });
      }
    },

    // Lưu toàn bộ dữ liệu lên Database
    syncAllDataToSheets: function(email, dataObj, isExporting, onSuccess, onFailure) {
      if (isGasEnvironment) {
        google.script.run
          .withSuccessHandler(onSuccess)
          .withFailureHandler(onFailure || console.error)
          .syncAllDataToSheets(email, dataObj, isExporting);
      } else {
        fetch('/api/syncAllData', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: email, data: dataObj, isExporting: isExporting })
        })
        .then(function(res) { return res.json(); })
        .then(onSuccess)
        .catch(function(err) {
          localStorage.setItem('local_user_cv_' + email, JSON.stringify(dataObj));
          onSuccess({ success: true, msg: 'Đã lưu hồ sơ cục bộ (Chế độ Local Dev)' });
        });
      }
    },

    // Tải dữ liệu Bảng điều khiển Quản trị viên
    getAdminDashboardData: function(onSuccess, onFailure) {
      if (isGasEnvironment) {
        google.script.run
          .withSuccessHandler(onSuccess)
          .withFailureHandler(onFailure || console.error)
          .getAdminDashboardData();
      } else {
        fetch('/api/admin/dashboard')
          .then(function(res) { return res.json(); })
          .then(onSuccess)
          .catch(function(err) {
            console.warn('Local dev fallback for admin dashboard:', err);
            if (typeof getLocalMockAdminData === 'function') {
              onSuccess(getLocalMockAdminData());
            }
          });
      }
    },

    // Lấy chi tiết toàn bộ hồ sơ của danh sách email ứng viên
    getMultipleFullCVData: function(emails, onSuccess, onFailure) {
      if (isGasEnvironment) {
        google.script.run
          .withSuccessHandler(onSuccess)
          .withFailureHandler(onFailure || console.error)
          .getMultipleFullCVData(emails);
      } else {
        fetch('/api/admin/multiple-cv', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ emails: emails })
        })
        .then(function(res) { return res.json(); })
        .then(onSuccess)
        .catch(function(err) {
          onSuccess([]);
        });
      }
    }
  };
})();

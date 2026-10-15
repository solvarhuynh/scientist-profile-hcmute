// 1. Hàm định tuyến (Routing) truyền trực tiếp role, email và thông báo bảo mật vào client template
function doGet(e) {
  var page = (e && e.parameter && e.parameter.page) || 'login';
  var targetRole = (e && e.parameter && e.parameter.role) || '';
  var targetEmail = (e && e.parameter && e.parameter.email) || '';

  // Tự động nhận diện tài khoản Google thực tế đang đăng nhập trình duyệt
  var activeEmail = getUserEmail();
  if (!targetEmail && activeEmail) {
    targetEmail = activeEmail;
  }

  if (page === 'index') {
    var isAdmin = checkIsAdmin(targetEmail);

    // PHÂN QUYỀN 1 CỔNG THÔNG MINH DUY NHẤT:
    // Nếu là admin -> ban đầu vào thẳng admin (trong admin đã có sẵn nút chuyển sang user);
    // Nếu là tài khoản thường -> chỉ vào user
    var finalRole = isAdmin ? 'admin' : 'user';

    // Cho phép URL override chỉ khi tài khoản thực sự là Admin và muốn vào thẳng user
    if (targetRole === 'user' && isAdmin) {
      finalRole = 'user';
    }

    var template = HtmlService.createTemplateFromFile('Index');
    template.serverRole = finalRole;
    template.serverEmail = targetEmail;
    return template.evaluate()
        .setTitle('Hồ sơ cá nhân - Scientist Profile | ĐH Công Nghệ Kỹ Thuật TP.HCM')
        .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL)
        .addMetaTag('viewport', 'width=device-width, initial-scale=1');
  } else {
    var template = HtmlService.createTemplateFromFile('Login');
    template.serverRole = '';
    template.serverEmail = targetEmail;
    template.serverError = '';
    return template.evaluate()
        .setTitle('Đăng nhập - Scientist Profile | ĐH Công Nghệ Kỹ Thuật TP.HCM')
        .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL)
        .addMetaTag('viewport', 'width=device-width, initial-scale=1');
  }
}

function getScriptUrl() { return ScriptApp.getService().getUrl(); }

// Lấy email chính xác của tài khoản đang truy cập Web App (Không dùng getEffectiveUser để tránh nhầm lẫn danh tính)
function getUserEmail() {
  try {
    var email = Session.getActiveUser().getEmail();
    if (email && email.trim() !== "") {
      return email.trim().toLowerCase();
    }
  } catch (e) {}
  return ""; 
}

// Kiểm tra xem email có nằm trong sheet "Admins" không (quét tất cả các cột để tránh lệch cấu trúc)
function checkIsAdmin(email) {
  if (!email || String(email).trim() === "") return false;
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName("Admins");
  if (!sheet) return false;
  var data = sheet.getDataRange().getValues();
  if (data.length <= 1) return false;
  var target = String(email).trim().toLowerCase();
  for (var i = 1; i < data.length; i++) {
    for (var col = 0; col < data[i].length; col++) {
      var val = String(data[i][col] || "").trim().toLowerCase();
      if (val === target) {
        return true;
      }
    }
  }
  return false;
}

// Xác thực đăng nhập phân quyền cho 2 block: User và Admin
function verifyLogin(email, intendedRole) {
  if (!email || String(email).trim() === "") {
    return { success: false, error: "Vui lòng chọn hoặc nhập tài khoản Google để tiếp tục." };
  }
  var cleanEmail = String(email).trim().toLowerCase();
  var isAdmin = checkIsAdmin(cleanEmail);

  if (intendedRole === 'admin') {
    if (!isAdmin) {
      return {
        success: false,
        isAdmin: false,
        email: cleanEmail,
        error: "Từ chối truy cập: Tài khoản \"" + cleanEmail + "\" không có quyền Quản trị viên! Vui lòng liên hệ Ban quản trị để được cấp quyền hoặc đăng nhập bằng Cổng Giảng viên."
      };
    }
    return {
      success: true,
      isAdmin: true,
      role: 'admin',
      email: cleanEmail
    };
  } else {
    // Cổng Giảng viên: Luôn vào vai trò 'user' để chỉnh sửa hồ sơ cá nhân (kể cả có quyền Admin)
    return {
      success: true,
      isAdmin: isAdmin,
      role: 'user',
      email: cleanEmail
    };
  }
}

// Lấy thông tin user hiện tại kèm quyền Admin
function getUserInfo(clientEmail) {
  var email = (clientEmail && String(clientEmail).trim() !== "") ? String(clientEmail).trim().toLowerCase() : getUserEmail();
  var isAdmin = checkIsAdmin(email);
  return { email: email, isAdmin: isAdmin };
}

// Lấy danh sách ứng viên để phân quyền Admin từ sheet ThongTinCoBan và Admins
function getAdminCandidates() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheetAdmins = getOrCreateSheet(ss, "Admins");
  var adminMap = {};
  
  var adminData = sheetAdmins.getDataRange().getValues();
  if (adminData.length === 0 || !adminData[0][0]) {
    sheetAdmins.getRange(1, 1, 1, 3).setValues([["Email", "NguoiThem", "NgayThem"]]);
  } else {
    for (var i = 1; i < adminData.length; i++) {
      var aEmail = String(adminData[i][0] || "").trim().toLowerCase();
      if (aEmail) {
        adminMap[aEmail] = {
          nguoiThem: adminData[i][1] ? String(adminData[i][1]) : "",
          ngayThem: adminData[i][2] ? String(adminData[i][2]) : ""
        };
      }
    }
  }

  var candidates = [];
  var seenEmails = {};
  
  var sheetCoBan = ss.getSheetByName("ThongTinCoBan");
  if (sheetCoBan) {
    var dataCB = sheetCoBan.getDataRange().getValues();
    for (var j = 1; j < dataCB.length; j++) {
      var rawEmail = String(dataCB[j][0] || "").trim();
      var normEmail = rawEmail.toLowerCase();
      if (!normEmail || seenEmails[normEmail]) continue;
      seenEmails[normEmail] = true;

      var name = String(dataCB[j][1] || "").trim() || normEmail;
      var donVi = String(dataCB[j][8] || dataCB[j][18] || "").trim() || "Chưa cập nhật";
      var isAdm = !!adminMap[normEmail];
      var adminMeta = adminMap[normEmail] || {};

      candidates.push({
        email: rawEmail,
        normEmail: normEmail,
        name: name,
        donVi: donVi,
        isAdmin: isAdm,
        nguoiThem: adminMeta.nguoiThem || "",
        ngayThem: adminMeta.ngayThem || ""
      });
    }
  }

  // Bổ sung các tài khoản trong sheet Admins nhưng chưa khai báo ở ThongTinCoBan
  for (var admEmail in adminMap) {
    if (!seenEmails[admEmail]) {
      seenEmails[admEmail] = true;
      candidates.push({
        email: admEmail,
        normEmail: admEmail,
        name: admEmail,
        donVi: "Ban Quản trị",
        isAdmin: true,
        nguoiThem: adminMap[admEmail].nguoiThem || "",
        ngayThem: adminMap[admEmail].ngayThem || ""
      });
    }
  }

  // Sắp xếp: Chưa là admin lên đầu (sáng hơn), Đã là admin xuống sau (tối hơn); cùng nhóm xếp theo tên
  candidates.sort(function(a, b) {
    if (a.isAdmin !== b.isAdmin) {
      return a.isAdmin ? 1 : -1;
    }
    return a.name.localeCompare(b.name, 'vi');
  });

  return candidates;
}

// Cấp quyền Admin cho 1 hoặc nhiều tài khoản
function grantAdminRoles(targetEmails, actingAdminEmail) {
  if (!targetEmails || !Array.isArray(targetEmails) || targetEmails.length === 0) {
    return { success: false, error: "Chưa chọn tài khoản nào để cấp quyền." };
  }

  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheetAdmins = getOrCreateSheet(ss, "Admins");
  var adminData = sheetAdmins.getDataRange().getValues();
  
  if (adminData.length === 0 || !adminData[0][0]) {
    sheetAdmins.getRange(1, 1, 1, 3).setValues([["Email", "NguoiThem", "NgayThem"]]);
    adminData = [["Email", "NguoiThem", "NgayThem"]];
  }

  var existingMap = {};
  for (var i = 1; i < adminData.length; i++) {
    var em = String(adminData[i][0] || "").trim().toLowerCase();
    if (em) existingMap[em] = true;
  }

  var nowStr = Utilities.formatDate(new Date(), "GMT+7", "dd/MM/yyyy HH:mm:ss");
  var rowsToAppend = [];
  var addedEmails = [];

  for (var j = 0; j < targetEmails.length; j++) {
    var raw = String(targetEmails[j] || "").trim();
    var lower = raw.toLowerCase();
    if (lower && !existingMap[lower]) {
      existingMap[lower] = true;
      rowsToAppend.push([lower, actingAdminEmail || "Admin", nowStr]);
      addedEmails.push(raw);
    }
  }

  if (rowsToAppend.length > 0) {
    var startRow = sheetAdmins.getLastRow() + 1;
    sheetAdmins.getRange(startRow, 1, rowsToAppend.length, 3).setValues(rowsToAppend);
  }

  return {
    success: true,
    addedCount: addedEmails.length,
    addedEmails: addedEmails
  };
}

// Lấy hồ sơ cá nhân của người dùng từ Sheets để đồng bộ đa thiết bị
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
function getUserProfileData(email) {
  if (!email || String(email).trim() === "") return null;
  var res = getMultipleFullCVData([String(email).trim().toLowerCase()]);
  return (res && res.length > 0) ? res[0] : null;
}

// HÀM HỖ TRỢ: Tự động tìm hoặc tạo thư mục trên Drive của người dùng (Không cần cấu hình ID cứng)
function getUserDriveFolder() {
  var folderName = "KhoLuuTru_LyLichKhoaHoc";
  var folders = DriveApp.getFoldersByName(folderName);
  if (folders.hasNext()) {
    return folders.next();
  } else {
    return DriveApp.createFolder(folderName);
  }
}

function getProfiles() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Profiles");
  if (!sheet) return [];
  var rows = sheet.getDataRange().getValues();
  var profiles = [];
  for (var i = 1; i < rows.length; i++) {
    profiles.push({
      id: rows[i][0], hoVaTen: rows[i][1], email: rows[i][2], donVi: rows[i][3],
      linhVuc: rows[i][4], avatarUrl: rows[i][5], cvUrl: rows[i][6]
    });
  }
  return profiles;
}

function saveProfile(data, avatarFileObj, cvFileObj) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = getOrCreateSheet(ss, "Profiles");
  var folder = getUserDriveFolder();
  var avatarUrl = "", cvUrl = "";
  
  if (avatarFileObj && avatarFileObj.base64) {
    var blob = Utilities.newBlob(Utilities.base64Decode(avatarFileObj.base64.split(',')[1]), avatarFileObj.type, avatarFileObj.name);
    var file = folder.createFile(blob); file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
    avatarUrl = file.getUrl();
  }
  if (cvFileObj && cvFileObj.base64) {
    var blobCv = Utilities.newBlob(Utilities.base64Decode(cvFileObj.base64.split(',')[1]), cvFileObj.type, cvFileObj.name);
    var fileCv = folder.createFile(blobCv); fileCv.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
    cvUrl = fileCv.getUrl();
  }
  
  var id = "MS" + new Date().getTime();
  sheet.appendRow([id, data.hoVaTen, data.email, data.donVi, data.linhVuc, avatarUrl, cvUrl]);
  return "Thêm thành công!";
}

function checkAndCreateCongBoSheet() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = getOrCreateSheet(ss, "CongBoKhoaHoc");
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(['ID', 'Type', 'Tên công trình', 'Tác giả', 'Năm XB', 'Nơi XB', 'Chỉ số', 'URL', 'File PDF']);
  }
  return sheet;
}

function getCongBoData() {
  var sheet = checkAndCreateCongBoSheet();
  var data = sheet.getDataRange().getValues();
  var headers = data.shift();
  if(!headers) return [];
  return data.map(function(row) {
    var obj = {}; headers.forEach(function(h, i) { obj[h] = row[i]; }); return obj;
  });
}

function uploadPdfToDrive(base64Data, fileName, recordId) {
  try {
    var folder = getUserDriveFolder();
    var blob = Utilities.newBlob(Utilities.base64Decode(base64Data), 'application/pdf', fileName);
    var file = folder.createFile(blob); file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
    var fileUrl = file.getUrl();
    var sheet = checkAndCreateCongBoSheet();
    var data = sheet.getDataRange().getValues();
    
    for (var i = 1; i < data.length; i++) {
      if (data[i][0] == recordId) { sheet.getRange(i + 1, 9).setValue(fileUrl); break; }
    }
    return { success: true, url: fileUrl };
  } catch (e) { return { success: false, error: e.toString() }; }
}

// Hàm hỗ trợ tự động tạo Sheet nếu chưa có
function getOrCreateSheet(ss, sheetName) {
  var sheet = ss.getSheetByName(sheetName);
  if (!sheet) {
    sheet = ss.insertSheet(sheetName);
  }
  return sheet;
}

/* =========================================================================
 * ĐỒNG BỘ TOÀN BỘ DỮ LIỆU LÊN CÁC SHEET 
 * ========================================================================= */
// Thêm tham số isExporting vào hàm
function syncAllDataToSheets(email, dataObj, isExporting) {
  if (!email || !dataObj) return { success: false, msg: "Thiếu thông tin Email hoặc Dữ liệu" };
  var cleanTargetEmail = String(email || "").trim().toLowerCase();
  if (!cleanTargetEmail) return { success: false, msg: "Email không hợp lệ" };

  var lock = LockService.getScriptLock();
  var hasLock = false;
  try {
    hasLock = lock.tryLock(20000);
  } catch(e) {
    hasLock = false;
  }

  var ss = SpreadsheetApp.getActiveSpreadsheet();
  
  try {
      // 1. LƯU THÔNG TIN CƠ BẢN
      var sheetCoBan = getOrCreateSheet(ss, "ThongTinCoBan");
      var cbHeaders = [
        "Email", "HoVaTen", "GioiTinh", "NgaySinh", "NoiSinh", "QueQuan", "DanToc", 
        "ChucVu", "DonVi", "DiaChi", "DienThoaiCQ", "DienThoaiNR", "DienThoaiDD", "Fax", 
        "SoCCCD", "NgayCap", "NoiCap", "TrangThai", "Khoa", "BoMon"
      ];
      if (sheetCoBan.getLastRow() === 0) {
        sheetCoBan.getRange(1, 1, 1, cbHeaders.length).setValues([cbHeaders]);
      } else {
        var firstRowCB = sheetCoBan.getRange(1, 1, 1, cbHeaders.length).getValues()[0];
        if (!firstRowCB[0] || firstRowCB[0].toString().toLowerCase() !== "email") {
          sheetCoBan.getRange(1, 1, 1, cbHeaders.length).setValues([cbHeaders]);
        }
      }

      var b = dataObj.basicInfo || {};
      var gioitinh = b.genderNam ? "Nam" : (b.genderNu ? "Nữ" : (b.gioiTinh || ""));
      
      var isComplete = checkAndSendReminderEmail(cleanTargetEmail, dataObj);
      var trangThai = "Bản nháp"; 

      if (isExporting) {
          if (isComplete) {
              var hasPDF = false;
              if (dataObj.congBo && dataObj.congBo.baiBao) {
                  hasPDF = dataObj.congBo.baiBao.some(function(item) { return item.filePdf && item.filePdf !== ""; });
              }
              trangThai = hasPDF ? "Chờ hậu kiểm" : "Đã duyệt tự động";
          } else {
              trangThai = "Thiếu minh chứng";
          }
      }
      
      var rowData = [
        cleanTargetEmail, b.name || "", gioitinh, b.dob || "", b.noiSinh || "", b.queQuan || "", b.danToc || "", 
        b.chucVu || "", b.donVi || "", b.diaChi || "", b.cq || "", b.nr || "", b.dd || b.dienThoai || "", 
        b.fax || "", b.cccd || b.soCCCD || "", b.ngayCap || "", b.noiCap || "", trangThai, 
        b.khoa || b.donViKhoa || "", b.boMon || b.donViBoMon || ""
      ];
      
      var dataCB = sheetCoBan.getDataRange().getValues();
      var matchingIndices = [];
      for (var i = 1; i < dataCB.length; i++) {
        if (String(dataCB[i][0] || "").trim().toLowerCase() === cleanTargetEmail) {
          matchingIndices.push(i + 1);
        }
      }
      if (matchingIndices.length > 0) {
        // Cập nhật dòng đầu tiên khớp với email
        sheetCoBan.getRange(matchingIndices[0], 1, 1, rowData.length).setValues([rowData]);
        // Xóa triệt để các dòng trùng lặp email phía sau nếu có để đảm bảo ThongTinCoBan duy nhất
        for (var d = matchingIndices.length - 1; d >= 1; d--) {
          sheetCoBan.deleteRow(matchingIndices[d]);
        }
      } else {
        sheetCoBan.appendRow(rowData);
      }
      
      // 2. BỔ SUNG
      var sheetBS = getOrCreateSheet(ss, "ThongTinBoSung");
      var bsHeaders = ["Email", "PhanLoai", "Nganh", "Ten", "MoTa", "ThinhGiang", "NghienCuu", "HoiDong", "HuongDan", "DoanhNghiep"];
      sheetBS.getRange(1, 1, 1, bsHeaders.length).setValues([bsHeaders]);

      var boSungList = [];
      if (dataObj.bosung) {
        var p = dataObj.bosung.prefs || {};
        
        // Đẩy dữ liệu Tùy chỉnh nguyện vọng vào đúng cột từ F đến J
        boSungList.push([
          cleanTargetEmail,                // Cột A: Email
          "Tùy chỉnh nguyện vọng",         // Cột B: PhanLoai
          "",                              // Cột C: Nganh (bỏ trống)
          "",                              // Cột D: Ten (bỏ trống)
          "",                              // Cột E: MoTa (bỏ trống)
          p.thinhGiang ? "Có" : "Không",   // Cột F: Đồng ý tìm việc thỉnh giảng
          p.nghienCuu ? "Có" : "Không",    // Cột G: Đồng ý tìm đồng đội nghiên cứu chung
          p.hoiDong ? "Có" : "Không",      // Cột H: Đồng ý tham gia hội đồng
          p.huongDan ? "Có" : "Không",     // Cột I: Đồng ý làm người hướng dẫn
          p.doanhNghiep ? "Có" : "Không"   // Cột J: Đồng ý làm dự án doanh nghiệp
        ]);
        
        (dataObj.bosung.monHoc || []).forEach(item => 
            boSungList.push([cleanTargetEmail, "Môn học", item.major || "", item.name || "", item.desc || "", "", "", "", "", ""])
        );
        (dataObj.bosung.huongNghienCuu || []).forEach(item => 
            boSungList.push([cleanTargetEmail, "Hướng nghiên cứu", item.major || "", item.name || "", item.desc || "", "", "", "", "", ""])
        );
      }
      updateListSheet("ThongTinBoSung", boSungList, r => r, cleanTargetEmail);
      
      // 3. ĐÀO TẠO
      var sheetDaoTao = getOrCreateSheet(ss, "QuaTrinhDaoTao");
      var dtHeaders = ["Email", "PhanLoai", "BacHoc_NgoaiNgu", "TenChucDanh", "Nganh_ChuyenNganh", "NoiDaoTao_MucDo", "NuocDaoTao", "Nam", "ChiTiet_ChungChi", "HeDaoTao"];
      // Luôn chuẩn hóa dòng 1 của QuaTrinhDaoTao đủ 10 cột: Cột H là Năm, Cột I là Chi tiết/Đề tài, Cột J là Hệ đào tạo
      sheetDaoTao.getRange(1, 1, 1, dtHeaders.length).setValues([dtHeaders]);

      var daoTaoList = [];
      if (dataObj.daotao || dataObj.daoTao) {
        var dtSource = dataObj.daotao || dataObj.daoTao;
        (dtSource.hocVi || []).forEach(function(item) {
          daoTaoList.push([
            cleanTargetEmail,
            "Học vị",
            item.hocVi || "",
            item.bacHoc || item.chucDanh || "",
            item.nganh || "",
            item.noiDaoTao || item.noi || "",
            item.nuoc || "",
            item.nam || "",
            item.chiTiet || "",
            item.heDaoTao || ""
          ]);
        });
        (dtSource.hocHam || []).forEach(function(item) {
          daoTaoList.push([
            cleanTargetEmail,
            "Học hàm",
            "",
            item.chucDanh || "",
            item.nganh || "",
            "",
            "",
            item.nam || "",
            "",
            ""
          ]);
        });
        (dtSource.ngoaiNgu || []).forEach(function(item) {
          daoTaoList.push([
            cleanTargetEmail,
            "Ngoại ngữ",
            item.ngonNgu || "",
            "",
            "",
            item.mucDo || "",
            "",
            "",
            item.chungChi || "",
            ""
          ]);
        });
      }
      updateListSheet("QuaTrinhDaoTao", daoTaoList, function(r) { return r; }, cleanTargetEmail);
      
      // 4. CÔNG TÁC
      var sheetCongTac = getOrCreateSheet(ss, "QuaTrinhCongTac");
      var ctHeaders = ["Email", "TuNgay", "DenNgay", "NoiCongTac", "ChucDanh", "MoTa"];
      sheetCongTac.getRange(1, 1, 1, ctHeaders.length).setValues([ctHeaders]);

      updateListSheet("QuaTrinhCongTac", dataObj.congTac || [], function(item) {
        return [
          cleanTargetEmail, 
          item.tu || item.tuNgay || "", 
          item.denLoai === 'HienTai' ? 'Hiện tại' : (item.denNgay || item.den || ""), 
          item.noi || item.noiCongTac || item.donVi || "", 
          item.chucDanh || item.chucVu || "", 
          item.moTa || ""
        ];
      }, cleanTargetEmail);
      
      // 5. ĐỀ TÀI
      var sheetDeTai = getOrCreateSheet(ss, "DeTaiThamGia");
      var dtgHeaders = ["Email", "TenDeTai", "BatDau", "NghiemThu", "CapDeTai", "XepHang", "ChucVu", "KinhPhi", "DonViTien"];
      sheetDeTai.getRange(1, 1, 1, dtgHeaders.length).setValues([dtgHeaders]);

      updateListSheet("DeTaiThamGia", dataObj.deTai || [], function(item) {
        return [
          cleanTargetEmail, 
          item.ten || "", 
          item.batDau || "", 
          item.nghiemThu || item.hoanTat || "", 
          item.cap || item.capDeTai || "", 
          item.xepHang || "", 
          item.chucVu || "", 
          item.kinhPhi || "", 
          item.donVi || item.donViTien || "triệu VNĐ"
        ];
      }, cleanTargetEmail);
      
      // 6. CÔNG BỐ
      var sheetCB = getOrCreateSheet(ss, "CongBoKhoaHoc");
      var cbKhoaHocHeaders = ["Email", "PhanLoai", "TenCongTrinh", "TacGia_DiaDiem", "ThoiGian", "NoiXuatBan_HinhThuc", "ChiSo_ThongTin", "URL", "FilePDF"];
      sheetCB.getRange(1, 1, 1, cbKhoaHocHeaders.length).setValues([cbKhoaHocHeaders]);

      var congBoList = [];
      if (dataObj.congBo) {
        (dataObj.congBo.baiBao || []).forEach(item => congBoList.push([
          cleanTargetEmail, 
          "Bài báo", 
          item.ten || item.tenBaiBao || "", 
          item.tacGia || "", 
          (item.thang ? item.thang + "/" : "") + (item.nam || item.namXuatBan || ""), 
          item.noiXB || item.tapChi || "", 
          item.chiSo || "", 
          item.url || "", 
          item.filePdf || item.pdfUrl || ""
        ]));
        (dataObj.congBo.seminar || []).forEach(item => congBoList.push([
          cleanTargetEmail, 
          "Seminar", 
          item.ten || "", 
          item.diaDiem || "", 
          (item.thang ? item.thang + "/" : "") + (item.nam || ""), 
          item.hinhThuc || "", 
          item.thongTin || "", 
          "", 
          ""
        ]));
        (dataObj.congBo.sach || []).forEach(item => congBoList.push([
          cleanTargetEmail, 
          "Sách", 
          item.ten || item.tenSach || "", 
          "", 
          (item.thang ? item.thang + "/" : "") + (item.nam || item.namXuatBan || ""), 
          item.noiXB || item.nhaXuatBan || "", 
          item.thongTin || item.vaiTro || "", 
          "", 
          ""
        ]));
      }
      updateListSheet("CongBoKhoaHoc", congBoList, r => r, cleanTargetEmail);
      
      // 7. GIẢI THƯỞNG
      var sheetGT = getOrCreateSheet(ss, "GiaiThuong");
      var gtHeaders = ["Email", "PhanLoai", "TenGiaiThuong", "NoiCap", "Nam", "NoiDung"];
      sheetGT.getRange(1, 1, 1, gtHeaders.length).setValues([gtHeaders]);

      var giaiThuongList = [];
      if (dataObj.giaiThuong) {
        (dataObj.giaiThuong.khcn || []).forEach(item => giaiThuongList.push([
          cleanTargetEmail, 
          "KHCN", 
          item.ten || "", 
          item.noi || item.coQuan || "", 
          item.nam || "", 
          item.noiDung || item.hinhThuc || ""
        ]));
        (dataObj.giaiThuong.chuyenGiao || []).forEach(item => giaiThuongList.push([
          cleanTargetEmail, 
          "Chuyển giao", 
          item.ten || "", 
          item.noi || item.coQuan || "", 
          item.nam || "", 
          item.noiDung || item.hinhThuc || ""
        ]));
      }
      updateListSheet("GiaiThuong", giaiThuongList, r => r, cleanTargetEmail);
      
      var returnMsg = "Đã đồng bộ nháp thành công!";
      if (isExporting) {
          if (trangThai === "Thiếu minh chứng") returnMsg = "Đã lưu CV! Đã gửi Email nhắc nhở bổ sung minh chứng.";
          else if (trangThai === "Chờ hậu kiểm") returnMsg = "Đã lưu CV! Đang chờ Admin hậu kiểm file PDF.";
          else returnMsg = "Hồ sơ hợp lệ và đã được Tự động duyệt!";
      }
      return { success: true, msg: returnMsg };
  } catch (error) {
      return { success: false, msg: "Lỗi đồng bộ: " + error.message };
  } finally {
      if (hasLock) {
        try { lock.releaseLock(); } catch(e) {}
      }
  }
}

// Lấy dữ liệu dropdown Tỉnh/Thành phố và Dân tộc
function getDropdownData() {
  var tinhThanh = [
    "Hà Nội", "Cao Bằng", "Tuyên Quang", "Điện Biên", "Lai Châu", "Sơn La", 
    "Lào Cai", "Thái Nguyên", "Lạng Sơn", "Quảng Ninh", "Bắc Ninh", "Phú Thọ", 
    "Hải Phòng", "Hưng Yên", "Ninh Bình", "Thanh Hóa", "Nghệ An", "Hà Tĩnh", 
    "Quảng Trị", "Huế", "Đà Nẵng", "Quảng Ngãi", "Gia Lai", "Khánh Hòa", 
    "Đắk Lắk", "Lâm Đồng", "Đồng Nai", "TP. Hồ Chí Minh", "Tây Ninh", 
    "Đồng Tháp", "Vĩnh Long", "An Giang", "Cần Thơ", "Cà Mau"
  ];
  
  var danToc = [
    "Kinh", "Tày", "Thái", "Mường", "Khmer (Khơ-me)", "Hoa", "Nùng", 
    "Mông (H'Mông)", "Dao", "Gia Rai", "Ê Đê", "Ba Na", "Xơ Đăng", "Sán Chay", 
    "Chăm", "Cơ Ho", "Sán Dìu", "Hrê", "Ra Glai", "Mnông", "Thổ", "Xtiêng", 
    "Khơ Mú", "Bru - Vân Kiều", "Cơ Tu", "Giáy", "Tà Ôi", "Mạ", "Giẻ Triêng", 
    "Co", "Chơ Ro", "Xinh Mun", "Hà Nhì", "Chu Ru", "Lào", "La Chí", "Kháng", 
    "Phù Lá", "La Hủ", "La Ha", "Pà Thẻn", "Lự", "Ngái", "Chứt", "Lô Lô", 
    "Mảng", "Cờ Lao", "Bố Y", "Cống", "Si La", "Pu Péo", "Rơ Măm", "Brâu", 
    "Ơ Đu"
  ];
  
  return { tinhThanh: tinhThanh, danToc: danToc };
}

// Lấy toàn bộ dữ liệu thống kê cho Admin
function getAdminDashboardData() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var result = { users: [], congBo: [], boSung: [], daoTao: [], congTac: [], deTai: [], giaiThuong: [] }; 
  
  var sheetCoBan = ss.getSheetByName("ThongTinCoBan");
  var validEmails = []; 
  
  if (sheetCoBan) {
    var dataCB = sheetCoBan.getDataRange().getValues();
    for (var i = 1; i < dataCB.length; i++) {
      var em = String(dataCB[i][0] || "").trim().toLowerCase();
      if (em) {
        validEmails.push(em);
        
        var rawDob = dataCB[i][3];
        var strDob = (rawDob instanceof Date) ? Utilities.formatDate(rawDob, "GMT+7", "dd/MM/yyyy") : String(rawDob || "");

        result.users.push({
          email: em,
          name: dataCB[i][1] || "",
          gender: dataCB[i][2] || "",
          dob: strDob, 
          chucVu: dataCB[i][7] || "",
          donVi: dataCB[i][8] || "",
          sdt: dataCB[i][12] || dataCB[i][10] || "",
          trangThai: dataCB[i][17] || "Bản nháp",
          khoa: dataCB[i][18] || "",
          boMon: dataCB[i][19] || ""
        });
      }
    }
  }

  var sheetCongBo = ss.getSheetByName("CongBoKhoaHoc");
  if (sheetCongBo) {
    var dataCongBo = sheetCongBo.getDataRange().getValues();
    for (var j = 1; j < dataCongBo.length; j++) {
      var emCb = String(dataCongBo[j][0] || "").trim().toLowerCase();
      if (emCb) {
        var rawThoiGian = dataCongBo[j][4];
        var strThoiGian = (rawThoiGian instanceof Date) ? Utilities.formatDate(rawThoiGian, "GMT+7", "dd/MM/yyyy") : String(rawThoiGian || "");
        
        result.congBo.push({
          email: emCb,
          loai: String(dataCongBo[j][1] || "Bài báo"),
          ten: String(dataCongBo[j][2] || "").trim(),
          tacGia: String(dataCongBo[j][3] || "").trim(),
          thoiGian: strThoiGian,
          tapChi: String(dataCongBo[j][5] || "").trim(),
          chiSo: String(dataCongBo[j][6] || "").trim(),
          url: String(dataCongBo[j][7] || "").trim(),
          filePdf: String(dataCongBo[j][8] || "").trim()
        });
      }
    }
  }

  var sheetDaoTao = ss.getSheetByName("QuaTrinhDaoTao");
  if (sheetDaoTao) {
    var dataDT = sheetDaoTao.getDataRange().getValues();
    for (var k = 1; k < dataDT.length; k++) {
      var emDt = String(dataDT[k][0] || "").trim().toLowerCase();
      if (emDt) {
         var loai = String(dataDT[k][1] || "").trim();
         var is9Col = (dataDT[k].length >= 8 && (/^\d{4}$/.test(String(dataDT[k][7] || "").trim()) || !/^\d{4}$/.test(String(dataDT[k][5] || "").trim())));
         var hocViVal = "", chucDanhVal = "", nganhVal = "", noiVal = "", nuocVal = "", namVal = "", chiTietVal = "", heDaoTaoVal = "";
         if (is9Col) {
           hocViVal = String(dataDT[k][2] || "").trim();
           chucDanhVal = String(dataDT[k][3] || "").trim();
           nganhVal = String(dataDT[k][4] || "").trim();
           noiVal = String(dataDT[k][5] || "").trim();
           nuocVal = String(dataDT[k][6] || "").trim();
           namVal = String(dataDT[k][7] || "").trim();
           chiTietVal = String(dataDT[k][8] || "").trim();
           heDaoTaoVal = (dataDT[k].length >= 10) ? String(dataDT[k][9] || "").trim() : "";
         } else {
           hocViVal = String(dataDT[k][2] || "").trim();
           chucDanhVal = String(dataDT[k][3] || "").trim();
           noiVal = String(dataDT[k][4] || "").trim();
           namVal = String(dataDT[k][5] || "").trim();
           chiTietVal = String(dataDT[k][6] || "").trim();
         }

         if (!heDaoTaoVal && (loai === 'Học vị' || !loai)) {
           var isHeMode = /^(chính quy|chất lượng cao|từ xa|vừa làm vừa học|văn bằng 2|liên thông|tại chức|clc)/i.test(chiTietVal);
           if (isHeMode) {
             heDaoTaoVal = chiTietVal;
             chiTietVal = "";
           } else if (hocViVal === 'Đại học' || chucDanhVal === 'Cử nhân' || chucDanhVal === 'Kỹ sư') {
             heDaoTaoVal = "Chính quy";
           }
         }

         result.daoTao.push({
            email: emDt,
            loai: loai || "Học vị",
            hocVi: hocViVal,
            bacHoc: chucDanhVal,
            chucDanh: chucDanhVal,
            title: chucDanhVal ? (hocViVal + " (" + chucDanhVal + ")") : hocViVal,
            nganh: nganhVal,
            noi: noiVal,
            noiDaoTao: noiVal,
            mucDo: (loai === 'Ngoại ngữ') ? noiVal : "",
            ngonNgu: (loai === 'Ngoại ngữ') ? hocViVal : "",
            nuoc: nuocVal,
            nam: namVal,
            chiTiet: chiTietVal,
            heDaoTao: heDaoTaoVal,
            chungChi: (loai === 'Ngoại ngữ') ? chiTietVal : ""
         });
      }
    }
  }

  var sheetBoSung = ss.getSheetByName("ThongTinBoSung");
  if (sheetBoSung) {
    var dataBS = sheetBoSung.getDataRange().getValues();
    for (var l = 1; l < dataBS.length; l++) {
      var emBs = String(dataBS[l][0] || "").trim().toLowerCase();
      if (emBs) {
        var pLoai = String(dataBS[l][1] || "");
        if (pLoai === "Tùy chỉnh nguyện vọng") {
          result.boSung.push({
            email: emBs,
            type: "nguyenVong",
            thinhGiang: dataBS[l][5] || "",   
            nghienCuu: dataBS[l][6] || "",    
            hoiDong: dataBS[l][7] || "",      
            huongDan: dataBS[l][8] || "",     
            doanhNghiep: dataBS[l][9] || ""   
          });
        } else {
          result.boSung.push({
            email: emBs,
            type: (pLoai === "Môn học" ? "monHoc" : "huongNghienCuu"),
            nganh: dataBS[l][2] || "",
            ten: dataBS[l][3] || "",
            moTa: dataBS[l][4] || ""
          });
        }
      }
    }
  }

  var sheetCongTac = ss.getSheetByName("QuaTrinhCongTac");
  if (sheetCongTac) {
    var dataCT = sheetCongTac.getDataRange().getValues();
    for (var c = 1; c < dataCT.length; c++) {
      var emCt = String(dataCT[c][0] || "").trim().toLowerCase();
      if (emCt) {
        result.congTac.push({
          email: emCt,
          tu: String(dataCT[c][1] || ""),
          den: String(dataCT[c][2] || ""),
          thoiGian: String(dataCT[c][1] || "") + (dataCT[c][2] ? " - " + String(dataCT[c][2]) : ""),
          noi: String(dataCT[c][3] || ""),
          donVi: String(dataCT[c][3] || ""),
          chucDanh: String(dataCT[c][4] || ""),
          chucVu: String(dataCT[c][4] || ""),
          moTa: String(dataCT[c][5] || "")
        });
      }
    }
  }

  var sheetDeTai = ss.getSheetByName("DeTaiThamGia");
  if (sheetDeTai) {
      var dataDeTai = sheetDeTai.getDataRange().getValues();
      for (var m = 1; m < dataDeTai.length; m++) {
          var emDeTai = String(dataDeTai[m][0] || "").trim().toLowerCase();
          if (emDeTai) {
              result.deTai.push({
                email: emDeTai,
                ten: String(dataDeTai[m][1] || ""),
                batDau: String(dataDeTai[m][2] || ""),
                nghiemThu: String(dataDeTai[m][3] || ""),
                cap: String(dataDeTai[m][4] || ""),
                xepHang: String(dataDeTai[m][5] || ""),
                chucVu: String(dataDeTai[m][6] || ""),
                kinhPhi: dataDeTai[m][7] || "",
                donViTien: dataDeTai[m][8] || ""
              });
          }
      }
  }

  var sheetGiaiThuong = ss.getSheetByName("GiaiThuong");
  if (sheetGiaiThuong) {
    var dataGT = sheetGiaiThuong.getDataRange().getValues();
    for (var g = 1; g < dataGT.length; g++) {
      var emGt = String(dataGT[g][0] || "").trim().toLowerCase();
      if (emGt) {
        result.giaiThuong.push({
          email: emGt,
          loai: String(dataGT[g][1] || ""),
          ten: String(dataGT[g][2] || ""),
          noi: String(dataGT[g][3] || ""),
          nam: String(dataGT[g][4] || ""),
          noiDung: String(dataGT[g][5] || "")
        });
      }
    }
  }

  return result;
}

// HÀM KIỂM TRA MINH CHỨNG VÀ GỬI EMAIL NHẮC NHỞ TỰ ĐỘNG
function checkAndSendReminderEmail(email, dataObj) {
  var missingItems = [];
  
  if (dataObj.congBo && dataObj.congBo.baiBao) {
    dataObj.congBo.baiBao.forEach(function(item) {
      if (!item.filePdf && !item.chiSo && !item.url) { 
        missingItems.push("- Bài báo: " + item.ten);
      }
    });
  }
  
  if (missingItems.length > 0) {
    var subject = "[Scientist Profile] Yêu cầu bổ sung minh chứng Lý lịch khoa học";
    var body = "Chào thầy/cô,\n\n" +
               "Hệ thống ghi nhận hồ sơ Lý lịch khoa học của thầy/cô đang thiếu minh chứng (File PDF, Link bài báo, hoặc mã DOI) cho các công trình sau:\n\n" +
               missingItems.join("\n") + "\n\n" +
               "Vui lòng đăng nhập vào hệ thống để bổ sung. Hồ sơ sẽ tự động chuyển sang trạng thái Đã Duyệt ngay sau khi cập nhật đầy đủ.\n\n" +
               "Trân trọng,\nBan Quản trị Hệ thống.";
    try { MailApp.sendEmail(email, subject, body); } catch(e) { console.log(e); }
    return false; // Báo hiệu dữ liệu ĐANG THIẾU
  }
  return true; // Dữ liệu ĐÃ ĐỦ SẠCH
}
// =========================================================================
// HÀM HỖ TRỢ: Cập nhật danh sách dữ liệu (Xóa dữ liệu cũ của user và ghi đè dữ liệu mới)
// =========================================================================
function updateListSheet(sheetName, dataList, mapFunc, userEmail) {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = getOrCreateSheet(ss, sheetName);
    
    // Áp dụng hàm map để tạo ra các dòng dữ liệu mới
    var newRows = (dataList || []).map(mapFunc);
    
    // Email của user (ưu tiên truyền trực tiếp hoặc lấy từ newRows)
    var email = userEmail || (newRows.length > 0 ? newRows[0][0] : ""); 
    var cleanEmail = String(email || "").trim().toLowerCase();
    if (!cleanEmail) return;

    // Lọc bỏ các dòng trùng lặp nội bộ trong newRows
    var uniqueNewRows = [];
    var seenKeys = {};
    for (var n = 0; n < newRows.length; n++) {
      var row = newRows[n];
      var rowKey = row.join("||").toLowerCase();
      if (!seenKeys[rowKey]) {
        seenKeys[rowKey] = true;
        uniqueNewRows.push(row);
      }
    }
    
    // 1. Quét tìm và giữ lại dữ liệu của các user khác (loại bỏ hoàn toàn dòng cũ/trùng lặp của user này)
    var lastRow = sheet.getLastRow();
    var lastCol = Math.max(sheet.getLastColumn(), (uniqueNewRows.length > 0 ? uniqueNewRows[0].length : 1));
    if (lastRow > 1) {
        var allData = sheet.getRange(2, 1, lastRow - 1, lastCol).getValues();
        var remainingRows = [];
        for (var i = 0; i < allData.length; i++) {
            var rowEmail = String(allData[i][0] || "").trim().toLowerCase();
            if (rowEmail !== cleanEmail) {
                remainingRows.push(allData[i]);
            }
        }
        
        // Kết hợp dữ liệu của các user khác + dữ liệu mới duy nhất của user này
        var finalRows = remainingRows.concat(uniqueNewRows);
        
        // Xóa trắng vùng dữ liệu từ dòng 2 trở xuống (bảo vệ nguyên vẹn dòng tiêu đề số 1)
        sheet.getRange(2, 1, Math.max(lastRow - 1, 1), lastCol).clearContent();
        
        // Ghi lại toàn bộ dữ liệu sạch
        if (finalRows.length > 0) {
            sheet.getRange(2, 1, finalRows.length, finalRows[0].length).setValues(finalRows);
        }
    } else {
        if (uniqueNewRows.length > 0) {
            sheet.getRange(2, 1, uniqueNewRows.length, uniqueNewRows[0].length).setValues(uniqueNewRows);
        }
    }
}
// HÀM MỚI: Lấy chi tiết toàn bộ hồ sơ của nhiều Email
function getMultipleFullCVData(emails) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var result = [];
  if (!emails || emails.length === 0) return result;
  
  var sheetCoBan = ss.getSheetByName("ThongTinCoBan");
  var sheetBS = ss.getSheetByName("ThongTinBoSung");
  var sheetDT = ss.getSheetByName("QuaTrinhDaoTao");
  var sheetCT = ss.getSheetByName("QuaTrinhCongTac");
  var sheetDTamGia = ss.getSheetByName("DeTaiThamGia");
  var sheetCB = ss.getSheetByName("CongBoKhoaHoc");
  var sheetGT = ss.getSheetByName("GiaiThuong");
  
  var cbData = sheetCoBan ? sheetCoBan.getDataRange().getValues() : [];
  var bsData = sheetBS ? sheetBS.getDataRange().getValues() : [];
  var dtData = sheetDT ? sheetDT.getDataRange().getValues() : [];
  var ctData = sheetCT ? sheetCT.getDataRange().getValues() : [];
  var dtgData = sheetDTamGia ? sheetDTamGia.getDataRange().getValues() : [];
  var cbKhoaHocData = sheetCB ? sheetCB.getDataRange().getValues() : [];
  var gtData = sheetGT ? sheetGT.getDataRange().getValues() : [];
  
  var timeZone = "GMT+7";
  try {
    timeZone = Session.getScriptTimeZone() || "GMT+7";
  } catch(e) {}
  
  function formatSheetDate(val, fmt) {
    if (!val) return "";
    if (val instanceof Date) {
      try {
        return Utilities.formatDate(val, timeZone, fmt || "dd/MM/yyyy");
      } catch(e) {
        return String(val);
      }
    }
    var str = String(val).trim();
    if (fmt === "dd/MM/yyyy" && /^\d{4}-\d{2}-\d{2}$/.test(str)) {
      var p = str.split('-');
      return p[2] + '/' + p[1] + '/' + p[0];
    }
    return str;
  }

  for (var e = 0; e < emails.length; e++) {
    var rawTargetEmail = emails[e];
    var targetEmail = String(rawTargetEmail || "").trim().toLowerCase();
    if (!targetEmail) continue;

    var data = {
      basicInfo: {},
      bosung: {
        prefs: { thinhGiang: false, nghienCuu: false, hoiDong: false, huongDan: false, doanhNghiep: false },
        monHoc: [],
        huongNghienCuu: []
      },
      daotao: { hocVi: [], hocHam: [], ngoaiNgu: [] },
      daoTao: { hocVi: [], hocHam: [], ngoaiNgu: [] },
      congTac: [],
      deTai: [],
      congBo: { baiBao: [], seminar: [], sach: [] },
      giaiThuong: { khcn: [], chuyenGiao: [] }
    };
    
    // 1. Thông tin cơ bản (Đảm bảo lấy đúng dòng có dữ liệu của targetEmail)
    for (var i = 1; i < cbData.length; i++) {
      var rowEmail = String(cbData[i][0] || "").trim().toLowerCase();
      if (rowEmail === targetEmail) {
        var rowName = String(cbData[i][1] || "").trim();
        var strDob = formatSheetDate(cbData[i][3], "dd/MM/yyyy");
        var gVal = String(cbData[i][2] || "").trim();
        var strNgayCap = formatSheetDate(cbData[i][15], "dd/MM/yyyy");
        var donViFull = String(cbData[i][8] || "").trim();
        var khoaVal = String(cbData[i][18] || "").trim();
        var boMonVal = String(cbData[i][19] || "").trim();
        var truongVal = "";

        if ((!khoaVal || !boMonVal) && donViFull.indexOf(',') > -1) {
          var dParts = donViFull.split(',').map(function(s) { return s.trim(); });
          if (dParts.length >= 3) {
            if (!boMonVal) boMonVal = dParts[0];
            if (!khoaVal) khoaVal = dParts[1];
            truongVal = dParts[2];
          } else if (dParts.length === 2) {
            if (!khoaVal) khoaVal = dParts[0];
            truongVal = dParts[1];
          }
        }

        if (!data.basicInfo.name || rowName) {
          data.basicInfo = {
            email: String(cbData[i][0] || targetEmail).trim(),
            name: rowName,
            gioiTinh: gVal,
            genderNam: gVal.toLowerCase() === "nam",
            genderNu: gVal.toLowerCase() === "nữ",
            dob: strDob,
            noiSinh: String(cbData[i][4] || "").trim(),
            queQuan: String(cbData[i][5] || "").trim(),
            danToc: String(cbData[i][6] || "").trim(),
            chucVu: String(cbData[i][7] || "").trim(),
            donVi: donViFull,
            diaChi: String(cbData[i][9] || "").trim(),
            cq: String(cbData[i][10] || "").trim(),
            nr: String(cbData[i][11] || "").trim(),
            dd: String(cbData[i][12] || "").trim(),
            fax: String(cbData[i][13] || "").trim(),
            cccd: String(cbData[i][14] || "").trim(),
            ngayCap: strNgayCap,
            noiCap: String(cbData[i][16] || "").trim(),
            trangThai: String(cbData[i][17] || "Bản nháp").trim(),
            khoa: khoaVal,
            boMon: boMonVal,
            donViKhoa: khoaVal,
            donViBoMon: boMonVal,
            donViTruong: truongVal
          };
        }
      }
    }
    
    // 2. Thông tin bổ sung
    for (var b = 1; b < bsData.length; b++) {
      if (String(bsData[b][0] || "").trim().toLowerCase() === targetEmail) {
        var pLoai = String(bsData[b][1] || "").trim();
        if (pLoai === "Tùy chỉnh nguyện vọng") {
          data.bosung.prefs = {
            thinhGiang: String(bsData[b][5] || "").toLowerCase() === "có",
            nghienCuu: String(bsData[b][6] || "").toLowerCase() === "có",
            hoiDong: String(bsData[b][7] || "").toLowerCase() === "có",
            huongDan: String(bsData[b][8] || "").toLowerCase() === "có",
            doanhNghiep: String(bsData[b][9] || "").toLowerCase() === "có"
          };
        } else if (pLoai === "Môn học") {
          data.bosung.monHoc.push({
            major: String(bsData[b][2] || "").trim(),
            name: String(bsData[b][3] || "").trim(),
            desc: String(bsData[b][4] || "").trim()
          });
        } else if (pLoai === "Hướng nghiên cứu") {
          data.bosung.huongNghienCuu.push({
            major: String(bsData[b][2] || "").trim(),
            name: String(bsData[b][3] || "").trim(),
            desc: String(bsData[b][4] || "").trim()
          });
        }
      }
    }
    
    // 3. Quá trình đào tạo
    for (var k = 1; k < dtData.length; k++) {
      if (String(dtData[k][0] || "").trim().toLowerCase() === targetEmail) {
        var loaiDT = String(dtData[k][1] || "").trim();
        if (loaiDT === 'Học vị') {
          var bacHocVal = "";
          var chucDanhVal = "";
          var nganhVal = "";
          var noiVal = "";
          var nuocVal = "";
          var namVal = "";
          var chiTietVal = "";

          var is9ColFormat = false;
          if (dtData[k].length >= 8 && /^\d{4}$/.test(String(dtData[k][7] || "").trim())) {
            is9ColFormat = true;
          } else if (dtData[k].length >= 8 && !/^\d{4}$/.test(String(dtData[k][5] || "").trim())) {
            is9ColFormat = true;
          }

          var heDaoTaoVal = "";
          if (is9ColFormat) {
            bacHocVal = String(dtData[k][2] || "").trim();
            chucDanhVal = String(dtData[k][3] || "").trim();
            nganhVal = String(dtData[k][4] || "").trim();
            noiVal = String(dtData[k][5] || "").trim();
            nuocVal = String(dtData[k][6] || "").trim();
            namVal = String(dtData[k][7] || "").trim();
            chiTietVal = String(dtData[k][8] || "").trim();
            heDaoTaoVal = (dtData[k].length >= 10) ? String(dtData[k][9] || "").trim() : "";
          } else {
            bacHocVal = String(dtData[k][2] || "").trim();
            chucDanhVal = String(dtData[k][3] || "").trim();
            noiVal = String(dtData[k][4] || "").trim();
            namVal = String(dtData[k][5] || "").trim();
            chiTietVal = String(dtData[k][6] || "").trim();
          }

          if (!heDaoTaoVal && (bacHocVal === 'Đại học' || chucDanhVal === 'Cử nhân' || chucDanhVal === 'Kỹ sư')) {
            var isHeMode = /^(chính quy|chất lượng cao|từ xa|vừa làm vừa học|văn bằng 2|liên thông|tại chức|clc)/i.test(chiTietVal);
            if (isHeMode) {
              heDaoTaoVal = chiTietVal;
              chiTietVal = "";
            } else {
              heDaoTaoVal = "Chính quy";
            }
          }

          var itemHV = {
            hocVi: bacHocVal,
            bacHoc: chucDanhVal,
            chucDanh: chucDanhVal,
            title: chucDanhVal ? (bacHocVal + " (" + chucDanhVal + ")") : bacHocVal,
            nganh: nganhVal,
            noi: noiVal,
            noiDaoTao: noiVal,
            nuoc: nuocVal,
            nam: namVal,
            chiTiet: chiTietVal,
            heDaoTao: heDaoTaoVal
          };
          data.daotao.hocVi.push(itemHV);
          data.daoTao.hocVi.push(itemHV);
        } else if (loaiDT === 'Học hàm') {
          var itemHH = {
            chucDanh: String(dtData[k][3] || dtData[k][2] || "").trim(),
            nganh: String(dtData[k][4] || dtData[k][3] || "").trim(),
            nam: String(dtData[k][7] || dtData[k][5] || "").trim()
          };
          data.daotao.hocHam.push(itemHH);
          data.daoTao.hocHam.push(itemHH);
        } else if (loaiDT === 'Ngoại ngữ') {
          var itemNN = {
            ngonNgu: String(dtData[k][2] || "").trim(),
            mucDo: String(dtData[k][5] || dtData[k][4] || "").trim(),
            chungChi: String(dtData[k][8] || dtData[k][6] || "").trim()
          };
          data.daotao.ngoaiNgu.push(itemNN);
          data.daoTao.ngoaiNgu.push(itemNN);
        }
      }
    }
    
    // 4. Quá trình công tác
    for (var c = 1; c < ctData.length; c++) {
      if (String(ctData[c][0] || "").trim().toLowerCase() === targetEmail) {
        var strTu = formatSheetDate(ctData[c][1], "dd/MM/yyyy");
        var rawDen = String(ctData[c][2] || "").trim();
        var denLoai = rawDen === 'Hiện tại' ? 'HienTai' : 'NgayKhac';
        var strDen = denLoai === 'HienTai' ? 'Hiện tại' : formatSheetDate(ctData[c][2], "dd/MM/yyyy");
        var noiCongTac = String(ctData[c][3] || "").trim();
        var chucDanh = String(ctData[c][4] || "").trim();
        var moTa = String(ctData[c][5] || "").trim();
        data.congTac.push({
          tu: strTu,
          tuNgay: strTu,
          denLoai: denLoai,
          denNgay: denLoai === 'HienTai' ? '' : strDen,
          noi: noiCongTac,
          noiCongTac: noiCongTac,
          donVi: noiCongTac,
          chucDanh: chucDanh,
          chucVu: chucDanh,
          moTa: moTa
        });
      }
    }
    
    // 5. Đề tài tham gia
    for (var d = 1; d < dtgData.length; d++) {
      if (String(dtgData[d][0] || "").trim().toLowerCase() === targetEmail) {
        var strBD = formatSheetDate(dtgData[d][2], "yyyy-MM-dd");
        var strNT = formatSheetDate(dtgData[d][3], "yyyy-MM-dd");
        data.deTai.push({
          ten: String(dtgData[d][1] || "").trim(),
          batDau: strBD,
          nghiemThu: strNT,
          cap: String(dtgData[d][4] || "").trim(),
          xepHang: String(dtgData[d][5] || "").trim(),
          chucVu: String(dtgData[d][6] || "").trim(),
          kinhPhi: String(dtgData[d][7] || "").trim(),
          donVi: String(dtgData[d][8] || "").trim()
        });
      }
    }
    
    // 6. Công bố khoa học
    for (var cb = 1; cb < cbKhoaHocData.length; cb++) {
      if (String(cbKhoaHocData[cb][0] || "").trim().toLowerCase() === targetEmail) {
        var loaiCB = String(cbKhoaHocData[cb][1] || "").trim();
        var rawNam = String(cbKhoaHocData[cb][4] || "").trim();
        var namParts = rawNam.split('/');
        var thang = namParts.length > 1 ? namParts[0].trim() : '';
        var nam = namParts.length > 1 ? namParts[1].trim() : namParts[0].trim();
        
        if (loaiCB === 'Bài báo') {
          data.congBo.baiBao.push({
            ten: String(cbKhoaHocData[cb][2] || "").trim(),
            tacGia: String(cbKhoaHocData[cb][3] || "").trim(),
            thang: thang,
            nam: nam,
            noiXB: String(cbKhoaHocData[cb][5] || "").trim(),
            tapChi: String(cbKhoaHocData[cb][5] || "").trim(),
            chiSo: String(cbKhoaHocData[cb][6] || "").trim(),
            url: String(cbKhoaHocData[cb][7] || "").trim(),
            filePdf: String(cbKhoaHocData[cb][8] || "").trim(),
            pdfUrl: String(cbKhoaHocData[cb][8] || "").trim()
          });
        } else if (loaiCB === 'Seminar') {
          data.congBo.seminar.push({
            ten: String(cbKhoaHocData[cb][2] || "").trim(),
            diaDiem: String(cbKhoaHocData[cb][3] || "").trim(),
            hinhThuc: String(cbKhoaHocData[cb][5] || "").trim(),
            thang: thang,
            nam: nam,
            thongTin: String(cbKhoaHocData[cb][6] || "").trim()
          });
        } else if (loaiCB === 'Sách') {
          data.congBo.sach.push({
            ten: String(cbKhoaHocData[cb][2] || "").trim(),
            noiXB: String(cbKhoaHocData[cb][5] || "").trim(),
            thang: thang,
            nam: nam,
            thongTin: String(cbKhoaHocData[cb][6] || "").trim()
          });
        }
      }
    }
    
    // 7. Giải thưởng
    for (var g = 1; g < gtData.length; g++) {
      if (String(gtData[g][0] || "").trim().toLowerCase() === targetEmail) {
        var loaiGT = String(gtData[g][1] || "").trim();
        var itemGT = {
          ten: String(gtData[g][2] || "").trim(),
          noi: String(gtData[g][3] || "").trim(),
          nam: String(gtData[g][4] || "").trim(),
          noiDung: String(gtData[g][5] || "").trim()
        };
        if (loaiGT === 'KHCN') {
          data.giaiThuong.khcn.push(itemGT);
        } else if (loaiGT === 'Chuyển giao') {
          data.giaiThuong.chuyenGiao.push(itemGT);
        }
      }
    }

    result.push(data);
  }
  return result;
}

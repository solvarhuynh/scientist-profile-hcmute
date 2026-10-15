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
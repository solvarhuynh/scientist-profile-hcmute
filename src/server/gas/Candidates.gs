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

const fs = require('fs');
const path = 'd:\\khanh\\Code.gs';

let content = fs.readFileSync(path, 'utf8');

const targetFunctionRegex = /\/\/ HÀM MỚI: Lấy chi tiết toàn bộ hồ sơ của nhiều Email[\s\S]*?function getMultipleFullCVData\(emails\)[\s\S]*?\n\}/;

const newFunction = `// HÀM MỚI: Lấy chi tiết toàn bộ hồ sơ của nhiều Email
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
    return String(val).trim();
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
    
    // 1. Thông tin cơ bản
    for (var i = 1; i < cbData.length; i++) {
      var rowEmail = String(cbData[i][0] || "").trim().toLowerCase();
      if (rowEmail === targetEmail) {
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

        data.basicInfo = {
          email: String(cbData[i][0] || targetEmail).trim(),
          name: String(cbData[i][1] || "").trim(),
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
        break;
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
          var itemHV = {
            hocVi: String(dtData[k][2] || "").trim(),
            nganh: String(dtData[k][3] || "").trim(),
            noi: String(dtData[k][4] || "").trim(),
            nam: String(dtData[k][5] || "").trim(),
            chiTiet: String(dtData[k][6] || "").trim()
          };
          data.daotao.hocVi.push(itemHV);
          data.daoTao.hocVi.push(itemHV);
        } else if (loaiDT === 'Học hàm') {
          var itemHH = {
            chucDanh: String(dtData[k][2] || "").trim(),
            nganh: String(dtData[k][3] || "").trim(),
            nam: String(dtData[k][5] || "").trim()
          };
          data.daotao.hocHam.push(itemHH);
          data.daoTao.hocHam.push(itemHH);
        } else if (loaiDT === 'Ngoại ngữ') {
          var itemNN = {
            ngonNgu: String(dtData[k][2] || "").trim(),
            mucDo: String(dtData[k][4] || "").trim(),
            chungChi: String(dtData[k][6] || "").trim()
          };
          data.daotao.ngoaiNgu.push(itemNN);
          data.daoTao.ngoaiNgu.push(itemNN);
        }
      }
    }
    
    // 4. Quá trình công tác
    for (var c = 1; c < ctData.length; c++) {
      if (String(ctData[c][0] || "").trim().toLowerCase() === targetEmail) {
        var strTu = formatSheetDate(ctData[c][1], "MM-yyyy");
        var strDen = formatSheetDate(ctData[c][2], "MM-yyyy");
        var denLoai = String(ctData[c][2] || "").trim() === 'Hiện tại' ? 'HienTai' : 'NgayKhac';
        data.congTac.push({
          tu: strTu,
          denLoai: denLoai,
          denNgay: denLoai === 'HienTai' ? '' : strDen,
          noi: String(ctData[c][3] || "").trim(),
          chucDanh: String(ctData[c][4] || "").trim(),
          moTa: String(ctData[c][5] || "").trim()
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
}`;

if (!targetFunctionRegex.test(content)) {
  console.error("Target regex not matched!");
  process.exit(1);
}

content = content.replace(targetFunctionRegex, newFunction);
fs.writeFileSync(path, content, 'utf8');
console.log("Updated Code.gs successfully!");


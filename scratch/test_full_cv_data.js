// Test script to verify full CV data extraction matching Google Sheets structure
const assert = require('assert');

function mockGetMultipleFullCVData(emails, mockSheets) {
  var result = [];
  if (!emails || emails.length === 0) return result;
  
  var cbData = mockSheets["ThongTinCoBan"] || [];
  var bsData = mockSheets["ThongTinBoSung"] || [];
  var dtData = mockSheets["QuaTrinhDaoTao"] || [];
  var ctData = mockSheets["QuaTrinhCongTac"] || [];
  var dtgData = mockSheets["DeTaiThamGia"] || [];
  var cbKhoaHocData = mockSheets["CongBoKhoaHoc"] || [];
  var gtData = mockSheets["GiaiThuong"] || [];
  
  function formatSheetDate(val) {
    if (!val) return "";
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
        var strDob = formatSheetDate(cbData[i][3]);
        var gVal = String(cbData[i][2] || "").trim();
        var strNgayCap = formatSheetDate(cbData[i][15]);
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
        var strTu = formatSheetDate(ctData[c][1]);
        var strDen = formatSheetDate(ctData[c][2]);
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
        var strBD = formatSheetDate(dtgData[d][2]);
        var strNT = formatSheetDate(dtgData[d][3]);
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

// Test with Image 2 data
const mockSheets = {
  ThongTinCoBan: [
    ['Email', 'HoVaTen', 'GioiTinh', 'NgaySinh', 'NoiSinh', 'QueQuan', 'DanToc', 'ChucVu', 'DonVi', 'DiaChi', 'CQ', 'NR', 'DD', 'Fax', 'CCCD', 'NgayCap', 'NoiCap', 'TrangThai', 'Khoa', 'BoMon'],
    ['admin@hcmute.edu.vn', 'Quản Trị Viên', 'Nam', '01/01/1980', 'Hà Nội', 'Hà Nội', 'Kinh', 'Admin', 'Khoa CNTT', 'Số 1 VVN', '', '', '0901111111', '', '', '', '', 'Đã duyệt tự động', 'Khoa Công nghệ Thông tin', 'Bộ môn Phần mềm'],
    ['24133903@student.hcmute.edu.vn', 'Huỳnh Trung Nghĩa', 'Nam', '14/04/2004', 'TP. Hồ Chí Minh', 'TP. Hồ Chí Minh', 'Kinh', 'Giảng viên', 'Khoa Điện - Điện tử', '1 Võ Văn Ngân, Linh Chiểu, Thủ Đức', '0281234567', '', '0909999999', '', '079204001234', '15/05/2021', 'Cục Cảnh sát QLHC', 'Bản nháp', 'Khoa Điện - Điện tử', 'Bộ môn Tự động hóa']
  ],
  ThongTinBoSung: [
    ['Email', 'PhanLoai', 'Nganh', 'Ten', 'MoTa', 'ThinhGiang', 'NghienCuu', 'HoiDong', 'HuongDan', 'DoanhNghiep'],
    ['24133903@student.hcmute.edu.vn', 'Tùy chỉnh nguyện vọng', '', '', '', 'Có', 'Có', 'Không', 'Có', 'Không'],
    ['24133903@student.hcmute.edu.vn', 'Môn học', 'Kỹ thuật Điện', 'Vi điều khiển nâng cao', 'Giảng dạy lý thuyết và thực hành', '', '', '', '', '']
  ],
  QuaTrinhDaoTao: [
    ['Email', 'Loai', 'HocVi', 'Nganh', 'Noi', 'Nam', 'ChiTiet'],
    ['24133903@student.hcmute.edu.vn', 'Học vị', 'Thạc sĩ', 'Kỹ thuật Điều khiển', 'ĐH Bách Khoa', '2022', 'Loại Giỏi']
  ],
  QuaTrinhCongTac: [
    ['Email', 'Tu', 'Den', 'Noi', 'ChucDanh', 'MoTa'],
    ['24133903@student.hcmute.edu.vn', '09-2022', 'Hiện tại', 'HCMUTE', 'Giảng viên', 'Giảng dạy và NCKH']
  ],
  DeTaiThamGia: [
    ['Email', 'Ten', 'BatDau', 'NghiemThu', 'Cap', 'XepHang', 'ChucVu', 'KinhPhi', 'DonVi'],
    ['24133903@student.hcmute.edu.vn', 'Nghiên cứu IoT thông minh', '2023-01-01', '2023-12-31', 'Cấp Trường', 'Tốt', 'Chủ nhiệm', '50.000.000', 'VND']
  ],
  CongBoKhoaHoc: [
    ['Email', 'Type', 'Tên công trình', 'Tác giả', 'Năm XB', 'Nơi XB', 'Chỉ số', 'URL', 'File PDF'],
    ['24133903@student.hcmute.edu.vn', 'Bài báo', 'Smart Grid Monitoring', 'Huỳnh Trung Nghĩa', '10/2023', 'IEEE Transactions', 'Q1', 'https://doi.org/...', 'https://drive.google.com/file/d/xyz']
  ],
  GiaiThuong: [
    ['Email', 'Loai', 'Ten', 'Noi', 'Nam', 'NoiDung'],
    ['24133903@student.hcmute.edu.vn', 'KHCN', 'Giải Nhất Sáng Tạo Trẻ', 'TP.HCM', '2023', 'Hệ thống năng lượng tái tạo']
  ]
};

const results = mockGetMultipleFullCVData(['24133903@student.hcmute.edu.vn'], mockSheets);
console.log('Result count:', results.length);
assert.strictEqual(results.length, 1);
const userCV = results[0];

console.log('Basic Info:', userCV.basicInfo);
assert.strictEqual(userCV.basicInfo.name, 'Huỳnh Trung Nghĩa');
assert.strictEqual(userCV.basicInfo.gioiTinh, 'Nam');
assert.strictEqual(userCV.basicInfo.genderNam, true);
assert.strictEqual(userCV.basicInfo.dob, '14/04/2004');
assert.strictEqual(userCV.basicInfo.cccd, '079204001234');
assert.strictEqual(userCV.basicInfo.khoa, 'Khoa Điện - Điện tử');

console.log('Bo sung prefs:', userCV.bosung.prefs);
assert.strictEqual(userCV.bosung.prefs.thinhGiang, true);
assert.strictEqual(userCV.bosung.prefs.hoiDong, false);
assert.strictEqual(userCV.bosung.monHoc.length, 1);

console.log('Dao tao:', userCV.daotao);
assert.strictEqual(userCV.daotao.hocVi.length, 1);
assert.strictEqual(userCV.daotao.hocVi[0].hocVi, 'Thạc sĩ');

console.log('Cong tac:', userCV.congTac);
assert.strictEqual(userCV.congTac.length, 1);
assert.strictEqual(userCV.congTac[0].denLoai, 'HienTai');

console.log('De tai:', userCV.deTai);
assert.strictEqual(userCV.deTai.length, 1);
assert.strictEqual(userCV.deTai[0].kinhPhi, '50.000.000');

console.log('Cong bo:', userCV.congBo);
assert.strictEqual(userCV.congBo.baiBao.length, 1);
assert.strictEqual(userCV.congBo.baiBao[0].filePdf, 'https://drive.google.com/file/d/xyz');

console.log('Giai thuong:', userCV.giaiThuong);
assert.strictEqual(userCV.giaiThuong.khcn.length, 1);
assert.strictEqual(userCV.giaiThuong.khcn[0].ten, 'Giải Nhất Sáng Tạo Trẻ');

console.log('\n>>> ALL CV DATA EXTRACTION TESTS PASSED 100%! <<<');


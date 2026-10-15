// Central Application State
var appData = {
  basicInfo: {
    name: "", dob: "", genderNam: true, genderNu: false,
    noiSinh: "", queQuan: "", danToc: "Kinh", chucVu: "", donVi: "",
    diaChi: "", cq: "", nr: "", dd: "", fax: "", email: "",
    soCCCD: "", ngayCap: "", noiCap: ""
  },
  daotao: {
    hocVi: [], hocHam: [], ngoaiNgu: []
  },
  daoTao: {
    hocVi: [], hocHam: [], ngoaiNgu: []
  },
  congTac: [],
  deTai: [],
  congBo: {
    baiBao: [], seminar: [], sach: []
  },
  giaiThuong: {
    khcn: [], chuyenGiao: []
  },
  bosung: {
    prefs: {
      thinhGiang: false, nghienCuu: false, hoiDong: false, huongDan: false, doanhNghiep: false
    },
    monHoc: [],
    huongNghienCuu: []
  }
};

window.currentActiveRole = 'user';
window.activeExportCandidate = null;
window.globalAdminData = null;
window.parsedImportDataCache = null;

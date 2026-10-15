const fs = require('fs');
const filePath = 'd:\\khanh\\Index.html';

let content = fs.readFileSync(filePath, 'utf8');

// 1. UPDATE updateWelcomeMessage
const oldWelcomeMsgRegex = /\/\/ Cập nhật lời chào: Có tên -> hiện tên viết hoa chữ cái đầu; Chưa có tên -> hiện gmail\/email[\s\S]*?function updateWelcomeMessage\(\) \{[\s\S]*?\n    \}/;

const newWelcomeMsg = `// Cập nhật lời chào: Có tên -> hiện tên viết hoa chữ cái đầu; Chưa có tên -> hiện gmail/email
    function updateWelcomeMessage() {
        var emailInput = document.getElementById('emailInput');
        var nameInput = document.getElementById('nameInput');
        
        var email = (emailInput && emailInput.value) ? emailInput.value.trim() : ((appData && appData.basicInfo && appData.basicInfo.email) ? appData.basicInfo.email.trim() : (window.currentUserEmail || sessionStorage.getItem('currentUserEmail') || localStorage.getItem('currentUserEmail') || ''));
        var name = (nameInput && nameInput.value) ? nameInput.value.trim() : ((appData && appData.basicInfo && appData.basicInfo.name) ? appData.basicInfo.name.trim() : '');
        
        var displaySpan = document.getElementById('welcomeNameDisplay');
        var topbarSpan = document.getElementById('topbar-name');
        var topbarAvatar = document.getElementById('topbar-avatar');

        var honorific = typeof getTeacherHonorific === 'function' ? getTeacherHonorific() : 'Thầy/Cô';

        var displayName = '';
        if (name) {
            displayName = formatCapitalizeWords(name);
        } else if (email) {
            displayName = email;
        } else {
            displayName = honorific;
        }

        if (displaySpan) displaySpan.innerText = name ? (honorific + ' ' + displayName) : displayName;
        if (topbarSpan) topbarSpan.innerText = displayName;
        if (topbarAvatar && displayName) {
            if (name) {
                topbarAvatar.innerText = displayName.charAt(0).toUpperCase();
            } else if (email) {
                topbarAvatar.innerText = email.charAt(0).toUpperCase();
            } else {
                topbarAvatar.innerText = (honorific === 'Thầy') ? 'T' : ((honorific === 'Cô') ? 'C' : 'TC');
            }
        }
        
        // Cập nhật Banner Chào mừng và Thẻ thông tin Tổng quan Giảng viên
        if (typeof renderUserOverview === 'function') {
            renderUserOverview();
        }
    }`;

if (!oldWelcomeMsgRegex.test(content)) {
  console.error("oldWelcomeMsgRegex not matched!");
  process.exit(1);
}
content = content.replace(oldWelcomeMsgRegex, newWelcomeMsg);
console.log("Updated updateWelcomeMessage successfully!");

// 2. UPDATE loadFromDatabase
const oldLoadFromDbRegex = /function loadFromDatabase\(\) \{[\s\S]*?\.getUserProfileData\(emailForProfile\);[\s\S]*?\}\s*\}\s*\}/;

const newLoadFromDb = `function loadFromDatabase(targetEmail) {
    var emailKey = getEmailKey();
    var stored = null;
    // Bọc localStorage để chặn lỗi làm đứng trang
    try {
        stored = localStorage.getItem(emailKey);
    } catch (e) {
        console.warn("Trình duyệt chặn localStorage.");
    }
    
    if (stored) {
        try {
            var parsed = JSON.parse(stored);
            if (parsed.basicInfo) appData.basicInfo = parsed.basicInfo;
            if (parsed.bosung) {
                appData.bosung.monHoc = parsed.bosung.monHoc || [];
                appData.bosung.huongNghienCuu = parsed.bosung.huongNghienCuu || [];
                appData.bosung.prefs = parsed.bosung.prefs || {};
            }
            if (parsed.daotao) {
                appData.daotao.hocVi = parsed.daotao.hocVi || [];
                appData.daotao.hocHam = parsed.daotao.hocHam || [];
                appData.daotao.ngoaiNgu = parsed.daotao.ngoaiNgu || [];
            }
            if (parsed.congTac) appData.congTac = parsed.congTac;
            if (parsed.deTai) appData.deTai = parsed.deTai;
            if (parsed.congBo) {
                appData.congBo.baiBao = parsed.congBo.baiBao || [];
                appData.congBo.seminar = parsed.congBo.seminar || [];
                appData.congBo.sach = parsed.congBo.sach || [];
            }
            if (parsed.giaiThuong) {
                appData.giaiThuong.khcn = parsed.giaiThuong.khcn || [];
                appData.giaiThuong.chuyenGiao = parsed.giaiThuong.chuyenGiao || [];
            }
        } catch (e) { console.error("Lỗi parse data:", e); }
    }
    
    // Hiển thị ngay dữ liệu tạm thời
    populateBasicInfo(); 
    populateBosungPrefs();
    renderBosungTable(); 
    renderDaoTaoTable();
    renderCongTacTable(); 
    renderDeTaiTable();
    renderCongBoTable();
    renderGiaiThuongTable();
    initKhoaBoMon(); 
    populateYearFilter(); 
    updateWelcomeMessage();
    if (typeof renderUserOverview === 'function') renderUserOverview();
    updateDashboardStats();

    // Luôn ưu tiên kiểm tra và đồng bộ đầy đủ các mục từ Google Sheets
    if (typeof google !== 'undefined' && google.script && google.script.run) {
        var emailForProfile = targetEmail || (document.getElementById('emailInput') ? document.getElementById('emailInput').value : '') || sessionStorage.getItem('currentUserEmail') || localStorage.getItem('currentUserEmail') || '';
        if (emailForProfile && emailForProfile.trim() !== '') {
            google.script.run
            .withSuccessHandler(function(serverData) {
                if (serverData) {
                    if (serverData.basicInfo && Object.keys(serverData.basicInfo).length > 0) {
                        appData.basicInfo = Object.assign(appData.basicInfo || {}, serverData.basicInfo);
                    }
                    if (serverData.bosung) {
                        if (!appData.bosung) appData.bosung = { prefs: {}, monHoc: [], huongNghienCuu: [] };
                        if (serverData.bosung.prefs) appData.bosung.prefs = serverData.bosung.prefs;
                        if (serverData.bosung.monHoc) appData.bosung.monHoc = serverData.bosung.monHoc;
                        if (serverData.bosung.huongNghienCuu) appData.bosung.huongNghienCuu = serverData.bosung.huongNghienCuu;
                    }
                    var dt = serverData.daoTao || serverData.daotao;
                    if (dt) {
                        if (!appData.daotao) appData.daotao = { hocVi: [], hocHam: [], ngoaiNgu: [] };
                        if (dt.hocVi) appData.daotao.hocVi = dt.hocVi;
                        if (dt.hocHam) appData.daotao.hocHam = dt.hocHam;
                        if (dt.ngoaiNgu) appData.daotao.ngoaiNgu = dt.ngoaiNgu;
                    }
                    if (serverData.congTac) appData.congTac = serverData.congTac;
                    if (serverData.deTai) appData.deTai = serverData.deTai;
                    if (serverData.congBo) {
                        if (!appData.congBo) appData.congBo = { baiBao: [], seminar: [], sach: [] };
                        if (serverData.congBo.baiBao) appData.congBo.baiBao = serverData.congBo.baiBao;
                        if (serverData.congBo.seminar) appData.congBo.seminar = serverData.congBo.seminar;
                        if (serverData.congBo.sach) appData.congBo.sach = serverData.congBo.sach;
                    }
                    if (serverData.giaiThuong) {
                        if (!appData.giaiThuong) appData.giaiThuong = { khcn: [], chuyenGiao: [] };
                        if (serverData.giaiThuong.khcn) appData.giaiThuong.khcn = serverData.giaiThuong.khcn;
                        if (serverData.giaiThuong.chuyenGiao) appData.giaiThuong.chuyenGiao = serverData.giaiThuong.chuyenGiao;
                    }
                    
                    populateBasicInfo(); 
                    populateBosungPrefs();
                    renderBosungTable(); 
                    renderDaoTaoTable();
                    renderCongTacTable(); 
                    renderDeTaiTable();
                    renderCongBoTable();
                    renderGiaiThuongTable();
                    updateWelcomeMessage();
                    if (typeof renderUserOverview === 'function') renderUserOverview();
                    updateDashboardStats();
                    try { localStorage.setItem(getEmailKey(), JSON.stringify(appData)); } catch(e){}
                }
            })
            .withFailureHandler(function(err) {
                console.error("Lỗi getUserProfileData:", err);
            })
            .getUserProfileData(emailForProfile);
        }
    }
}`;

if (!oldLoadFromDbRegex.test(content)) {
  console.error("oldLoadFromDbRegex not matched!");
  process.exit(1);
}
content = content.replace(oldLoadFromDbRegex, newLoadFromDb);
console.log("Updated loadFromDatabase successfully!");

// 3. UPDATE populateSelect inside loadDropdownData
content = content.replace(
  'function populateSelect(selectEl, list) {\n                    if(!selectEl) return;',
  'function populateSelect(selectEl, list) {\n                    if(!selectEl || selectEl.tagName !== "SELECT") return;'
);
content = content.replace(
  'function populateSelect(selectEl, list) {\n                if(!selectEl) return;',
  'function populateSelect(selectEl, list) {\n                if(!selectEl || selectEl.tagName !== "SELECT") return;'
);
console.log("Updated loadDropdownData select check!");

// 4. UPDATE DOMContentLoaded loadFromDatabase calls
content = content.replace(
  "updateWelcomeMessage();\n                    loadFromDatabase();",
  "updateWelcomeMessage();\n                    loadFromDatabase(emailToUse);"
);
content = content.replace(
  "updateWelcomeMessage();\n                loadFromDatabase();",
  "updateWelcomeMessage();\n                loadFromDatabase(emailToUse);"
);
content = content.replace(
  "updateWelcomeMessage();\n            loadFromDatabase();",
  "updateWelcomeMessage();\n            loadFromDatabase(emailToUse);"
);

// 5. ADD getHighestDegreeText and renderUserOverview
const userOverviewHeader = `// --- SỬA 2: USER OVERVIEW (TỔNG QUAN HỒ SƠ ẢNH 1) ---`;
const userOverviewImplementation = `// --- SỬA 2: USER OVERVIEW (TỔNG QUAN HỒ SƠ ẢNH 1) ---
function getHighestDegreeText() {
  var hocHamStr = '';
  var hocViStr = '';
  
  if (appData && (appData.daotao || appData.daoTao)) {
    var dt = appData.daotao || appData.daoTao;
    var hocHamList = dt.hocHam || [];
    for (var i = 0; i < hocHamList.length; i++) {
      var cd = (hocHamList[i].chucDanh || '').toUpperCase();
      if (cd.includes('GS') || cd.includes('GIÁO SƯ')) {
        hocHamStr = 'GS.';
        break;
      } else if (cd.includes('PGS') || cd.includes('PHÓ GIÁO SƯ')) {
        hocHamStr = 'PGS.';
      }
    }
    
    var hocViList = dt.hocVi || [];
    var degreeRank = 0;
    for (var j = 0; j < hocViList.length; j++) {
      var hv = (hocViList[j].hocVi || '').toUpperCase();
      if (hv.includes('TIẾN SĨ') || hv.includes('TS') || hv.includes('PHD')) {
        if (degreeRank < 4) { degreeRank = 4; hocViStr = 'Tiến sĩ'; }
      } else if (hv.includes('THẠC SĨ') || hv.includes('THS') || hv.includes('MASTER')) {
        if (degreeRank < 3) { degreeRank = 3; hocViStr = 'Thạc sĩ'; }
      } else if (hv.includes('KỸ SƯ') || hv.includes('KS') || hv.includes('ENGINEER')) {
        if (degreeRank < 2) { degreeRank = 2; hocViStr = 'Kỹ sư'; }
      } else if (hv.includes('CỬ NHÂN') || hv.includes('CN') || hv.includes('BACHELOR')) {
        if (degreeRank < 1) { degreeRank = 1; hocViStr = 'Cử nhân'; }
      }
    }
  }
  
  if (hocHamStr && hocViStr) return hocHamStr + ' ' + hocViStr;
  if (hocHamStr) return hocHamStr;
  if (hocViStr) return hocViStr;
  return 'Đang cập nhật';
}

function renderUserOverview() {
  var b = (appData && appData.basicInfo) ? appData.basicInfo : {};
  var nameInput = document.getElementById('nameInput');
  var emailInput = document.getElementById('emailInput');
  
  var name = (nameInput && nameInput.value) ? nameInput.value.trim() : (b.name ? b.name.trim() : '');
  var email = (emailInput && emailInput.value) ? emailInput.value.trim() : (b.email ? b.email.trim() : (sessionStorage.getItem('currentUserEmail') || localStorage.getItem('currentUserEmail') || ''));
  
  var honorific = typeof getTeacherHonorific === 'function' ? getTeacherHonorific() : 'Thầy/Cô';
  var formattedName = typeof formatCapitalizeWords === 'function' ? formatCapitalizeWords(name) : name;
  
  // 1. CẬP NHẬT HERO BANNER (ẢNH TRƯỜNG HCMUTE)
  var heroHonorificEl = document.getElementById('userHeroGreetingHonorific');
  var heroNameEl = document.getElementById('userHeroName');
  var heroSubEl = document.getElementById('userHeroSubtitle');
  
  if (heroHonorificEl) {
    heroHonorificEl.innerText = honorific;
  }
  if (heroNameEl) {
    heroNameEl.innerText = formattedName ? (' ' + formattedName) : '';
  }
  if (heroSubEl) {
    heroSubEl.innerText = 'Chào mừng ' + honorific + (formattedName ? (' ' + formattedName) : '') + ' đến với Cổng thông tin Lý lịch Khoa học. Cùng quản lý, chuẩn hóa hồ sơ và khẳng định thành tựu công bố nghiên cứu chuyên môn.';
  }
  
  // 2. CẬP NHẬT PROFILE SUMMARY CARD (THÔNG TIN TỔNG QUAN GIẢNG VIÊN)
  var cardAvatarEl = document.getElementById('userOverviewAvatar');
  var cardNameEl = document.getElementById('userOverviewName');
  var cardDegreeEl = document.getElementById('userOverviewHighestDegree');
  var cardDeptEl = document.getElementById('userOverviewDept');
  var cardEmailEl = document.getElementById('userOverviewEmail');
  var cardPhoneEl = document.getElementById('userOverviewPhone');
  
  if (cardAvatarEl) {
    if (formattedName) {
      var parts = formattedName.split(' ');
      var initial = parts[parts.length - 1].charAt(0).toUpperCase();
      cardAvatarEl.innerText = initial;
    } else {
      cardAvatarEl.innerText = 'GV';
    }
  }
  
  if (cardNameEl) {
    cardNameEl.innerText = name ? formattedName.toUpperCase() : '[HỌ VÀ TÊN]';
  }
  
  if (cardDegreeEl) {
    cardDegreeEl.innerText = getHighestDegreeText();
  }
  
  if (cardDeptEl) {
    var deptText = b.donViKhoa || b.khoa || b.donVi || '';
    if (!deptText && document.getElementById('donViKhoaSelect')) {
      deptText = document.getElementById('donViKhoaSelect').value;
    }
    cardDeptEl.innerText = deptText || 'Khoa / Viện trực thuộc';
  }
  
  if (cardEmailEl) {
    cardEmailEl.innerText = email || 'email@hcmute.edu.vn';
  }
  
  if (cardPhoneEl) {
    var phone = b.dd || b.nr || b.cq || '';
    if (!phone && document.getElementById('ddInput')) {
      phone = document.getElementById('ddInput').value;
    }
    cardPhoneEl.innerText = phone || '090xxxxxxx';
  }

  // 3. CẬP NHẬT 5 THẺ CHỈ SỐ METRIC THỐNG KÊ TRÊN DASHBOARD USER
  var statPapersEl = document.getElementById('statUserPapers');
  var statProjectsEl = document.getElementById('statUserProjects');
  var statAwardsEl = document.getElementById('statUserAwards');
  var statBooksEl = document.getElementById('statUserBooks');
  var statExpYearsEl = document.getElementById('statUserExpYears');

  if (statPapersEl) {
    statPapersEl.innerText = (appData.congBo && appData.congBo.baiBao) ? appData.congBo.baiBao.length : 0;
  }
  if (statProjectsEl) {
    statProjectsEl.innerText = (appData.deTai) ? appData.deTai.length : 0;
  }
  if (statAwardsEl) {
    var numAwards = 0;
    if (appData.giaiThuong) {
      numAwards = (appData.giaiThuong.khcn ? appData.giaiThuong.khcn.length : 0) + (appData.giaiThuong.chuyenGiao ? appData.giaiThuong.chuyenGiao.length : 0);
    }
    statAwardsEl.innerText = numAwards;
  }
  if (statBooksEl) {
    statBooksEl.innerText = (appData.congBo && appData.congBo.sach) ? appData.congBo.sach.length : 0;
  }
  if (statExpYearsEl) {
    var expYears = 0;
    if (appData.congTac && appData.congTac.length > 0) {
      var minYear = new Date().getFullYear();
      var hasValid = false;
      appData.congTac.forEach(function(ct) {
        var m = String(ct.tu || '').match(/\\d{4}/);
        if (m) {
          var y = parseInt(m[0], 10);
          if (y < minYear && y > 1950) {
            minYear = y;
            hasValid = true;
          }
        }
      });
      if (hasValid) {
        expYears = Math.max(1, new Date().getFullYear() - minYear);
      }
    }
    statExpYearsEl.innerText = expYears;
  }
}`;

if (!content.includes(userOverviewHeader)) {
  console.error("userOverviewHeader not found!");
  process.exit(1);
}
content = content.replace(userOverviewHeader, userOverviewImplementation);
console.log("Added renderUserOverview and getHighestDegreeText successfully!");

// 6. UPDATE populateBasicInfo
const oldPopulateBasicInfoRegex = /function populateBasicInfo\(\) \{[\s\S]*?if \(typeof renderUserOverview === 'function'\) renderUserOverview\(\);\s*\}/;

const newPopulateBasicInfo = `function populateBasicInfo() {
    var b = appData.basicInfo;
    if (!b || Object.keys(b).length === 0) return;
    
    var fields = ['name','dob','noiSinh','queQuan','danToc','chucVu','donVi','diaChi','cq','nr','dd','fax','cccd','ngayCap','noiCap'];
    for(var i=0; i<fields.length; i++) {
        var el = document.getElementById(fields[i]+'Input');
        if(el && b[fields[i]] !== undefined) el.value = b[fields[i]];
    }
    
    if (b.email && document.getElementById('emailInput')) {
        document.getElementById('emailInput').value = b.email;
    }

    var isNu = (b.genderNu === true || (b.gioiTinh && b.gioiTinh.trim().toLowerCase() === 'nữ'));
    var isNam = (b.genderNam === true || (b.gioiTinh && b.gioiTinh.trim().toLowerCase() === 'nam'));
    
    if (document.getElementById('genderNu')) document.getElementById('genderNu').checked = isNu;
    if (document.getElementById('genderNam')) document.getElementById('genderNam').checked = isNam;

    // Phục hồi lựa chọn Trường -> Khoa -> Bộ môn
    var truongSel = document.getElementById('donViTruongSelect');
    var khoaSel = document.getElementById('donViKhoaSelect');
    var boMonSel = document.getElementById('donViBoMonSelect');
    
    if (truongSel && b.donViTruong) {
        truongSel.value = b.donViTruong;
        handleCascadeTruongChange();
        if (khoaSel && (b.donViKhoa || b.khoa)) {
            khoaSel.value = b.donViKhoa || b.khoa;
            handleCascadeKhoaChange();
            if (boMonSel && (b.donViBoMon || b.boMon)) {
                boMonSel.value = b.donViBoMon || b.boMon;
            }
        }
    } else if (truongSel && (b.khoa || b.donViKhoa)) {
        truongSel.value = "Trường Đại học Công nghệ Kỹ thuật TP.HCM";
        handleCascadeTruongChange();
        if (khoaSel) {
            khoaSel.value = b.donViKhoa || b.khoa;
            handleCascadeKhoaChange();
            if (boMonSel && (b.donViBoMon || b.boMon)) {
                boMonSel.value = b.donViBoMon || b.boMon;
            }
        }
    } else if (truongSel && b.donVi) {
        var parts = b.donVi.split(',').map(function(s){ return s.trim(); });
        if (parts.length >= 3) {
            var savedTruong = parts[2];
            var savedKhoa = parts[1];
            var savedBoMon = parts[0];
            if (typeof DON_VI_CASCADE_DATA !== 'undefined' && DON_VI_CASCADE_DATA[savedTruong]) {
                truongSel.value = savedTruong;
                handleCascadeTruongChange();
                if (khoaSel) {
                    khoaSel.value = savedKhoa;
                    handleCascadeKhoaChange();
                    if (boMonSel) boMonSel.value = savedBoMon;
                }
            }
        } else if (parts.length === 1 && parts[0]) {
            truongSel.value = "Trường Đại học Công nghệ Kỹ thuật TP.HCM";
            handleCascadeTruongChange();
            if (khoaSel) {
                khoaSel.value = parts[0];
                handleCascadeKhoaChange();
            }
        }
    }
    updateWelcomeMessage();
    if (typeof renderUserOverview === 'function') renderUserOverview();
}`;

if (!oldPopulateBasicInfoRegex.test(content)) {
  console.error("oldPopulateBasicInfoRegex not matched!");
  process.exit(1);
}
content = content.replace(oldPopulateBasicInfoRegex, newPopulateBasicInfo);
console.log("Updated populateBasicInfo successfully!");

fs.writeFileSync(filePath, content, 'utf8');
console.log("ALL UPDATES TO Index.html WRITTEN SUCCESSFULLY!");


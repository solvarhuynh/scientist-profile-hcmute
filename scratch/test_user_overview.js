const assert = require('assert');

// Mock DOM
function createMockElement(id, initialText = '') {
  return {
    id: id,
    innerText: initialText,
    value: initialText,
    checked: false,
    classList: {
      contains: () => false,
      add: () => {},
      remove: () => {}
    }
  };
}

const elements = {
  welcomeNameDisplay: createMockElement('welcomeNameDisplay'),
  'topbar-name': createMockElement('topbar-name'),
  'topbar-avatar': createMockElement('topbar-avatar'),
  userHeroGreetingHonorific: createMockElement('userHeroGreetingHonorific', 'Thầy/Cô'),
  userHeroName: createMockElement('userHeroName', ''),
  userHeroSubtitle: createMockElement('userHeroSubtitle', ''),
  userOverviewAvatar: createMockElement('userOverviewAvatar', 'GV'),
  userOverviewName: createMockElement('userOverviewName', '[HỌ VÀ TÊN]'),
  userOverviewHighestDegree: createMockElement('userOverviewHighestDegree', 'Đang cập nhật'),
  userOverviewDept: createMockElement('userOverviewDept', 'Khoa / Viện trực thuộc'),
  userOverviewEmail: createMockElement('userOverviewEmail', 'email@hcmute.edu.vn'),
  userOverviewPhone: createMockElement('userOverviewPhone', '090xxxxxxx'),
  statUserPapers: createMockElement('statUserPapers', '0'),
  statUserProjects: createMockElement('statUserProjects', '0'),
  statUserAwards: createMockElement('statUserAwards', '0'),
  statUserBooks: createMockElement('statUserBooks', '0'),
  statUserExpYears: createMockElement('statUserExpYears', '0'),
  emailInput: createMockElement('emailInput', ''),
  nameInput: createMockElement('nameInput', ''),
  genderNam: createMockElement('genderNam'),
  genderNu: createMockElement('genderNu')
};

function getElementById(id) {
  return elements[id] || null;
}

function formatCapitalizeWords(str) {
  if (!str) return '';
  return str.trim().split(/\s+/).map(function(w) {
    if (!w) return '';
    var upper = w.toUpperCase();
    if (upper === 'PGS.' || upper === 'GS.' || upper === 'TS.' || upper === 'THS.' || upper === 'KS.') {
      return upper;
    }
    return w.charAt(0).toUpperCase() + w.slice(1).toLowerCase();
  }).join(' ');
}

function getTeacherHonorific(appData) {
  var isNam = false;
  var isNu = false;
  var radNam = getElementById('genderNam');
  var radNu = getElementById('genderNu');
  
  if (radNam && radNam.checked) {
    isNam = true;
  } else if (radNu && radNu.checked) {
    isNu = true;
  } else if (appData && appData.basicInfo) {
    var b = appData.basicInfo;
    var g = (b.gioiTinh || b.gender || '').trim().toLowerCase();
    if (b.genderNam === true || g === 'nam') {
      isNam = true;
    } else if (b.genderNu === true || g === 'nữ' || g === 'nu') {
      isNu = true;
    }
  }
  
  if (isNam) return 'Thầy';
  if (isNu) return 'Cô';
  return 'Thầy/Cô';
}

function getHighestDegreeText(appData) {
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

function renderUserOverview(appData) {
  var b = (appData && appData.basicInfo) ? appData.basicInfo : {};
  var nameInput = getElementById('nameInput');
  var emailInput = getElementById('emailInput');
  
  var name = (nameInput && nameInput.value) ? nameInput.value.trim() : (b.name ? b.name.trim() : '');
  var email = (emailInput && emailInput.value) ? emailInput.value.trim() : (b.email ? b.email.trim() : '');
  
  var honorific = getTeacherHonorific(appData);
  var formattedName = formatCapitalizeWords(name);
  
  // 1. HERO BANNER
  var heroHonorificEl = getElementById('userHeroGreetingHonorific');
  var heroNameEl = getElementById('userHeroName');
  var heroSubEl = getElementById('userHeroSubtitle');
  
  if (heroHonorificEl) {
    heroHonorificEl.innerText = honorific;
  }
  if (heroNameEl) {
    heroNameEl.innerText = formattedName ? (' ' + formattedName) : '';
  }
  if (heroSubEl) {
    heroSubEl.innerText = 'Chào mừng ' + honorific + (formattedName ? (' ' + formattedName) : '') + ' đến với Cổng thông tin Lý lịch Khoa học. Cùng quản lý, chuẩn hóa hồ sơ và khẳng định thành tựu công bố nghiên cứu chuyên môn.';
  }
  
  // 2. PROFILE SUMMARY CARD
  var cardAvatarEl = getElementById('userOverviewAvatar');
  var cardNameEl = getElementById('userOverviewName');
  var cardDegreeEl = getElementById('userOverviewHighestDegree');
  var cardDeptEl = getElementById('userOverviewDept');
  var cardEmailEl = getElementById('userOverviewEmail');
  var cardPhoneEl = getElementById('userOverviewPhone');
  
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
    cardDegreeEl.innerText = getHighestDegreeText(appData);
  }
  
  if (cardDeptEl) {
    var deptText = b.donViKhoa || b.khoa || b.donVi || '';
    cardDeptEl.innerText = deptText || 'Khoa / Viện trực thuộc';
  }
  
  if (cardEmailEl) {
    cardEmailEl.innerText = email || 'email@hcmute.edu.vn';
  }
  
  if (cardPhoneEl) {
    var phone = b.dd || b.nr || b.cq || '';
    cardPhoneEl.innerText = phone || '090xxxxxxx';
  }

  // 3. TOPBAR & WELCOME DISPLAY
  var displaySpan = getElementById('welcomeNameDisplay');
  var topbarSpan = getElementById('topbar-name');
  var topbarAvatar = getElementById('topbar-avatar');

  if (displaySpan) displaySpan.innerText = formattedName ? (honorific + ' ' + formattedName) : (email || honorific);
  if (topbarSpan) topbarSpan.innerText = formattedName ? formattedName : (email || honorific);
  if (topbarAvatar) {
    if (formattedName) {
      topbarAvatar.innerText = formattedName.charAt(0).toUpperCase();
    } else if (email) {
      topbarAvatar.innerText = email.charAt(0).toUpperCase();
    } else {
      topbarAvatar.innerText = (honorific === 'Thầy') ? 'T' : ((honorific === 'Cô') ? 'C' : 'TC');
    }
  }

  // 4. METRICS
  var statPapersEl = getElementById('statUserPapers');
  var statProjectsEl = getElementById('statUserProjects');
  var statAwardsEl = getElementById('statUserAwards');
  var statBooksEl = getElementById('statUserBooks');

  if (statPapersEl) statPapersEl.innerText = (appData.congBo && appData.congBo.baiBao) ? appData.congBo.baiBao.length : 0;
  if (statProjectsEl) statProjectsEl.innerText = (appData.deTai) ? appData.deTai.length : 0;
  if (statAwardsEl) {
    var numAwards = 0;
    if (appData.giaiThuong) {
      numAwards = (appData.giaiThuong.khcn ? appData.giaiThuong.khcn.length : 0) + (appData.giaiThuong.chuyenGiao ? appData.giaiThuong.chuyenGiao.length : 0);
    }
    statAwardsEl.innerText = numAwards;
  }
  if (statBooksEl) statBooksEl.innerText = (appData.congBo && appData.congBo.sach) ? appData.congBo.sach.length : 0;
}

// Test Case 1: Teacher Huỳnh Trung Nghĩa, Male
const appDataTeacher = {
  basicInfo: {
    name: 'Huỳnh Trung Nghĩa',
    gioiTinh: 'Nam',
    genderNam: true,
    email: '24133903@student.hcmute.edu.vn',
    dd: '0909999999',
    khoa: 'Khoa Điện - Điện tử'
  },
  daotao: {
    hocVi: [{ hocVi: 'Thạc sĩ' }],
    hocHam: []
  },
  congBo: {
    baiBao: [{ ten: 'Paper 1' }],
    sach: []
  },
  deTai: [{ ten: 'Project 1' }],
  giaiThuong: {
    khcn: [{ ten: 'Award 1' }]
  }
};

renderUserOverview(appDataTeacher);

console.log('Hero Honorific:', elements.userHeroGreetingHonorific.innerText);
assert.strictEqual(elements.userHeroGreetingHonorific.innerText, 'Thầy');
console.log('Hero Name:', elements.userHeroName.innerText);
assert.strictEqual(elements.userHeroName.innerText, ' Huỳnh Trung Nghĩa');

const fullHeroGreeting = `Xin chào, ${elements.userHeroGreetingHonorific.innerText}${elements.userHeroName.innerText} !`;
console.log('Full Hero Greeting:', fullHeroGreeting);
assert.strictEqual(fullHeroGreeting, 'Xin chào, Thầy Huỳnh Trung Nghĩa !');

console.log('Overview Card Name:', elements.userOverviewName.innerText);
assert.strictEqual(elements.userOverviewName.innerText, 'HUỲNH TRUNG NGHĨA');
console.log('Overview Card Avatar:', elements.userOverviewAvatar.innerText);
assert.strictEqual(elements.userOverviewAvatar.innerText, 'N');
console.log('Overview Card Degree:', elements.userOverviewHighestDegree.innerText);
assert.strictEqual(elements.userOverviewHighestDegree.innerText, 'Thạc sĩ');
console.log('Overview Card Dept:', elements.userOverviewDept.innerText);
assert.strictEqual(elements.userOverviewDept.innerText, 'Khoa Điện - Điện tử');
console.log('Overview Card Phone:', elements.userOverviewPhone.innerText);
assert.strictEqual(elements.userOverviewPhone.innerText, '0909999999');

console.log('Topbar Welcome:', elements.welcomeNameDisplay.innerText);
assert.strictEqual(elements.welcomeNameDisplay.innerText, 'Thầy Huỳnh Trung Nghĩa');

console.log('\n>>> OVERVIEW BANNER AND CARD TESTS PASSED 100%! <<<');


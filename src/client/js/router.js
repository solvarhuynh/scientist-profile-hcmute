// =========================================================================
// ROUTER & NAVIGATION CONTROLLER (ADMIN / USER SWITCHER)
// =========================================================================

function switchSection(sectionId) {
  var sections = document.querySelectorAll('.content-section');
  sections.forEach(function(s) {
    s.classList.remove('active-section');
  });

  var target = document.getElementById(sectionId);
  if (target) {
    target.classList.add('active-section');
  }

  // Cập nhật trạng thái active cho menu sidebar User
  var links = document.querySelectorAll('#user-sidebar-nav .sidebar-link');
  links.forEach(function(link) {
    link.classList.remove('active');
    var onclickAttr = link.getAttribute('onclick') || '';
    if (onclickAttr.indexOf(sectionId) !== -1) {
      link.classList.add('active');
    }
  });

  // Tự động đóng mobile sidebar nếu đang mở trên màn hình nhỏ
  if (window.innerWidth < 1024 && typeof closeMobileSidebar === 'function') {
    closeMobileSidebar();
  }
}

function updatePortalSwitcherUI(role) {
  var switcher = document.getElementById('adminPortalSwitcher');
  var tabAdmin = document.getElementById('tabRoleAdmin');
  var tabUser = document.getElementById('tabRoleUser');
  if (!switcher) return;

  switcher.classList.remove('hidden');
  switcher.classList.add('flex');

  if (role === 'admin') {
    if (tabAdmin) {
      tabAdmin.className = 'px-3 py-1 text-xs font-bold rounded-lg transition-all duration-200 bg-white text-blue-900 shadow-sm flex items-center gap-1.5 cursor-pointer';
    }
    if (tabUser) {
      tabUser.className = 'px-3 py-1 text-xs font-medium rounded-lg transition-all duration-200 text-blue-100 hover:text-white hover:bg-white/10 flex items-center gap-1.5 cursor-pointer';
    }
  } else {
    if (tabUser) {
      tabUser.className = 'px-3 py-1 text-xs font-bold rounded-lg transition-all duration-200 bg-white text-blue-900 shadow-sm flex items-center gap-1.5 cursor-pointer';
    }
    if (tabAdmin) {
      tabAdmin.className = 'px-3 py-1 text-xs font-medium rounded-lg transition-all duration-200 text-blue-100 hover:text-white hover:bg-white/10 flex items-center gap-1.5 cursor-pointer';
    }
  }
}

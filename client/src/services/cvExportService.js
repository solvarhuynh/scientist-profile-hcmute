// =========================================================================
// HCMUTE CV EXPORT ENGINE (PHỤ LỤC III - THÔNG TƯ 09/2017/TT-BGDĐT)
// Produces 100% compliant Phụ lục III document matching mau-xuat-file.pdf
// =========================================================================

function escapeHtml(text) {
  if (!text) return '';
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

export function generatePhuLucIIIHtml(profile = {}, options = {}) {
  const { includeBooks = false, includeAwards = false } = options;

  const b = profile || {};
  const name = b.full_name || '';
  const gender = b.gender || '';
  const dob = b.dob || '';
  const noiSinh = b.pob || '';
  const queQuan = b.hometown || '';
  const danToc = b.ethnicity || 'Kinh';
  const chucVu = b.position || '';
  const donVi = b.department || '';
  const diaChi = b.address || '';
  const cq = b.office_phone || '';
  const nr = b.home_phone || '';
  const dd = b.mobile_phone || '';
  const fax = b.fax || '';
  const email = b.email || '';

  const now = new Date();
  const curDay = now.getDate();
  const curMonth = now.getMonth() + 1;
  const curYear = now.getFullYear();

  // Degrees
  const degrees = b.degrees || [];
  const tsDegree = degrees.find(d => (d.bac_hoc || '').toLowerCase().includes('tiến sĩ') || (d.bac_hoc || '').toLowerCase().includes('phd'));
  const thsDegree = degrees.find(d => (d.bac_hoc || '').toLowerCase().includes('thạc sĩ') || (d.bac_hoc || '').toLowerCase().includes('master'));
  const dhDegrees = degrees.filter(d => {
    const bac = (d.bac_hoc || '').toLowerCase();
    return bac.includes('đại học') || bac.includes('cử nhân') || bac.includes('kỹ sư');
  });

  const dh1 = dhDegrees[0] || {};
  const dh2 = dhDegrees[1] || {};

  let hocViCaoNhat = b.highest_degree || '';
  let namNuocHocVi = (b.degree_conferred_year || '') + (b.degree_country ? (b.degree_conferred_year ? ', ' : '') + b.degree_country : '');

  if (!hocViCaoNhat) {
    if (tsDegree) {
      hocViCaoNhat = 'Tiến sĩ (PhD)';
      namNuocHocVi = (tsDegree.nam_tot_nghiep || '') + (tsDegree.nuoc_dao_tao ? ', ' + tsDegree.nuoc_dao_tao : '');
    } else if (thsDegree) {
      hocViCaoNhat = 'Thạc sĩ';
      namNuocHocVi = (thsDegree.nam_tot_nghiep || '') + (thsDegree.nuoc_dao_tao ? ', ' + thsDegree.nuoc_dao_tao : '');
    } else if (dh1.bac_hoc) {
      hocViCaoNhat = 'Cử nhân / Kỹ sư';
      namNuocHocVi = (dh1.nam_tot_nghiep || '') + (dh1.nuoc_dao_tao ? ', ' + dh1.nuoc_dao_tao : '');
    }
  }

  const chucDanhCaoNhat = b.academic_title || '';
  const namBoNhiem = b.title_appointed_year || '';

  // Languages
  const languages = b.foreign_languages || [];
  const nn1 = languages[0] || null;
  const nn2 = languages[1] || null;

  // Work History
  const workHistory = b.work_history || [];

  // Research Projects
  const researchProjects = b.research_projects || [];

  // Publications
  const publications = b.publications || [];

  // Books
  const books = b.books || [];

  // Awards
  const awards = b.awards || [];

  let html = '';
  html += '<div style="font-family: \'Times New Roman\', Times, serif; font-size: 13pt; line-height: 1.4; color: black; background: white; padding: 20px;">';

  // 1. Top Section - EXACT mau-xuat-file.pdf layout
  html += '<div style="text-align: left; font-weight: bold; font-size: 13pt; margin-bottom: 2px;">' +
            'BỘ GIÁO DỤC VÀ ĐÀO TẠO' +
          '</div>';

  html += '<div style="text-align: center; margin-bottom: 16px;">' +
            '<div style="font-weight: bold; font-size: 13pt;">Phụ lục III</div>' +
            '<div style="font-weight: bold; font-size: 13.5pt; text-transform: uppercase;">LÝ LỊCH KHOA HỌC</div>' +
            '<div style="font-style: italic; font-size: 11pt; margin-top: 2px;">' +
              '(Kèm theo Thông tư số: 09/2017/TT-BGDĐT ngày 04 tháng 4 năm 2017 của<br>' +
              'Bộ trưởng Bộ Giáo dục và Đào tạo)' +
            '</div>' +
          '</div>';

  // 2. Agency & National Title (2 columns)
  html += '<table style="width: 100%; border-collapse: collapse; border: none; margin-bottom: 20px;">' +
            '<tr>' +
              '<td style="width: 50%; vertical-align: top; text-align: left; border: none; font-size: 12pt; line-height: 1.35;">' +
                'BỘ, NGÀNH (Cơ quan chủ quản nếu có)<br>' +
                '<b>' + (donVi ? escapeHtml(donVi.toUpperCase()) : 'TRƯỜNG ĐẠI HỌC SƯ PHẠM KỸ THUẬT TP.HCM') + '</b>' +
              '</td>' +
              '<td style="width: 50%; vertical-align: top; text-align: center; border: none; font-size: 12pt; line-height: 1.35;">' +
                '<b>CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</b><br>' +
                '<b>Độc lập - Tự do - Hạnh phúc</b><br>' +
                '<span style="display: inline-block; width: 140px; border-bottom: 1px solid black; margin-bottom: 4px;"></span><br>' +
                '<span style="font-style: italic;">……., ngày ' + curDay + ' tháng ' + curMonth + ' năm ' + curYear + '</span>' +
              '</td>' +
            '</tr>' +
          '</table>';

  // 3. Document Main Title
  html += '<div style="text-align: center; margin: 22px 0 18px 0;">' +
            '<h2 style="font-size: 16pt; font-weight: bold; text-transform: uppercase; margin: 0; letter-spacing: 0.5px;">LÝ LỊCH KHOA HỌC</h2>' +
          '</div>';

  // I. LÝ LỊCH SƠ LƯỢC
  html += '<h3 style="font-size: 13pt; font-weight: bold; margin-top: 15px; margin-bottom: 8px;">I. LÝ LỊCH SƠ LƯỢC</h3>' +
          '<table style="width: 100%; border-collapse: collapse; border: none; margin-bottom: 12px; font-size: 12pt;">' +
            '<tr>' +
              '<td style="border: none; padding: 2.5px 0; width: 60%;">Họ và tên: ' + (name ? ('<b>' + escapeHtml(name.toUpperCase()) + '</b>') : '................................................') + '</td>' +
              '<td style="border: none; padding: 2.5px 0; width: 40%;">Giới tính: ' + escapeHtml(gender) + '</td>' +
            '</tr>' +
            '<tr>' +
              '<td style="border: none; padding: 2.5px 0;">Ngày, tháng, năm sinh: ' + escapeHtml(dob) + '</td>' +
              '<td style="border: none; padding: 2.5px 0;">Nơi sinh: ' + escapeHtml(noiSinh) + '</td>' +
            '</tr>' +
            '<tr>' +
              '<td style="border: none; padding: 2.5px 0;">Quê quán: ' + escapeHtml(queQuan) + '</td>' +
              '<td style="border: none; padding: 2.5px 0;">Dân tộc: ' + escapeHtml(danToc) + '</td>' +
            '</tr>' +
            '<tr>' +
              '<td style="border: none; padding: 2.5px 0;">Học vị cao nhất: ' + escapeHtml(hocViCaoNhat) + '</td>' +
              '<td style="border: none; padding: 2.5px 0;">Năm, nước nhận học vị: ' + escapeHtml(namNuocHocVi) + '</td>' +
            '</tr>' +
            '<tr>' +
              '<td style="border: none; padding: 2.5px 0;">Chức danh khoa học cao nhất: ' + escapeHtml(chucDanhCaoNhat) + '</td>' +
              '<td style="border: none; padding: 2.5px 0;">Năm bổ nhiệm: ' + escapeHtml(namBoNhiem) + '</td>' +
            '</tr>' +
            '<tr>' +
              '<td colspan="2" style="border: none; padding: 2.5px 0;">Chức vụ (hiện tại hoặc trước khi nghỉ hưu): ' + escapeHtml(chucVu) + '</td>' +
            '</tr>' +
            '<tr>' +
              '<td colspan="2" style="border: none; padding: 2.5px 0;">Đơn vị công tác (hiện tại hoặc trước khi nghỉ hưu): ' + escapeHtml(donVi) + '</td>' +
            '</tr>' +
            '<tr>' +
              '<td colspan="2" style="border: none; padding: 2.5px 0;">Chỗ ở riêng hoặc địa chỉ liên lạc: ' + escapeHtml(diaChi) + '</td>' +
            '</tr>' +
            '<tr>' +
              '<td colspan="2" style="border: none; padding: 2.5px 0;">' +
                'Điện thoại liên hệ: CQ: ' + escapeHtml(cq) + ' &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; NR: ' + escapeHtml(nr) + ' &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; DĐ: ' + escapeHtml(dd) +
              '</td>' +
            '</tr>' +
            '<tr>' +
              '<td style="border: none; padding: 2.5px 0;">Fax: ' + escapeHtml(fax) + '</td>' +
              '<td style="border: none; padding: 2.5px 0;">Email: ' + escapeHtml(email) + '</td>' +
            '</tr>' +
          '</table>';

  // II. QUÁ TRÌNH ĐÀO TẠO
  html += '<h3 style="font-size: 13pt; font-weight: bold; margin-top: 18px; margin-bottom: 6px;">II. QUÁ TRÌNH ĐÀO TẠO</h3>';
  html += '<div style="font-weight: bold; font-size: 12pt; margin-top: 6px; margin-bottom: 2px;">1. Đại học:</div>' +
          '<table style="width: 100%; border-collapse: collapse; border: none; margin-bottom: 6px; font-size: 12pt;">' +
            '<tr><td colspan="2" style="border: none; padding: 2px 0;">Hệ đào tạo: ' + escapeHtml(dh1.he_dao_tao || 'Chính quy') + '</td></tr>' +
            '<tr><td colspan="2" style="border: none; padding: 2px 0;">Nơi đào tạo: ' + escapeHtml(dh1.noi_dao_tao || '') + '</td></tr>' +
            '<tr><td colspan="2" style="border: none; padding: 2px 0;">Ngành học: ' + escapeHtml(dh1.nganh || '') + '</td></tr>' +
            '<tr>' +
              '<td style="border: none; padding: 2px 0; width: 60%;">Nước đào tạo: ' + escapeHtml(dh1.nuoc_dao_tao || '') + '</td>' +
              '<td style="border: none; padding: 2px 0; width: 40%;">Năm tốt nghiệp: ' + escapeHtml(dh1.nam_tot_nghiep || '') + '</td>' +
            '</tr>' +
            (dh1.ten_de_tai_luan_van ? ('<tr><td colspan="2" style="border: none; padding: 2px 0;">- Tên đồ án / Đề tài tốt nghiệp: ' + escapeHtml(dh1.ten_de_tai_luan_van) + '</td></tr>') : '') +
            '<tr>' +
              '<td style="border: none; padding: 2px 0; width: 60%;">Bằng đại học 2: ' + escapeHtml(dh2.nganh || '') + '</td>' +
              '<td style="border: none; padding: 2px 0; width: 40%;">Năm tốt nghiệp: ' + escapeHtml(dh2.nam_tot_nghiep || '') + '</td>' +
            '</tr>' +
            (dh2.ten_de_tai_luan_van ? ('<tr><td colspan="2" style="border: none; padding: 2px 0;">- Tên đồ án tốt nghiệp bằng 2: ' + escapeHtml(dh2.ten_de_tai_luan_van) + '</td></tr>') : '') +
          '</table>';

  // 2. Sau đại học
  html += '<div style="font-weight: bold; font-size: 12pt; margin-top: 8px; margin-bottom: 2px;">2. Sau đại học</div>' +
          '<table style="width: 100%; border-collapse: collapse; border: none; margin-bottom: 6px; font-size: 12pt;">' +
            '<tr><td colspan="2" style="border: none; padding: 2px 0;">- Thạc sĩ ngành/chuyên ngành: ' + escapeHtml(thsDegree?.nganh || '') + '</td></tr>' +
            '<tr>' +
              '<td style="border: none; padding: 2px 0; width: 60%;">Năm cấp bằng: ' + escapeHtml(thsDegree?.nam_tot_nghiep || '') + '</td>' +
              '<td style="border: none; padding: 2px 0; width: 40%;">Nơi đào tạo: ' + escapeHtml(thsDegree?.noi_dao_tao || '') + '</td>' +
            '</tr>' +
            '<tr><td colspan="2" style="border: none; padding: 2px 0;">- Tên luận văn: ' + escapeHtml(thsDegree?.ten_de_tai_luan_van || '') + '</td></tr>' +
            '<tr><td colspan="2" style="border: none; padding: 2px 0;">- Tiến sĩ chuyên ngành: ' + escapeHtml(tsDegree?.nganh || '') + '</td></tr>' +
            '<tr>' +
              '<td style="border: none; padding: 2px 0;">Năm cấp bằng: ' + escapeHtml(tsDegree?.nam_tot_nghiep || '') + '</td>' +
              '<td style="border: none; padding: 2px 0;">Nơi đào tạo: ' + escapeHtml(tsDegree?.noi_dao_tao || '') + '</td>' +
            '</tr>' +
            '<tr><td colspan="2" style="border: none; padding: 2px 0;">- Tên luận án: ' + escapeHtml(tsDegree?.ten_de_tai_luan_van || '') + '</td></tr>' +
          '</table>';

  // 3. Ngoại ngữ
  html += '<table style="width: 100%; border-collapse: collapse; border: none; margin-bottom: 12px; font-size: 12pt;">' +
            '<tr>' +
              '<td style="border: none; padding: 2px 0; width: 60%;">' +
                '<b>3. Ngoại ngữ:</b> 1. ' + escapeHtml(nn1 ? nn1.language_name : '') +
              '</td>' +
              '<td style="border: none; padding: 2px 0; width: 40%;">' +
                'Mức độ sử dụng: ' + escapeHtml(nn1 ? nn1.proficiency_level : '') +
              '</td>' +
            '</tr>' +
            (nn2 ? ('<tr><td style="border: none; padding: 2px 0; padding-left: 92px;">2. ' + escapeHtml(nn2.language_name) + '</td><td style="border: none; padding: 2px 0;">Mức độ sử dụng: ' + escapeHtml(nn2.proficiency_level) + '</td></tr>') : '') +
          '</table>';

  // III. QUÁ TRÌNH CÔNG TÁC CHUYÊN MÔN
  html += '<h3 style="font-size: 13pt; font-weight: bold; margin-top: 18px; margin-bottom: 8px;">III. QUÁ TRÌNH CÔNG TÁC CHUYÊN MÔN</h3>';
  html += '<table style="width: 100%; border-collapse: collapse; margin-bottom: 14px; font-size: 11pt;" border="1">' +
            '<tr style="background-color: #f8fafc; font-weight: bold; text-align: center;">' +
              '<td style="padding: 5px 6px; width: 25%;">Thời gian</td>' +
              '<td style="padding: 5px 6px; width: 45%;">Đơn vị công tác</td>' +
              '<td style="padding: 5px 6px; width: 30%;">Công việc đảm nhiệm</td>' +
            '</tr>';
  if (workHistory.length === 0) {
    html += '<tr><td style="padding: 5px 6px; text-align: center;">&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td></tr>';
  } else {
    workHistory.forEach(w => {
      const tg = (w.from_date || '') + (w.is_current ? ' - Hiện tại' : (w.to_date ? ' - ' + w.to_date : ''));
      html += '<tr>' +
                '<td style="padding: 5px 6px; text-align: center;">' + escapeHtml(tg) + '</td>' +
                '<td style="padding: 5px 6px;">' + escapeHtml(w.workplace || '') + '</td>' +
                '<td style="padding: 5px 6px;">' + escapeHtml(w.position || '') + '</td>' +
              '</tr>';
    });
  }
  html += '</table>';

  // IV. QUÁ TRÌNH NGHIÊN CỨU KHOA HỌC
  html += '<h3 style="font-size: 13pt; font-weight: bold; margin-top: 18px; margin-bottom: 8px;">IV. QUÁ TRÌNH NGHIÊN CỨU KHOA HỌC</h3>';
  html += '<p style="font-size: 12pt; margin-top: 8px; margin-bottom: 6px;">' +
            '1. Các đề tài nghiên cứu khoa học đã và đang tham gia (thuộc danh mục Hội đồng Chức danh giáo sư nhà nước quy định):' +
          '</p>';
  html += '<table style="width: 100%; border-collapse: collapse; margin-bottom: 14px; font-size: 11pt;" border="1">' +
            '<tr style="background-color: #f8fafc; font-weight: bold; text-align: center;">' +
              '<td style="padding: 5px 6px; width: 6%;">TT</td>' +
              '<td style="padding: 5px 6px; width: 44%;">Tên đề tài nghiên cứu</td>' +
              '<td style="padding: 5px 6px; width: 18%;">Năm bắt đầu/Năm hoàn thành</td>' +
              '<td style="padding: 5px 6px; width: 16%;">Đề tài cấp (NN, Bộ, ngành, trường)</td>' +
              '<td style="padding: 5px 6px; width: 16%;">Trách nhiệm tham gia trong đề tài</td>' +
            '</tr>';
  if (researchProjects.length === 0) {
    html += '<tr><td style="padding: 5px 6px; text-align: center;">&nbsp;</td><td>&nbsp;</td><td style="text-align: center;">&nbsp;</td><td>&nbsp;</td><td style="text-align: center;">&nbsp;</td></tr>';
  } else {
    researchProjects.forEach((p, idx) => {
      const tg = (p.start_year || '') + (p.end_year ? '/' + p.end_year : '');
      html += '<tr>' +
                '<td style="padding: 5px 6px; text-align: center;">' + (idx + 1) + '</td>' +
                '<td style="padding: 5px 6px;">' + escapeHtml(p.name || '') + '</td>' +
                '<td style="padding: 5px 6px; text-align: center;">' + escapeHtml(tg) + '</td>' +
                '<td style="padding: 5px 6px;">' + escapeHtml(p.project_level || 'Trường') + '</td>' +
                '<td style="padding: 5px 6px; text-align: center;">' + escapeHtml(p.role || 'Thành viên') + '</td>' +
              '</tr>';
    });
  }
  html += '</table>';

  // 2. Các công trình công bố
  html += '<p style="font-size: 12pt; margin-top: 10px; margin-bottom: 6px;">' +
            '2. Các công trình khoa học đã công bố (thuộc danh mục Hội đồng Chức danh giáo sư nhà nước quy định): Tên công trình, năm công bố, nơi công bố.' +
          '</p>';
  html += '<table style="width: 100%; border-collapse: collapse; margin-bottom: 14px; font-size: 11pt;" border="1">' +
            '<tr style="background-color: #f8fafc; font-weight: bold; text-align: center;">' +
              '<td style="padding: 5px 6px; width: 6%;">TT</td>' +
              '<td style="padding: 5px 6px; width: 54%;">Tên công trình</td>' +
              '<td style="padding: 5px 6px; width: 15%;">Năm công bố</td>' +
              '<td style="padding: 5px 6px; width: 25%;">Tên tạp chí</td>' +
            '</tr>';
  if (publications.length === 0) {
    html += '<tr><td style="padding: 5px 6px; text-align: center;">&nbsp;</td><td>&nbsp;</td><td style="text-align: center;">&nbsp;</td><td>&nbsp;</td></tr>';
  } else {
    publications.forEach((pub, idx) => {
      html += '<tr>' +
                '<td style="padding: 5px 6px; text-align: center;">' + (idx + 1) + '</td>' +
                '<td style="padding: 5px 6px;">' + escapeHtml(pub.title || '') + '</td>' +
                '<td style="padding: 5px 6px; text-align: center;">' + escapeHtml(pub.publication_year || '') + '</td>' +
                '<td style="padding: 5px 6px;">' + escapeHtml(pub.journal_name || '') + '</td>' +
              '</tr>';
    });
  }
  html += '</table>';

  // Dynamic V / VI Sections for Books & Awards
  let romanIdx = 5;
  if (includeBooks) {
    const rLabel = romanIdx === 5 ? 'V' : 'VI';
    romanIdx++;
    html += '<h3 style="font-size: 13pt; font-weight: bold; margin-top: 18px; margin-bottom: 8px;">' + rLabel + '. SÁCH VÀ GIÁO TRÌNH XUẤT BẢN</h3>';
    html += '<table style="width: 100%; border-collapse: collapse; margin-bottom: 14px; font-size: 11pt;" border="1">' +
              '<tr style="background-color: #f8fafc; font-weight: bold; text-align: center;">' +
                '<td style="padding: 5px 6px; width: 6%;">TT</td>' +
                '<td style="padding: 5px 6px; width: 44%;">Tên sách, giáo trình</td>' +
                '<td style="padding: 5px 6px; width: 26%;">Nhà xuất bản</td>' +
                '<td style="padding: 5px 6px; width: 12%;">Năm xuất bản</td>' +
                '<td style="padding: 5px 6px; width: 12%;">Vai trò</td>' +
              '</tr>';
    if (books.length === 0) {
      html += '<tr><td style="padding: 5px 6px; text-align: center;">&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td style="text-align: center;">&nbsp;</td><td style="text-align: center;">&nbsp;</td></tr>';
    } else {
      books.forEach((bItem, idx) => {
        html += '<tr>' +
                  '<td style="padding: 5px 6px; text-align: center;">' + (idx + 1) + '</td>' +
                  '<td style="padding: 5px 6px;">' + escapeHtml(bItem.title || '') + '</td>' +
                  '<td style="padding: 5px 6px;">' + escapeHtml(bItem.publisher || '') + '</td>' +
                  '<td style="padding: 5px 6px; text-align: center;">' + escapeHtml(bItem.publication_year || '') + '</td>' +
                  '<td style="padding: 5px 6px; text-align: center;">' + escapeHtml(bItem.role || 'Chủ biên') + '</td>' +
                '</tr>';
      });
    }
    html += '</table>';
  }

  if (includeAwards) {
    const rLabel = romanIdx === 5 ? 'V' : 'VI';
    romanIdx++;
    html += '<h3 style="font-size: 13pt; font-weight: bold; margin-top: 18px; margin-bottom: 8px;">' + rLabel + '. GIẢI THƯỞNG KHOA HỌC VÀ CÔNG NGHỆ</h3>';
    html += '<table style="width: 100%; border-collapse: collapse; margin-bottom: 14px; font-size: 11pt;" border="1">' +
              '<tr style="background-color: #f8fafc; font-weight: bold; text-align: center;">' +
                '<td style="padding: 5px 6px; width: 6%;">TT</td>' +
                '<td style="padding: 5px 6px; width: 44%;">Tên giải thưởng</td>' +
                '<td style="padding: 5px 6px; width: 28%;">Cơ quan trao giải</td>' +
                '<td style="padding: 5px 6px; width: 11%;">Năm</td>' +
                '<td style="padding: 5px 6px; width: 11%;">Cấp giải</td>' +
              '</tr>';
    if (awards.length === 0) {
      html += '<tr><td style="padding: 5px 6px; text-align: center;">&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td style="text-align: center;">&nbsp;</td><td style="text-align: center;">&nbsp;</td></tr>';
    } else {
      awards.forEach((aItem, idx) => {
        html += '<tr>' +
                  '<td style="padding: 5px 6px; text-align: center;">' + (idx + 1) + '</td>' +
                  '<td style="padding: 5px 6px;">' + escapeHtml(aItem.name || '') + '</td>' +
                  '<td style="padding: 5px 6px;">' + escapeHtml(aItem.awarding_body || '') + '</td>' +
                  '<td style="padding: 5px 6px; text-align: center;">' + escapeHtml(aItem.award_year || '') + '</td>' +
                  '<td style="padding: 5px 6px; text-align: center;">' + escapeHtml(aItem.award_type || '') + '</td>' +
                '</tr>';
      });
    }
    html += '</table>';
  }

  // Signatures block
  html += '<table style="width: 100%; border-collapse: collapse; border: none; margin-top: 25px; font-size: 12pt; page-break-inside: avoid;">' +
            '<tr>' +
              '<td style="width: 50%; border: none; vertical-align: top; text-align: center; padding-top: 20px;">' +
                '<b>Xác nhận của cơ quan</b>' +
              '</td>' +
              '<td style="width: 50%; border: none; vertical-align: top; text-align: center;">' +
                '<span style="font-style: italic;">……., ngày ' + curDay + ' tháng ' + curMonth + ' năm ' + curYear + '</span><br>' +
                '<b>Người khai kí tên</b><br>' +
                '<span style="font-style: italic; font-size: 10pt;">(Ghi rõ chức danh, học vị)</span>' +
                '<div style="height: 65px;"></div>' +
                '<b>' + (name ? escapeHtml(name.toUpperCase()) : '................................................') + '</b>' +
              '</td>' +
            '</tr>' +
          '</table>';

  html += '</div>';
  return html;
}

export function exportCvToWord(profile, options = {}) {
  const innerHtml = generatePhuLucIIIHtml(profile, options);
  const fullName = profile.full_name ? profile.full_name.trim().replace(/\s+/g, '_') : 'PhuLucIII';
  const fileName = `HCMUTE_LyLichKhoaHoc_${fullName}.docx`;

  const docHtml = `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
  @page {
    size: 21.0cm 29.7cm;
    margin: 2.0cm 2.0cm 2.0cm 2.0cm;
    mso-page-orientation: portrait;
  }
  body {
    font-family: 'Times New Roman', Times, serif;
    font-size: 13pt;
    line-height: 1.4;
    color: #000;
  }
  table {
    border-collapse: collapse;
    width: 100%;
  }
  table[border="1"] td, table[border="1"] th {
    border: 1px solid black;
  }
</style>
</head>
<body>
  ${innerHtml}
</body>
</html>`;

  // 1. Try htmlDocx asBlob
  if (typeof window.htmlDocx !== 'undefined' && window.htmlDocx.asBlob) {
    try {
      const blob = window.htmlDocx.asBlob(docHtml, {
        orientation: 'portrait',
        margins: { top: 1134, right: 1134, bottom: 1134, left: 1134 }
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      return;
    } catch (e) {
      console.warn('htmlDocx export fallback to Word HTML format:', e);
    }
  }

  // 2. Direct Word HTML fallback
  const fallbackBlob = new Blob(['\ufeff', docHtml], { type: 'application/msword;charset=utf-8' });
  const fallbackUrl = URL.createObjectURL(fallbackBlob);
  const aW = document.createElement('a');
  aW.href = fallbackUrl;
  aW.download = fileName.replace('.docx', '.doc');
  document.body.appendChild(aW);
  aW.click();
  document.body.removeChild(aW);
  URL.revokeObjectURL(fallbackUrl);
}

export function printCvToPdf() {
  window.print();
}

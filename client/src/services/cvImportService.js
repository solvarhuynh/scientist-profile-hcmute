// =========================================================================
// HCMUTE CV IMPORT ENGINE
// Supports: JSON (100% High Fidelity) & DOCX (Mammoth + AltChunk Extraction)
// =========================================================================

export async function parseCvFile(file) {
  const fileName = file.name.toLowerCase();

  // 1. JSON File Parsing
  if (fileName.endsWith('.json')) {
    const text = await file.text();
    const data = JSON.parse(text);
    return normalizeParsedData(data);
  }

  // 2. DOCX File Parsing
  if (fileName.endsWith('.docx')) {
    const arrayBuffer = await file.arrayBuffer();

    // Check if Mammoth is available in browser window
    if (typeof window.mammoth !== 'undefined') {
      try {
        const result = await window.mammoth.convertToHtml({ arrayBuffer });
        if (result && result.value && result.value.length > 50) {
          return parseCvFromHtml(result.value);
        }
      } catch (err) {
        console.warn('Mammoth error, falling back to raw buffer decode:', err);
      }
    }

    // Fallback: UTF-8 buffer decoding (for AltChunk Word files)
    const decoder = new TextDecoder('utf-8');
    const rawText = decoder.decode(arrayBuffer);
    if (rawText.includes('<html') || rawText.includes('<!DOCTYPE') || rawText.includes('LÝ LỊCH KHOA HỌC')) {
      return parseCvFromHtml(rawText);
    }

    throw new Error('Không thể đọc nội dung file DOCX. Vui lòng sử dụng file JSON mẫu để đạt độ chính xác 100%.');
  }

  throw new Error('Định dạng tệp không được hỗ trợ. Vui lòng chọn file .json hoặc .docx');
}

// Normalize imported data into the standard app format
export function normalizeParsedData(data) {
  // If it's already in the target schema format
  if (data.full_name || data.degrees || data.work_history) {
    return {
      ...data,
      preferences: data.preferences || {},
      teaching_subjects: data.teaching_subjects || [],
      research_directions: data.research_directions || [],
      degrees: data.degrees || [],
      foreign_languages: data.foreign_languages || [],
      work_history: data.work_history || [],
      research_projects: data.research_projects || [],
      publications: data.publications || [],
      books: data.books || [],
      awards: data.awards || []
    };
  }

  // If it's in the legacy format (basicInfo, daotao, congTac, deTai, congBo, giaiThuong)
  const b = data.basicInfo || data.basic_info || {};
  const dt = data.daotao || data.daoTao || {};
  const congTac = data.congTac || [];
  const deTai = data.deTai || [];
  const congBo = data.congBo || {};
  const giaiThuong = data.giaiThuong || [];

  const degrees = [];
  const hocViList = dt.hocVi || dt.degrees || [];
  hocViList.forEach((h, idx) => {
    // Separate he_dao_tao from ten_de_tai_luan_van
    let heDaoTao = h.heDaoTao || h.he_dao_tao || '';
    let deTaiLuanVan = h.tenDeTaiLuanVan || h.ten_de_tai_luan_van || '';

    if (h.chiTiet) {
      const isHeMode = /^(chính quy|chất lượng cao|từ xa|vừa làm vừa học|văn bằng 2|liên thông|tại chức|clc)/i.test(h.chiTiet.trim());
      if (isHeMode) {
        if (!heDaoTao) heDaoTao = h.chiTiet.trim();
      } else {
        if (!deTaiLuanVan) deTaiLuanVan = h.chiTiet.trim();
        if (!heDaoTao) heDaoTao = 'Chính quy';
      }
    }

    degrees.push({
      id: 'deg-' + idx,
      bac_hoc: h.bacHoc || h.chucDanh || h.title || 'Đại học',
      he_dao_tao: heDaoTao || 'Chính quy',
      nganh: h.nganh || '',
      noi_dao_tao: h.noiDaoTao || h.noi || '',
      nuoc_dao_tao: h.nuoc || 'Việt Nam',
      nam_tot_nghiep: h.nam ? parseInt(h.nam) : null,
      ten_de_tai_luan_van: deTaiLuanVan || h.tenLuanVan || h.tenLuanAn || ''
    });
  });

  const foreign_languages = (dt.ngoaiNgu || []).map((n, idx) => ({
    id: 'fl-' + idx,
    language_name: n.ngonNgu || n.name || '',
    proficiency_level: n.mucDo || n.level || ''
  }));

  const work_history = congTac.map((c, idx) => ({
    id: 'wh-' + idx,
    from_date: c.tu || c.tuNgay || '',
    to_date: c.denLoai === 'HienTai' ? '' : (c.den || c.denNgay || ''),
    is_current: c.denLoai === 'HienTai' || !c.den,
    workplace: c.noi || c.noiCongTac || c.donVi || '',
    position: c.chucDanh || c.chucVu || c.moTa || ''
  }));

  const research_projects = deTai.map((d, idx) => ({
    id: 'rp-' + idx,
    name: d.ten || d.tenDeTai || '',
    project_level: d.capDeTai || d.cap || 'Trường',
    start_year: d.batDau || d.thoiGianBatDau || '',
    end_year: d.nghiemThu || d.hoanTat || d.thoiGianKetThuc || '',
    role: d.chucVu || d.vaiTro || 'Thành viên',
    status: d.trangThai || 'Đã nghiệm thu',
    rating: d.xepLoai || '',
    funding: d.kinhPhi || null
  }));

  const publications = (congBo.baiBao || []).map((p, idx) => ({
    id: 'pub-' + idx,
    title: p.tenBaiBao || p.ten || '',
    authors: p.tacGia || '',
    journal_name: p.tapChi || '',
    publication_year: p.namXuatBan || p.nam ? parseInt(p.namXuatBan || p.nam) : null,
    volume_issue: p.soTap || '',
    index_type: p.loaiTapChi || 'Trong nước',
    doi_url: p.doi || ''
  }));

  const books = (congBo.sach || []).map((s, idx) => ({
    id: 'bk-' + idx,
    title: s.tenSach || s.ten || '',
    publisher: s.nhaXuatBan || '',
    publication_year: s.namXuatBan || s.nam ? parseInt(s.namXuatBan || s.nam) : null,
    role: s.vaiTro || 'Chủ biên',
    isbn: s.isbn || ''
  }));

  const awards = giaiThuong.map((a, idx) => ({
    id: 'aw-' + idx,
    name: a.ten || a.tenGiaiThuong || '',
    awarding_body: a.coQuan || a.noiCap || '',
    award_year: a.nam ? parseInt(a.nam) : null,
    award_type: a.capKhenThuong || a.loai || '',
    description: a.noiDung || ''
  }));

  return {
    full_name: b.name || b.full_name || '',
    gender: b.gender || (b.genderNu ? 'Nữ' : 'Nam'),
    dob: b.dob || '',
    pob: b.noiSinh || b.pob || '',
    hometown: b.queQuan || b.hometown || '',
    ethnicity: b.danToc || b.ethnicity || 'Kinh',
    academic_title: b.chucDanh || b.academic_title || '',
    title_appointed_year: b.namBoNhiem || b.title_appointed_year || null,
    highest_degree: b.hocViCaoNhat || b.highest_degree || '',
    degree_conferred_year: b.namHocVi || b.degree_conferred_year || null,
    degree_country: b.nuocHocVi || b.degree_country || '',
    position: b.chucVu || b.position || '',
    department: b.donVi || b.department || '',
    address: b.diaChi || b.address || '',
    office_phone: b.cq || b.office_phone || '',
    home_phone: b.nr || b.home_phone || '',
    mobile_phone: b.dd || b.mobile_phone || '',
    fax: b.fax || '',
    cccd: b.cccd || '',
    email: b.email || '',
    preferences: {
      thinh_giang: true,
      nghien_cuu: true,
      hoi_dong: true,
      huong_dan: true,
      doanh_nghiep: false
    },
    teaching_subjects: [],
    research_directions: [],
    degrees,
    foreign_languages,
    work_history,
    research_projects,
    publications,
    books,
    awards
  };
}

// Simple HTML Parser for extracted DOCX content
export function parseCvFromHtml(html) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');
  const text = doc.body.innerText || doc.body.textContent || '';

  const res = {
    full_name: '',
    gender: '',
    dob: '',
    pob: '',
    hometown: '',
    ethnicity: 'Kinh',
    position: '',
    department: '',
    address: '',
    office_phone: '',
    mobile_phone: '',
    email: '',
    degrees: [],
    foreign_languages: [],
    work_history: [],
    research_projects: [],
    publications: [],
    books: [],
    awards: []
  };

  // Extract Basic Info using RegEx patterns
  const nameMatch = text.match(/Họ và tên[:\s]+([^\n\r]+)/i);
  if (nameMatch) res.full_name = nameMatch[1].trim();

  const genderMatch = text.match(/Giới tính[:\s]+([^\n\r]+)/i);
  if (genderMatch) res.gender = genderMatch[1].trim();

  const dobMatch = text.match(/Ngày.*năm sinh[:\s]+([^\n\r]+)/i);
  if (dobMatch) res.dob = dobMatch[1].trim();

  const pobMatch = text.match(/Nơi sinh[:\s]+([^\n\r]+)/i);
  if (pobMatch) res.pob = pobMatch[1].trim();

  const queMatch = text.match(/Quê quán[:\s]+([^\n\r]+)/i);
  if (queMatch) res.hometown = queMatch[1].trim();

  const emailMatch = text.match(/Email[:\s]+([^\s,;]+)/i);
  if (emailMatch) res.email = emailMatch[1].trim();

  const phoneMatch = text.match(/(?:DĐ|Điện thoại|Di động)[:\s]+([0-9\.\s]+)/i);
  if (phoneMatch) res.mobile_phone = phoneMatch[1].trim();

  const donViMatch = text.match(/Đơn vị công tác[:\s]+([^\n\r]+)/i);
  if (donViMatch) res.department = donViMatch[1].trim();

  return res;
}


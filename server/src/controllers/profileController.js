const { supabase, isConfigured } = require('../config/supabase');
const { mockProfiles } = require('../services/mockDbService');

// GET full scientist profile
exports.getProfile = async (req, res, next) => {
  try {
    const email = req.query.email || req.user?.email;
    if (!email) {
      return res.status(400).json({ success: false, message: 'Thiếu tham số email' });
    }

    const cleanEmail = email.trim().toLowerCase();

    if (isConfigured()) {
      // 1. Fetch core profile
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('email', cleanEmail)
        .maybeSingle();

      if (error) throw error;
      if (!profile) {
        return res.json({ success: true, profile: null, message: 'Hồ sơ chưa được khởi tạo' });
      }

      const profileId = profile.id;

      // 2. Fetch all child relations in parallel
      const [
        { data: preferences },
        { data: teaching_subjects },
        { data: research_directions },
        { data: degrees },
        { data: foreign_languages },
        { data: work_history },
        { data: research_projects },
        { data: publications },
        { data: books },
        { data: awards }
      ] = await Promise.all([
        supabase.from('faculty_preferences').select('*').eq('profile_id', profileId).maybeSingle(),
        supabase.from('teaching_subjects').select('*').eq('profile_id', profileId).order('created_at'),
        supabase.from('research_directions').select('*').eq('profile_id', profileId).order('created_at'),
        supabase.from('degrees').select('*').eq('profile_id', profileId).order('order_index'),
        supabase.from('foreign_languages').select('*').eq('profile_id', profileId).order('created_at'),
        supabase.from('work_history').select('*').eq('profile_id', profileId).order('order_index'),
        supabase.from('research_projects').select('*').eq('profile_id', profileId).order('order_index'),
        supabase.from('publications').select('*').eq('profile_id', profileId).order('order_index'),
        supabase.from('books').select('*').eq('profile_id', profileId).order('order_index'),
        supabase.from('awards').select('*').eq('profile_id', profileId).order('order_index')
      ]);

      const fullProfile = {
        ...profile,
        preferences: preferences || {},
        teaching_subjects: teaching_subjects || [],
        research_directions: research_directions || [],
        degrees: degrees || [],
        foreign_languages: foreign_languages || [],
        work_history: work_history || [],
        research_projects: research_projects || [],
        publications: publications || [],
        books: books || [],
        awards: awards || []
      };

      return res.json({ success: true, profile: fullProfile });
    }

    // Mock Mode fallback
    let found = mockProfiles.find(p => p.email.toLowerCase() === cleanEmail);
    if (!found) {
      // create empty template
      found = {
        id: 'mock-' + Date.now(),
        email: cleanEmail,
        full_name: cleanEmail.split('@')[0],
        preferences: {},
        teaching_subjects: [],
        research_directions: [],
        degrees: [],
        foreign_languages: [],
        work_history: [],
        research_projects: [],
        publications: [],
        books: [],
        awards: []
      };
      mockProfiles.push(found);
    }

    return res.json({ success: true, profile: found });
  } catch (err) {
    next(err);
  }
};

// SAVE or UPDATE profile (All 7 sections)
exports.saveProfile = async (req, res, next) => {
  try {
    const payload = req.body;
    const email = payload.email || req.user?.email;

    if (!email) {
      return res.status(400).json({ success: false, message: 'Email không được để trống' });
    }

    const cleanEmail = email.trim().toLowerCase();

    if (isConfigured()) {
      // 1. Upsert profile table
      const profileData = {
        email: cleanEmail,
        full_name: payload.full_name || cleanEmail.split('@')[0],
        gender: payload.gender || 'Nam',
        dob: payload.dob || null,
        pob: payload.pob || null,
        hometown: payload.hometown || null,
        ethnicity: payload.ethnicity || 'Kinh',
        academic_title: payload.academic_title || null,
        title_appointed_year: payload.title_appointed_year ? parseInt(payload.title_appointed_year) : null,
        highest_degree: payload.highest_degree || null,
        degree_conferred_year: payload.degree_conferred_year ? parseInt(payload.degree_conferred_year) : null,
        degree_country: payload.degree_country || null,
        position: payload.position || null,
        department: payload.department || null,
        address: payload.address || null,
        office_phone: payload.office_phone || null,
        home_phone: payload.home_phone || null,
        mobile_phone: payload.mobile_phone || null,
        fax: payload.fax || null,
        cccd: payload.cccd || null,
        cccd_date: payload.cccd_date || null,
        cccd_place: payload.cccd_place || null,
        avatar_url: payload.avatar_url || null,
        role: payload.role || 'user'
      };

      const { data: upsertedProfile, error: profileErr } = await supabase
        .from('profiles')
        .upsert(profileData, { onConflict: 'email' })
        .select()
        .single();

      if (profileErr) throw profileErr;
      const profileId = upsertedProfile.id;

      // 2. Preferences
      if (payload.preferences) {
        await supabase
          .from('faculty_preferences')
          .upsert({
            profile_id: profileId,
            thinh_giang: !!payload.preferences.thinh_giang,
            nghien_cuu: !!payload.preferences.nghien_cuu,
            hoi_dong: !!payload.preferences.hoi_dong,
            huong_dan: !!payload.preferences.huong_dan,
            doanh_nghiep: !!payload.preferences.doanh_nghiep,
            ghi_chu: payload.preferences.ghi_chu || ''
          }, { onConflict: 'profile_id' });
      }

      // 3. Child tables: Replace with incoming array
      if (Array.isArray(payload.degrees)) {
        await supabase.from('degrees').delete().eq('profile_id', profileId);
        if (payload.degrees.length > 0) {
          const degreesToInsert = payload.degrees.map((d, index) => ({
            profile_id: profileId,
            bac_hoc: d.bac_hoc || 'Đại học',
            he_dao_tao: d.he_dao_tao || 'Chính quy',
            nganh: d.nganh || '',
            noi_dao_tao: d.noi_dao_tao || '',
            nuoc_dao_tao: d.nuoc_dao_tao || 'Việt Nam',
            nam_tot_nghiep: d.nam_tot_nghiep ? parseInt(d.nam_tot_nghiep) : null,
            ten_de_tai_luan_van: d.ten_de_tai_luan_van || '',
            order_index: index
          }));
          await supabase.from('degrees').insert(degreesToInsert);
        }
      }

      if (Array.isArray(payload.teaching_subjects)) {
        await supabase.from('teaching_subjects').delete().eq('profile_id', profileId);
        if (payload.teaching_subjects.length > 0) {
          const items = payload.teaching_subjects.map(s => ({
            profile_id: profileId,
            major: s.major || '',
            name: s.name || '',
            description: s.description || ''
          }));
          await supabase.from('teaching_subjects').insert(items);
        }
      }

      if (Array.isArray(payload.research_directions)) {
        await supabase.from('research_directions').delete().eq('profile_id', profileId);
        if (payload.research_directions.length > 0) {
          const items = payload.research_directions.map(r => ({
            profile_id: profileId,
            major: r.major || '',
            name: r.name || '',
            description: r.description || ''
          }));
          await supabase.from('research_directions').insert(items);
        }
      }

      if (Array.isArray(payload.foreign_languages)) {
        await supabase.from('foreign_languages').delete().eq('profile_id', profileId);
        if (payload.foreign_languages.length > 0) {
          const items = payload.foreign_languages.map(f => ({
            profile_id: profileId,
            language_name: f.language_name || '',
            proficiency_level: f.proficiency_level || ''
          }));
          await supabase.from('foreign_languages').insert(items);
        }
      }

      if (Array.isArray(payload.work_history)) {
        await supabase.from('work_history').delete().eq('profile_id', profileId);
        if (payload.work_history.length > 0) {
          const items = payload.work_history.map((w, index) => ({
            profile_id: profileId,
            from_date: w.from_date || '',
            to_date: w.to_date || '',
            is_current: !!w.is_current,
            workplace: w.workplace || '',
            position: w.position || '',
            description: w.description || '',
            order_index: index
          }));
          await supabase.from('work_history').insert(items);
        }
      }

      if (Array.isArray(payload.research_projects)) {
        await supabase.from('research_projects').delete().eq('profile_id', profileId);
        if (payload.research_projects.length > 0) {
          const items = payload.research_projects.map((p, index) => ({
            profile_id: profileId,
            name: p.name || '',
            project_level: p.project_level || 'Trường',
            start_year: p.start_year || '',
            end_year: p.end_year || '',
            role: p.role || 'Thành viên',
            status: p.status || 'Đã nghiệm thu',
            rating: p.rating || '',
            funding: p.funding ? parseFloat(p.funding) : null,
            order_index: index
          }));
          await supabase.from('research_projects').insert(items);
        }
      }

      if (Array.isArray(payload.publications)) {
        await supabase.from('publications').delete().eq('profile_id', profileId);
        if (payload.publications.length > 0) {
          const items = payload.publications.map((pub, index) => ({
            profile_id: profileId,
            title: pub.title || '',
            authors: pub.authors || '',
            journal_name: pub.journal_name || '',
            publication_year: pub.publication_year ? parseInt(pub.publication_year) : null,
            volume_issue: pub.volume_issue || '',
            index_type: pub.index_type || 'Trong nước',
            doi_url: pub.doi_url || '',
            order_index: index
          }));
          await supabase.from('publications').insert(items);
        }
      }

      if (Array.isArray(payload.books)) {
        await supabase.from('books').delete().eq('profile_id', profileId);
        if (payload.books.length > 0) {
          const items = payload.books.map((b, index) => ({
            profile_id: profileId,
            title: b.title || '',
            publisher: b.publisher || '',
            publication_year: b.publication_year ? parseInt(b.publication_year) : null,
            role: b.role || 'Chủ biên',
            isbn: b.isbn || '',
            order_index: index
          }));
          await supabase.from('books').insert(items);
        }
      }

      if (Array.isArray(payload.awards)) {
        await supabase.from('awards').delete().eq('profile_id', profileId);
        if (payload.awards.length > 0) {
          const items = payload.awards.map((a, index) => ({
            profile_id: profileId,
            name: a.name || '',
            awarding_body: a.awarding_body || '',
            award_year: a.award_year ? parseInt(a.award_year) : null,
            award_type: a.award_type || '',
            description: a.description || '',
            order_index: index
          }));
          await supabase.from('awards').insert(items);
        }
      }

      return res.json({ success: true, message: 'Lưu toàn bộ hồ sơ khoa học thành công' });
    }

    // Mock Mode fallback
    let existingIndex = mockProfiles.findIndex(p => p.email.toLowerCase() === cleanEmail);
    if (existingIndex >= 0) {
      mockProfiles[existingIndex] = { ...mockProfiles[existingIndex], ...payload };
    } else {
      mockProfiles.push({ id: 'mock-' + Date.now(), ...payload });
    }

    return res.json({ success: true, message: 'Lưu hồ sơ thành công (Chế độ Mock)' });
  } catch (err) {
    next(err);
  }
};


const { supabase, isConfigured } = require('../config/supabase');
const { mockProfiles } = require('../services/mockDbService');

// Get list of all candidates with search & filters
exports.getCandidates = async (req, res, next) => {
  try {
    const { keyword, department, highest_degree, academic_title } = req.query;

    if (isConfigured()) {
      let query = supabase.from('profiles').select('*');

      if (department) {
        query = query.ilike('department', `%${department}%`);
      }
      if (highest_degree) {
        query = query.ilike('highest_degree', `%${highest_degree}%`);
      }
      if (academic_title) {
        query = query.ilike('academic_title', `%${academic_title}%`);
      }
      if (keyword) {
        query = query.or(`full_name.ilike.%${keyword}%,email.ilike.%${keyword}%,department.ilike.%${keyword}%`);
      }

      const { data: candidates, error } = await query.order('created_at', { ascending: false });
      if (error) throw error;

      return res.json({ success: true, count: candidates.length, candidates });
    }

    // Mock Mode
    let list = [...mockProfiles];
    if (department) {
      list = list.filter(p => p.department?.toLowerCase().includes(department.toLowerCase()));
    }
    if (highest_degree) {
      list = list.filter(p => p.highest_degree?.toLowerCase().includes(highest_degree.toLowerCase()));
    }
    if (academic_title) {
      list = list.filter(p => p.academic_title?.toLowerCase().includes(academic_title.toLowerCase()));
    }
    if (keyword) {
      const kw = keyword.toLowerCase();
      list = list.filter(p =>
        p.full_name?.toLowerCase().includes(kw) ||
        p.email?.toLowerCase().includes(kw) ||
        p.department?.toLowerCase().includes(kw)
      );
    }

    return res.json({ success: true, count: list.length, candidates: list });
  } catch (err) {
    next(err);
  }
};

// Get stats for Admin Dashboard
exports.getStats = async (req, res, next) => {
  try {
    if (isConfigured()) {
      const { data: profiles, error } = await supabase.from('profiles').select('highest_degree, academic_title, department');
      if (error) throw error;

      const totalProfiles = profiles.length;
      const professors = profiles.filter(p => p.academic_title?.includes('Giáo sư')).length;
      const doctors = profiles.filter(p => p.highest_degree?.includes('Tiến sĩ')).length;
      const masters = profiles.filter(p => p.highest_degree?.includes('Thạc sĩ')).length;

      return res.json({
        success: true,
        stats: {
          totalProfiles,
          professors,
          doctors,
          masters
        }
      });
    }

    // Mock Mode
    const totalProfiles = mockProfiles.length;
    const professors = mockProfiles.filter(p => p.academic_title?.includes('Giáo sư')).length;
    const doctors = mockProfiles.filter(p => p.highest_degree?.includes('Tiến sĩ')).length;
    const masters = mockProfiles.filter(p => p.highest_degree?.includes('Thạc sĩ')).length;

    return res.json({
      success: true,
      stats: {
        totalProfiles,
        professors,
        doctors,
        masters
      }
    });
  } catch (err) {
    next(err);
  }
};

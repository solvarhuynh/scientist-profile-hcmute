const { supabase, isConfigured } = require('../config/supabase');
const { mockAdmins } = require('../services/mockDbService');

// Get all admins
exports.getAdmins = async (req, res, next) => {
  try {
    if (isConfigured()) {
      const { data: admins, error } = await supabase.from('admins').select('*').order('granted_at', { ascending: false });
      if (error) throw error;
      return res.json({ success: true, admins });
    }

    return res.json({ success: true, admins: mockAdmins });
  } catch (err) {
    next(err);
  }
};

// Add new admin
exports.addAdmin = async (req, res, next) => {
  try {
    const { email, full_name, role } = req.body;
    if (!email) {
      return res.status(400).json({ success: false, message: 'Email quản trị viên không được để trống' });
    }

    const cleanEmail = email.trim().toLowerCase();

    if (isConfigured()) {
      const { data, error } = await supabase
        .from('admins')
        .insert({
          email: cleanEmail,
          full_name: full_name || cleanEmail.split('@')[0],
          role: role || 'admin',
          granted_by: req.user?.email || 'admin@hcmute.edu.vn'
        })
        .select()
        .single();

      if (error) throw error;
      return res.json({ success: true, message: `Đã cấp quyền Quản trị viên cho ${cleanEmail}`, admin: data });
    }

    const newAdmin = {
      id: 'adm-' + Date.now(),
      email: cleanEmail,
      full_name: full_name || cleanEmail.split('@')[0],
      role: role || 'admin',
      granted_at: new Date().toISOString(),
      granted_by: req.user?.email || 'admin@hcmute.edu.vn'
    };
    mockAdmins.push(newAdmin);

    return res.json({ success: true, message: `Đã cấp quyền Quản trị viên cho ${cleanEmail}`, admin: newAdmin });
  } catch (err) {
    next(err);
  }
};

// Remove admin
exports.removeAdmin = async (req, res, next) => {
  try {
    const { email } = req.params;
    if (!email) {
      return res.status(400).json({ success: false, message: 'Thiếu tham số email' });
    }

    const cleanEmail = email.trim().toLowerCase();

    if (cleanEmail === 'admin@hcmute.edu.vn') {
      return res.status(400).json({ success: false, message: 'Không thể xóa tài khoản Quản trị viên gốc (Superadmin)' });
    }

    if (isConfigured()) {
      const { error } = await supabase.from('admins').delete().eq('email', cleanEmail);
      if (error) throw error;
      return res.json({ success: true, message: `Đã thu hồi quyền quản trị viên của ${cleanEmail}` });
    }

    const index = mockAdmins.findIndex(a => a.email.toLowerCase() === cleanEmail);
    if (index >= 0) {
      mockAdmins.splice(index, 1);
    }

    return res.json({ success: true, message: `Đã thu hồi quyền quản trị viên của ${cleanEmail}` });
  } catch (err) {
    next(err);
  }
};

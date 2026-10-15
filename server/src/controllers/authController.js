const jwt = require('jsonwebtoken');
const { supabase, isConfigured } = require('../config/supabase');
const { mockProfiles, mockAdmins } = require('../services/mockDbService');

const JWT_SECRET = process.env.JWT_SECRET || 'hcmute_scientific_cv_secret_2026';

// Login handler
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email) {
      return res.status(400).json({ success: false, message: 'Email không được để trống' });
    }

    const cleanEmail = email.trim().toLowerCase();

    // Check if Supabase is connected
    if (isConfigured()) {
      // In production Supabase, can use supabase.auth.signInWithPassword or check profiles table
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('email', cleanEmail)
        .maybeSingle();

      if (error) throw error;

      // Check if user is in admins list
      const { data: adminRecord } = await supabase
        .from('admins')
        .select('*')
        .eq('email', cleanEmail)
        .maybeSingle();

      const role = adminRecord ? 'admin' : (profile?.role || 'user');

      const token = jwt.sign(
        { email: cleanEmail, role, id: profile?.id },
        JWT_SECRET,
        { expiresIn: '7d' }
      );

      return res.json({
        success: true,
        message: 'Đăng nhập thành công',
        token,
        user: {
          id: profile?.id,
          email: cleanEmail,
          full_name: profile?.full_name || cleanEmail.split('@')[0],
          role
        }
      });
    }

    // Fallback Mock Mode
    const foundProfile = mockProfiles.find(p => p.email.toLowerCase() === cleanEmail);
    const isAdmin = mockAdmins.some(a => a.email.toLowerCase() === cleanEmail);
    const role = isAdmin ? 'admin' : (foundProfile ? foundProfile.role : 'user');

    const token = jwt.sign(
      { email: cleanEmail, role, id: foundProfile?.id || 'mock-id' },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    return res.json({
      success: true,
      message: 'Đăng nhập thành công (Chế độ Mock Demo)',
      token,
      user: {
        id: foundProfile?.id || 'user-' + Date.now(),
        email: cleanEmail,
        full_name: foundProfile?.full_name || cleanEmail.split('@')[0],
        role
      }
    });
  } catch (err) {
    next(err);
  }
};

// Get current user session
exports.getMe = async (req, res, next) => {
  try {
    const user = req.user;
    if (!user) {
      return res.status(401).json({ success: false, message: 'Chưa đăng nhập' });
    }

    return res.json({
      success: true,
      user
    });
  } catch (err) {
    next(err);
  }
};

// REST API Client for HCMUTE Scientific CV System

const BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

function getAuthHeader() {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function handleResponse(response) {
  const contentType = response.headers.get('content-type');
  let data = null;
  if (contentType && contentType.includes('application/json')) {
    data = await response.json();
  } else {
    data = { message: await response.text() };
  }

  if (!response.ok) {
    const errorMsg = data?.message || `Lỗi HTTP ${response.status}`;
    throw new Error(errorMsg);
  }
  return data;
}

export const api = {
  // Auth
  async login(email, password) {
    const res = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    return handleResponse(res);
  },

  async getMe() {
    const res = await fetch(`${BASE_URL}/auth/me`, {
      headers: { ...getAuthHeader() },
    });
    return handleResponse(res);
  },

  // Profiles
  async getProfile(email) {
    const url = email ? `${BASE_URL}/profile?email=${encodeURIComponent(email)}` : `${BASE_URL}/profile`;
    const res = await fetch(url, {
      headers: { ...getAuthHeader() },
    });
    return handleResponse(res);
  },

  async saveProfile(profileData) {
    const res = await fetch(`${BASE_URL}/profile`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader(),
      },
      body: JSON.stringify(profileData),
    });
    return handleResponse(res);
  },

  // Candidates (Admin)
  async getCandidates(filters = {}) {
    const params = new URLSearchParams(filters);
    const res = await fetch(`${BASE_URL}/candidates?${params.toString()}`, {
      headers: { ...getAuthHeader() },
    });
    return handleResponse(res);
  },

  async getStats() {
    const res = await fetch(`${BASE_URL}/candidates/stats`, {
      headers: { ...getAuthHeader() },
    });
    return handleResponse(res);
  },

  // Admins
  async getAdmins() {
    const res = await fetch(`${BASE_URL}/admins`, {
      headers: { ...getAuthHeader() },
    });
    return handleResponse(res);
  },

  async addAdmin(adminData) {
    const res = await fetch(`${BASE_URL}/admins`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader(),
      },
      body: JSON.stringify(adminData),
    });
    return handleResponse(res);
  },

  async removeAdmin(email) {
    const res = await fetch(`${BASE_URL}/admins/${encodeURIComponent(email)}`, {
      method: 'DELETE',
      headers: { ...getAuthHeader() },
    });
    return handleResponse(res);
  },
};


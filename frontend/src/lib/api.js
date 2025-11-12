/**
 * Frontend API client
 * - Centralizes fetch calls to the backend API
 * - Handles authentication tokens automatically
 * - Provides typed API methods
 */
import { API_BASE_URL, STORAGE_KEYS } from '../config/constants';

/**
 * Get authentication token from localStorage
 */
const getAuthToken = () => {
  return localStorage.getItem(STORAGE_KEYS.TOKEN);
};

/**
 * Get user role from localStorage
 */
const getUserRole = () => {
  return localStorage.getItem(STORAGE_KEYS.ROLE);
};

/**
 * Base request function with error handling
 */
async function request(path, options = {}) {
  const headers = {
    ...options.headers,
  };

  // Add auth token if available
  const token = getAuthToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  // Add content-type for JSON requests
  if (options.body && typeof options.body === 'object' && !(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
    options.body = JSON.stringify(options.body);
  }

  const config = {
    ...options,
    headers,
  };

  try {
    const response = await fetch(`${API_BASE_URL}${path}`, config);
    const contentType = response.headers.get('content-type');

    let data;
    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      data = await response.text();
    }

    if (!response.ok) {
      throw {
        status: response.status,
        message: data.message || data.error || 'Request failed',
        data,
      };
    }

    return data;
  } catch (error) {
    // Re-throw with structured error
    throw {
      status: error.status || 500,
      message: error.message || 'Network error',
      data: error.data,
    };
  }
}

// ============================================================================
// Authentication APIs
// ============================================================================

export async function register(payload) {
  return request('/api/auth/register', {
    method: 'POST',
    body: payload,
  });
}

export async function login(payload) {
  return request('/api/auth/login', {
    method: 'POST',
    body: payload,
  });
}

export async function logout() {
  localStorage.removeItem(STORAGE_KEYS.TOKEN);
  localStorage.removeItem(STORAGE_KEYS.ROLE);
  localStorage.removeItem(STORAGE_KEYS.USER_ID);
}

// ============================================================================
// User Profile APIs
// ============================================================================

export async function getMe() {
  const role = getUserRole();
  
  if (role === 'student') {
    return request('/api/students/me');
  }
  if (role === 'company') {
    return request('/api/companies/me');
  }
  if (role === 'admin') {
    return request('/api/admin/me');
  }
  
  return null;
}

// ============================================================================
// File Upload APIs
// ============================================================================

export async function uploadResume(file) {
  const formData = new FormData();
  formData.append('resume', file);

  return request('/api/students/upload-resume', {
    method: 'POST',
    body: formData,
  });
}

// ============================================================================
// Company APIs
// ============================================================================

export async function getCompanyJobs() {
  return request('/api/companies/jobs/my');
}

export async function getJobApplications(jobId) {
  return request(`/api/companies/jobs/${jobId}/applications`);
}

export async function updateApplicationStatus(applicationId, status) {
  return request(`/api/companies/applications/${applicationId}/status`, {
    method: 'POST',
    body: { status },
  });
}

// ============================================================================
// Profile Edit Request APIs
// ============================================================================

export async function submitProfileEditRequest(data) {
  return request('/api/students/profile-edit-request', {
    method: 'POST',
    body: data,
  });
}

export async function getMyProfileEditRequests() {
  return request('/api/students/profile-edit-requests');
}

export async function getProfileEditRequests() {
  return request('/api/admin/profile-edit-requests');
}

export async function approveProfileEditRequest(id, comments) {
  return request(`/api/admin/profile-edit-requests/${id}/approve`, {
    method: 'POST',
    body: { comments },
  });
}

export async function rejectProfileEditRequest(id, comments) {
  return request(`/api/admin/profile-edit-requests/${id}/reject`, {
    method: 'POST',
    body: { comments },
  });
}

// ============================================================================
// Company Permission Request APIs
// ============================================================================

export async function requestCompanyPermission(companyId, reason) {
  return request('/api/students/request-company-permission', {
    method: 'POST',
    body: { companyId, reason },
  });
}

export async function getMyCompanyPermissionRequests() {
  return request('/api/students/company-permission-requests', {
    method: 'GET',
  });
}

export async function getAllCompanyPermissionRequests() {
  return request('/api/admin/company-permission-requests', {
    method: 'GET',
  });
}

export async function approveCompanyPermissionRequest(requestId, note = '') {
  return request(`/api/admin/company-permission-requests/${requestId}/approve`, {
    method: 'POST',
    body: { note },
  });
}

export async function rejectCompanyPermissionRequest(requestId, note = '') {
  return request(`/api/admin/company-permission-requests/${requestId}/reject`, {
    method: 'POST',
    body: { note },
  });
}

export async function checkHasOffer() {
  return request('/api/students/has-offer', {
    method: 'GET',
  });
}

// ============================================================================
// Utilities
// ============================================================================

/**
 * Decode role from JWT token
 */
export function parseJwtRole(token) {
  try {
    const payload = token.split('.')[1];
    const decoded = JSON.parse(atob(payload));
    return decoded.role || null;
  } catch {
    return null;
  }
}

/**
 * Check if user is authenticated
 */
export function isAuthenticated() {
  return !!getAuthToken();
}

/**
 * Get stored authentication data
 */
export function getAuthData() {
  return {
    token: getAuthToken(),
    role: getUserRole(),
    userId: localStorage.getItem(STORAGE_KEYS.USER_ID),
  };
}

export default {
  request,
  register,
  login,
  logout,
  getMe,
  uploadResume,
  getCompanyJobs,
  getJobApplications,
  updateApplicationStatus,
  submitProfileEditRequest,
  getMyProfileEditRequests,
  getProfileEditRequests,
  approveProfileEditRequest,
  rejectProfileEditRequest,
  requestCompanyPermission,
  getMyCompanyPermissionRequests,
  getAllCompanyPermissionRequests,
  approveCompanyPermissionRequest,
  rejectCompanyPermissionRequest,
  checkHasOffer,
  parseJwtRole,
  isAuthenticated,
  getAuthData,
};


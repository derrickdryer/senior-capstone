export function requireAuth(...allowedRoles) {
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
  const userRole = localStorage.getItem('role');

  if (!isAuthenticated) {
    window.location.href = '/unauthorized';
    return false;
  }

  // If allowedRoles is provided and userRole isn’t one of them, redirect
  if (allowedRoles.length > 0 && !allowedRoles.includes(userRole)) {
    window.location.href = '/unauthorized';
    return false;
  }

  return true;
}

export function getUserId() {
  return localStorage.getItem('user_id');
}

/*
USAGE
import { requireAuth } from '/scripts/auth.js';
requireAuth('tenant'); OR requireAuth('tenant', 'manager');
*/

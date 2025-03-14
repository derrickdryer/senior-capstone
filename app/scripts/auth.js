/**
 * Ensures that a user is authenticated and has one of the required roles.
 *
 * This function verifies the user's authentication status using the 'isAuthenticated'
 * flag in localStorage. It also checks whether the user's role (stored under 'role')
 * matches any of the roles provided in the allowedRoles parameter. If the user is
 * either not authenticated or does not have an allowed role, the function redirects
 * the user to the /unauthorized page and returns false.
 *
 * @param {...string} allowedRoles - The roles permitted to access the resource.
 * @returns {boolean} Returns true if the user is authenticated and has an allowed role; otherwise, false.
 */
export function requireAuth(...allowedRoles) {
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
  const userRole = localStorage.getItem('role');

  if (!isAuthenticated) {
    window.location.href = '/unauthorized';
    return false;
  }

  // Redirect if allowedRoles are specified and the user's role is not among them.
  if (allowedRoles.length > 0 && !allowedRoles.includes(userRole)) {
    window.location.href = '/unauthorized';
    return false;
  }

  return true;
}

/**
 * Retrieves the currently authenticated user's unique identifier.
 *
 * This function returns the user ID stored in localStorage as 'user_id'.
 *
 * @returns {string|null} The user's unique identifier, or null if it is not available.
 */
export function getUserId() {
  return localStorage.getItem('user_id');
}

/*
Example Usage:

import { requireAuth, getUserId } from '/scripts/auth.js';

// Enforce access for tenants:
if (requireAuth('tenant')) {
  const userId = getUserId();
  // Perform tenant-specific logic here...
}

// Allow access for both tenants and managers:
requireAuth('tenant', 'manager');
*/

/**
 * Decodes a JSON Web Token (JWT) and extracts its payload.
 *
 * This function decodes the base64Url-encoded payload of the provided JWT,
 * converts it into a JSON string, and then parses it into an object.
 * If the token is falsy or improperly formatted, it returns null.
 *
 * @param {string} token - The JSON Web Token to be decoded.
 * @returns {Object|null} The decoded payload as an object, or null if the token is invalid.
 */
function parseJwt(token) {
  if (!token) return null;
  const base64Url = token.split('.')[1];
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  const jsonPayload = decodeURIComponent(
    atob(base64)
      .split('')
      .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
      .join('')
  );
  return JSON.parse(jsonPayload);
}

/**
 * Updates the header element in the DOM by replacing the current header
 * with a newly generated header.
 *
 * This function searches for an existing <header> element in the document.
 * If found, it calls the createHeader() function to generate an updated header,
 * and then replaces the old header with the new one.
 */
export function updateHeader() {
  const headerContainer = document.querySelector('header');
  if (headerContainer) {
    const newHeader = createHeader();
    headerContainer.parentNode.replaceChild(newHeader, headerContainer);
  }
}

/**
 * Generates a header element with dynamic navigation based on user authentication.
 *
 * This function creates a <header> element that includes the site title and a set of
 * navigation links. If a valid JWT token is found in sessionStorage, it decodes the
 * token to determine the user's role and stores the authentication status and role
 * in localStorage. It also adds role-specific navigation links along with a logout button.
 * If no valid token is present, it clears any stored authentication data and displays
 * a login link.
 *
 * @returns {HTMLElement} The constructed header element containing navigation links.
 */
export function createHeader() {
  const token = sessionStorage.getItem('token');
  const isLoggedIn = Boolean(token);
  let role = '';

  if (isLoggedIn) {
    const payload = parseJwt(token);
    if (payload && payload.role) {
      role = payload.role;
      // Store role and authentication status
      localStorage.setItem('role', role);
      localStorage.setItem('isAuthenticated', 'true');
      // Store user ID if available
      if (payload.id) {
        localStorage.setItem('user_id', payload.id);
      }
    }
  } else {
    localStorage.removeItem('role');
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('user_id');
  }

  let extraButtons = '';
  if (isLoggedIn) {
    if (role === 'manager') {
      extraButtons += `<li><a href="/admin">Admin</a></li>`;
    }
    if (role === 'maintenance') {
      extraButtons += `<li><a href="/maintenance-info">Maintenance</a></li>`;
    }
    if (role === 'tenant') {
      extraButtons += `<li><a href="/tenant">Tenant</a></li>`;
    }
    extraButtons += `<li><a href="#" id="logout-btn">Logout</a></li>`;
  }

  const header = document.createElement('header');
  header.innerHTML = `
    <h1>Russell Properties LLC (Development Build)</h1>
    <nav>
      <ul>
        <li><a href="/index">Home</a></li>
        <li><a href="/properties">Properties</a></li>
        <li><a href="/about">About Us</a></li>
        <li><a href="/contact">Contact</a></li>
        ${isLoggedIn ? '' : '<li><a href="/login">Login</a></li>'}
        ${extraButtons}
      </ul>
    </nav>
  `;

  if (isLoggedIn) {
    const logoutBtn = header.querySelector('#logout-btn');
    logoutBtn.addEventListener('click', (event) => {
      event.preventDefault();
      sessionStorage.removeItem('token');
      localStorage.removeItem('isAuthenticated');
      localStorage.removeItem('role');
      localStorage.removeItem('user_id');
      updateHeader();
      window.location.href = '/login';
    });
  }
  return header;
}

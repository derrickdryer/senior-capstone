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

export function updateHeader() {
  const headerContainer = document.querySelector('header');
  if (headerContainer) {
    const newHeader = createHeader();
    headerContainer.parentNode.replaceChild(newHeader, headerContainer);
  }
}

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
      // Also store user_id if available
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

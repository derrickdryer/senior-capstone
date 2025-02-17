export function createHeader() {
  const header = document.createElement('header');
  const isLoggedIn = localStorage.getItem('isAuthenticated') === 'true';
  const role = localStorage.getItem('role');

  let extraButtons = '';
  if (isLoggedIn) {
    // If the user is a manager, add an Admin page button
    if (role === 'manager') {
      extraButtons += `<li><a href="/admin">Admin</a></li>`;
    }
    // If the user is a tenant, add a Tenant page button
    if (role === 'tenant') {
      extraButtons += `<li><a href="/tenant">Tenant</a></li>`;
    }
    // Add Logout button regardless of role
    extraButtons += `<li><button id="logout-btn">Logout</button></li>`;
  }

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

  // Add logout functionality if logged in
  if (isLoggedIn) {
    const logoutBtn = header.querySelector('#logout-btn');
    logoutBtn.addEventListener('click', () => {
      localStorage.clear();
      updateHeader(); // re-render header after logout
      window.location.href = '/login';
    });
  }

  return header;
}

export function updateHeader() {
  const existingHeader = document.querySelector('header');
  const newHeader = createHeader();
  if (existingHeader) {
    existingHeader.replaceWith(newHeader);
  } else {
    document.body.prepend(newHeader);
  }
}

// Usage example (call updateHeader once on page load or after login state changes)
// updateHeader();

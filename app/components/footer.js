/**
 * Creates a footer element for the application with copyright information.
 *
 * This function generates an HTML <footer> element containing a paragraph with copyright details.
 * It can be appended to any part of the DOM. The content and styling of the footer may be
 * customized as needed.
 *
 * @example
 * // Append the generated footer to the body element:
 * document.body.appendChild(createFooter());
 *
 * @returns {HTMLElement} A <footer> element populated with the copyright information.
 */
export function createFooter() {
  const footer = document.createElement('footer');
  footer.innerHTML = `
        <p>&copy; 2024-${new Date().getFullYear()} Russell Properties. All rights reserved.</p>
  `;
  return footer;
}

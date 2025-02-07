// app/components/footer.js

export function createFooter() {
    const footer = document.createElement('footer');
    footer.innerHTML = `
        <p>&copy; 2024 Russell Properties. All rights reserved.</p>
    `;
    return footer;
}

// Usage example
// document.body.appendChild(createFooter());
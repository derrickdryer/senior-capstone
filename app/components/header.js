// app/components/header.js

export function createHeader() {
    const header = document.createElement('header');
    header.innerHTML = `
        <h1>Russell Properties LLC (Development Build)</h1>
        <nav>
            <ul>
                <li><a href="/index">Home</a></li>
                <li><a href="/properties">Properties</a></li>
                <li><a href="/about">About Us</a></li>
                <li><a href="/contact">Contact</a></li>
                <li><a href="/login">Login</a></li>
            </ul>
        </nav>
    `;
    return header;
}

// Usage example
// document.body.prepend(createHeader());

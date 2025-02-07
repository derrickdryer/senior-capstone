// app/components/header.js

export function createHeader() {
    const header = document.createElement('header');
    header.innerHTML = `
        <h1>Russell Properties LLC (Development Build)</h1>
        <nav>
            <ul>
                <li><a href="index.html">Home</a></li>
                <li><a href="properties.html">Properties</a></li>
                <li><a href="about.html">About Us</a></li>
                <li><a href="contact.html">Contact</a></li>
                <li><a href="login.html">Login</a></li>
            </ul>
        </nav>
    `;
    return header;
}

// Usage example
// document.body.prepend(createHeader());
// ======================================================================
// File: babel.config.js
// Description: Babel configuration for transpiling modern JavaScript and TypeScript.
//              Uses @babel/preset-env to convert ES6+ code and @babel/preset-typescript
//              to handle TypeScript compilation.
// Dependencies: @babel/preset-env, @babel/preset-typescript.
// Usage: Babel uses this configuration during the build or testing process.
// ======================================================================

module.exports = {
  presets: ['@babel/preset-env', '@babel/preset-typescript'], // Enables ES6+ and TypeScript support
};

// ======================================================================
// File: ci-info.js
// Description: Provides a mock for CI environment information.
//              Prevents runtime errors related to vendor properties in CI tests.
// Usage: Used during tests to simulate a non-CI environment or customize CI flags.
// ======================================================================

module.exports = {
  isCI: false, // Indicates whether the code is running in a CI environment
  vendors: [], // List of vendors; ensures vendors.map exists to avoid runtime errors
  isPR: () => false, // Function to indicate if the current environment is a PR build
};

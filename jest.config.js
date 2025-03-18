// ======================================================================
// File: jest.config.js
// Description: Configuration file for Jest, enabling TypeScript support via ts-jest,
//              setting the test environment to Node.js, and defining module name mappings.
// Dependencies: ts-jest for transpiling TypeScript, Jest for testing.
// Usage: Run Jest tests using this configuration by executing the jest command.
// ======================================================================

module.exports = {
  preset: 'ts-jest', // Use ts-jest preset to compile TypeScript files.
  testEnvironment: 'node', // Set the testing environment to Node.js.
  moduleNameMapper: {
    '^ci-info$': '<rootDir>/tests/__mocks__/ci-info.js', // Redirect 'ci-info' imports to the mock.
  },
};

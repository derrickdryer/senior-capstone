module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleNameMapper: {
    '^ci-info$': '<rootDir>/tests/__mocks__/ci-info.js',
  },
};

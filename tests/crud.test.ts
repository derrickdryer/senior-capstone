const { models } = require('../models/schemas'); // Import corrected models

const tables = Object.keys(models).filter(
  (key) => !['settings', 'alerts', 'tools', 'images'].includes(key)
);

const additionalEndpoints = [];
export const endpoints = [...new Set([...tables, ...additionalEndpoints])];

test('simple test', () => {
  expect(true).toBe(true);
});

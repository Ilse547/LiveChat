const { defineConfig } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './server/tests/E2E',
  use: {
    baseURL: 'http://localhost:3000',
  },
});

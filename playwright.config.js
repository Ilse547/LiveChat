const { defineConfig } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './server/tests/e2e',
  use: {
    baseURL: 'http://localhost:3000',
  },
});

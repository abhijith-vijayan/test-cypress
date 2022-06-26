const { defineConfig } = require("cypress");

module.exports = defineConfig({
  projectId: '86ag1v',
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});

const { defineConfig } = require("cypress");

module.exports = defineConfig({
  "defaultCommandTimeout": 10000,  // Set the timeout to 10 seconds (in milliseconds)
  
  "e2e": {
    "setupNodeEvents": (on, config) => {
      // implement node event listeners here
    }
  },
  
  "component": {
    "devServer": {
      "framework": "create-react-app",
      "bundler": "webpack"
    }
  }
});

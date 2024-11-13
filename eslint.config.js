const globals = require("globals");

module.exports = [
  {
    files: ["**/*.js"],
    languageOptions: {
      sourceType: "commonjs",
      globals: {
        ...globals.browser, // Merge global variables defined by the "browser" environment
        window: "readonly",
        document: "readonly",
        localStorage: "readonly",
        sessionStorage: "readonly",
        fetch: "readonly",
        console: "readonly",
        navigator: "readonly",
      },
    },
    plugins: {
      // Add the eslint-plugin-html plugin here
      "html": require("eslint-plugin-html"),
    },
    rules: {
      "no-console": "off",
      semi: ["error", "always"],
    },
  }
];

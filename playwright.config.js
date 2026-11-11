const { defineConfig } = require("@playwright/test");

module.exports = defineConfig({
  testDir: "./_scripts/browser",
  workers: 1,
  globalTimeout: 120_000,
  use: {
    baseURL: "http://127.0.0.1:4173",
    browserName: "chromium",
    permissions: ["clipboard-read", "clipboard-write"],
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
  },
  webServer: {
    command:
      "bundle exec jekyll serve --host 127.0.0.1 --port 4173 --no-watch --skip-initial-build",
    url: "http://127.0.0.1:4173",
    reuseExistingServer: false,
  },
});

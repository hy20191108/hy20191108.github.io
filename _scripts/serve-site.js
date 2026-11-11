const { createServer } = require("node:http");
const sirv = require("sirv");

const site = sirv("_site", {
  setHeaders(response, path) {
    // Match GitHub Pages so Markdown is displayed as UTF-8 in the browser.
    if (path.endsWith(".md")) {
      response.setHeader("Content-Type", "text/markdown; charset=utf-8");
    }
  },
});

createServer(site).listen(4173, "127.0.0.1");

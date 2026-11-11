const { resolve, sep } = require("node:path");
const root = resolve("_site");

Bun.serve({
  hostname: "127.0.0.1",
  port: 4173,
  async fetch(request) {
    const pathname = decodeURIComponent(new URL(request.url).pathname);
    const path = resolve(
      root,
      `.${pathname}${pathname.endsWith("/") ? "index.html" : ""}`,
    );
    if (!path.startsWith(root + sep))
      return new Response(null, { status: 404 });
    const file = Bun.file(path);
    if (!(await file.exists())) return new Response(null, { status: 404 });
    return new Response(file, {
      headers: {
        "Content-Type": path.endsWith(".md")
          ? "text/markdown; charset=utf-8"
          : file.type,
      },
    });
  },
});

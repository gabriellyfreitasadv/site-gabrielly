// Servidor estático sem dependências para o Railway
const http = require("http");
const fs = require("fs");
const path = require("path");

const PORT = process.env.PORT || 3000;
const ROOT = __dirname;
const TYPES = {
  ".html": "text/html; charset=utf-8", ".css": "text/css", ".js": "text/javascript",
  ".webp": "image/webp", ".png": "image/png", ".jpg": "image/jpeg", ".svg": "image/svg+xml", ".ico": "image/x-icon"
};

http.createServer((req, res) => {
  let p = decodeURIComponent(req.url.split("?")[0]);
  if (p === "/") p = "/index.html";
  const file = path.join(ROOT, path.normalize(p).replace(/^(\.\.[\/\\])+/, ""));
  if (!file.startsWith(ROOT) || file.endsWith("server.js") || file.endsWith("package.json")) { res.writeHead(404); return res.end(); }
  fs.readFile(file, (err, data) => {
    if (err) {
      return fs.readFile(path.join(ROOT, "index.html"), (e2, html) => {
        res.writeHead(e2 ? 404 : 200, { "Content-Type": TYPES[".html"] }); res.end(html || "");
      });
    }
    const ext = path.extname(file).toLowerCase();
    res.writeHead(200, {
      "Content-Type": TYPES[ext] || "application/octet-stream",
      "Cache-Control": ext === ".html" ? "no-cache" : "public, max-age=604800"
    });
    res.end(data);
  });
}).listen(PORT, () => console.log("Site no ar na porta " + PORT));

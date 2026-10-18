/* Tiny static server for local preview and API tests: node scripts/serve.js [port] */
const http = require('http');
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const TYPES = {
  '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8',
  '.json': 'application/json', '.pdf': 'application/pdf', '.png': 'image/png', '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg', '.webp': 'image/webp', '.svg': 'image/svg+xml', '.ico': 'image/x-icon',
};

function createServer() {
  return http.createServer((req, res) => {
    const urlPath = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
    let file = path.normalize(path.join(ROOT, urlPath));
    if (!file.startsWith(ROOT) || /(^|[\\/])(node_modules|\.)/.test(path.relative(ROOT, file))) {
      res.writeHead(404, { 'Content-Type': 'text/plain' }); return res.end('Not found');
    }
    if (fs.existsSync(file) && fs.statSync(file).isDirectory()) file = path.join(file, 'index.html');
    fs.readFile(file, (err, data) => {
      if (err) { res.writeHead(404, { 'Content-Type': 'text/plain' }); return res.end('Not found'); }
      res.writeHead(200, { 'Content-Type': TYPES[path.extname(file).toLowerCase()] || 'application/octet-stream' });
      res.end(data);
    });
  });
}

if (require.main === module) {
  const port = Number(process.argv[2] || process.env.PORT || 8080);
  createServer().listen(port, () => console.log(`Portfolio running at http://localhost:${port}`));
}

module.exports = { createServer };

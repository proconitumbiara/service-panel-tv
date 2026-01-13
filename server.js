const http = require("http");
const fs = require("fs");
const path = require("path");

const PORT = 3000;
// URL do WebSocket - Altere aqui para o IP correto do servidor WebSocket
const WS_URL = process.env.WEBSOCKET_URL;

const server = http.createServer((req, res) => {
  let filePath = "./app" + (req.url === "/" ? "/index.html" : req.url);
  let extname = String(path.extname(filePath)).toLowerCase();

  const mimeTypes = {
    ".html": "text/html",
    ".js": "text/javascript",
    ".css": "text/css",
    ".svg": "image/svg+xml",
    ".png": "image/png",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".gif": "image/gif",
    ".ico": "image/x-icon",
  };

  const contentType = mimeTypes[extname] || "application/octet-stream";

  fs.readFile(filePath, (error, content) => {
    if (error) {
      if (error.code === "ENOENT") {
        res.writeHead(404, { "Content-Type": "text/html; charset=utf-8" });
        res.end(`Arquivo não encontrado: ${req.url}`);
      } else {
        res.writeHead(500, { "Content-Type": "text/html; charset=utf-8" });
        res.end(`Erro ao ler arquivo: ${error.message}`);
      }
    } else {
      // Se for index.html, injeta a URL do WebSocket
      if (req.url === "/" || req.url === "/index.html") {
        let htmlContent = content.toString();
        // Injeta script com a URL do WebSocket antes do fechamento do </head>
        const wsConfig = `
    <script>
      window.WS_URL = "${WS_URL}";
    </script>`;
        htmlContent = htmlContent.replace("</head>", wsConfig + "\n  </head>");
        res.writeHead(200, { "Content-Type": contentType });
        res.end(htmlContent, "utf-8");
      } else {
        res.writeHead(200, { "Content-Type": contentType });
        res.end(content, "utf-8");
      }
    }
  });
});

server.listen(PORT, "0.0.0.0", () => {
  const os = require("os");
  const interfaces = os.networkInterfaces();
  let localIp = "localhost";
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      if (iface.family === "IPv4" && !iface.internal) {
        localIp = iface.address;
        break;
      }
    }
  }
  console.log(`Servidor rodando em http://localhost:${PORT}`);
  console.log(`Acesse também via IP: http://${localIp}:${PORT}`);
  console.log(`WebSocket configurado: ${WS_URL}`);
});

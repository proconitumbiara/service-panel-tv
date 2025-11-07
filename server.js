const http = require("http");
const fs = require("fs");
const path = require("path");

const PORT = 3000;

const server = http.createServer((req, res) => {
  let filePath = "./public" + (req.url === "/" ? "/index.html" : req.url);
  let extname = String(path.extname(filePath)).toLowerCase();

  const mimeTypes = {
    ".html": "text/html",
    ".js": "text/javascript",
    ".css": "text/css",
  };

  const contentType = mimeTypes[extname] || "application/octet-stream";

  fs.readFile(filePath, (error, content) => {
    if (error) {
      res.writeHead(404);
      res.end("Arquivo não encontrado");
    } else {
      res.writeHead(200, { "Content-Type": contentType });
      res.end(content, "utf-8");
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
});

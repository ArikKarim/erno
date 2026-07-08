const http = require("node:http");
const fs = require("node:fs");
const path = require("node:path");

const root = __dirname;
const rootPrefix = root.endsWith(path.sep) ? root : `${root}${path.sep}`;
const port = Number(process.argv[2] || 4173);
const host = "127.0.0.1";
const types = new Map([
  [".html", "text/html; charset=utf-8"],
  [".css", "text/css; charset=utf-8"],
  [".js", "text/javascript; charset=utf-8"],
  [".json", "application/json; charset=utf-8"],
  [".svg", "image/svg+xml"],
]);

const server = http.createServer((request, response) => {
  const requestUrl = new URL(request.url, `http://${host}`);
  const pathname = requestUrl.pathname === "/" ? "/index.html" : decodeURIComponent(requestUrl.pathname);
  const filePath = path.resolve(root, `.${pathname}`);

  if (filePath !== root && !filePath.startsWith(rootPrefix)) {
    response.writeHead(403);
    response.end("Forbidden");
    return;
  }

  fs.readFile(filePath, (error, data) => {
    if (error) {
      response.writeHead(404);
      response.end("Not found");
      return;
    }

    response.writeHead(200, {
      "Content-Type": types.get(path.extname(filePath)) || "application/octet-stream",
    });
    response.end(data);
  });
});

server.listen(port, host, () => {
  console.log(`erno running at http://${host}:${port}`);
});

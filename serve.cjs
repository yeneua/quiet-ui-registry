// 로컬 확인용: r/*.json 을 http://localhost:4873/r/{name}.json 으로 서빙
const http = require("http");
const fs = require("fs");
const path = require("path");

const port = Number(process.env.PORT) || 4873;

http
  .createServer((req, res) => {
    const file = path.join(__dirname, decodeURIComponent(req.url.split("?")[0]));
    if (!file.startsWith(path.join(__dirname, "r"))) {
      res.statusCode = 404;
      return res.end();
    }
    fs.readFile(file, (err, data) => {
      if (err) {
        res.statusCode = 404;
        return res.end();
      }
      res.setHeader("content-type", "application/json");
      res.end(data);
    });
  })
  .listen(port, () => console.log(`registry: http://localhost:${port}/r/{name}.json`));

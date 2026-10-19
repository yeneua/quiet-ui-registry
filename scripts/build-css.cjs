// registry.json 의 theme 토큰 + src/css/components.css → dist/quiet.css
// React 레지스트리와 같은 토큰을 쓰도록 색·폰트 값은 registry.json 에서만 읽는다.
const fs = require("fs");
const path = require("path");

const root = path.join(__dirname, "..");
const pkg = require(path.join(root, "package.json"));
const registry = require(path.join(root, "registry.json"));
const theme = registry.items.find((item) => item.name === "theme");

const pretendard = theme.dependencies.find((d) => d.startsWith("pretendard@"));
const vars = (obj) =>
  Object.entries(obj)
    .map(([key, value]) => `  --${key}: ${value};`)
    .join("\n");

const css = [
  `/* quiet-ui v${pkg.version} | 생성 파일: registry.json, src/css/components.css 를 고친 뒤 npm run build */`,
  `@import url("https://cdn.jsdelivr.net/npm/${pretendard}/dist/web/variable/pretendardvariable-dynamic-subset.min.css");`,
  `:root {\n${vars({ ...theme.cssVars.theme, ...theme.cssVars.light })}\n}`,
  `.dark {\n${vars(theme.cssVars.dark)}\n}`,
  fs.readFileSync(path.join(root, "src/css/components.css"), "utf8"),
].join("\n\n");

fs.mkdirSync(path.join(root, "dist"), { recursive: true });
fs.writeFileSync(path.join(root, "dist/quiet.css"), css);
console.log("dist/quiet.css");

import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const css = await readFile(
  new URL("../src/app/global.css", import.meta.url),
  "utf8",
);
const page = await readFile(
  new URL("../src/app/docs/[[...slug]]/page.tsx", import.meta.url),
  "utf8",
);
const landmarks = await readFile(
  new URL("../src/components/docs-landmarks.tsx", import.meta.url),
  "utf8",
);
const code = await readFile(
  new URL("../src/components/docs-code.tsx", import.meta.url),
  "utf8",
);
const fumadocsPage = await readFile(
  new URL(
    "../node_modules/fumadocs-ui/dist/layouts/docs/page/slots/container.js",
    import.meta.url,
  ),
  "utf8",
);
const fumadocsToc = await readFile(
  new URL(
    "../node_modules/fumadocs-ui/dist/layouts/docs/page/slots/toc.js",
    import.meta.url,
  ),
  "utf8",
);
const fumadocsLayout = await readFile(
  new URL(
    "../node_modules/fumadocs-ui/dist/layouts/docs/slots/container.js",
    import.meta.url,
  ),
  "utf8",
);
const fumadocsHeader = await readFile(
  new URL(
    "../node_modules/fumadocs-ui/dist/layouts/docs/slots/header.js",
    import.meta.url,
  ),
  "utf8",
);
const fumadocsCode = await readFile(
  new URL(
    "../node_modules/fumadocs-ui/dist/components/codeblock.js",
    import.meta.url,
  ),
  "utf8",
);

test("pins the fumadocs ids the docs chrome fix depends on", () => {
  assert.match(fumadocsPage, /id:\s*"nd-page"/);
  assert.match(fumadocsToc, /id:\s*"nd-toc"/);
  assert.match(fumadocsLayout, /id:\s*"nd-docs-layout"/);
  assert.match(fumadocsHeader, /id:\s*"nd-subnav"/);
  assert.match(fumadocsCode, /\.\.\.viewportProps,\s*role:\s*"region"/);
});

test("pins the dark Shiki comment color override", () => {
  for (const token of [
    "--shiki-dark:#6A737D",
    "--shiki-dark: #6A737D",
    "--shiki-dark:#6a737d",
    "--shiki-dark: #6a737d",
  ]) {
    assert.equal(css.includes(token), true, token);
  }
  assert.match(css, /--shiki-dark:\s*#8b949e\s*!important;/);
});

test("sets docs landmark roles through fumadocs props", () => {
  assert.match(page, /role="main"/);
  assert.match(page, /role:\s*"navigation"/);
  assert.match(page, /"aria-label":\s*"On this page"/);
  assert.match(page, /"aria-label":\s*"Page sections"/);
  assert.match(page, /pre:\s*DocsPre/);
  assert.match(
    code,
    /viewportProps=\{\{\s*"aria-label":\s*`Code sample \$\{id\}`\s*\}\}/,
  );
});

test("reapplies the uncovered header role when the docs path changes", () => {
  assert.match(landmarks, /usePathname\(\)/);
  assert.match(landmarks, /useLayoutEffect\([\s\S]*?,\s*\[pathname\]\s*\)/);
  assert.match(landmarks, /#nd-docs-layout header/);
  assert.match(landmarks, /header\.id === "nd-subnav"/);
  assert.match(landmarks, /setAttribute\("role", "group"\)/);
  assert.equal(landmarks.includes("useLayoutEffect(() => {"), true);
  assert.equal(/\],\s*\[\s*\]\s*\)/.test(landmarks), false);
});

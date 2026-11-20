import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { codeSampleLabel } from "../src/lib/code-sample-label.mjs";

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
const labelSource = await readFile(
  new URL("../src/lib/code-sample-label.mjs", import.meta.url),
  "utf8",
);
const sourceConfig = await readFile(
  new URL("../source.config.ts", import.meta.url),
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
  assert.equal(page.includes("DocsCodeScope"), false);
  assert.match(code, /codeSampleLabel\(/);
  assert.match(code, /"data-order":\s*dataOrder/);
  assert.match(code, /viewportProps=\{\{\s*"aria-label":\s*label\s*\}\}/);
  assert.equal(code.includes("usePathname"), false);
  assert.equal(code.includes("+="), false);
  assert.match(sourceConfig, /dataOrder\s*=\s*order/);
  assert.match(sourceConfig, /stampCodeOrder/);
});

test("builds readable code labels without screen-reader id marks", () => {
  assert.match(labelSource, /\$\{lang\} code \$\{order\}/);
  assert.match(labelSource, /`Code sample \$\{order\}`/);
  assert.equal(code.includes("useId"), false);
  const titled = new Set();
  assert.equal(
    codeSampleLabel({
      title: "Install",
      language: "bash",
      order: 1,
      used: titled,
    }),
    "Install",
  );
  const plain = new Set();
  assert.equal(
    codeSampleLabel({ language: "bash", order: 1, used: plain }),
    "bash code 1",
  );
  assert.equal(
    codeSampleLabel({ language: "json", order: 2, used: plain }),
    "json code 2",
  );
  const untitled = new Set();
  assert.equal(codeSampleLabel({ order: 1, used: untitled }), "Code sample 1");
  const noisy = new Set();
  const cleaned = codeSampleLabel({
    title: "Note: «read»",
    order: 1,
    used: noisy,
  });
  assert.equal(cleaned, "Note read");
  const built = [
    cleaned,
    "bash code 1",
    "json code 2",
    "Code sample 1",
    "Install",
  ];
  for (const label of built) {
    assert.equal(label.includes("«"), false, label);
    assert.equal(label.includes("»"), false, label);
    assert.equal(label.includes(":"), false, label);
  }
  assert.match(sourceConfig, /dataCodeLabel = codeSampleLabel/);
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

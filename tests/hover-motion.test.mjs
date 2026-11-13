import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const globalCss = await readFile(
  new URL("../src/app/global.css", import.meta.url),
  "utf8",
);
const projects = await readFile(
  new URL(
    "../src/app/(home)/_components/projects-section.tsx",
    import.meta.url,
  ),
  "utf8",
);
const diagramCss = await readFile(
  new URL(
    "../src/app/(home)/_components/network-diagram.module.css",
    import.meta.url,
  ),
  "utf8",
);

const allowed = new Set([
  "color",
  "background-color",
  "border-color",
  "opacity",
  "box-shadow",
  "transform",
  "none",
]);

test("defines shared fast hover tokens beside the root color tokens", () => {
  const root = globalCss.slice(
    globalCss.indexOf(":root {"),
    globalCss.indexOf(".dark {"),
  );
  assert.match(root, /--km-dur-fast:\s*150ms\s*;/);
  assert.match(
    root,
    /--km-ease-out:\s*cubic-bezier\(0\.22,\s*1,\s*0\.36,\s*1\)\s*;/,
  );
  assert.match(
    diagramCss,
    /--nh-ease-out:\s*cubic-bezier\(0\.22,\s*1,\s*0\.36,\s*1\)\s*;/,
  );
  assert.equal(diagramCss.includes("--km-dur-fast"), false);
  assert.equal(diagramCss.includes("--km-ease-out"), false);
});

test("points button hover and focus transitions at the shared tokens", () => {
  assert.match(
    globalCss,
    /\.km-button-primary,\s*\.km-button-secondary,\s*\.km-copy-button\s*\{[^}]*transition:\s*background-color var\(--km-dur-fast\) var\(--km-ease-out\),\s*border-color var\(--km-dur-fast\) var\(--km-ease-out\);/s,
  );
  assert.equal(globalCss.includes("transition: all"), false);
  assert.equal(globalCss.includes("background-color 150ms"), false);
});

test("points project-card hovers at the shared tokens", () => {
  for (const banned of [
    "transition-all",
    "transition-colors",
    "transition-opacity",
    "transition-transform",
    "duration-",
  ]) {
    assert.equal(projects.includes(banned), false, banned);
  }
  assert.match(projects, /km-project-card/);
  assert.match(projects, /km-project-arrow/);
  assert.match(projects, /km-project-open/);
  assert.match(projects, /km-project-action/);
  assert.match(
    globalCss,
    /\.km-project-card\s*\{[^}]*transition:\s*border-color var\(--km-dur-fast\) var\(--km-ease-out\);/s,
  );
  assert.match(
    globalCss,
    /\.km-project-arrow\s*\{[^}]*transition:\s*transform var\(--km-dur-fast\) var\(--km-ease-out\);/s,
  );
  assert.match(
    globalCss,
    /\.km-project-open\s*\{[^}]*transition:\s*opacity var\(--km-dur-fast\) var\(--km-ease-out\);/s,
  );
  assert.match(
    globalCss,
    /\.km-project-action\s*\{[^}]*transition:\s*background-color var\(--km-dur-fast\) var\(--km-ease-out\);/s,
  );
});

test("limits motion transitions to paint properties and keeps reduced motion", () => {
  const declarations = [...globalCss.matchAll(/transition:\s*([^;]+);/g)].map(
    (match) => match[1],
  );
  assert.ok(declarations.length >= 2);
  for (const declaration of declarations) {
    const body = declaration.replace(/\s*!important\s*/g, " ").trim();
    for (const part of body.split(",")) {
      const [property] = part.trim().split(/\s+/);
      assert.ok(allowed.has(property), property);
      if (property === "none") continue;
      assert.match(part, /var\(--km-dur-fast\)/);
      assert.match(part, /var\(--km-ease-out\)/);
    }
  }
  assert.match(
    globalCss,
    /@media \(prefers-reduced-motion: reduce\) \{\s*\.km-home \*,\s*\.km-home \*::before,\s*\.km-home \*::after \{\s*animation: none !important;\s*transition: none !important;\s*\}\s*\}/,
  );
});

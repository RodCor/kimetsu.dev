import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const css = await readFile(
  new URL("../src/app/global.css", import.meta.url),
  "utf8",
);

const homeFiles = [
  "src/app/(home)/page.tsx",
  "src/app/(home)/_components/about-contact.tsx",
  "src/app/(home)/_components/benchmark-results.tsx",
  "src/app/(home)/_components/home-visuals.tsx",
  "src/app/(home)/_components/network-section.tsx",
  "src/app/(home)/_components/quick-start.tsx",
];

const tokens = [
  "--km-text-xs",
  "--km-text-sm",
  "--km-text-md",
  "--km-text-lg",
  "--km-text-xl",
  "--km-text-2xl",
  "--km-text-display",
];

test("defines one homepage type scale of seven tokens", () => {
  for (const token of tokens) {
    assert.match(css, new RegExp(`${token}:`));
  }
  const sizes = [...css.matchAll(/font-size:\s*([^;]+);/g)].map((match) =>
    match[1].trim(),
  );
  assert.ok(sizes.length > 0);
  for (const size of sizes) {
    assert.match(size, /^var\(--km-text-(xs|sm|md|lg|xl|2xl|display)\)$/);
  }
  assert.match(css, /--km-section-gap:\s*3\.5rem/);
  assert.match(css, /--km-section-gap:\s*3rem/);
});

test("homepage copy uses the type tokens instead of one-off sizes", async () => {
  for (const file of homeFiles) {
    const source = await readFile(
      new URL(`../${file}`, import.meta.url),
      "utf8",
    );
    assert.doesNotMatch(
      source,
      /(?<![\w-])text-(xs|sm|base|lg|xl|2xl|3xl|4xl|5xl|6xl|7xl|8xl|9xl)\b/,
      file,
    );
    assert.doesNotMatch(source, /(?<![\w-])text-\[/, file);
  }
});

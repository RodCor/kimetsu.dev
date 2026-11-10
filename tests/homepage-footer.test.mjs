import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const about = await readFile(
  new URL("../src/app/(home)/_components/about-contact.tsx", import.meta.url),
  "utf8",
);
const page = await readFile(
  new URL("../src/app/(home)/page.tsx", import.meta.url),
  "utf8",
);

test("keeps about and contact copy in the footer without a primary button", () => {
  const footer = page.indexOf("<footer");
  const folded = page.indexOf("<AboutContact");
  assert.ok(footer >= 0 && folded > footer);
  assert.match(page, /href="#about"/);
  assert.match(page, /href="#contact"/);

  assert.match(about, /id="about"/);
  assert.match(about, /id="contact"/);
  assert.match(about, /About Kimetsu/);
  assert.match(about, /Created and maintained by/);
  assert.match(about, /Rodrigo Córdoba/);
  assert.match(
    about,
    /Written in Rust and released under the MIT and Apache-2.0 licenses/,
  );
  assert.match(about, /Source code →/);
  assert.match(about, /Related projects →/);
  assert.match(about, /href=\{links\.linkedin\}/);
  assert.match(
    about,
    /For questions, feedback, or collaboration, contact Rodrigo on/,
  );
  assert.equal(about.includes("km-button-primary"), false);
  assert.equal(about.includes("km-section"), false);
  assert.equal(about.includes("km-heading"), false);
});

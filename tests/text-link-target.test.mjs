import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const css = await readFile(
  new URL("../src/app/global.css", import.meta.url),
  "utf8",
);

const sources = {
  benchmarks: await readFile(
    new URL(
      "../src/app/(home)/_components/benchmark-results.tsx",
      import.meta.url,
    ),
    "utf8",
  ),
  network: await readFile(
    new URL(
      "../src/app/(home)/_components/network-section.tsx",
      import.meta.url,
    ),
    "utf8",
  ),
  quickStart: await readFile(
    new URL("../src/app/(home)/_components/quick-start.tsx", import.meta.url),
    "utf8",
  ),
  page: await readFile(
    new URL("../src/app/(home)/page.tsx", import.meta.url),
    "utf8",
  ),
  about: await readFile(
    new URL("../src/app/(home)/_components/about-contact.tsx", import.meta.url),
    "utf8",
  ),
};

const repeatedTarget = "inline-flex min-h-[24px] items-center";

test("defines one tap-target utility beside km-text-link", () => {
  const linkStart = css.indexOf(".km-text-link {");
  const linkRule = css.slice(linkStart, css.indexOf("}", linkStart) + 1);
  assert.equal(linkRule.includes("inline-flex"), false);
  assert.equal(linkRule.includes("min-height"), false);
  assert.match(
    css,
    /\.km-text-link-target\s*\{[^}]*display:\s*inline-flex;[^}]*min-height:\s*24px;[^}]*align-items:\s*center;[^}]*\}/s,
  );
});

test("replaces the repeated min-height class string with the utility", () => {
  for (const [name, source] of Object.entries(sources)) {
    assert.equal(source.includes(repeatedTarget), false, name);
  }
  assert.equal(sources.benchmarks.match(/km-text-link-target/g)?.length, 1);
  assert.equal(sources.network.match(/km-text-link-target/g)?.length, 1);
  assert.equal(sources.quickStart.match(/km-text-link-target/g)?.length, 1);
  assert.equal(sources.page.match(/km-text-link-target/g)?.length, 5);
  assert.match(
    sources.quickStart,
    /className="km-text-link km-text-link-target mt-4"/,
  );
  assert.match(
    sources.benchmarks,
    /href="\/docs\/network\/results" className="km-text-link"/,
  );
  assert.equal(sources.benchmarks.includes("km-text-link mt-auto pt-6"), true);
});

test("gives the about and contact links the same 24px target", () => {
  assert.match(
    sources.about,
    /href=\{links\.github\}[^>]*className="km-text-link km-text-link-target"[^>]*>\s*Source code →/,
  );
  assert.match(
    sources.about,
    /href="\/projects"[^>]*className="km-text-link km-text-link-target"[^>]*>\s*Related projects →/,
  );
  assert.match(
    sources.about,
    /href=\{links\.linkedin\}[\s\S]*?className="km-text-link km-text-link-target"[\s\S]*?LinkedIn/,
  );
  assert.equal(sources.about.match(/km-text-link-target/g)?.length, 3);
});

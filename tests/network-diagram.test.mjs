import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const diagram = await readFile(
  new URL("../src/app/(home)/_components/network-diagram.tsx", import.meta.url),
  "utf8",
);
const css = await readFile(
  new URL(
    "../src/app/(home)/_components/network-diagram.module.css",
    import.meta.url,
  ),
  "utf8",
);
const globalCss = await readFile(
  new URL("../src/app/global.css", import.meta.url),
  "utf8",
);

test("keeps the diagram copy, labels, and control order", () => {
  for (const text of [
    "Agent A learns",
    "Agent A, on its machine, learns a project lesson.",
    "Saved to the brain",
    "Kimetsu writes it to the local SQLite brain on that machine. Nothing is listening yet.",
    "A signed pack is shared",
    "A signed, scrubbed repo pack crosses the network. Session resume, telemetry, and the database file stay put. Share is a terminal command: kimetsu network share.",
    "Agent B asks",
    "Agent B, on another machine or tool, requests the shared memory with kimetsu_network_request or kimetsu network request.",
    "B answers, with a citation",
    "Agent B answers using the imported lesson and cites the memory that helped (kimetsu_brain_cite).",
    "How Kimetsu Network moves a lesson from Agent A to Agent B",
    "Animation playback",
    "Animation steps",
    "Reduced motion is on, so steps fade in place instead of moving. Use Play",
    "or the step buttons to move through the story.",
  ]) {
    assert.ok(diagram.includes(text), text);
  }
  assert.match(diagram, /aria-pressed=\{playing\}/);
  assert.match(diagram, /useState\(STEPS\.length - 1\)/);
  const play = diagram.indexOf("styles.play");
  const previous = diagram.indexOf("Previous");
  const next = diagram.indexOf("Next");
  assert.ok(play !== -1 && play < previous && previous < next);
});

test("styles Play/Pause as a secondary control that stays enabled", () => {
  assert.equal(diagram.includes("km-button-primary"), false);
  assert.match(diagram, /\$\{styles\.play\} km-button-secondary/);
  assert.equal(diagram.includes("aria-disabled"), false);
  assert.match(
    css,
    /\.play \{[^}]*min-width: 2\.75rem;[^}]*min-height: 2\.75rem;/s,
  );
});

test("mounts reduced-motion step layers only after the preference is known", () => {
  assert.match(diagram, /const \[reduced, setReduced\] = useState\(false\)/);
  assert.match(diagram, /data-reduced=\{reduced \? "true" : "false"\}/);
  assert.match(diagram, /\{reduced\s*\?\s*STEPS\.map\(\(item, index\) =>/s);
  assert.match(
    css,
    /\.root\[data-reduced="true"\] \.live \{\s*display: none;\s*\}/,
  );
});

test("uses type scale tokens for the 13px and 15px labels and keeps step buttons at 14px", () => {
  assert.equal(css.includes("0.8125rem"), false);
  assert.equal(css.includes("0.9375rem"), false);
  assert.equal(/\b13px\b/.test(css), false);
  assert.equal(/\b15px\b/.test(css), false);
  assert.match(css, /\.kicker \{[^}]*font-size: var\(--km-text-sm\);/s);
  assert.match(css, /\.meta \{[^}]*font-size: var\(--km-text-xs\);/s);
  assert.match(css, /\.chip \{[^}]*font-size: var\(--km-text-xs\);/s);
  assert.match(css, /\.step \{[^}]*font-size: 0\.875rem;/s);
  assert.match(css, /\.note \{[^}]*font-size: 0\.75rem;/s);
});

test("crossfades reduced-motion step changes with opacity only", () => {
  assert.match(diagram, /styles\.stepLayer/);
  assert.equal(diagram.includes("if (reduced) return"), false);
  assert.equal(diagram.includes("if (!playing || reduced) return"), false);
  assert.match(diagram, /if \(!playing\) return/);
  const mediaAt = css.indexOf("@media (prefers-reduced-motion: reduce)");
  const importantAt = css.indexOf("!important");
  assert.ok(mediaAt !== -1 && importantAt > mediaAt);
  assert.equal((css.match(/!important/g) || []).length, 1);
  assert.match(
    css,
    /\.root \.stepLayer \{\s*transition: opacity 200ms linear !important;\s*\}/,
  );
  assert.match(globalCss, /transition: none !important;/);
  assert.equal(globalCss.includes(".stepLayer"), false);
});

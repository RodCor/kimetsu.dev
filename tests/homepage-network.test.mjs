import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const section = await readFile(
  new URL("../src/app/(home)/_components/network-section.tsx", import.meta.url),
  "utf8",
);
const page = await readFile(
  new URL("../src/app/(home)/page.tsx", import.meta.url),
  "utf8",
);
const changelog = await readFile(
  new URL("../content/docs/changelog.mdx", import.meta.url),
  "utf8",
);
const results = await readFile(
  new URL("../content/docs/network/results.mdx", import.meta.url),
  "utf8",
);
const networkIndex = await readFile(
  new URL("../content/docs/network/index.mdx", import.meta.url),
  "utf8",
);

test("places the network section under the hero and before benchmarks", () => {
  const hero = page.indexOf('id="home-title"');
  const network = page.indexOf("<NetworkSection />");
  const benchmarks = page.indexOf("<BenchmarkResults />");
  assert.ok(hero >= 0 && network > hero && benchmarks > network);
  assert.match(section, /One shared memory network your agents plug into/);
  assert.match(section, /href="\/docs\/network"/);
});

test("uses only the three approved homepage figures", () => {
  assert.match(section, /1\.77x/);
  assert.match(section, /\+77%/);
  assert.match(section, /40\.3 vs 22\.8/);
  assert.match(section, /22% to 65%/);
  assert.match(section, /about 99%/);
  assert.match(section, /40\.1 vs 40\.3/);
  assert.match(
    section,
    /Token F1 on LoCoMo \(answerable questions\) and LongMemEval \(proxy F1,\s+not the official judge\)\. QUIC measured on one machine over loopback\./,
  );
  assert.match(section, /href="\/docs\/network\/results"/);
  for (const banned of [
    "+17.5",
    "+13.6",
    "+17.3",
    "+7.1",
    "1.51x",
    "1.22x",
    "−1.6",
    "+18.3",
    "22.7",
    "31.8",
    "38.9",
  ]) {
    assert.equal(section.includes(banned), false, banned);
  }
});

test("documents the network result tables and links them from the index", () => {
  assert.match(networkIndex, /\/docs\/network\/results/);
  for (const row of [
    "Qwen 7B, LoCoMo | 22.8 | 40.3 | +77% (1.77x)",
    "Qwen 0.5B, LongMemEval oracle | 5.7 | 21.4 | +273% (3.7x)",
    "Qwen 0.5B, LongMemEval s-cleaned | 5.4 | 20.3 | +279% (3.8x)",
    "Qwen 0.5B, LoCoMo (answerable questions) | 2.1 | 22.1 | about 10x",
    "Qwen 7B, LoCoMo | 31.8 | 38.9 | +22%",
    "Qwen 7B, LongMemEval oracle | 11.1 | 27.9 | +151%",
    "Qwen 0.5B, LoCoMo (answerable questions) | 16.2 | 21.9 | +35%",
    "Qwen 0.5B, LongMemEval oracle | 14.1 | 23.4 | +65%",
    "Qwen 0.5B, LongMemEval s-cleaned | 14.8 | 21.3 | +44%",
    "40.1 vs 40.3",
    "22.7 vs 23.0",
  ]) {
    assert.ok(results.includes(row), row);
  }
  assert.match(results, /not the official LLM judge/);
  assert.match(results, /single-machine loopback/);
  assert.match(results, /category 5/);
  assert.match(results, /issues\/68/);
  assert.match(results, /kimetsu-bench/);
  assert.match(results, /RTX 5060 Ti 16 GB/);
});

test("does not repeat install commands and links them to get started", () => {
  for (const command of [
    "kimetsu plugin install grok-bot",
    "kimetsu plugin install codex",
    "kimetsu plugin install claude-code",
    "kimetsu plugin install cursor",
    "pi install npm:kimetsu-pi",
  ]) {
    assert.equal(section.includes(command), false, command);
  }
  assert.match(
    section,
    /<a href="#get-started" className="km-text-link">\s*Install commands in Get started\s*<\/a>/,
  );
  assert.equal(section.includes("km-button-primary"), false);
  for (const command of [
    "kimetsu network invite --name laptop",
    "kimetsu network join <code>",
    "kimetsu network share",
    "kimetsu network request",
  ]) {
    assert.ok(section.includes(command), command);
  }
  assert.match(section, /prefers-reduced-motion/);
  assert.match(section, /12\.2s|12200/);
});

test("changelog leads with the v2.11.0 peer network release", () => {
  const latest = changelog.indexOf("## v2.11.0: Peer network");
  const previous = changelog.indexOf("## v2.10.0:");
  assert.ok(latest > 0 && latest < previous);
  assert.match(changelog, /RUSTSEC-2026-0459/);
  assert.match(changelog, /kimetsu_network_request/);
});

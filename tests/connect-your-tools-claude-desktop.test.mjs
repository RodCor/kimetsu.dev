import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const page = await readFile(
  new URL("../content/docs/network/connect-your-tools.mdx", import.meta.url),
  "utf8",
);

test("connect your tools states that Claude Desktop has no installer", () => {
  const hosts = page.indexOf(
    "kimetsu plugin install <host>   # claude-code | codex | cursor | grok-bot | pi | openclaw",
  );
  const sentence = page.indexOf("Claude Desktop has no installer.");
  const claudeCode = page.indexOf("## Claude Code");
  assert.ok(hosts >= 0);
  assert.ok(sentence > hosts);
  assert.ok(claudeCode > sentence);
  assert.equal(page.split("Claude Desktop has no installer.").length - 1, 1);
});

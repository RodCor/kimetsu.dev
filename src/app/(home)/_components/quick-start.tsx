"use client";

import { Check, Copy } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const hosts = [
  { id: "claude-code", label: "Claude Code" },
  { id: "codex", label: "Codex" },
  { id: "cursor", label: "Cursor" },
  { id: "pi", label: "Pi" },
  { id: "openclaw", label: "OpenClaw" },
];

export function QuickStart() {
  const [host, setHost] = useState(hosts[0].id);
  const [feedback, setFeedback] = useState({ command: "", ok: false });
  const command = `npm install -g kimetsu-ai\nkimetsu setup --host ${host}`;
  const currentFeedback = feedback.command === command;

  async function copyCommands() {
    try {
      await navigator.clipboard.writeText(command);
      setFeedback({ command, ok: true });
    } catch {
      setFeedback({ command, ok: false });
    }
  }

  return (
    <section
      id="get-started"
      aria-labelledby="setup-title"
      className="km-section scroll-mt-24"
    >
      <div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
        <div>
          <h2 id="setup-title" className="km-heading">
            Install Kimetsu
          </h2>
          <p className="mt-4 max-w-md text-fd-muted-foreground">
            Select your agent and run these commands from your project
            directory. Available for Linux, macOS, and Windows.
          </p>
          <Link href="/docs/install" className="km-text-link mt-4 inline-block">
            All installation options →
          </Link>
        </div>
        <div className="min-w-0 rounded-2xl border border-fd-border bg-fd-card">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-fd-border p-4">
            <div className="flex items-center gap-3">
              <label htmlFor="setup-host" className="text-sm font-medium">
                Your agent
              </label>
              <select
                id="setup-host"
                name="host"
                value={host}
                onChange={(event) => {
                  setHost(event.target.value);
                  setFeedback({ command: "", ok: false });
                }}
                className="min-h-11 rounded-lg border border-fd-border bg-fd-background px-3 text-sm text-fd-foreground"
              >
                {hosts.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.label}
                  </option>
                ))}
              </select>
            </div>
            <button
              type="button"
              onClick={copyCommands}
              className="km-copy-button"
            >
              {currentFeedback && feedback.ok ? (
                <Check aria-hidden className="size-4" />
              ) : (
                <Copy aria-hidden className="size-4" />
              )}
              {currentFeedback && feedback.ok ? "Copied" : "Copy commands"}
            </button>
          </div>
          <pre className="whitespace-pre-wrap break-words p-5 text-sm leading-8 sm:text-base">
            <code translate="no">{command}</code>
          </pre>
          <div className="border-t border-fd-border px-5 py-3 text-xs leading-5 text-fd-muted-foreground">
            <p>
              Requires npm. Installs the lean build; local semantic models are
              optional.
            </p>
            <p aria-live="polite" role="status">
              {currentFeedback
                ? feedback.ok
                  ? "Commands copied to clipboard."
                  : "Copy is unavailable. Select and copy the commands above."
                : ""}
            </p>
          </div>
          <noscript>
            <p className="px-5 pb-4 text-sm">
              For other agents, use the{" "}
              <a className="underline" href="/docs/install/">
                installation guide
              </a>
              .
            </p>
          </noscript>
        </div>
      </div>
    </section>
  );
}

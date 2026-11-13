import Link from "next/link";
import { NetworkDiagram } from "./network-diagram";

// Owner-approved homepage figures only. Full tables live on /docs/network/results.
const GAINS = [
  {
    value: "1.77x",
    label: "One Kimetsu brain",
    detail:
      "Better answers than no memory (+77%; Qwen 7B on LoCoMo, 40.3 vs 22.8).",
  },
  {
    value: "22% to 65%",
    label: "As a network",
    detail:
      "Each agent answers better with merged memory than with only its own (Qwen 7B and 0.5B, LoCoMo and LongMemEval).",
  },
  {
    value: "about 99%",
    label: "Over QUIC between machines",
    detail: "Of the gain kept (7B LoCoMo 40.1 vs 40.3).",
  },
] as const;

const FLOW = [
  {
    title: "Invite",
    command: "kimetsu network invite --name laptop",
    detail:
      "On machine A, in the repo. Copy the code (it starts with knet1.). The default name is friends. Kimetsu is not listening yet.",
  },
  {
    title: "Join",
    command: "kimetsu network join <code>",
    detail: "On machine B. Membership is saved. Still nothing is listening.",
  },
  {
    title: "Share, then request",
    command: "kimetsu network share",
    detail:
      "Leave share running on A. On B: kimetsu network request. If discovery misses A, pass the peer: line share printed.",
  },
] as const;

export function NetworkSection() {
  return (
    <section
      id="network"
      aria-labelledby="network-title"
      className="km-section km-network scroll-mt-24"
    >
      <p className="km-eyebrow">Kimetsu Network</p>
      <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
        <div>
          <h2 id="network-title" className="km-heading">
            One shared memory network your agents plug into.
          </h2>
          <p className="km-text-md mt-4 max-w-2xl leading-7 text-fd-muted-foreground">
            The same project lessons follow you from machine to machine, in Grok
            Bot, Codex, Claude Code, Cursor, and the Pi package. Each machine
            keeps its own local SQLite brain and exchanges a signed, scrubbed
            repo pack only when you ask. Nothing is listening until you run
            share or request, and there is no server to stand up.
          </p>
        </div>
        <div className="flex flex-wrap gap-3 lg:justify-end">
          <Link href="/docs/network" className="km-text-link">
            Read the Network guide
          </Link>
        </div>
      </div>

      <NetworkDiagram
        loopMs={12200}
        motionQuery="(prefers-reduced-motion: reduce)"
      />

      <ol className="mt-8 grid gap-6 md:grid-cols-3">
        {FLOW.map((item, index) => (
          <li key={item.title} className="border-t border-fd-border pt-5">
            <span
              className="km-text-sm mb-3 block font-mono leading-5 text-fd-primary"
              aria-hidden
            >
              0{index + 1}
            </span>
            <h3 className="km-text-lg leading-7 font-semibold">{item.title}</h3>
            <code
              translate="no"
              className="km-text-sm mt-3 block font-mono leading-6 break-words"
            >
              {item.command}
            </code>
            <p className="km-text-sm mt-2 leading-6 text-fd-muted-foreground">
              {item.detail}
            </p>
          </li>
        ))}
      </ol>

      <div className="mt-10">
        <h3 className="km-text-lg leading-7 font-semibold">
          What Kimetsu adds
        </h3>
        <div className="mt-4 grid gap-4 lg:grid-cols-3">
          {GAINS.map((gain) => (
            <article
              key={gain.value + gain.label}
              className="rounded-2xl border border-fd-border p-4"
            >
              <p className="km-text-xl font-mono leading-8 font-semibold tracking-tight text-fd-primary">
                {gain.value}
              </p>
              <p className="km-text-sm mt-2 leading-5 font-medium">
                {gain.label}
              </p>
              <p className="km-text-xs mt-2 leading-5 text-fd-muted-foreground">
                {gain.detail}
              </p>
            </article>
          ))}
        </div>
        <p className="km-text-xs mt-4 max-w-4xl leading-5 text-fd-muted-foreground">
          Token F1 on LoCoMo (answerable questions) and LongMemEval (proxy F1,
          not the official judge). QUIC measured on one machine over loopback.{" "}
          <Link href="/docs/network/results" className="km-text-link">
            Tables and caveats
          </Link>
        </p>
      </div>

      <p className="mt-10">
        <a href="#get-started" className="km-text-link">
          Install commands in Get started
        </a>
      </p>

      <div className="km-text-sm mt-8 max-w-3xl leading-6 text-fd-muted-foreground">
        <p>
          v2.11.0 prebuilt and npm binaries include{" "}
          <code translate="no" className="km-text-xs font-mono leading-4">
            kimetsu network
          </code>
          .{" "}
          <code translate="no" className="km-text-xs font-mono leading-4">
            cargo install kimetsu-cli
          </code>{" "}
          still needs{" "}
          <code translate="no" className="km-text-xs font-mono leading-4">
            --features network
          </code>
          . Relay is off, and router port mapping stays off unless you pass{" "}
          <code translate="no" className="km-text-xs font-mono leading-4">
            --map-ports
          </code>
          . This is not Kimetsu Remote, and Claude Desktop has no installer. The
          Pi package can request a pack; it does not start share.
        </p>
        <p className="mt-3">
          <Link href="/docs/network/security" className="km-text-link">
            What is signed, scrubbed, and when Kimetsu listens →
          </Link>
        </p>
      </div>
    </section>
  );
}

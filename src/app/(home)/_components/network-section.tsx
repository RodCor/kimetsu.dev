"use client";

import { ArrowRight, Check, Copy, Pause, Play } from "lucide-react";
import Link from "next/link";
import { type CSSProperties, useEffect, useState } from "react";

// Durations match the approved storyboard: 2.2 + 2.2 + 2.8 + 2.2 + 2.8 = 12.2s.
const STEP_STARTS = [0, 2200, 4400, 7200, 9400] as const;
const LOOP_MS = 12200;

const STEPS = [
  {
    title: "Agent A learns",
    caption: "Agent A, on its machine, learns a project lesson.",
  },
  {
    title: "Saved to the brain",
    caption:
      "Kimetsu writes it to the local SQLite brain on that machine. Nothing is listening yet.",
  },
  {
    title: "A signed pack is shared",
    caption:
      "A signed, scrubbed repo pack crosses the network. Session resume, telemetry, and the database file stay put. Share is a terminal command: kimetsu network share.",
  },
  {
    title: "Agent B asks",
    caption:
      "Agent B, on another machine or tool, requests the shared memory with kimetsu_network_request or kimetsu network request.",
  },
  {
    title: "B answers, with a citation",
    caption:
      "Agent B answers using the imported lesson and cites the memory that helped (kimetsu_brain_cite).",
  },
] as const;

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

const INTEGRATIONS = [
  {
    name: "Grok Bot",
    command: "kimetsu plugin install grok-bot",
    note: "Writes an operator snippet at .kimetsu/hosts/grok-bot.md. Not a settings file.",
  },
  {
    name: "Codex",
    via: "OpenAI",
    command: "kimetsu plugin install codex",
    note: "Writes [mcp_servers.kimetsu] in .codex/config.toml.",
  },
  {
    name: "Claude Code",
    via: "Anthropic",
    command: "kimetsu plugin install claude-code",
    note: "Writes mcpServers.kimetsu in .mcp.json. Claude Code still asks you to approve it.",
  },
  {
    name: "Cursor",
    command: "kimetsu plugin install cursor",
    note: "Writes .cursor/mcp.json and a guidance rule. setup --host does not list Cursor.",
  },
  {
    name: "Pi",
    command: "pi install npm:kimetsu-pi",
    note: "kimetsu-pi 0.2.0. Share stays kimetsu network share in a terminal.",
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

type Box = { x: number; y: number; w: number; h: number };

type Layout = {
  id: string;
  className: string;
  viewBox: string;
  font: number;
  pack: {
    ax: number;
    ay: number;
    nx: number;
    ny: number;
    bx: number;
    by: number;
  };
  agentA: [number, number];
  agentNet: [number, number];
  agentB: [number, number];
  machineA: Box;
  machineB: Box;
  brainA: Box;
  brainB: Box;
  network: { cx: number; cy: number; r: number };
  lesson: Box;
  seal: [number, number];
  requestD: string;
  requestLabel: [number, number];
  answer: Box;
  cite: [number, number];
};

const WIDE: Layout = {
  id: "network-how-title-wide",
  className: "nh-svg nh-svg-wide",
  viewBox: "0 0 640 252",
  font: 14,
  pack: { ax: 100, ay: 148, nx: 320, ny: 132, bx: 540, by: 148 },
  agentA: [100, 16],
  agentNet: [320, 16],
  agentB: [540, 16],
  machineA: { x: 12, y: 52, w: 176, h: 124 },
  machineB: { x: 452, y: 52, w: 176, h: 124 },
  brainA: { x: 36, y: 96, w: 128, h: 72 },
  brainB: { x: 476, y: 96, w: 128, h: 72 },
  network: { cx: 320, cy: 132, r: 42 },
  lesson: { x: 48, y: 26, w: 104, h: 22 },
  seal: [210, 198],
  requestD: "M540 58 C 490 28, 410 30, 360 84",
  requestLabel: [430, 214],
  answer: { x: 468, y: 188, w: 144, h: 24 },
  cite: [540, 234],
};

const STACK: Layout = {
  id: "network-how-title-stack",
  className: "nh-svg nh-svg-stack",
  viewBox: "0 0 320 520",
  font: 16,
  pack: { ax: 160, ay: 156, nx: 160, ny: 252, bx: 160, by: 400 },
  agentA: [160, 20],
  agentNet: [160, 210],
  agentB: [160, 300],
  machineA: { x: 24, y: 68, w: 272, h: 120 },
  machineB: { x: 24, y: 316, w: 272, h: 120 },
  brainA: { x: 72, y: 100, w: 176, h: 72 },
  brainB: { x: 72, y: 348, w: 176, h: 72 },
  network: { cx: 160, cy: 252, r: 34 },
  lesson: { x: 108, y: 32, w: 104, h: 24 },
  seal: [160, 192],
  requestD: "M236 360 C 286 330, 286 270, 198 250",
  requestLabel: [250, 304],
  answer: { x: 70, y: 452, w: 180, h: 26 },
  cite: [160, 502],
};

function stepAt(elapsed: number) {
  const t = ((elapsed % LOOP_MS) + LOOP_MS) % LOOP_MS;
  if (t < STEP_STARTS[1]) return 0;
  if (t < STEP_STARTS[2]) return 1;
  if (t < STEP_STARTS[3]) return 2;
  if (t < STEP_STARTS[4]) return 3;
  return 4;
}

function center(box: Box) {
  return { x: box.x + box.w / 2, y: box.y + box.h / 2 + 4 };
}

function NetworkDiagram({ layout }: { layout: Layout }) {
  const brainA = center(layout.brainA);
  const brainB = center(layout.brainB);
  const machineA = center(layout.machineA);
  const machineB = center(layout.machineB);
  const lesson = center(layout.lesson);
  const answer = center(layout.answer);
  const packStyle = {
    "--pack-a-x": `${layout.pack.ax}px`,
    "--pack-a-y": `${layout.pack.ay}px`,
    "--pack-n-x": `${layout.pack.nx}px`,
    "--pack-n-y": `${layout.pack.ny}px`,
    "--pack-b-x": `${layout.pack.bx}px`,
    "--pack-b-y": `${layout.pack.by}px`,
  } as CSSProperties;

  return (
    <svg
      className={layout.className}
      viewBox={layout.viewBox}
      role="img"
      aria-labelledby={`${layout.id} network-how-caption`}
    >
      <title id={layout.id}>
        How Kimetsu Network moves a lesson from Agent A to Agent B
      </title>
      <text
        x={layout.agentA[0]}
        y={layout.agentA[1]}
        textAnchor="middle"
        className="nh-ink"
        fontSize={layout.font}
      >
        Agent A
      </text>
      <text
        x={layout.agentNet[0]}
        y={layout.agentNet[1]}
        textAnchor="middle"
        className="nh-ink"
        fontSize={layout.font}
      >
        Network
      </text>
      <text
        x={layout.agentB[0]}
        y={layout.agentB[1]}
        textAnchor="middle"
        className="nh-ink"
        fontSize={layout.font}
      >
        Agent B
      </text>

      <rect className="nh-panel" rx={12} {...layout.machineA} />
      <text
        x={machineA.x}
        y={layout.machineA.y + 22}
        textAnchor="middle"
        className="nh-mute"
        fontSize={layout.font - 2}
      >
        Machine A
      </text>
      <rect className="nh-brain nh-brain-a nh-anim" rx={8} {...layout.brainA} />
      <text
        x={brainA.x}
        y={layout.brainA.y + 18}
        textAnchor="middle"
        className="nh-ink"
        fontSize={layout.font - 1}
      >
        Brain A
      </text>

      <circle
        className="nh-network"
        cx={layout.network.cx}
        cy={layout.network.cy}
        r={layout.network.r}
      />
      <text
        x={layout.network.cx}
        y={layout.network.cy + 4}
        textAnchor="middle"
        className="nh-ink"
        fontSize={layout.font - 1}
      >
        Shared
      </text>

      <rect className="nh-panel" rx={12} {...layout.machineB} />
      <text
        x={machineB.x}
        y={layout.machineB.y + 22}
        textAnchor="middle"
        className="nh-mute"
        fontSize={layout.font - 2}
      >
        Machine B
      </text>
      <rect className="nh-brain" rx={8} {...layout.brainB} />
      <text
        x={brainB.x}
        y={layout.brainB.y + 18}
        textAnchor="middle"
        className="nh-ink"
        fontSize={layout.font - 1}
      >
        Brain B
      </text>

      <g className="nh-lesson nh-anim">
        <rect className="nh-lesson-shape" rx={6} {...layout.lesson} />
        <text
          x={lesson.x}
          y={lesson.y}
          textAnchor="middle"
          className="nh-accent"
          fontSize={layout.font - 2}
        >
          lesson
        </text>
      </g>

      <g className="nh-pack nh-anim" style={packStyle}>
        <rect
          className="nh-pack-shape"
          x={-36}
          y={-14}
          width={72}
          height={28}
          rx={8}
        />
        <text
          x={0}
          y={4}
          textAnchor="middle"
          className="nh-pack-label"
          fontSize={layout.font - 2}
        >
          pack
        </text>
      </g>

      <text
        x={layout.seal[0]}
        y={layout.seal[1]}
        textAnchor="middle"
        className="nh-seal nh-anim nh-accent"
        fontSize={layout.font - 2}
      >
        signed, scrubbed
      </text>

      <path
        d={layout.requestD}
        className="nh-request nh-anim nh-request-path"
      />
      <text
        x={layout.requestLabel[0]}
        y={layout.requestLabel[1]}
        textAnchor="middle"
        className="nh-request nh-anim nh-mute"
        fontSize={layout.font - 2}
      >
        request
      </text>

      <g className="nh-answer nh-anim">
        <rect className="nh-answer-shape" rx={6} {...layout.answer} />
        <text
          x={answer.x}
          y={answer.y}
          textAnchor="middle"
          className="nh-accent"
          fontSize={layout.font - 2}
        >
          answer
        </text>
      </g>
      <text
        x={layout.cite[0]}
        y={layout.cite[1]}
        textAnchor="middle"
        className="nh-cite nh-anim nh-ink"
        fontSize={layout.font - 2}
      >
        cited memory
      </text>
    </svg>
  );
}

export function NetworkSection() {
  const [reduced, setReduced] = useState(true);
  const [playing, setPlaying] = useState(false);
  const [step, setStep] = useState(STEPS.length - 1);
  const [playDelay, setPlayDelay] = useState(0);
  const [copied, setCopied] = useState<string | null>(null);
  const [copyError, setCopyError] = useState(false);
  const current = STEPS[step];

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => {
      const reduce = mq.matches;
      setReduced(reduce);
      if (reduce) {
        setPlaying(false);
        setStep(STEPS.length - 1);
        setPlayDelay(0);
        return;
      }
      setPlayDelay(0);
      setStep(0);
      setPlaying(true);
    };
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  useEffect(() => {
    if (!playing) return;
    const origin = performance.now() - playDelay;
    let frame = 0;
    const tick = (now: number) => {
      const next = stepAt(now - origin);
      setStep((currentStep) => (currentStep === next ? currentStep : next));
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [playing, playDelay]);

  function showStep(index: number) {
    setPlaying(false);
    setStep(index);
    setPlayDelay(STEP_STARTS[index]);
  }

  function togglePlay() {
    if (reduced) return;
    if (playing) {
      setPlaying(false);
      return;
    }
    setPlayDelay(STEP_STARTS[step]);
    setPlaying(true);
  }

  async function copyCommand(command: string) {
    try {
      await navigator.clipboard.writeText(command);
      setCopied(command);
      setCopyError(false);
    } catch {
      setCopied(command);
      setCopyError(true);
    }
  }

  const frameStyle = {
    "--nh-delay": `-${playDelay}ms`,
  } as CSSProperties;

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
          <p className="mt-4 max-w-2xl text-base leading-7 text-fd-muted-foreground">
            The same project lessons follow you from machine to machine, in Grok
            Bot, Codex, Claude Code, Cursor, and the Pi package. Each machine
            keeps its own local SQLite brain and exchanges a signed, scrubbed
            repo pack only when you ask. Nothing is listening until you run
            share or request, and there is no server to stand up.
          </p>
        </div>
        <div className="flex flex-wrap gap-3 lg:justify-end">
          <Link href="/docs/network" className="km-button-primary">
            Read the Network guide <ArrowRight className="size-4" aria-hidden />
          </Link>
          <a href="#get-started" className="km-button-secondary">
            Install Kimetsu
          </a>
        </div>
      </div>

      <div
        className={`nh mt-8 rounded-2xl border border-fd-border bg-fd-card p-4 sm:p-5 ${playing ? "is-playing" : "is-step"}`}
        data-step={step}
        style={frameStyle}
      >
        <NetworkDiagram layout={WIDE} />
        <NetworkDiagram layout={STACK} />
        <p id="network-how-caption" className="mt-4 text-sm leading-6">
          <span className="font-mono text-fd-primary">
            {step + 1}. {current.title}.
          </span>{" "}
          <span className="text-fd-muted-foreground">{current.caption}</span>
        </p>
        <ol className="sr-only">
          {STEPS.map((item, index) => (
            <li key={item.title}>
              {index + 1}. {item.title}. {item.caption}
            </li>
          ))}
        </ol>
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <fieldset
            aria-label="Animation playback"
            className="flex gap-2 border-0 p-0"
          >
            <button
              type="button"
              className="km-button-primary"
              onClick={togglePlay}
              disabled={reduced}
              aria-pressed={playing}
            >
              {playing ? (
                <Pause className="size-4" aria-hidden />
              ) : (
                <Play className="size-4" aria-hidden />
              )}
              {playing ? "Pause" : "Play"}
            </button>
            <button
              type="button"
              className="km-button-secondary"
              onClick={() => showStep((step + STEPS.length - 1) % STEPS.length)}
            >
              Previous
            </button>
            <button
              type="button"
              className="km-button-secondary"
              onClick={() => showStep((step + 1) % STEPS.length)}
            >
              Next
            </button>
          </fieldset>
          <fieldset
            aria-label="Animation steps"
            className="flex gap-2 border-0 p-0"
          >
            {STEPS.map((item, index) => (
              <button
                key={item.title}
                type="button"
                aria-current={step === index ? "step" : undefined}
                aria-label={`Step ${index + 1}: ${item.title}`}
                onClick={() => showStep(index)}
                className={`nh-step ${step === index ? "is-current" : ""}`}
              >
                {index + 1}
              </button>
            ))}
          </fieldset>
        </div>
        {reduced ? (
          <p className="mt-3 text-xs leading-5 text-fd-muted-foreground">
            Reduced motion is on, so this stays on the final frame. Use the step
            buttons to move through the story without animation.
          </p>
        ) : null}
        <noscript>
          <ol className="mt-4 list-decimal space-y-2 pl-5 text-sm leading-6 text-fd-muted-foreground">
            {STEPS.map((item) => (
              <li key={item.title}>
                <span className="font-medium text-fd-foreground">
                  {item.title}.{" "}
                </span>
                {item.caption}
              </li>
            ))}
          </ol>
        </noscript>
      </div>

      <ol className="mt-8 grid gap-6 md:grid-cols-3">
        {FLOW.map((item, index) => (
          <li key={item.title} className="border-t border-fd-border pt-5">
            <span
              className="mb-3 block font-mono text-sm text-fd-primary"
              aria-hidden
            >
              0{index + 1}
            </span>
            <h3 className="text-lg font-semibold">{item.title}</h3>
            <code
              translate="no"
              className="mt-3 block font-mono text-sm leading-6 break-words"
            >
              {item.command}
            </code>
            <p className="mt-2 text-sm leading-6 text-fd-muted-foreground">
              {item.detail}
            </p>
          </li>
        ))}
      </ol>

      <div className="mt-10">
        <h3 className="text-lg font-semibold">What Kimetsu adds</h3>
        <div className="mt-4 grid gap-4 lg:grid-cols-3">
          {GAINS.map((gain) => (
            <article
              key={gain.value + gain.label}
              className="rounded-2xl border border-fd-border p-4"
            >
              <p className="font-mono text-2xl font-semibold tracking-tight text-fd-primary">
                {gain.value}
              </p>
              <p className="mt-2 text-sm font-medium">{gain.label}</p>
              <p className="mt-2 text-xs leading-5 text-fd-muted-foreground">
                {gain.detail}
              </p>
            </article>
          ))}
        </div>
        <p className="mt-4 max-w-4xl text-xs leading-5 text-fd-muted-foreground">
          Token F1 on LoCoMo (answerable questions) and LongMemEval (proxy F1,
          not the official judge). QUIC measured on one machine over loopback.{" "}
          <Link href="/docs/network/results" className="km-text-link">
            Tables and caveats
          </Link>
        </p>
      </div>

      <div className="mt-10">
        <h3 className="text-lg font-semibold">
          Plug in the agent you already use
        </h3>
        <ul className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          {INTEGRATIONS.map((item) => {
            const copiedThis = copied === item.command;
            return (
              <li
                key={item.name}
                className="flex min-w-0 flex-col rounded-2xl border border-fd-border p-4"
              >
                <h4 className="text-sm font-semibold">
                  {item.name}
                  {"via" in item && item.via ? (
                    <span className="font-normal text-fd-muted-foreground">
                      {" "}
                      · {item.via}
                    </span>
                  ) : null}
                </h4>
                <p className="mt-2 text-xs leading-5 text-fd-muted-foreground">
                  {item.note}
                </p>
                <code
                  translate="no"
                  className="mt-3 block font-mono text-xs leading-5 break-words"
                >
                  {item.command}
                </code>
                <button
                  type="button"
                  className="km-copy-button mt-3 self-start"
                  onClick={() => copyCommand(item.command)}
                  aria-label={`Copy the ${item.name} install command`}
                >
                  {copiedThis && !copyError ? (
                    <Check className="size-4" aria-hidden />
                  ) : (
                    <Copy className="size-4" aria-hidden />
                  )}
                  {copiedThis && !copyError ? "Copied" : "Copy"}
                </button>
              </li>
            );
          })}
        </ul>
        <p className="sr-only" aria-live="polite">
          {copied
            ? copyError
              ? `Copy is unavailable for ${copied}. Select the command and copy it.`
              : `Copied ${copied}.`
            : ""}
        </p>
      </div>

      <div className="mt-8 max-w-3xl text-sm leading-6 text-fd-muted-foreground">
        <p>
          v2.11.0 prebuilt and npm binaries include{" "}
          <code translate="no" className="font-mono text-xs">
            kimetsu network
          </code>
          .{" "}
          <code translate="no" className="font-mono text-xs">
            cargo install kimetsu-cli
          </code>{" "}
          still needs{" "}
          <code translate="no" className="font-mono text-xs">
            --features network
          </code>
          . Relay is off, and router port mapping stays off unless you pass{" "}
          <code translate="no" className="font-mono text-xs">
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

"use client";

import { Pause, Play } from "lucide-react";
import { useEffect, useState } from "react";
import styles from "./network-diagram.module.css";

// Approved storyboard: 2.2 + 2.2 + 2.8 + 2.2 + 2.8 = 12.2s.
const STEP_MS = [2200, 2200, 2800, 2200, 2800] as const;

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

export function NetworkDiagram({
  loopMs,
  motionQuery,
}: {
  loopMs: number;
  motionQuery: string;
}) {
  const [reduced, setReduced] = useState(true);
  const [playing, setPlaying] = useState(false);
  const [step, setStep] = useState(STEPS.length - 1);
  const [instant, setInstant] = useState(true);
  const current = STEPS[step];

  useEffect(() => {
    const mq = window.matchMedia(motionQuery);
    const apply = () => {
      const reduce = mq.matches;
      setReduced(reduce);
      if (reduce) {
        setPlaying(false);
        setInstant(true);
        setStep(STEPS.length - 1);
        return;
      }
      setInstant(true);
      setStep(0);
      setPlaying(true);
    };
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, [motionQuery]);

  useEffect(() => {
    if (!instant) return;
    let frame = 0;
    let inner = 0;
    frame = requestAnimationFrame(() => {
      inner = requestAnimationFrame(() => setInstant(false));
    });
    return () => {
      cancelAnimationFrame(frame);
      cancelAnimationFrame(inner);
    };
  }, [instant]);

  useEffect(() => {
    if (!playing || reduced) return;
    const total = STEP_MS.reduce((sum, ms) => sum + ms, 0);
    const dwell = (STEP_MS[step] * loopMs) / total;
    const id = window.setTimeout(() => {
      if (step === STEPS.length - 1) setInstant(true);
      setStep((step + 1) % STEPS.length);
    }, dwell);
    return () => window.clearTimeout(id);
  }, [playing, reduced, step, loopMs]);

  function showStep(index: number) {
    if (Math.abs(index - step) > 1) setInstant(true);
    setPlaying(false);
    setStep(index);
  }

  function togglePlay() {
    if (reduced) return;
    setPlaying((value) => !value);
  }

  return (
    <div
      className={`${styles.root} mt-8 rounded-2xl border border-fd-border bg-fd-card p-4 sm:p-5`}
      data-step={step}
      data-instant={instant ? "true" : "false"}
    >
      <p className="sr-only">
        How Kimetsu Network moves a lesson from Agent A to Agent B
      </p>
      <div className={styles.stage} aria-hidden="true">
        <div className={styles.track}>
          <span className={styles.spine} />
          <span className={styles.stations}>
            <span />
            <span />
            <span />
          </span>
          <span className={styles.mover} data-signal="">
            <span className={styles.dot} />
          </span>
          <div className={styles.node}>
            <p className={styles.kicker}>Agent A</p>
            <p className={styles.meta}>Machine A</p>
            <p className={styles.meta}>
              Brain A
              <span className={styles.brainBar} />
            </p>
            <div className={styles.status}>
              <p className={`${styles.chip} ${styles.lesson}`}>lesson</p>
            </div>
          </div>
          <div className={styles.node}>
            <p className={styles.kicker}>Network</p>
            <p className={styles.meta}>Shared</p>
            <div className={styles.status}>
              <p className={`${styles.chip} ${styles.packNet}`}>pack</p>
              <p className={`${styles.chip} ${styles.seal}`}>
                signed, scrubbed
              </p>
            </div>
          </div>
          <div className={styles.node}>
            <p className={styles.kicker}>Agent B</p>
            <p className={styles.meta}>Machine B</p>
            <p className={styles.meta}>Brain B</p>
            <div className={styles.status}>
              <p className={`${styles.chip} ${styles.packB}`}>pack</p>
              <p className={`${styles.chip} ${styles.request}`}>request</p>
              <p className={`${styles.chip} ${styles.answer}`}>answer</p>
              <p className={`${styles.chip} ${styles.cite}`}>cited memory</p>
            </div>
          </div>
        </div>
      </div>
      <p
        id="network-how-caption"
        className={`${styles.caption} mt-4 text-sm leading-6`}
      >
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
      <div className={styles.controls}>
        <fieldset aria-label="Animation playback" className={styles.playback}>
          <button
            type="button"
            className={`${styles.play} km-button-primary`}
            onClick={togglePlay}
            aria-disabled={reduced}
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
        <fieldset aria-label="Animation steps" className={styles.steps}>
          {STEPS.map((item, index) => (
            <button
              key={item.title}
              type="button"
              aria-current={step === index ? "step" : undefined}
              aria-label={`Step ${index + 1}: ${item.title}`}
              onClick={() => showStep(index)}
              className={styles.step}
            >
              {index + 1}
            </button>
          ))}
        </fieldset>
      </div>
      {reduced ? (
        <p className={styles.note}>
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
  );
}

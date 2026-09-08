import { ArrowLeftRight, GitMerge, PackageOpen } from "lucide-react";
import Link from "next/link";

const sharingModes = [
  {
    icon: PackageOpen,
    title: "Export",
    body: "Package selected memories for another machine or teammate. Review the pack before sharing it.",
  },
  {
    icon: GitMerge,
    title: "Merge",
    body: "Import a pack into an existing brain. Duplicate detection helps keep repeated knowledge from piling up.",
  },
  {
    icon: ArrowLeftRight,
    title: "Swap",
    body: "Use a different set of project memories while preserving superseded history.",
  },
];

export function BrainSharing() {
  return (
    <section aria-labelledby="sharing-title" className="km-section">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-5">
        <div>
          <p className="km-eyebrow">Bring the knowledge with you</p>
          <h2 id="sharing-title" className="km-heading">
            A useful lesson travels well.
          </h2>
        </div>
        <Link
          href="/docs/how-kimetsu-works/operations"
          className="km-text-link"
        >
          Manage your brain →
        </Link>
      </div>
      <div className="grid gap-6 sm:grid-cols-3">
        {sharingModes.map((item) => (
          <div
            key={item.title}
            className="border-l-2 border-fd-primary/30 pl-5"
          >
            <item.icon aria-hidden className="mb-3 size-5 text-fd-primary" />
            <h3 className="mb-2 font-semibold">{item.title}</h3>
            <p className="text-sm leading-6 text-fd-muted-foreground">
              {item.body}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

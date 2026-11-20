"use client";

import { CodeBlock, Pre } from "fumadocs-ui/components/codeblock";
import { usePathname } from "next/navigation";
import {
  type ComponentProps,
  createContext,
  type ReactNode,
  useContext,
  useRef,
} from "react";
import { codeSampleLabel } from "@/lib/code-sample-label.mjs";

type SampleCounter = {
  pathname: string;
  order: number;
  used: Set<string>;
};

const CodeSampleCounter = createContext<SampleCounter | null>(null);

export function DocsCodeScope({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const counter = useRef<SampleCounter>({
    pathname: "",
    order: 0,
    used: new Set(),
  });
  // Reset on every render, including after a client navigation changes pathname,
  // so page-order numbers start at 1 for the page that is rendering.
  counter.current = { pathname, order: 0, used: new Set() };
  return (
    <CodeSampleCounter.Provider value={counter.current}>
      {children}
    </CodeSampleCounter.Provider>
  );
}

type DocsPreProps = ComponentProps<"pre"> & {
  title?: string;
  "data-language"?: string;
  "data-title"?: string;
};

export function DocsPre({
  children,
  title,
  "data-language": dataLanguage,
  "data-title": dataTitle,
  ...props
}: DocsPreProps) {
  const counter = useContext(CodeSampleCounter);
  if (!counter) {
    throw new Error("DocsPre must render inside DocsCodeScope");
  }
  counter.order += 1;
  const label = codeSampleLabel({
    title: title ?? dataTitle,
    language: dataLanguage,
    order: counter.order,
    used: counter.used,
  });
  return (
    <CodeBlock {...props} viewportProps={{ "aria-label": label }}>
      <Pre>{children}</Pre>
    </CodeBlock>
  );
}

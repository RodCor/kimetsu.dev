"use client";

import { CodeBlock, Pre } from "fumadocs-ui/components/codeblock";
import type { ComponentProps } from "react";
import { codeSampleLabel } from "@/lib/code-sample-label.mjs";

type DocsPreProps = ComponentProps<"pre"> & {
  title?: string;
  "data-language"?: string;
  "data-title"?: string;
  "data-order"?: number | string;
  "data-code-label"?: string;
};

export function DocsPre({
  children,
  title,
  "data-language": dataLanguage,
  "data-title": dataTitle,
  "data-order": dataOrder,
  "data-code-label": dataCodeLabel,
  ...props
}: DocsPreProps) {
  const order = Number(dataOrder);
  const label =
    dataCodeLabel ??
    codeSampleLabel({
      title: title ?? dataTitle,
      language: dataLanguage,
      order: Number.isFinite(order) ? order : 1,
      used: new Set(),
    });
  return (
    <CodeBlock {...props} viewportProps={{ "aria-label": label }}>
      <Pre>{children}</Pre>
    </CodeBlock>
  );
}

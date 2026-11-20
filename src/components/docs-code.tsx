"use client";

import { CodeBlock, Pre } from "fumadocs-ui/components/codeblock";
import { type ComponentProps, useId } from "react";

export function DocsPre({ children, ...props }: ComponentProps<"pre">) {
  const id = useId();
  return (
    <CodeBlock {...props} viewportProps={{ "aria-label": `Code sample ${id}` }}>
      <Pre>{children}</Pre>
    </CodeBlock>
  );
}

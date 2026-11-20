import { DocsLayout } from "fumadocs-ui/layouts/docs";
import { DocsLandmarks } from "@/components/docs-landmarks";
import { baseOptions } from "@/lib/layout.shared";
import { source } from "@/lib/source";

export default function Layout({ children }: LayoutProps<"/docs">) {
  return (
    <DocsLayout tree={source.getPageTree()} {...baseOptions()}>
      <DocsLandmarks />
      {children}
    </DocsLayout>
  );
}

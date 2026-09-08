import { HomeLayout } from "fumadocs-ui/layouts/home";
import { baseOptions } from "@/lib/layout.shared";

export default function Layout({ children }: LayoutProps<"/">) {
  return (
    <>
      <a className="km-skip-link" href="#main-content">
        Skip to content
      </a>
      <HomeLayout {...baseOptions()}>{children}</HomeLayout>
    </>
  );
}

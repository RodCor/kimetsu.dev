import type { Metadata } from "next";
import { IBM_Plex_Sans, JetBrains_Mono } from "next/font/google";
import { Provider } from "@/components/provider";
import { appName } from "@/lib/shared";
import "./global.css";

const sans = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-ibm",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-jbmono",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://kimetsu.dev"),
  title: {
    default: appName,
    template: "%s | kimetsu.dev",
  },
  description:
    "Local memory for coding agents. Carry project decisions, conventions, and fixes across sessions with one Rust binary. Explore setup, documentation, and measured results.",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: "/",
    siteName: appName,
    title: appName,
    description:
      "Carry project decisions, conventions, and fixes across coding sessions. Local memory, one Rust binary, and benchmarks you can inspect.",
  },
};

export default function Layout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${sans.variable} ${mono.variable}`}
      suppressHydrationWarning
    >
      <body className="flex flex-col min-h-screen font-sans">
        <Provider>{children}</Provider>
      </body>
    </html>
  );
}

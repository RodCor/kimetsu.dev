import type { Metadata } from "next";
import { IBM_Plex_Sans, JetBrains_Mono } from "next/font/google";
import { Provider } from "@/components/provider";
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
    default: "Kimetsu — proactive memory for coding agents",
    template: "%s | kimetsu.dev",
  },
  description:
    "Kimetsu documentation, open agent projects, and a credential-free discovery gateway.",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: "/",
    siteName: "kimetsu.dev",
    title: "Kimetsu — proactive memory for coding agents",
    description:
      "Kimetsu documentation, open agent projects, and a credential-free discovery gateway.",
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

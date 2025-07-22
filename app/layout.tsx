import type { Metadata } from "next";
import { Fira_Code } from "next/font/google";
import "./globals.css";
import Galaxy from "@/components/Galaxy";
import NoZoom from "@/components/NoZoom";

const firaCode = Fira_Code({
  subsets: ["latin"],
  variable: "--font-fira-code",
  display: "swap",
});

export const metadata: Metadata = {
  title: "BeatMeUp",
  description:
    "A modern, real-time leaderboard web app for a ZType-inspired typing game.",
  icons: {
    icon: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={firaCode.className}>
      <head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1, minimum-scale=1, user-scalable=no"
        />
      </head>
      <body
        className={`antialiased vsc-initialized bg-gradient-to-b from-gray-900 to-black text-white`}
      >
        <NoZoom />
        <div className="fixed inset-0 -z-10">
          <Galaxy
            mouseRepulsion={true}
            mouseInteraction={true}
            density={1.5}
            glowIntensity={0.5}
            saturation={0.8}
            hueShift={240}
          />
        </div>
        {children}
      </body>
    </html>
  );
}

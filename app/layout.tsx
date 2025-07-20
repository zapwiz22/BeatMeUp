import type { Metadata } from "next";
import { Fira_Code } from "next/font/google";
import "./globals.css";
import Galaxy from "@/components/Galaxy";

const firaCode = Fira_Code({
  subsets: ["latin"],
  variable: "--font-fira-code",
  display: "swap",
});

export const metadata: Metadata = {
  title: "BeatMeUp",
  description: "",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={firaCode.className}>
      <body
        className={`antialiased vsc-initialized bg-gradient-to-b from-gray-900 to-black text-white`}
      >
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

"use client";
import GameCanvas from "@/components/GameCanvas";
import { useSearchParams } from "next/navigation";

export default function Game() {
  const searchParams = useSearchParams();
  const captchaToken = searchParams.get("captchaToken") || "";
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4">
      <GameCanvas captchaToken={captchaToken} />
    </main>
  );
}

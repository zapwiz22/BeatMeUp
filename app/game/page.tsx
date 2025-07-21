"use client";
import GameCanvas from "@/components/GameCanvas";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";

function GameContent() {
  const searchParams = useSearchParams();
  const captchaToken = searchParams.get("captchaToken") || "";
  return <GameCanvas captchaToken={captchaToken} />;
}

export default function Game() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4">
      <Suspense>
        <GameContent />
      </Suspense>
    </main>
  );
}

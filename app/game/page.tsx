"use client";
import GameCanvas from "@/components/GameCanvas";
import { Suspense } from "react";
import { GoogleReCaptchaProvider } from "react-google-recaptcha-v3";

export default function Game() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4">
      <GoogleReCaptchaProvider
        reCaptchaKey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY!}
      >
        <Suspense>
          <GameCanvas />
        </Suspense>
      </GoogleReCaptchaProvider>
    </main>
  );
}

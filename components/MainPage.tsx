"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import ShinyText from "./ShinyText";

export default function HomePage() {
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  const [glow, setGlow] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const stored = localStorage.getItem("username");
    if (stored) {
      router.push("/game");
    }
  }, [router]);

  useEffect(() => {
    const interval = setInterval(() => {
      setGlow((prev) => !prev);
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  // sound background
  useEffect(() => {
    function playRandomSound() {
      const audio = new window.Audio("/space.mp3");
      audio.play();
    }

    const interval = setInterval(() => {
      playRandomSound();
    }, 1500);

    return () => clearInterval(interval);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) {
      setError("Please enter a username.");
      return;
    }

    // play start sound
    const audio = new window.Audio("/start.mp3");
    audio.play();

    localStorage.setItem("username", username.trim());
    router.push("/game");
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen text-white p-6">
      <h1 className="text-4xl font-bold">
        <span
          className={
            glow
              ? "block transition-all duration-500 drop-shadow-[0_0_5px_white]"
              : "block transition-all duration-500"
          }
        >
          <Image
            src={"/bg.png"}
            alt="beatmeup image"
            width={1000}
            height={1000}
          />
        </span>
      </h1>
      <ShinyText
        text="type out the words before it reaches rock-bottom."
        disabled={false}
        speed={3}
        className="mb-12 text-xl"
      />

      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4 w-full max-w-md text-center"
      >
        <label htmlFor="username" className="text-lg">
          enter your username
        </label>
        <input
          id="username"
          className="p-2 text-white rounded outline-none border-b-2 border-b-red-100 text-center"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="e.g. Jacob_25075041"
        />
        {error && <p className="text-red-400 text-sm">{error}</p>}

        <button
          type="submit"
          className="bg-white text-black font-bold py-2 px-4 rounded hover:bg-gray-200 cursor-pointer"
        >
          Start Game
        </button>
      </form>

      <button
        className="text-white font-bold py-2 px-4 rounded border-2 border-white w-full max-w-md mt-2 hover:bg-white hover:text-black cursor-pointer"
        onClick={() => router.push("/leaderboard")}
      >
        Leaderboard
      </button>

      <p className="mt-8 text-gray-400 text-center max-w-md text-sm">
        <strong>Tip:</strong> Please use your username in the format{" "}
        <code>firstName_rollNo</code>, e.g., <code>Jacob_25075041</code>. This
        will help uniquely identify you in the leaderboard.
      </p>
    </main>
  );
}

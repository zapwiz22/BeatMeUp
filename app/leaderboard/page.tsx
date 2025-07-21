"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import ShinyText from "@/components/ShinyText";

interface User {
  name: string;
  score: number;
}

export default function LeaderboardPage() {
  const [username, setUsername] = useState("");
  const [leaderboard, setLeaderboard] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingDot, setLoadingDot] = useState(0);

  const router = useRouter();

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

  useEffect(() => {
    const stored = localStorage.getItem("username");
    if (stored) setUsername(stored);
  }, []);

  useEffect(() => {
    fetch("/api/scores")
      .then((res) => res.json())
      .then((data) => setLeaderboard(data))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!loading) return;
    const interval = setInterval(() => {
      setLoadingDot((prev) => (prev + 1) % 3);
    }, 300);
    return () => clearInterval(interval);
  }, [loading]);

  return (
    <main className="min-h-screen flex flex-col items-center p-6">
      <div className="relative mb-6 flex items-center justify-center">
        <div className="text-4xl font-bold leading-none whitespace-pre-wrap text-center text-white relative z-10 px-8 py-2">
          <ShinyText
            text="Leaderboard"
            disabled={false}
            speed={3}
            className=""
          />
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-12">
          <div className="flex space-x-2 mb-4">
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                className={`inline-block w-3 h-3 rounded-full bg-lime-400 transition-all duration-200 ${
                  loadingDot === i
                    ? "translate-y-[-10px] scale-125"
                    : "translate-y-0 scale-100"
                }`}
                style={{
                  display: "inline-block",
                  transition: "transform 0.2s",
                }}
              ></span>
            ))}
          </div>
          <span className="text-white text-lg">Loading</span>
        </div>
      ) : (
        <div className="w-full max-w-4xl shadow-xl rounded-2xl overflow-hidden">
          <table className="w-full border-separate border-spacing-y-2">
            <thead>
              <tr className="text-white text-lg border-b border-gray-700">
                <th className="py-4 font-semibold text-center">#</th>
                <th className="px-4 font-semibold text-center">Username</th>
                <th className="px-4 font-semibold text-center">Score</th>
              </tr>
            </thead>
            <tbody className="text-center">
              {leaderboard.length === 0 ? (
                <tr>
                  <td colSpan={3} className="py-8 text-gray-400 text-lg">
                    No scores yet. Be the first to play!
                  </td>
                </tr>
              ) : (
                leaderboard.map((entry, index) => (
                  <tr
                    key={entry.name + index}
                    className={`transition-all duration-200 ${
                      entry.name === username
                        ? "bg-white/10 text-lime-400 font-bold scale-105 shadow-md"
                        : index < 3
                        ? "text-lime-300 font-semibold  hover:bg-white/5"
                        : "text-white hover:bg-white/5"
                    } rounded-lg`}
                  >
                    <td className="py-3 px-4 text-xl text-center align-middle">
                      {index === 0
                        ? "🥇"
                        : index === 1
                        ? "🥈"
                        : index === 2
                        ? "🥉"
                        : index + 1}
                    </td>
                    <td className="px-4 text-center text-lg align-middle">
                      {entry.name}
                    </td>
                    <td className="px-4 text-center text-lg align-middle">
                      {entry.score.toFixed(2)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      <button
        className="cursor-pointer mt-8 py-2 px-6 border-2 border-white text-white font-bold hover:bg-white hover:text-black transition-colors"
        onClick={() => {
          localStorage.removeItem("username");
          router.push("/");
        }}
      >
        Back to Home
      </button>
    </main>
  );
}

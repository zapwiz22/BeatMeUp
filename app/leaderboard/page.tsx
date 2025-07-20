"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

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
      <p className="text-4xl font-bold leading-none whitespace-pre-wrap mb-6 text-center text-white">
        LEADERBOARD
      </p>

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
        <div className="w-full max-w-2xl border-2 border-white rounded overflow-hidden">
          <table className="w-full border-collapse">
            <thead>
              <tr className="text-white text-lg">
                <th className="py-4 px-4 border-b-2 border-white">#</th>
                <th className="px-4 border-b-2 border-white">Username</th>
                <th className="px-4 border-b-2 border-white text-right">
                  Score
                </th>
              </tr>
            </thead>
            <tbody className="text-center">
              {leaderboard.map((entry, index) => (
                <tr
                  key={entry.name + index}
                  className={`${
                    entry.name === username
                      ? "bg-lime-700 text-black font-bold"
                      : "text-white"
                  } border-t-2 border-white`}
                >
                  <td className="py-3 px-4">{index + 1}</td>
                  <td className="px-4">{entry.name}</td>
                  <td className="px-4 text-right">{entry.score.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <button
        className="mt-8 py-2 px-6 border-2 border-white text-white font-bold hover:bg-white hover:text-black transition-colors"
        onClick={() => {
          localStorage.removeItem("username");
          router.push("/");
        }}
      >
        ← Back to Home
      </button>
    </main>
  );
}

"use client";

import wordlist from "@/config/wordlist";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import TextPressure from "./TextPressure";

type Word = {
  text: string;
  x: number;
  y: number;
  speed: number;
  matchedLength: number;
  targetedAt?: number;
};

type Shot = {
  x: number;
  y: number;
  timestamp: number;
};

type Explosion = {
  x: number;
  y: number;
  startTime: number;
};

const WORD_LIST = wordlist;

export default function GameCanvas() {
  const router = useRouter();
  useEffect(() => {
    const username = localStorage.getItem("username");
    if (!username) {
      router.push("/");
    }
  }, [router]);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wordsRef = useRef<Word[]>([]);
  const speedMultiplierRef = useRef(1);
  const lastSpeedRef = useRef(0);
  const lastSpawnRef = useRef(0);

  const shotsRef = useRef<Shot[]>([]);
  const explosionsRef = useRef<Explosion[]>([]);

  const scoreRef = useRef(0);
  const [score, setScore] = useState(0);

  const [typed, setTyped] = useState("");
  const [target, setTarget] = useState<Word | null>(null);

  const [gameOver, setGameOver] = useState(false);
  const gameOverRef = useRef(false);

  const animationFrameIdRef = useRef<number>(1);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const spawnWord = () => {
      const text = WORD_LIST[Math.floor(Math.random() * WORD_LIST.length)];
      const x = Math.random() * (canvas.width - 100);
      const y = -30;
      const speed = 0.5 + Math.random();
      wordsRef.current.push({ text, x, y, speed, matchedLength: 0 });
    };

    const render = async (time: number) => {
      if (gameOverRef.current) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // increasing speed after every few seconds
      if (time - lastSpeedRef.current > 5000) {
        speedMultiplierRef.current += 0.2;
        lastSpeedRef.current = time;
      }

      // spwaing words
      if (time - lastSpawnRef.current > 1000) {
        spawnWord();
        lastSpawnRef.current = time;
      }

      wordsRef.current = wordsRef.current.filter(
        (word) => word.y < canvas.height + 50
      );

      for (const word of wordsRef.current) {
        word.y += word.speed * speedMultiplierRef.current;
        if (word.y + 5 >= canvas.height) {
          console.log("Game Over triggered by:", word.text, word.y);
          gameOverRef.current = true;
          setGameOver(true);
          // submitting
          await fetch("/api/scores", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              name: username,
              score: parseFloat(scoreRef.current.toFixed(2)),
            }),
          });
          cancelAnimationFrame(animationFrameIdRef.current!);
          return;
        }
        ctx.font = "30px Fira Code";
        ctx.fillStyle = word === target ? "lime" : "white";

        // highlight the typing word
        const typedText = word.text.slice(0, word.matchedLength);
        const remainingText = word.text.slice(word.matchedLength);

        const typedWidth = ctx.measureText(typedText).width;
        ctx.fillText(typedText, word.x, word.y);

        ctx.fillStyle = "gray";
        ctx.fillText(remainingText, word.x + typedWidth, word.y);
        //   ctx.fillText("GoBeatMe Game Starts Here", 100, 100);
      }

      // bullet shots
      const now = performance.now();
      shotsRef.current = shotsRef.current.filter(
        (shot) => now - shot.timestamp < 200
      );

      for (const shot of shotsRef.current) {
        const alpha = 1 - (now - shot.timestamp) / 200;
        ctx.strokeStyle = `rgba(0, 255, 0, ${alpha})`;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(canvas.width / 2, canvas.height);
        ctx.lineTo(shot.x, shot.y - 5);
        ctx.stroke();
      }

      // explosion
      explosionsRef.current = explosionsRef.current.filter(
        (explo) => now - explo.startTime < 400
      );

      for (const explo of explosionsRef.current) {
        const elapsed = now - explo.startTime;
        const alpha = 1 - elapsed / 400;
        const radius = elapsed / 10;

        ctx.beginPath();
        ctx.arc(explo.x, explo.y, radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,165,0,${alpha})`;
        ctx.fill();

        ctx.beginPath();
        ctx.arc(explo.x, explo.y, radius / 2, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,0,${alpha})`; // yellow-ish
        ctx.fill();
      }

      animationFrameIdRef.current = requestAnimationFrame(render);
    };

    animationFrameIdRef.current = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animationFrameIdRef.current);
  }, [target]);

  const username =
    typeof window !== "undefined" ? localStorage.getItem("username") : "";

  useEffect(() => {
    if (gameOver) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameOverRef.current) return;
      const char = e.key.toLowerCase();

      if (!/^[a-z]$/.test(char)) return;

      const newTyped = typed + char;
      setTyped(newTyped);

      // find the target
      let newTarget = target;

      if (!newTarget || !newTarget.text.startsWith(newTyped)) {
        newTarget =
          wordsRef.current.find((w) => w.text.startsWith(newTyped)) || null;
        if (newTarget && newTarget.targetedAt) {
          newTarget.targetedAt = performance.now();
        }
        setTarget(newTarget);
      }

      if (newTarget) {
        newTarget.matchedLength = newTyped.length;

        // shooting
        shotsRef.current.push({
          x: newTarget.x + 30,
          y: newTarget.y - 10,
          timestamp: performance.now(),
        });

        if (newTyped === newTarget.text) {
          wordsRef.current = wordsRef.current.filter((w) => w !== newTarget);

          // explosion
          explosionsRef.current.push({
            x: newTarget.x + 30,
            y: newTarget.y - 10,
            startTime: performance.now(),
          });

          // score-calculation
          const timeTaken =
            performance.now() - (newTarget.targetedAt ?? performance.now());
          const timeTakenSec = Math.max(timeTaken / 1000, 0.2);

          const baseScore = newTarget.text.length;
          const speedMultiplier = 2.0 / timeTakenSec;
          const earned = parseFloat((baseScore * speedMultiplier).toFixed(2));

          scoreRef.current += earned;
          setScore(parseFloat(scoreRef.current.toFixed(2)));

          setTyped("");
          setTarget(null);
        }
      } else {
        setTyped("");
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [typed, target, gameOver, username]);

  return (
    <>
      <canvas
        ref={canvasRef}
        className="fixed top-0 left-0 w-full h-full z-0"
      />
      <div className="absolute top-4 left-4 text-xl font-mono text-white z-10">
        <p>Score: {score.toFixed(2)}</p>
        {username && <p>Player: {username}</p>}
      </div>
      {gameOver && (
        <div className="absolute inset-0 flex  items-center justify-center bg-black bg-opacity-80 z-20">
          <div className="text-center flex-col flex">
            <h2 className="text-4xl font-bold text-red-500">
              <div style={{ position: "relative" }}>
                <TextPressure
                  text="Game Over!"
                  flex={true}
                  alpha={false}
                  stroke={false}
                  width={true}
                  weight={true}
                  italic={true}
                  textColor="red"
                  strokeColor="#ff0000"
                  minFontSize={50}
                />
              </div>
            </h2>
            <p className="text-white text-xl mb-2 mt-2">
              Final Score: {score.toFixed(2)} of player {username}
            </p>
            <button
              className="mt-4 px-4 py-2 bg-white text-black font-bold rounded cursor-pointer hover:bg-gray-200"
              onClick={() => {
                localStorage.removeItem("username");
                router.push("/");
              }}
            >
              Home
            </button>
            <button
              className="mt-4 px-4 py-2 text-white border-2 border-white font-bold rounded cursor-pointer hover:bg-white hover:text-black"
              onClick={() => {
                router.push("/leaderboard");
              }}
            >
              Leaderboard
            </button>
          </div>
        </div>
      )}
    </>
  );
}

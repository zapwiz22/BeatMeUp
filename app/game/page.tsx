import GameCanvas from "@/components/GameCanvas"
import dynamic from "next/dynamic"

export default function Game() {
  return (
      <main className="min-h-screen flex flex-col items-center justify-center p-4">
        {/* <h1 className="text-4xl font-bold mb-4">BeatMeUp</h1> */}
        <GameCanvas />
      </main>
  )
}
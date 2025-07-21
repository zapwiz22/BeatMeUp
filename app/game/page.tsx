import GameCanvas from "@/components/GameCanvas";

function GameContent() {
  return <GameCanvas />;
}

export default function Game() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4">
      <GameContent />
    </main>
  );
}

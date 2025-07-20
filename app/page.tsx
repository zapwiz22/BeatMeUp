import Galaxy from "@/components/Galaxy";
import HomePage from "@/components/MainPage";

export default function Home() {
  return (
    <div className="relative w-full min-h-screen overflow-hidden">
      <main className="relative z-10">
        <HomePage />
      </main>
    </div>
  );
}

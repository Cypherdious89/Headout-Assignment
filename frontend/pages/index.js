// /pages/index.js
import { useState } from "react";
import WelcomeModal from "../components/WelcomeModal";
import QuizGame from "../components/QuizGame";

export default function Home() {
  const [showWelcome, setShowWelcome] = useState(true);
  const [gameStarted, setGameStarted] = useState(false);

  const startGame = () => {
    setShowWelcome(false);
    setGameStarted(true);
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-gradient-to-br from-purple-50 to-purple-200">
      <div className="w-full max-w-2xl">
        {showWelcome && <WelcomeModal onStart={startGame} />}
        {gameStarted && <QuizGame />}
      </div>
    </main>
  );
}

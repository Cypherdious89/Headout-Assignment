// /components/QuizGame.js
import { useState, useEffect } from "react";
import Confetti from "./Confetti";
import GameResultModal from "./GameResultModal";
import StylizedButton from "./StylizedButton";

const QuizGame = () => {
  const [destinations, setDestinations] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [options, setOptions] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isCorrect, setIsCorrect] = useState(null);
  const [funFact, setFunFact] = useState("");
  const [score, setScore] = useState({ correct: 0, incorrect: 0 });
  const [showConfetti, setShowConfetti] = useState(false);
  const [gameComplete, setGameComplete] = useState(false);
  const [challengeInfo, setChallengeInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [username, setUsername] = useState(null);

  const questionCount = 10;
  // Fetch destinations from API on mount
  useEffect(() => {
    const fetchDestinations = async () => {
      try {
        const response = await fetch("/api/destinations");
        if (!response.ok) {
          throw new Error("Failed to fetch destinations");
        }
        const data = await response.json();
        setDestinations(data);
        generateNewQuestion(data);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching destinations:", error);
        setError(error.message);
        setIsLoading(false);
      }
    };

    // Check URL parameters for friend challenge
    const urlParams = new URLSearchParams(window.location.search);
    const challengeId = urlParams.get("challenge");

    if (challengeId) {
      fetchChallengeInfo(challengeId);
    }

    // Try to get stored username from sessionStorage
    const storedUsername = sessionStorage.getItem("quizUsername");
    if (storedUsername) {
      setUsername(storedUsername);
    }

    fetchDestinations();
  }, []);

  const fetchChallengeInfo = async (challengeId) => {
    try {
      // Also get the score from URL if available
      const urlParams = new URLSearchParams(window.location.search);
      const scoreFromUrl = urlParams.get("score");

      const response = await fetch(`/api/challenges/${challengeId}`);
    
      if (!response.ok) {
        const errorData = await response.json();
        console.error("Challenge API error:", response.status, errorData);
        throw new Error(
          `Failed to fetch challenge info: ${
            errorData.error || response.statusText
          }`
        );
      }

      const data = await response.json();

      setChallengeInfo({
        fromId: challengeId,
        username: data.challengeInfo.username,
        // Use score from URL if available, otherwise use from API
        score: scoreFromUrl ? parseInt(scoreFromUrl) : data.challengeInfo.score,
      });
    } catch (error) {
      console.error(
        "Error fetching challenge info:",
        error,
        "Challenge ID:",
        challengeId
      );
    }
  };

  useEffect(() => {
    // Check if game should end (questionCount questions answered)
    if (
      score.correct + score.incorrect === questionCount &&
      !gameComplete &&
      selectedOption
    ) {
      setGameComplete(true);
    }
  }, [score, selectedOption, gameComplete]);

  const generateNewQuestion = (data) => {
    if (!data || data.length === 0) return;

    // Reset state for new question
    setSelectedOption(null);
    setIsCorrect(null);
    setFunFact("");
    setShowConfetti(false);

    // Randomly select destination
    const randomIndex = Math.floor(Math.random() * data.length);
    const selectedDestination = data[randomIndex];

    // Get 1-2 random clues
    const numberOfClues = Math.floor(Math.random() * 2) + 1;
    const shuffledClues = [...selectedDestination.clues].sort(
      () => 0.5 - Math.random()
    );
    const selectedClues = shuffledClues.slice(0, numberOfClues);

    // Set current question
    setCurrentQuestion({
      destination: selectedDestination,
      clues: selectedClues,
    });

    // Generate answer options (1 correct, 3 incorrect)
    const correctAnswer = `${selectedDestination.city}, ${selectedDestination.country}`;
    const incorrectOptions = data
      .filter((d) => d.city !== selectedDestination.city)
      .sort(() => 0.5 - Math.random())
      .slice(0, 3)
      .map((d) => `${d.city}, ${d.country}`);

    // Shuffle all options
    const allOptions = [correctAnswer, ...incorrectOptions].sort(
      () => 0.5 - Math.random()
    );
    setOptions(allOptions);
  };

  const handleAnswer = (option) => {
    const correctAnswer = `${currentQuestion.destination.city}, ${currentQuestion.destination.country}`;
    const correct = option === correctAnswer;

    setSelectedOption(option);
    setIsCorrect(correct);

    // Update score
    if (correct) {
      setScore((prev) => ({ ...prev, correct: prev.correct + 1 }));
      setShowConfetti(true);
    } else {
      setScore((prev) => ({ ...prev, incorrect: prev.incorrect + 1 }));
    }

    // Show random fun fact
    const funFacts = currentQuestion.destination.fun_fact;
    const randomFunFact = funFacts[Math.floor(Math.random() * funFacts.length)];
    setFunFact(randomFunFact);
  };

  const handleNextQuestion = () => {
    if (score.correct + score.incorrect < questionCount) {
      generateNewQuestion(destinations);
    }
  };

  const restartGame = () => {
    setScore({ correct: 0, incorrect: 0 });
    setGameComplete(false);
    generateNewQuestion(destinations);
  };

  // This is now simplified since SharePopup handles username entry
  const handleChallengeClick = () => {
    // Set challengeInfo to include showSharePopup flag
    // The SharePopup component will now handle all username collection
    const newChallengeInfo = {
      ...challengeInfo,
      showSharePopup: true,
      isNewChallenge: true,
    };

    setChallengeInfo(newChallengeInfo);
  };

  // Function to update username when it's set from SharePopup
  // This can be called from GameResultModal if needed
  const updateUsername = (newUsername) => {
    setUsername(newUsername);
    sessionStorage.setItem("quizUsername", newUsername);
  };

  if (isLoading) {
    return (
      <div className="purple-card p-8 text-center">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-8 w-32 bg-purple-200 rounded mb-4"></div>
          <div className="h-24 w-full bg-purple-100 rounded mb-4"></div>
          <div className="h-10 w-full bg-purple-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="purple-card p-8 text-center">
        <h3 className="text-xl font-bold text-red-500 mb-4">
          Error Loading Game
        </h3>
        <p className="mb-4">{error}</p>
        <StylizedButton
          variant="primary"
          size="medium"
          onClick={() => window.location.reload()}
        >
          Try Again
        </StylizedButton>
      </div>
    );
  }

  if (!currentQuestion) {
    return (
      <div className="purple-card p-8 text-center">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-8 w-32 bg-purple-200 rounded mb-4"></div>
          <div className="h-24 w-full bg-purple-100 rounded mb-4"></div>
          <div className="h-10 w-full bg-purple-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center w-full">
      {/* Score indicators fixed at top of page with background */}
      <div className="fixed top-0 left-0 right-0 bg-white shadow-md py-3 z-10">
        <div className="score-indicators flex justify-center gap-6 w-full max-w-8xl mx-auto">
          <div className="score-tile correct rounded-lg flex flex-col items-center">
            <span className="score-value font-bold text-xl p-3 bg-green-200">
              {score.correct}/{questionCount}
            </span>
            <span className="score-label text-sm">Correct</span>
          </div>

          <div className="score-tile total rounded-lg flex flex-col items-center">
            <span className="score-value font-bold text-xl p-3 bg-blue-200">
              {Math.min(score.correct + score.incorrect, questionCount)}
              /{questionCount}
            </span>
            <span className="score-label text-sm">Total</span>
          </div>

          <div className="score-tile incorrect rounded-lg flex flex-col items-center">
            <span className="score-value font-bold text-xl p-3 bg-red-200">
              {score.incorrect}/{questionCount}
            </span>
            <span className="score-label text-sm">Incorrect</span>
          </div>

          {challengeInfo && (
            <div className="score-tile challenge rounded-lg flex flex-col items-center">
              <span className="score-value font-bold text-xl p-3 bg-purple-200">
                {challengeInfo.score}/10
              </span>
              <span className="score-label text-sm">
                {challengeInfo.username}`s Score
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Game result modal as a fixed overlay */}
      {gameComplete && (
        <div className="fixed inset-0 bg-white bg-opacity-20 flex items-center justify-center z-50">
          <GameResultModal
            score={score}
            onRestart={restartGame}
            challengeInfo={challengeInfo}
            onChallengeClick={handleChallengeClick}
            username={username}
          />
        </div>
      )}

      {/* Added space to account for fixed header */}
      <div className="mt-30 w-full max-w-4xl">
        {/* Main game container */}
        {showConfetti && <Confetti />}

        {selectedOption && (
          <div
            className={`p-4 rounded-lg mb-4 shadow-sm ${
              isCorrect
                ? "bg-gradient-to-r from-green-50 to-purple-50 border-l-4 border-green-500"
                : "bg-gradient-to-r from-red-50 to-purple-50 border-l-4 border-red-500"
            }`}
          >
            <div className="flex items-start">
              <span className="text-3xl mr-3">{isCorrect ? "🎉" : "😢"}</span>
              <div>
                <h3 className="text-xl font-bold mb-1">
                  {isCorrect ? "Correct!" : "Not quite right..."}
                </h3>
                <p className="text-lg">
                  <span className="font-semibold">Fun Fact:</span> {funFact}
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="purple-card p-6 w-full">
          <div>
            <div className="text-center mb-6">
              <h2 className="text-3xl font-bold mb-2 text-accent">
                Guess the City?
              </h2>
              <div className="h-1 w-16 mx-auto bg-accent"></div>
            </div>

            <div className="mb-4 space-y-3">
              {currentQuestion.clues.map((clue, index) => (
                <div
                  key={index}
                  className="clue-box p-4 hover:shadow-md transition-all"
                >
                  <p className="text-lg">
                    <span className="inline-block mr-2">🌍</span>
                    <span className="font-medium">{clue}</span>
                  </p>
                </div>
              ))}
            </div>

            {/* Side by side buttons */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              {options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => !selectedOption && handleAnswer(option)}
                  disabled={selectedOption !== null}
                  className={`option-button p-4 rounded-full text-left font-medium text-lg shadow-sm ${
                    selectedOption === option
                      ? isCorrect
                        ? "bg-green-100 border-2 border-green-500 text-green-700"
                        : "bg-red-100 border-2 border-red-500 text-red-700"
                      : selectedOption !== null &&
                        option ===
                          `${currentQuestion.destination.city}, ${currentQuestion.destination.country}`
                      ? "bg-green-100 border-2 border-green-500 text-green-700"
                      : "bg-white hover:bg-accent-light border-2 border-accent text-accent hover:border-accent active:p-3 transition-all"
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Next Destination button outside the game box - only show if game is not complete */}
        {selectedOption && !gameComplete && (
          <div className="w-full my-3 mx-auto">
            <StylizedButton
              variant="primary"
              size="large"
              fullWidth={true}
              onClick={handleNextQuestion}
            >
              Next Destination
            </StylizedButton>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuizGame;

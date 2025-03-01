// /components/GameResultModal.js
import React, { useState, useEffect } from "react";
import StylizedButton from "./StylizedButton";
import SharePopup from "./SharePopup";
import { Trophy, Frown, ArrowRightLeft, Share2, User } from "lucide-react";

const GameResultModal = ({
  score,
  onRestart,
  challengeInfo,
  onChallengeClick,
  username,
}) => {
  const [showSharePopup, setShowSharePopup] = useState(false);
  const [comparisonResult, setComparisonResult] = useState(null);
  const totalQuestions = 10;
  const percentage = (score.correct / totalQuestions) * 100;

  let message = "";
  let emoji = "";

  if (percentage >= 90) {
    message = "Geography Expert! You're amazing!";
    emoji = "🏆";
  } else if (percentage >= 70) {
    message = "Great job! You know your destinations!";
    emoji = "🌟";
  } else if (percentage >= 50) {
    message = "Not bad! More adventures await you!";
    emoji = "✈️";
  } else {
    message = "Time to explore more of the world!";
    emoji = "🌍";
  }

  // Determine challenge result when component mounts
  useEffect(() => {
    if (challengeInfo) {
      // Skip showing comparison result if this is a new challenge we're creating
      if (challengeInfo.isNewChallenge) {
        // Don't set comparison result for challenges we're creating
        setComparisonResult(null);
      } else {
        // Only show comparison for challenges we're responding to
        if (score.correct > challengeInfo.score) {
          setComparisonResult({
            status: "win",
            message: "You beat your friend's score!",
            icon: <Trophy className="w-6 h-6 text-yellow-500" />,
          });
        } else if (score.correct < challengeInfo.score) {
          setComparisonResult({
            status: "loss",
            message: "Your friend scored higher. Try again?",
            icon: <Frown className="w-6 h-6 text-blue-500" />,
          });
        } else {
          setComparisonResult({
            status: "draw",
            message: "You tied with your friend!",
            icon: <ArrowRightLeft className="w-6 h-6 text-purple-500" />,
          });
        }
      }
    }

    if (challengeInfo && challengeInfo.showSharePopup) {
      setShowSharePopup(true);
    }
  }, [score, challengeInfo]);

  const handleChallengeClick = () => {
    // Show the share popup directly - username collection is now handled there
    setShowSharePopup(true);
  };

  const handleCloseSharePopup = () => {
    setShowSharePopup(false);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content bg-white p-8 rounded-xl shadow-2xl max-w-md backdrop-blur-lg">
        <div className="flex flex-col items-center">
          <span className="text-6xl mb-4">{emoji}</span>

          <h2 className="text-3xl font-bold mb-2 text-accent">
            Quiz Complete!
          </h2>
          <div className="h-1 w-16 mx-auto mb-6 bg-accent"></div>

          {/* User information display */}
          {username && (
            <div className="flex items-center mb-4 px-4 py-2 bg-accent-light rounded-full">
              <User className="w-5 h-5 mr-2 text-accent" />
              <span className="font-medium text-accent">{username}</span>
            </div>
          )}

          <div className="score-display flex items-center justify-center w-32 h-32 rounded-full bg-accent-light mb-6">
            <span className="text-4xl font-bold text-accent">
              {score.correct}/{totalQuestions}
            </span>
          </div>

          <p className="text-lg mb-6 text-center text-gray-700">{message}</p>

          {/* Challenge comparison result */}
          {comparisonResult && (
            <div
              className={`w-full p-4 mb-6 rounded-lg flex items-center 
              ${
                comparisonResult.status === "win"
                  ? "bg-green-50 border-green-200"
                  : comparisonResult.status === "loss"
                  ? "bg-red-50 border-red-200"
                  : "bg-purple-50 border-purple-200"
              } border`}
            >
              <div className="mr-3">{comparisonResult.icon}</div>
              <div>
                <p className="font-medium">{comparisonResult.message}</p>
                <p className="text-sm text-gray-600">
                  Your score: {score.correct} / {challengeInfo?.username}`s
                  score: {challengeInfo?.score}
                </p>
              </div>
            </div>
          )}

          <div className="w-full mb-8 bg-gray-200 rounded-full h-4">
            <div
              className="h-4 rounded-full accent-gradient"
              style={{ width: `${percentage}%` }}
            ></div>
          </div>

          <div className="flex gap-4 mb-4 w-full">
            <div className="flex-1 p-4 bg-green-50 rounded-lg text-center">
              <p className="text-sm text-gray-600">Correct</p>
              <p className="text-2xl font-bold text-green-600">
                {score.correct}
              </p>
            </div>
            <div className="flex-1 p-4 bg-red-50 rounded-lg text-center">
              <p className="text-sm text-gray-600">Incorrect</p>
              <p className="text-2xl font-bold text-red-500">
                {score.incorrect}
              </p>
            </div>
          </div>

          <div className="flex gap-4 w-full">
            <StylizedButton
              variant="primary"
              size="large"
              fullWidth={true}
              onClick={onRestart}
            >
              Play Again
            </StylizedButton>

            <StylizedButton
              variant="secondary"
              size="large"
              fullWidth={true}
              onClick={handleChallengeClick}
              className="flex items-center justify-center"
            >
              <Share2 className="w-5 h-5 mr-2" />
              Challenge a Friend
            </StylizedButton>
          </div>
        </div>
      </div>

      {showSharePopup && (
        <SharePopup
          score={score}
          onClose={handleCloseSharePopup}
          message={message}
          emoji={emoji}
          comparisonResult={comparisonResult}
          challengeInfo={challengeInfo}
          username={username}
          // We no longer need to pass a separate onUsernameSubmit function
          // as the SharePopup now handles saving the username internally
        />
      )}
    </div>
  );
};

export default GameResultModal;

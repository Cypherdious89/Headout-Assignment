import React, { useState, useEffect } from 'react';
import WelcomeModal from '../components/WelcomeModal';
import FriendChallengeInfo from '../components/FriendChallengeInfo';
import SharePopup from '../components/SharePopup';
import QuizGame from "../components/QuizGame";


const App = () => {
  // Game state
  const [gameStarted, setGameStarted] = useState(false);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [score, setScore] = useState({ correct: 0, total: 10 });
  const [username, setUsername] = useState('');
  const [showSharePopup, setShowSharePopup] = useState(false);
  
  // Challenge related state
  const [challengeInfo, setChallengeInfo] = useState(null);
  const [showChallengeInfo, setShowChallengeInfo] = useState(false);
  
  // Load username from session storage
  useEffect(() => {
    const storedUsername = sessionStorage.getItem('quizUsername');
    if (storedUsername) {
      setUsername(storedUsername);
    }
    
    // Parse URL query params to check for challenge
    const queryParams = new URLSearchParams(window.location.search);
    const challengeId = queryParams.get('challenge');
    const challengeScore = queryParams.get('score');
    
    if (challengeId && challengeScore) {
      // Fetch challenge data from API
      fetchChallengeInfo(challengeId, challengeScore);
    }
  }, []);
  
  // Example function to fetch challenge info
  const fetchChallengeInfo = async (challengeId, challengeScore) => {
    try {
      const response = await fetch(`/api/challenges/${challengeId}`);
      if (response.ok) {
        const data = await response.json();
        setChallengeInfo({
          username: data.username,
          score: parseInt(challengeScore, 10),
          fromId: challengeId,
          isNewChallenge: false
        });
        setShowChallengeInfo(true);
      }
    } catch (error) {
      console.error('Error fetching challenge info:', error);
    }
  };
  
  // Handle game start
  const handleStartGame = () => {
    setGameStarted(true);
    setShowChallengeInfo(false);
  };
  
  // Handle game completion
  const handleGameComplete = (finalScore) => {
    setScore(finalScore);
    setGameCompleted(true);
    setShowSharePopup(true);
  };
  
  // Handle username submission from SharePopup
  const handleUsernameSubmit = (newUsername) => {
    setUsername(newUsername);
    // You can handle any additional logic here
  };
  
  // Dismiss challenge info
  const handleDismissChallenge = () => {
    setShowChallengeInfo(false);
  };

  return (
    <div className="app-container">
      {/* Welcome modal */}
      {!gameStarted && (
        <WelcomeModal 
          onStart={handleStartGame} 
          challengeInfo={challengeInfo} 
        />
      )}
      
      {/* Game content */}
      {gameStarted && !gameCompleted && (
        <>
          {/* Show challenge info if applicable */}
          {showChallengeInfo && challengeInfo && (
            <FriendChallengeInfo 
              friendUsername={challengeInfo.username}
              friendScore={challengeInfo.score}
              onDismiss={handleDismissChallenge}
            />
          )}
          
          {/* Your game component here */}
          {gameStarted && <QuizGame />}
        </>
      )}
      
      {/* Share popup */}
      {showSharePopup && (
        <SharePopup
          score={score}
          onClose={() => setShowSharePopup(false)}
          message="I completed the challenge!"
          emoji="🌍"
          challengeInfo={challengeInfo}
          username={username}
          onUsernameSubmit={handleUsernameSubmit}
        />
      )}
    </div>
  );
};

export default App;
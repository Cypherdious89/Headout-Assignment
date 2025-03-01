// /components/SharePopup.js
import React, { useRef, useEffect, useState } from "react";
import StylizedButton from "./StylizedButton";
import { Share, User, Clipboard, Check } from "lucide-react";
import html2canvas from "html2canvas";
import Image from "next/image";

const SharePopup = ({
  score,
  onClose,
  message,
  emoji,
  comparisonResult,
  challengeInfo,
  username,
  onUsernameSubmit, // New prop to handle username submission
}) => {
  const shareCardRef = useRef(null);
  const totalQuestions = 10;
  const [localUsername, setLocalUsername] = useState(username || "");
  const [isChecking, setIsChecking] = useState(false);
  const [isAvailable, setIsAvailable] = useState(null);
  const [error, setError] = useState("");
  const [linkCopied, setLinkCopied] = useState(false);
  const [isUsernameSubmitted, setIsUsernameSubmitted] = useState(!!username);

  // Always generate a new unique game ID when component mounts
  // This ensures each new challenge gets a unique ID
  const [gameId, setGameId] = useState("");
  const [shareUrl, setShareUrl] = useState("");

  useEffect(() => {
    // Generate a fresh game ID when the component mounts
    const newGameId = btoa(
      `game_${Date.now()}_${Math.random().toString(36).substring(2, 9)}_${
        score.correct
      }`
    );
    setGameId(newGameId);

    // Create share URL with the score and game ID embedded
    const url = `${window.location.origin}${window.location.pathname}?challenge=${newGameId}&score=${score.correct}`;
    setShareUrl(url);
  }, [score.correct]);

  // Check username availability after user stops typing
  useEffect(() => {
    if (!localUsername || isUsernameSubmitted) {
      setIsAvailable(null);
      setError("");
      return;
    }

    const checkUsername = async () => {
      if (localUsername.length < 3) {
        setError("Username must be at least 3 characters");
        setIsAvailable(false);
        return;
      }

      if (!/^[a-zA-Z0-9_]+$/.test(localUsername)) {
        setError("Only letters, numbers, and underscores allowed");
        setIsAvailable(false);
        return;
      }

      setIsChecking(true);
      setError("");

      try {
        const response = await fetch(
          `/api/users?username=${encodeURIComponent(localUsername)}`
        );
        const data = await response.json();

        if (response.ok) {
          setIsAvailable(data.available);
          if (!data.available) {
            setError("Username already taken");
          }
        } else {
          setError("Error checking username");
          setIsAvailable(false);
        }
      } catch (error) {
        console.error("Error checking username:", error);
        setError("Error checking username");
        setIsAvailable(false);
      } finally {
        setIsChecking(false);
      }
    };

    const timeoutId = setTimeout(checkUsername, 500);
    return () => clearTimeout(timeoutId);
  }, [localUsername, isUsernameSubmitted]);

  // Save username and score to database
  const saveUserScore = async () => {
    if (!localUsername || localUsername.length < 3 || !isAvailable) {
      setError("Please choose a valid username");
      return false;
    }

    setIsChecking(true);

    try {
      const response = await fetch("/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nameToUse: localUsername,
          score: score.correct,
          gameId: gameId,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          `Failed to save score: ${errorData.error || response.statusText}`
        );
      }

      const data = await response.json();
      // Use the returned gameId from the server
      setGameId(data.gameId);

      // Update share URL with new game ID
      const newUrl = `${window.location.origin}${window.location.pathname}?challenge=${data.gameId}&score=${score.correct}`;
      setShareUrl(newUrl);

      setIsUsernameSubmitted(true);

      // Store username in session storage
      sessionStorage.setItem("quizUsername", localUsername);

      // Notify parent component of username submission
      if (onUsernameSubmit) {
        onUsernameSubmit(localUsername);
      }

      return true;
    } catch (error) {
      console.error("Error saving score:", error);
      setError(`Failed to save: ${error.message}`);
      return false;
    } finally {
      setIsChecking(false);
    }
  };

  // Create WhatsApp share text
  const getWhatsappText = () => {
    let whatsappText = `I scored ${score.correct}/${totalQuestions} in The Globetrotter Challenge – The Ultimate Travel Guessing Game! \n`;

    if (comparisonResult) {
      if (comparisonResult.status === "win") {
        whatsappText = `I beat ${challengeInfo.username}'s score (${challengeInfo.score}/${totalQuestions}) with ${score.correct}/${totalQuestions} in the Globetrotter Challenge`;
      } else if (comparisonResult.status === "loss") {
        whatsappText = `I scored ${score.correct}/${totalQuestions} against ${challengeInfo.username}'s ${challengeInfo.score}/${totalQuestions} in the Globetrotter Challenge. Can you beat us both?`;
      } else {
        whatsappText = `I tied with ${challengeInfo.username} (${score.correct}/${totalQuestions}) in the Globetrotter Challenge! Can you beat us?`;
      }
    } else {
      whatsappText += " Can you beat me?";
    }

    whatsappText += ` ${shareUrl}`;
    return whatsappText;
  };

  // Generate WhatsApp link
  const getWhatsappLink = () => {
    return `https://wa.me/?text=${encodeURIComponent(getWhatsappText())}`;
  };

  const isResponseToChallenge =
    challengeInfo && !challengeInfo.isNewChallenge && challengeInfo.fromId;

  // Handle sharing via WhatsApp
  const handleShareWhatsApp = async () => {
    // First save the username and score if not already submitted
    if (!isUsernameSubmitted) {
      const saveSuccess = await saveUserScore();
      if (!saveSuccess) return;
    }

    try {
      if (shareCardRef.current) {
        html2canvas(shareCardRef.current, {
          // Add configuration to ignore problematic CSS
          ignoreElements: (element) => {
            const computedStyle = window.getComputedStyle(element);
            // Check for problematic gradient styles
            return (
              computedStyle.background &&
              (computedStyle.background.includes("oklch") ||
                computedStyle.background.includes("gradient"))
            );
          },
          backgroundColor: "#FFFFFF", // Use standard color format
          logging: false,
        })
          .then((canvas) => {
            // Convert canvas to blob
            canvas.toBlob((blob) => {
              if (blob) {
                // Create a File object
                const file = new File([blob], "challenge.png", {
                  type: "image/png",
                });

                // Use Web Share API if available and supports files
                if (navigator.share && navigator.canShare({ files: [file] })) {
                  navigator
                    .share({
                      title: "The Globetrotter Challenge",
                      text: getWhatsappText(),
                      files: [file],
                      url: shareUrl,
                    })
                    .catch((err) => {
                      console.error("Share failed:", err);
                      // Fallback to direct WhatsApp link
                      window.open(getWhatsappLink(), "_blank");
                    });
                } else {
                  // Fallback to direct WhatsApp link
                  window.open(getWhatsappLink(), "_blank");
                }
              } else {
                // If blob creation fails, use text-only sharing
                window.open(getWhatsappLink(), "_blank");
              }
            });
          })
          .catch((error) => {
            console.error("html2canvas error:", error);
            // Fallback if canvas generation fails
            window.open(getWhatsappLink(), "_blank");
          });
      } else {
        // Fallback if ref is not available
        window.open(getWhatsappLink(), "_blank");
      }
    } catch (error) {
      console.error("Share error:", error);
      // Ultimate fallback
      window.open(getWhatsappLink(), "_blank");
    }
  };

  // Copy link to clipboard
  const copyLinkToClipboard = async () => {
    // First save the username and score if not already submitted
    if (!isUsernameSubmitted) {
      const saveSuccess = await saveUserScore();
      if (!saveSuccess) return;
    }

    navigator.clipboard.writeText(shareUrl).then(() => {
      setLinkCopied(true);
      setTimeout(() => setLinkCopied(false), 3000);
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-5">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-accent">Challenge a Friend</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        {/* Username input section - displayed if username isn't submitted yet */}
        {!isUsernameSubmitted && (
          <div className="mb-6">
            <p className="text-gray-600 mb-3">
              Choose a unique username to challenge your friends. This will be
              visible to people you share your score with.
            </p>

            <div className="relative mb-2">
              <div className="flex">
                <div className="relative flex-grow">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <User className="w-5 h-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    value={localUsername}
                    onChange={(e) => setLocalUsername(e.target.value)}
                    placeholder="YourCoolUsername"
                    className={`w-full pl-10 p-3 border rounded-lg focus:outline-none focus:ring-2 ${
                      isAvailable === true
                        ? "border-green-500 focus:ring-green-500"
                        : isAvailable === false
                        ? "border-red-500 focus:ring-red-500"
                        : "border-gray-300 focus:ring-accent"
                    }`}
                  />
                  {isChecking && (
                    <div className="absolute right-3 top-3">
                      <div className="animate-spin h-5 w-5 border-2 border-accent border-t-transparent rounded-full"></div>
                    </div>
                  )}
                  {isAvailable === true && !isChecking && (
                    <div className="absolute right-3 top-3 text-green-500">
                      ✓
                    </div>
                  )}
                </div>
              </div>
            </div>

            {error && <p className="text-sm text-red-600 mb-2">{error}</p>}
            {isAvailable === true && (
              <p className="text-sm text-green-600 mb-2">
                Username is available
              </p>
            )}
          </div>
        )}

        {/* This div will be captured as an image */}
        <div ref={shareCardRef} className="p-6 bg-purple-100 rounded-lg mb-6">
          <div className="flex flex-col items-center bg-white p-4 rounded-lg shadow-md">
            <div className="flex items-center justify-center w-full mb-4">
              <Image
                src="/image.jpeg"
                alt="Game logo"
                width={160}
                height={160}
                className="mr-2"
              />
              <h4 className="text-xl font-bold text-accent">Guess the City?</h4>
            </div>

            <span className="text-4xl mb-2">{emoji}</span>
            <p className="text-lg font-medium mb-2">{message}</p>

            {/* Show username if available */}
            {(isUsernameSubmitted || username) && (
              <div className="mb-3 px-4 py-2 bg-accent-light rounded-full">
                <span className="font-medium text-accent">
                  {localUsername || username}
                </span>
              </div>
            )}

            <div className="score-display flex items-center justify-center w-24 h-24 rounded-full bg-accent-light mb-4">
              <span className="text-3xl font-bold text-accent">
                {score.correct}/{totalQuestions}
              </span>
            </div>

            {/* Show comparison if this was a response to a challenge */}
            {isResponseToChallenge && comparisonResult && (
              <div
                className={`w-full p-3 mb-3 rounded-lg text-center text-sm
                ${
                  comparisonResult.status === "win"
                    ? "bg-green-100 text-green-700"
                    : comparisonResult.status === "loss"
                    ? "bg-red-100 text-red-700"
                    : "bg-purple-100 text-purple-700"
                }`}
              >
                {comparisonResult.status === "win" ? (
                  <p>
                    I beat {challengeInfo.username}`s score of{" "}
                    {challengeInfo.score}/{totalQuestions}!
                  </p>
                ) : comparisonResult.status === "loss" ? (
                  <p>
                    {challengeInfo.username} scored {challengeInfo.score}/
                    {totalQuestions}. Can you beat us both?
                  </p>
                ) : (
                  <p>
                    I tied with {challengeInfo.username} at {score.correct}/
                    {totalQuestions}!
                  </p>
                )}
              </div>
            )}

            <p className="text-sm text-center text-gray-600 mb-2">
              I challenge you to beat my score!
            </p>
            <p className="text-xs text-center text-gray-500">
              Tap the link to play now
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <StylizedButton
            variant="primary"
            size="medium"
            fullWidth={true}
            onClick={handleShareWhatsApp}
            disabled={
              !isUsernameSubmitted &&
              (!localUsername || !isAvailable || isChecking)
            }
          >
            <div className="flex items-center justify-center w-full">
              <Share className="w-5 h-5 mr-2" />
              <span>Share on WhatsApp</span>
            </div>
          </StylizedButton>

          <StylizedButton
            variant="secondary"
            size="medium"
            fullWidth={true}
            onClick={copyLinkToClipboard}
            disabled={
              !isUsernameSubmitted &&
              (!localUsername || !isAvailable || isChecking)
            }
          >
            <div className="flex items-center justify-center w-full">
              {linkCopied ? (
                <>
                  <Check className="w-5 h-5 mr-2" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Clipboard className="w-5 h-5 mr-2" />
                  <span>Copy Challenge Link</span>
                </>
              )}
            </div>
          </StylizedButton>
        </div>
      </div>
    </div>
  );
};

export default SharePopup;
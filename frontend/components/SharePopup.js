// /components/SharePopup.js
import React, { useRef, useEffect } from "react";
import StylizedButton from "./StylizedButton";
import { Share } from "lucide-react";
import html2canvas from "html2canvas";
import Image from "next/image";

const SharePopup = ({
  score,
  onClose,
  message,
  emoji,
  comparisonResult,
  challengeInfo,
}) => {
  const shareCardRef = useRef(null);
  const totalQuestions = 10;

  // Generate a unique game ID to track who invited whom
  const gameId = btoa(`game_${Date.now()}_${score.correct}`);

  // Create share URL with the score and game ID embedded
  const shareUrl = `${window.location.origin}${window.location.pathname}?from=${gameId}&score=${score.correct}`;

  // Create WhatsApp share text based on whether this was a challenge response
  let whatsappText = `I scored ${score.correct}/${totalQuestions} in Where Am I? Geography Quiz!`;

  if (comparisonResult) {
    if (comparisonResult.status === "win") {
      whatsappText = `I beat my friend's score (${challengeInfo.score}/${totalQuestions}) with ${score.correct}/${totalQuestions} in Where Am I? Geography Quiz!`;
    } else if (comparisonResult.status === "loss") {
      whatsappText = `I scored ${score.correct}/${totalQuestions} against my friend's ${challengeInfo.score}/${totalQuestions} in Where Am I? Geography Quiz. Can you beat us both?`;
    } else {
      whatsappText = `I tied with my friend (${score.correct}/${totalQuestions}) in Where Am I? Geography Quiz! Can you beat us?`;
    }
  } else {
    whatsappText += " Can you beat me?";
  }

  whatsappText += ` ${shareUrl}`;
  const whatsappLink = `https://wa.me/?text=${encodeURIComponent(
    whatsappText
  )}`;

  // Handle html2canvas errors
  const handleShareWhatsApp = () => {
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
                      title: "Geography Quiz Challenge",
                      text: whatsappText,
                      files: [file],
                      url: shareUrl,
                    })
                    .catch((err) => {
                      console.error("Share failed:", err);
                      // Fallback to direct WhatsApp link
                      window.open(whatsappLink, "_blank");
                    });
                } else {
                  // Fallback to direct WhatsApp link
                  window.open(whatsappLink, "_blank");
                }
              } else {
                // If blob creation fails, use text-only sharing
                window.open(whatsappLink, "_blank");
              }
            });
          })
          .catch((error) => {
            console.error("html2canvas error:", error);
            // Fallback if canvas generation fails
            window.open(whatsappLink, "_blank");
          });
      } else {
        // Fallback if ref is not available
        window.open(whatsappLink, "_blank");
      }
    } catch (error) {
      console.error("Share error:", error);
      // Ultimate fallback
      window.open(whatsappLink, "_blank");
    }
  };

  // Copy link to clipboard
  const copyLinkToClipboard = () => {
    navigator.clipboard.writeText(shareUrl).then(() => {
      alert("Challenge link copied to clipboard!");
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-accent">Challenge a Friend</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        {/* This div will be captured as an image - using standard colors instead of problematic gradients */}
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
              <h4 className="text-xl font-bold text-accent">Where Am I?</h4>
            </div>

            <span className="text-4xl mb-2">{emoji}</span>
            <p className="text-lg font-medium mb-2">{message}</p>

            <div className="score-display flex items-center justify-center w-24 h-24 rounded-full bg-accent-light mb-4">
              <span className="text-3xl font-bold text-accent">
                {score.correct}/{totalQuestions}
              </span>
            </div>

            {/* Show comparison if this was a response to a challenge */}
            {comparisonResult && (
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
                    I beat my friend`s score of {challengeInfo.score}/
                    {totalQuestions}!
                  </p>
                ) : comparisonResult.status === "loss" ? (
                  <p>
                    My friend scored {challengeInfo.score}/{totalQuestions}. Can
                    you beat us both?
                  </p>
                ) : (
                  <p>
                    I tied with my friend at {score.correct}/{totalQuestions}!
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
          >
            <Share className="w-5 h-5 mr-2" />
            Share on WhatsApp
          </StylizedButton>

          <StylizedButton
            variant="secondary"
            size="medium"
            fullWidth={true}
            onClick={copyLinkToClipboard}
          >
            Copy Challenge Link
          </StylizedButton>
        </div>
      </div>
    </div>
  );
};

export default SharePopup;

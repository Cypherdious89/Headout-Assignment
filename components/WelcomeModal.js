// /components/WelcomeModal.js
import React from "react";
import StylizedButton from "./StylizedButton";
import { Trophy, User } from "lucide-react";

const WelcomeModal = ({ onStart, challengeInfo }) => {
  return (
    <div className="modal-overlay">
      <div className="modal-content bg-white p-8 rounded-xl shadow-2xl backdrop-blur-lg">
        {/* Challenge info banner - show only when there's a challenge */}
        {challengeInfo && (
          <div className="mb-6 bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg border border-accent-light">
            <div className="flex items-center mb-2">
              <Trophy className="text-yellow-500 w-6 h-6 mr-2" />
              <h3 className="font-bold text-lg text-accent">
                You`ve Been Challenged!
              </h3>
            </div>

            <div className="flex items-center mb-3">
              <User className="text-accent w-5 h-5 mr-2" />
              <span className="font-medium">{challengeInfo.username}</span>
              <span className="mx-2 text-gray-500">•</span>
              <span className="font-bold text-accent">
                {challengeInfo.score}/10
              </span>
            </div>

            <p className="text-gray-700 text-sm">
              Beat their score to claim bragging rights!
            </p>
          </div>
        )}

        <div className="mb-6 text-center">
          <h1 className="text-4xl font-bold mb-2 text-accent">
            The Globetrotter Challenge
          </h1>
          <div className="h-1 w-24 mx-auto mb-4 bg-accent"></div>
        </div>

        <h4 className="text-lg mb-8 text-gray-700">
          The Ultimate Travel Guessing Game!
        </h4>

        <p className="text-lg mb-8 text-gray-700">
          Discover the hidden worlds around the globe, and guess where they
          are!🌎
        </p>

        <StylizedButton
          variant="rounded"
          size="large"
          fullWidth={true}
          onClick={onStart}
        >
          {challengeInfo ? "Accept Challenge!" : "Start Challenge!"}
        </StylizedButton>

        <p className="text-sm mt-5 text-gray-500">
          A web development challenge by Headout.
        </p>
      </div>
    </div>
  );
};

export default WelcomeModal;

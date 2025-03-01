// /components/FriendChallengeInfo.js
import React from "react";
import { Trophy, X, User } from "lucide-react";

const FriendChallengeInfo = ({ friendUsername, friendScore, onDismiss }) => {
  return (
    <div className="challenge-info-banner w-full max-w-6xl mb-4 mt-20">
      <div className="bg-gradient-to-r from-blue-100 to-purple-100 p-4 rounded-lg shadow-md relative">
        <button
          onClick={onDismiss}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
          aria-label="Dismiss challenge notification"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center">
          <Trophy className="text-yellow-500 w-8 h-8 mr-3" />
          <div>
            <div className="flex items-center mb-1">
              <h3 className="font-bold text-lg mr-2">Friend`s Challenge!</h3>
              {friendUsername && (
                <div className="flex items-center bg-white bg-opacity-70 px-3 py-1 rounded-full">
                  <User className="text-accent w-4 h-4 mr-1" />
                  <span className="font-medium text-accent text-sm">
                    {friendUsername}
                  </span>
                </div>
              )}
            </div>
            <p className="text-gray-700">
              {friendUsername
                ? `${friendUsername} scored`
                : "Your friend scored"}{" "}
              <span className="font-bold text-accent">{friendScore}/10</span>.
              Can you beat their score?
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FriendChallengeInfo;

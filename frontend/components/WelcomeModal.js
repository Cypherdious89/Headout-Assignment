// /components/WelcomeModal.js
import React from "react";
import StylizedButton from "./StylizedButton";

const WelcomeModal = ({ onStart }) => {
  return (
    <div className="modal-overlay">
      <div className="modal-content bg-white p-8 rounded-xl shadow-2xl backdrop-blur-lg">
        <div className="mb-6 text-center">
          <h1 className="text-4xl font-bold mb-2 text-accent">
            Destination Detective
          </h1>
          <div className="h-1 w-24 mx-auto mb-4 bg-accent"></div>
        </div>

        <p className="text-lg mb-8 text-gray-700">
          Test your geography knowledge with clues from famous destinations
          around the world. Can you guess where we are taking you?
        </p>

        <StylizedButton
          variant="rounded"
          size="large"
          fullWidth={true}
          onClick={onStart}
        >
          Lets Explore! 🌎
        </StylizedButton>
      </div>
    </div>
  );
};

export default WelcomeModal;

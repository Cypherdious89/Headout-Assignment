// /components/UsernameModal.js
import React, { useState, useEffect } from "react";
import StylizedButton from "./StylizedButton";

const UsernameModal = ({ onSubmit, onClose }) => {
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  const [isChecking, setIsChecking] = useState(false);
  const [isAvailable, setIsAvailable] = useState(null);

  // Check username availability after user stops typing
  useEffect(() => {
    if (!username) {
      setIsAvailable(null);
      setError("");
      return;
    }

    const checkUsername = async () => {
      if (username.length < 3) {
        setError("Username must be at least 3 characters");
        setIsAvailable(false);
        return;
      }

      if (!/^[a-zA-Z0-9_]+$/.test(username)) {
        setError("Only letters, numbers, and underscores allowed");
        setIsAvailable(false);
        return;
      }

      setIsChecking(true);
      setError("");

      try {
        const response = await fetch(
          `/api/users?username=${encodeURIComponent(username)}`
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
  }, [username]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!username || username.length < 3) {
      setError("Username must be at least 3 characters");
      return;
    }

    if (!isAvailable) {
      setError("Please choose a different username");
      return;
    }

    onSubmit(username);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-accent">Choose a Username</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <p className="text-gray-600 mb-4">
              Choose a unique username to challenge your friends. This will be
              visible to people you share your score with.
            </p>

            <label className="block text-sm font-medium text-gray-700 mb-2">
              Username
            </label>

            <div className="relative">
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="YourCoolUsername"
                className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 ${
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
                <div className="absolute right-3 top-3 text-green-500">✓</div>
              )}
            </div>

            {error && <p className="mt-2 text-sm text-red-600">{error}</p>}

            {isAvailable === true && (
              <p className="mt-2 text-sm text-green-600">
                Username is available
              </p>
            )}
          </div>

          <div className="flex gap-4">
            <StylizedButton
              variant="secondary"
              size="medium"
              fullWidth={true}
              onClick={onClose}
              type="button"
            >
              Cancel
            </StylizedButton>

            <StylizedButton
              variant="primary"
              size="medium"
              fullWidth={true}
              type="submit"
              disabled={!isAvailable || isChecking}
            >
              Confirm
            </StylizedButton>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UsernameModal;

# The Globetrotter Challenge

## Overview

The Globetrotter Challenge is an interactive geography quiz game where players test their knowledge by identifying cities based on clues. Players can compete with friends, challenge others, and improve their knowledge of global destinations.

## Features

- 🌍 **Geography Quiz**: Answer 10 questions by guessing the correct city.
- 🏆 **Challenge Friends**: Compare scores and invite friends to compete.
- 🎉 **Confetti Effects**: Celebrate correct answers with confetti animations.
- 📊 **Score Tracking**: Keep track of correct and incorrect answers.
- 🔥 **Fun Facts**: Learn fun facts about each location after every answer.
- 📤 **Social Sharing**: Share your score and challenge others via WhatsApp and other platforms.
- 🛠️ **MongoDB Integration**: Store player scores and challenge information securely.

## Live Demo

The Globetrotter Challenge is live at: [Headout Assignment](https://headout-assignment-sage.vercel.app/)

## Documentation

The Project Documentation is live at: [Assignment Documentation](https://globletrotter-webapp-documentation.netlify.app/)

## Installation & Setup

### Prerequisites

Ensure you have the following installed:

- Node.js (v16 or later)
- npm or yarn
- MongoDB database (local or cloud instance)

### Clone the Repository

```sh
git clone <repository-url>
cd globetrotter-challenge
```

### Install Dependencies

```sh
npm install
```

### Environment Variables

Create a `.env.local` file in the root directory and add the following:

```sh
MONGODB_URI=<your-mongodb-connection-string>
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### Start the Development Server

```sh
npm run dev
```

The application will be available at `http://localhost:3000`

## Project Structure

```
/components  # UI Components (Quiz, Modals, Buttons, etc.)
/pages       # Next.js Pages (API, Home, Game)
/styles      # Global and Component-based Styles
/lib         # Utility functions (MongoDB connection, etc.)
/pages/api   # API routes to fetch and insert data into MongoDB
```

### API Endpoints

- **`/pages/api/users.js`** - Handles user-related data operations.
- **`/pages/api/destination.js`** - Manages destination data for the quiz.
- **`/pages/api/challenges/[id].js`** - Fetches and updates challenge information.

## How to Play

1. Start the quiz and read the clues provided.
2. Select the correct city from the given options.
3. Get instant feedback and a fun fact about the destination.
4. Complete 10 questions and view your score.
5. Challenge a friend and try to beat their score!

## Technologies Used

- **Frontend**: Next.js, React, Tailwind CSS
- **Backend**: Node.js, MongoDB
- **Icons & Animations**: Lucide-react, Confetti.js
- **State Management**: React Hooks

## Contributing

1. Fork the repository.
2. Create a new branch (`feature/new-feature`)
3. Commit changes and push to the branch.
4. Open a pull request for review.

## License

This project is licensed under the MIT License.

## Acknowledgments

This project was developed as part of a web development challenge by Headout.

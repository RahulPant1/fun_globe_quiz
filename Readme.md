# Earth Explorer - A Geographic Adventure Game
An engaging educational web application designed to teach children (ages 8-12) geography through interactive exploration and gamified quizzes.
Project Overview
Earth Explorer features:

- A 3D interactive globe powered by CesiumJS
- Interactive pins marking various geographic locations
- AI-generated quiz questions using Google's Gemini API
- Zooming in on locations for visual exploration
- Score tracking over ten questions
- Fun facts about each location

Technical Implementation
Core Technologies:

- Frontend : React with Vite
- 3D Globe : CesiumJS
- Styling : Tailwind CSS
- AI Integration : Google Gemini API

Key Components:

- 3D Globe : An interactive CesiumJS globe with camera controls
- Location Pins : Clickable pins placed on 50+ famous locations around the world
- Quiz Interface : Multiple-choice questions about geographic locations
- Scoring System : Tracks progress through 10 questions
- Educational Content : AI-generated fun facts after answering questions

Setup Instructions
Prerequisites

Node.js (v14 or higher)
npm or yarn

Installation

Clone the repository:
git clone [repository-url]
cd fun_globe_quiz

Install dependencies:
npm install

Add a Cesium ion access token:

Create a free account at cesium.com
Obtain an access token
Create a .env file in the project root with:
VITE_GEMINI_API_KEY=your-api-key-here



Start the development server:
npm run dev

Open your browser to http://localhost:3000

Project Structure

fun_globe_quiz/
├── .env                         # Store API Key here (gitignored)
├── .gitignore                   # Ensures .env is not committed
├── index.html                   # Main HTML entry point
├── package.json                 # Project dependencies and scripts
├── vite.config.js               # Vite configuration with Cesium plugin
├── src/
│   ├── components/
│   │   ├── Globe.jsx            # CesiumJS globe implementation
│   │   ├── QuizPanel.jsx        # Panel for questions/answers/info
│   │   ├── LoadingScreen.jsx    # Loading screen component
│   │   ├── WelcomeScreen.jsx    # Welcome/instructions screen
│   │   ├── GameOverScreen.jsx   # End game results screen
│   │   └── Header.jsx           # Game header with score tracking
│   ├── data/
│   │   ├── allLocations.js      # 50 famous locations worldwide
│   │   └── mockLocations.js     # Sample location data for testing
│   ├── services/
│   │   └── geminiService.js     # Gemini API integration for quiz questions
│   ├── App.jsx                  # Main application component (state management)
│   ├── index.jsx                # React entry point
│   └── index.css                # Global styles with Tailwind


## How to Play
1. Click "Start Exploring" on the welcome screen
2. Click on any pin on the globe to select a location
3. Answer the geography question provided by the AI
4. Learn interesting facts about the location
5. Continue exploring and answering questions
6. Complete 10 questions to finish the game and see your score
## Features
- Interactive 3D Globe : Explore the world in a visually engaging way
- AI-Generated Questions : Unique questions for each location using Google's Gemini API
- Educational Content : Learn interesting facts about global landmarks
- Responsive Design : Works on desktop and tablet devices
- Engaging UI : Clean, intuitive interface with Tailwind CSS styling


Future Enhancements

Multiple difficulty levels
Expanded content (more locations, question types)
Leaderboards
User profiles
More detailed educational content

## Development
This project uses:

- Vite for fast development and optimized builds
- React for UI components
- CesiumJS for 3D globe visualization
- Tailwind CSS for styling
- Google Gemini API for AI-generated quiz content

License
[License information would go here]
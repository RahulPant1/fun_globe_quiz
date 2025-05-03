// src/App.jsx (With Overlay Layout Implemented)
import React, { useState, useEffect, useCallback } from "react";
import Globe from "./components/Globe";
import QuizPanel from "./components/QuizPanel";
import LoadingScreen from "./components/LoadingScreen";
import WelcomeScreen from "./components/WelcomeScreen";
import GameOverScreen from "./components/GameOverScreen";
import Header from "./components/Header";
// Import the full list of locations instead of mockLocations
import { allLocations } from './data/allLocations'; // <--- CHANGE HERE
import { generateQuizQuestion } from './services/geminiService';
import { Camera } from 'lucide-react';

const TOTAL_QUESTIONS = 10;
const PINS_TO_DISPLAY = 15; // Define how many pins to show

// Helper function to shuffle an array and take the first N items
function getRandomSubset(array, size) {
  const shuffled = array.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, size);
}

export default function App() {
  // --- State variables ---
  const [isInitializing, setIsInitializing] = useState(true);
  const [showWelcome, setShowWelcome] = useState(true);
  // New state for the currently displayed locations
  const [displayedLocations, setDisplayedLocations] = useState([]); // <--- ADD THIS STATE
  const [score, setScore] = useState(0);
  const [questionCount, setQuestionCount] = useState(0);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [isFetchingQuestion, setIsFetchingQuestion] = useState(false);
  const [fetchError, setFetchError] = useState(null);
  const [userAnswer, setUserAnswer] = useState("");
  const [answered, setAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [funFact, setFunFact] = useState("");
  const [tookSnapshot, setTookSnapshot] = useState(false);

  // --- Hooks and handlers ---
  useEffect(() => {
    // Simulate initial loading
    const timer = setTimeout(() => {
      setIsInitializing(false);
      // Set initial random locations when loading finishes if not showing welcome
      if (!showWelcome) {
         setDisplayedLocations(getRandomSubset(allLocations, PINS_TO_DISPLAY));
      }
    }, 2500);
    return () => clearTimeout(timer);
  }, [showWelcome]); // Re-run if showWelcome changes

  const handleStartGame = () => {
    setShowWelcome(false);
    resetGame(); // Reset game state when starting, which now includes setting locations
  };

  // Fetch question from Gemini API
  const fetchQuestion = async (location) => {
    if (!location) return;
    setIsFetchingQuestion(true);
    setFetchError(null);
    setCurrentQuestion(null); // Clear previous question
    try {
        const questionData = await generateQuizQuestion(location.name, location.country);
        setCurrentQuestion(questionData);
        setFunFact(questionData.funFact); // Store fun fact immediately
    } catch (error) {
        console.error("Failed to fetch question:", error);
        // Display the error message from the service
        setFetchError(error.message || "Could not load question.");
    } finally {
        setIsFetchingQuestion(false);
    }
  };

  // Handle location selection (called by Globe component)
  const handleLocationClick = useCallback((location) => {
    // Allow clicking only if game active, no location already selected, and not fetching
    if (!gameOver && !selectedLocation && !showWelcome && !isFetchingQuestion) {
        console.log("App received location click:", location);
        setSelectedLocation(location); // Set selected location to show panel & trigger flyTo in Globe
        // Reset quiz state for the new location
        setUserAnswer("");
        setAnswered(false);
        setIsCorrect(false);
        setFunFact("");
        setFetchError(null); // Clear previous errors
        // Fetch a new question
        fetchQuestion(location);
    }
  }, [gameOver, selectedLocation, showWelcome, isFetchingQuestion]); // Dependencies for useCallback

  // Handle answer submission
  const handleAnswerSubmit = () => {
     if (!answered && selectedLocation && currentQuestion && !isFetchingQuestion && !fetchError) {
      setAnswered(true);
      // Increment question count only when an answer is submitted
      setQuestionCount(prevCount => prevCount + 1);
      const correct = userAnswer === currentQuestion.correctAnswer;
      setIsCorrect(correct);
      if (correct) {
        setScore(prevScore => prevScore + 1);
      }
      // Fun fact should already be set from fetchQuestion
    }
  };

  // Handle taking a snapshot
  const handleTakeSnapshot = () => {
     setTookSnapshot(true);
     setTimeout(() => setTookSnapshot(false), 2000); // Hide notification after 2s
     console.log("Snapshot button clicked - Implement actual snapshot logic if needed");
  };

  // Handle next question or game end
  const handleNextQuestion = () => {
       // Check if the current question count has reached the total
       if (questionCount >= TOTAL_QUESTIONS) {
         setGameOver(true); // End the game
       } else {
         // Reset for the next location/question
         setSelectedLocation(null); // This will hide the QuizPanel and trigger flyHome in Globe
         setCurrentQuestion(null);
         setUserAnswer("");
         setAnswered(false);
         setIsCorrect(false);
         setFunFact("");
         setFetchError(null);
         setIsFetchingQuestion(false);
         setTookSnapshot(false); // Reset snapshot state if needed
       }
  };

   // Reset game state completely
   const resetGame = () => {
     setIsInitializing(false);
     setShowWelcome(false);
     setScore(0);
     setQuestionCount(0);
     setSelectedLocation(null);
     setCurrentQuestion(null);
     setUserAnswer("");
     setAnswered(false);
     setIsCorrect(false);
     setGameOver(false);
     setFunFact("");
     setFetchError(null);
     setIsFetchingQuestion(false);
     setTookSnapshot(false);
     // Select and set the random locations for this game round
     setDisplayedLocations(getRandomSubset(allLocations, PINS_TO_DISPLAY)); // <--- ADD THIS LINE
   };

  // Handle restart from Game Over screen
  const handleRestart = () => {
      resetGame(); // This will now also pick a new set of random locations
  };

  // NEW: Handler for clicking the globe background
  const handleBackgroundClick = () => {
    console.log("App: Handling background click, resetting selected location.");
    setSelectedLocation(null); // Setting this to null will trigger flyHome in Globe
    // Optionally reset other quiz-related states if the panel should hide immediately
    // setCurrentQuestion(null);
    // setAnswered(false);
    // setUserAnswer("");
    // setFetchError(null);
    // setIsFetchingQuestion(false);
  };


  // --- JSX RETURN STRUCTURE FOR OVERLAY LAYOUT ---
  return (
    // Outermost container: Full screen, vertical flex column
    <div className="h-screen w-screen flex flex-col bg-gray-50 overflow-hidden">
      {/* Conditional Screens: Loading, Welcome, Game Over */}
      {isInitializing && <LoadingScreen message="Initializing Earth Explorer..." />}
      {!isInitializing && showWelcome && <WelcomeScreen onStartGame={handleStartGame} />}
      {gameOver && <GameOverScreen score={score} totalQuestions={TOTAL_QUESTIONS} onRestart={handleRestart} />}

      {/* Main Game UI: Rendered only when game is active */}
      {!isInitializing && !showWelcome && !gameOver && ( // Added !gameOver condition here
          <>
              {/* Header: Displays score and question count */}
              <Header
                  score={score}
                  questionCount={questionCount}
                  totalQuestions={TOTAL_QUESTIONS}
                  gameOver={gameOver} // Pass gameOver to potentially hide progress when game ends
              />
              {/* Main Content Area: Takes remaining space, positioned relatively */}
              <div className="flex-grow relative overflow-hidden"> {/* Relative positioning for absolute children */}

                   {/* Globe Container: Fills the Main Content Area absolutely */}
                  <div className="absolute inset-0"> {/* Fills parent using absolute positioning */}
                      <Globe
                          locations={displayedLocations} // <--- CHANGE HERE: Pass the random subset
                          selectedLocation={selectedLocation}
                          onLocationClick={handleLocationClick}
                          onBackgroundClick={handleBackgroundClick}
                      />
                  </div>

                  {/* Snapshot Button & Notification: Overlays the globe */}
                  {selectedLocation && !isFetchingQuestion && !fetchError && ( // Show only when location selected and not fetching/error
                    <button
                      className="absolute bottom-4 right-4 md:bottom-8 md:right-8 bg-white p-2 md:p-3 rounded-full shadow-lg hover:bg-gray-100 transition-colors z-20" // z-index 20
                      title="Take a snapshot"
                      onClick={handleTakeSnapshot}
                    >
                      <Camera size={20} md:size={24} className="text-blue-600" />
                    </button>
                  )}
                  {tookSnapshot && (
                      <div className="absolute top-4 right-4 bg-black bg-opacity-70 text-white px-4 py-2 rounded animate-fade-out z-30"> {/* z-index 30 */}
                        Snapshot taken!
                      </div>
                  )}

                  {/* Quiz Panel Container: Overlays the globe, appears conditionally */}
                  {selectedLocation && ( // Render this div *only* if a location is selected
                    // Absolute positioning with fixed height and proper overflow
                    <div className="absolute top-4 right-4 z-50 w-full max-w-sm md:max-w-md bg-white rounded-lg shadow-xl"
                         style={{ maxHeight: '80vh' }}> {/* Set a fixed percentage of viewport height */}
                        <div className="h-full overflow-y-auto p-4"> {/* Set height to 100% of parent */}
                            <QuizPanel
                                selectedLocation={selectedLocation}
                                currentQuestion={currentQuestion}
                                userAnswer={userAnswer}
                                onAnswerChange={setUserAnswer}
                                onAnswerSubmit={handleAnswerSubmit}
                                answered={answered}
                                isCorrect={isCorrect}
                                funFact={funFact}
                                onNextQuestion={handleNextQuestion}
                                questionCount={questionCount}
                                totalQuestions={TOTAL_QUESTIONS}
                                isFetchingQuestion={isFetchingQuestion}
                                fetchError={fetchError}
                            />
                        </div>
                    </div>
                  )}
              </div>
          </>
      )}
    </div>
  );
}
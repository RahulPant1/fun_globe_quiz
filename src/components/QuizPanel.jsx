// src/components/QuizPanel.jsx
import React from 'react';

const QuizPanel = ({
  selectedLocation,
  currentQuestion,
  userAnswer,
  onAnswerChange,
  onAnswerSubmit,
  answered,
  isCorrect,
  funFact,
  onNextQuestion,
  questionCount,
  totalQuestions = 10, // Default total
  isFetchingQuestion, // New prop for loading state
  fetchError        // New prop for error message
}) => {

  if (!selectedLocation) {
    return (
      <div className="w-full md:w-1/3 bg-white p-4 overflow-y-auto shadow-lg flex flex-col items-center justify-center text-center">
        <div className="mb-4">
          <div className="mx-auto h-16 w-16 text-blue-600 opacity-50">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064" />
                <circle cx="12" cy="12" r="10" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} />
              </svg>
          </div>
        </div>
        <h3 className="text-lg font-bold mb-2">Choose a Location</h3>
        <p className="text-gray-600">Click on any pin on the globe to start exploring and answer geography questions!</p>
      </div>
    );
  }

  return (
    <div className="w-full md:w-1/3 bg-white p-4 overflow-y-auto shadow-lg">
      <div>
        <h2 className="text-xl font-bold mb-2">
          {selectedLocation.name}, {selectedLocation.country}
        </h2>

        {/* Loading indicator for question */}
        {isFetchingQuestion && (
          <div className="flex items-center justify-center my-6 bg-blue-50 p-4 rounded-lg">
             <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mr-3"></div>
             <span>Generating question...</span>
          </div>
        )}

        {/* Error message display */}
         {fetchError && !isFetchingQuestion && (
            <div className="my-6 bg-red-100 p-4 rounded-lg text-red-700">
                <p className="font-bold">Oops!</p>
                <p>{fetchError}</p>
                 <button
                    className="mt-2 text-sm text-blue-600 hover:underline"
                    onClick={onNextQuestion} // Allow skipping if error occurs
                >
                    Skip this location
                </button>
            </div>
         )}


        {/* Question display */}
        {currentQuestion && !isFetchingQuestion && !fetchError && (
          <div className="mb-6 bg-blue-50 p-4 rounded-lg">
            <h3 className="font-bold mb-2">Question {questionCount} of {totalQuestions}:</h3>
            <p className="text-lg">{currentQuestion.questionText}</p>
          </div>
        )}

        {/* Answer/Feedback Section */}
        {currentQuestion && !isFetchingQuestion && !fetchError && (
          <div>
            {!answered ? (
              <div>
                {/* Answer Options */}
                <div className="mb-4">
                  {currentQuestion.options && currentQuestion.options.map((option, index) => (
                    <div key={index} className="mb-2">
                      <label className={`flex items-center cursor-pointer p-2 rounded transition-colors ${
                          userAnswer === option ? 'bg-blue-100' : 'hover:bg-gray-100'
                      }`}>
                        <input
                          type="radio"
                          name="answer"
                          value={option}
                          checked={userAnswer === option}
                          onChange={() => onAnswerChange(option)}
                          className="mr-2 accent-blue-600" // Style the radio button
                        />
                        {option}
                      </label>
                    </div>
                  ))}
                </div>
                {/* Submit Button */}
                <button
                  className="bg-blue-600 text-white px-4 py-2 rounded w-full disabled:bg-gray-400 hover:bg-blue-700 transition-colors"
                  onClick={onAnswerSubmit}
                  disabled={!userAnswer}
                >
                  Submit Answer
                </button>
              </div>
            ) : (
              <div>
                {/* Feedback */}
                <div className={`p-4 mb-4 rounded-lg ${
                  isCorrect ? "bg-green-100" : "bg-red-100"
                }`}>
                  {isCorrect ? (
                    <p className="text-green-700 font-bold">Correct! Great job!</p>
                  ) : (
                    <div>
                      <p className="text-red-700 font-bold">Not quite right.</p>
                      <p className="mt-1">The correct answer is: {currentQuestion.correctAnswer}</p>
                    </div>
                  )}
                </div>

                {/* Fun Fact */}
                {funFact && (
                  <div className="bg-yellow-50 p-4 rounded-lg mb-4">
                    <h3 className="font-bold mb-1">Fun Fact:</h3>
                    <p>{funFact}</p>
                  </div>
                )}

                {/* Next Button */}
                <button
                  className="bg-blue-600 text-white px-4 py-2 rounded w-full hover:bg-blue-700 transition-colors"
                  onClick={onNextQuestion}
                >
                  {questionCount >= totalQuestions ? "See Final Score" : "Next Location"}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default QuizPanel;
// src/components/Header.js
import React from 'react';

const Header = ({ score, questionCount, totalQuestions = 10, gameOver }) => {
  const displayQuestionCount = Math.min(questionCount, totalQuestions);

  return (
    <header className="bg-blue-600 text-white p-4 z-10 shadow-md">
      <div className="container mx-auto flex flex-wrap justify-between items-center">
        <h1 className="text-xl sm:text-2xl font-bold mb-2 sm:mb-0">Earth Explorer</h1>
        <div className="flex items-center space-x-2 sm:space-x-4">
          <div className="bg-blue-800 px-3 py-1 sm:px-4 sm:py-2 rounded-lg flex items-center text-sm sm:text-base">
            <span className="mr-1 sm:mr-2">Score:</span>
            <span className="font-bold">{score}</span>
            {/* Show total only when game started */}
            {questionCount > 0 && !gameOver && <span> / {displayQuestionCount}</span>}
          </div>
          {!gameOver && questionCount > 0 && (
            <div className="bg-blue-800 px-3 py-1 sm:px-4 sm:py-2 rounded-lg text-sm sm:text-base">
              Question: {displayQuestionCount} / {totalQuestions}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
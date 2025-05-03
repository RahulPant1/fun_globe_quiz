// src/components/GameOverScreen.js
import React from 'react';

const GameOverScreen = ({ score, totalQuestions, onRestart }) => (
    <div className="absolute inset-0 flex items-center justify-center bg-blue-600 bg-opacity-75 z-40">
    <div className="bg-white p-8 rounded-lg shadow-lg text-center max-w-lg">
      <h1 className="text-3xl font-bold mb-4">Adventure Complete!</h1>

      <div className="mb-6">
        <p className="text-2xl mb-2">Your Score:</p>
        <p className="text-4xl font-bold">{score} / {totalQuestions}</p>
      </div>

      {/* Score feedback messages */}
      {score === totalQuestions && (
        <div className="mb-6 bg-green-50 p-4 rounded-lg">
          <p className="text-green-700 font-bold text-xl">Perfect Score!</p>
          <p>You're a geography expert! Amazing job!</p>
        </div>
      )}
      {score >= Math.floor(totalQuestions * 0.7) && score < totalQuestions && (
        <div className="mb-6 bg-blue-50 p-4 rounded-lg">
          <p className="text-blue-700 font-bold text-xl">Great Job!</p>
          <p>You have excellent geography knowledge!</p>
        </div>
      )}
       {score >= Math.floor(totalQuestions * 0.4) && score < Math.floor(totalQuestions * 0.7) && (
        <div className="mb-6 bg-yellow-50 p-4 rounded-lg">
          <p className="text-yellow-700 font-bold text-xl">Good Effort!</p>
          <p>Keep exploring to learn more about our world!</p>
        </div>
      )}
      {score < Math.floor(totalQuestions * 0.4) && (
        <div className="mb-6 bg-orange-50 p-4 rounded-lg">
          <p className="text-orange-700 font-bold text-xl">Keep Learning!</p>
          <p>The world is full of fascinating places to discover!</p>
        </div>
      )}

      <button
        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg text-lg"
        onClick={onRestart}
      >
        Play Again
      </button>
    </div>
  </div>
);

export default GameOverScreen;
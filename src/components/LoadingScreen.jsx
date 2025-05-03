// src/components/LoadingScreen.js
import React from 'react';

const LoadingScreen = ({ message = "Loading Earth Explorer" }) => (
  <div className="absolute inset-0 flex items-center justify-center bg-blue-600 bg-opacity-50 z-50">
    <div className="bg-white p-8 rounded-lg shadow-lg text-center">
      <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
      <h2 className="text-xl font-bold mb-2">{message}</h2>
      <p>Please wait...</p>
    </div>
  </div>
);

export default LoadingScreen;
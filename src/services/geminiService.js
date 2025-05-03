// src/services/geminiService.js
import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from "@google/generative-ai";

// --- Use Vite's way to access environment variables ---
// Ensure your .env file variable starts with VITE_
// Example: VITE_GEMINI_API_KEY=YOUR_KEY_HERE
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
// --- End Vite specific change ---

if (!API_KEY) {
    // --- Updated Error Message for Vite ---
    console.error("Gemini API Key not found. Please ensure VITE_GEMINI_API_KEY is set in your .env file.");
    // Optionally throw an error to halt execution if the key is critical
    throw new Error("VITE_GEMINI_API_KEY is missing in the environment configuration.");
    // --- End Updated Error Message ---
}

const genAI = new GoogleGenerativeAI(API_KEY);

const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash", // Or "gemini-pro" etc.
  safetySettings: [
    { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
    { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
    { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
    { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
  ],
  generationConfig: {
    // temperature: 0.7, // Example: Adjust creativity
    // maxOutputTokens: 500, // Example: Limit response size
  }
});

export const generateQuizQuestion = async (locationName, countryName) => {
  // --- Keep prompt clear and specific ---
  const prompt = `
    Generate a multiple-choice geography quiz question suitable for a 10-year-old about ${locationName}, ${countryName}.
    The question should be engaging and related to a well-known landmark, feature, or cultural aspect of the location.

    Provide the response ONLY as a valid JSON object with the following structure and keys:
    {
      "questionText": "string",
      "options": ["string", "string", "string", "string"],
      "correctAnswer": "string",
      "funFact": "string"
    }

    Ensure the "options" array has exactly 4 unique strings.
    Ensure "correctAnswer" exactly matches one of the strings in the "options" array.
    Ensure "funFact" is a short (1-2 sentences), interesting, and kid-friendly fact about ${locationName}.

    Example for London, England:
    {
      "questionText": "What famous clock tower is located in London, England?",
      "options": ["Eiffel Tower", "Big Ben", "Leaning Tower of Pisa", "Empire State Building"],
      "correctAnswer": "Big Ben",
      "funFact": "Big Ben is actually the nickname for the Great Bell inside the clock tower, not the tower itself!"
    }

    Generate the JSON for ${locationName}, ${countryName}:
  `;
  // --- End prompt ---

  let rawResponseText = ''; // Variable to store raw text for error reporting

  try {
    console.log("Sending prompt to Gemini for:", `${locationName}, ${countryName}`);
    const result = await model.generateContent(prompt);
    const response = result.response;

    // Check for blocked responses or missing text function early
    if (!response || typeof response.text !== 'function') {
        console.error("Invalid response structure received from Gemini:", response);
        throw new Error("Received an unexpected response format from the AI service.");
    }

    rawResponseText = response.text(); // Store raw text before cleaning
    console.log("Raw response from Gemini:", rawResponseText);

    // --- Robust JSON Cleaning ---
    // Remove optional ```json prefix and ``` suffix, handling potential whitespace and newlines
    const jsonRegex = /^```json\s*([\s\S]*?)\s*```$/; // Regex to capture content within fences
    let cleanedText = rawResponseText.trim(); // Start with trimmed text

    const match = cleanedText.match(jsonRegex);
    if (match && match[1]) {
        // If fences are found, use the captured content
        cleanedText = match[1].trim();
        console.log("Cleaned text (fences removed):", cleanedText);
    } else {
        // If no fences, log that we are proceeding without fence removal
        console.log("Cleaned text (no fences found, just trimmed):", cleanedText);
    }
    // --- End Robust JSON Cleaning ---

    // Attempt to parse the cleaned text as JSON
    const questionData = JSON.parse(cleanedText);

    // --- Enhanced Validation ---
    let validationError = null;
    if (!questionData) {
        validationError = "Parsed data is null or undefined.";
    } else if (typeof questionData.questionText !== 'string' || !questionData.questionText) {
        validationError = "Missing or invalid 'questionText'.";
    } else if (!Array.isArray(questionData.options) || questionData.options.length !== 4) {
        validationError = `Invalid 'options' array (length should be 4, found ${questionData.options?.length}).`;
    } else if (questionData.options.some(opt => typeof opt !== 'string' || !opt)) {
        validationError = "One or more options in the 'options' array are invalid.";
    } else if (typeof questionData.correctAnswer !== 'string' || !questionData.correctAnswer) {
        validationError = "Missing or invalid 'correctAnswer'.";
    } else if (!questionData.options.includes(questionData.correctAnswer)) {
        validationError = "'correctAnswer' does not match any of the provided options.";
    } else if (typeof questionData.funFact !== 'string' || !questionData.funFact) {
        validationError = "Missing or invalid 'funFact'.";
    }

    if (validationError) {
        console.error("Invalid JSON structure or content:", validationError, questionData);
        throw new Error(`Received invalid data structure from AI: ${validationError}`);
    }
    // --- End Enhanced Validation ---

    console.log("Parsed Question Data:", questionData);
    return questionData;

  } catch (error) {
    console.error("Error in generateQuizQuestion:", error); // Log the caught error object

    // Improve error messages based on error type
    if (error instanceof SyntaxError) {
         // Provide more context for parsing errors
         return Promise.reject(new Error(`Failed to parse AI response as JSON. Please check the format. Raw response started with: ${rawResponseText.substring(0, 100)}...`));
    }
    // Check for specific Gemini API error messages (e.g., safety blocks)
    // Note: Error structure from the SDK might vary, adjust checks as needed
    if (error.message && error.message.includes("response was blocked")) {
         return Promise.reject(new Error("The AI couldn't generate a question due to safety filters. Try a different location."));
    }
    if (error.message && error.message.includes("API key not valid")) {
        return Promise.reject(new Error("Invalid Gemini API Key. Please check your .env file (VITE_GEMINI_API_KEY)."));
   }

   // Rethrow other errors or return a generic failure message
    // Use Promise.reject to ensure the calling function handles it as a failed promise
    return Promise.reject(new Error("Could not generate quiz question. An unexpected error occurred."));
  }
};
import OpenAI from "openai";

// 1. Get the API key from environment variables
const OPENROUTER_API_KEY = import.meta.env.VITE_AI_API_KEY;

if (!OPENROUTER_API_KEY) {
    throw new Error("VITE_AI_API_KEY is not set in your .env file for OpenRouter.");
}

// 2. Configure the OpenAI client to point to OpenRouter's servers
const openai = new OpenAI({
    baseURL: "https://openrouter.ai/api/v1",
    apiKey: OPENROUTER_API_KEY,
    dangerouslyAllowBrowser: true, // This is required for client-side usage
});

// 3. Define the chatbot's persona and knowledge base (same as before)
const SYSTEM_INSTRUCTION = `
You are "Ryde", a friendly and helpful AI assistant for the "Dynamic Ride Sharing" web platform.
Your primary goal is to answer user questions about using the platform.
Your tone must be encouraging and simple.
If a user asks a question unrelated to the ride-sharing platform, you must politely refuse to answer and guide them back to the platform's features.

Here is the essential information about the platform:
- Roles: Users can be a 'Passenger' or a 'Driver'.
- Registration & Login: Users can register and log in for their specific roles.
- Booking (Passengers): Passengers search for rides, book them, and pay securely online.
- Posting Rides (Drivers): Drivers post their rides, including route, date, and price.
- Reviews: A mutual review system exists for drivers and passengers after a ride is complete.
- Notifications: The platform has both email and in-app notifications for key events.
- Admin Panel: A secure dashboard exists for platform management.
`;

/**
 * Sends a user's query to a free model via OpenRouter and returns the response.
 * @param {string} userQuery - The user's question.
 * @returns {Promise<string>} The AI-generated response.
 */
export async function runChat(userQuery) {
    try {
        const completion = await openai.chat.completions.create({
            // 4. We use a message-based format, which is standard
            messages: [
                { role: "system", content: SYSTEM_INSTRUCTION },
                { role: "user", content: userQuery },
            ],
            // 5. This specifies which free model to use. Mistral is excellent.
            // You can swap this with other free models like "google/gemini-flash-1.5"
            model: "mistralai/mistral-7b-instruct:free", 
        });

        const response = completion.choices[0]?.message?.content;
        
        if (!response) {
            throw new Error("Received an empty response from the AI model.");
        }

        return response.trim();

    } catch (error) {
        console.error("OpenRouter API Error:", error);
        return "I'm sorry, I'm having trouble connecting to my AI brain. Please check the developer console for more details.";
    }
}
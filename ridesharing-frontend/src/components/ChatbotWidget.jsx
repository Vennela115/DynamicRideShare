import React, { useState } from 'react';
import { FiMessageSquare, FiX, FiSend, FiCpu } from 'react-icons/fi';
import { runChat } from '../services/aiChatService';
import { FaRobot } from "react-icons/fa";
// --- Main Chat Window Component ---
const Chatbot = ({ onClose }) => {
    const [messages, setMessages] = useState([
        { id: 1, text: "Hello! I'm Ryde, your AI assistant. How can I help you with our ride-sharing platform today?", sender: 'ai' }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        const userMessage = { id: Date.now(), text: input, sender: 'user' };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        try {
            const aiResponseText = await runChat(input);
            const aiMessage = { id: Date.now() + 1, text: aiResponseText, sender: 'ai' };
            setMessages(prev => [...prev, aiMessage]);
        } catch (error) {
             const errorMessage = { id: Date.now() + 1, text: "Sorry, I'm having trouble connecting.", sender: 'ai' };
             setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed bottom-24 right-4 sm:right-8 w-[calc(100%-2rem)] max-w-sm h-[70vh] max-h-[600px] bg-white rounded-2xl shadow-2xl flex flex-col animate-slideUp">
            {/* Header */}
            <div className="flex items-center justify-between p-4 bg-indigo-600 text-white rounded-t-2xl">
                <div className="flex items-center space-x-3">
                    <FiCpu size={24} />
                    <h3 className="font-bold text-lg">Ryde - AI Assistant</h3>
                </div>
                <button onClick={onClose} className="p-1 rounded-full hover:bg-white/20"><FiX size={20} /></button>
            </div>
            {/* Message Area */}
            <div className="flex-1 p-4 overflow-y-auto">
                <div className="space-y-4">
                    {messages.map((msg) => (
                        <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`px-4 py-2 rounded-xl max-w-xs ${
                                msg.sender === 'user' ? 'bg-indigo-500 text-white' : 'bg-slate-100 text-slate-800'
                            }`}>
                                {msg.text}
                            </div>
                        </div>
                    ))}
                    {isLoading && (
                        <div className="flex justify-start">
                            <div className="px-4 py-2 rounded-xl bg-slate-100 text-slate-800 animate-pulse">Thinking...</div>
                        </div>
                    )}
                </div>
            </div>
            {/* Input Form */}
            <form onSubmit={handleSend} className="p-4 border-t flex items-center">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ask a question..."
                    className="flex-1 px-4 py-2 border rounded-full focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
                <button type="submit" className="ml-3 p-3 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 disabled:opacity-50" disabled={isLoading}>
                    <FiSend />
                </button>
            </form>
        </div>
    );
};


// --- Floating Widget Button ---
export default function ChatbotWidget() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div>
            {/* The main chat window, conditionally rendered */}
            {isOpen && <Chatbot onClose={() => setIsOpen(false)} />}
            
            {/* The floating button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="fixed bottom-6 right-6 sm:right-8 bg-indigo-600 text-white p-4 rounded-full shadow-lg hover:bg-indigo-700 transition-transform hover:scale-110"
                aria-label="Toggle Chatbot"
            >
                {isOpen ? <FiX size={24} /> : <FaRobot size={24} />}
            </button>
        </div>
    );
}

// Add this animation to your index.css
/*
@keyframes slideUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-slideUp {
  animation: slideUp 0.3s ease-out forwards;
}
*/

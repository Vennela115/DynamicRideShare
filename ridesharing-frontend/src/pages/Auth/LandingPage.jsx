import React from "react";
import { useNavigate } from "react-router-dom";
// We'll use icons from two popular sets within react-icons
import { FiUser } from "react-icons/fi"; // A clean icon for the passenger
import { FaTaxi } from "react-icons/fa6"; // A perfect icon for the driver

/**
 * A reusable, beautifully styled card for role selection.
 * @param {object} props
 * @param {React.ReactNode} props.icon - The icon component to display.
 * @param {string} props.title - The main title of the card.
 * @param {string} props.description - The descriptive text.
 * @param {() => void} props.onLogin - Function to call on login button click.
 * @param {() => void} props.onRegister - Function to call on register button click.
 * @param {'indigo' | 'green'} props.colorScheme - The color theme for the card.
 */
const RoleCard = ({ icon, title, description, onLogin, onRegister, colorScheme }) => {
    const colors = {
        indigo: {
            bg: 'bg-indigo-500',
            iconText: 'text-indigo-100',
            primaryButton: 'bg-indigo-600 hover:bg-indigo-700 text-white',
            secondaryButton: 'bg-indigo-100 hover:bg-indigo-200 text-indigo-700',
        },
        green: {
            bg: 'bg-green-500',
            iconText: 'text-green-100',
            primaryButton: 'bg-green-600 hover:bg-green-700 text-white',
            secondaryButton: 'bg-green-100 hover:bg-green-200 text-green-700',
        },
    };
    const theme = colors[colorScheme] || colors.indigo;

    return (
        <div className="bg-white rounded-2xl shadow-lg p-8 text-center transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 border border-slate-200">
            <div className={`mx-auto rounded-full h-24 w-24 flex items-center justify-center mb-6 ${theme.bg}`}>
                {icon}
            </div>
            <h2 className="text-3xl font-bold text-slate-800 mb-3">{title}</h2>
            <p className="text-slate-500 mb-8 px-4 min-h-[48px]">
                {description}
            </p>
            <div className="flex flex-col gap-4">
                <button
                    onClick={onLogin}
                    className={`w-full py-3 font-semibold rounded-lg transition-colors ${theme.primaryButton}`}
                >
                    Login
                </button>
                <button
                    onClick={onRegister}
                    className={`w-full py-3 font-semibold rounded-lg transition-colors ${theme.secondaryButton}`}
                >
                    Register
                </button>
            </div>
        </div>
    );
};


const LandingPage = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen flex flex-col items-center justify-center px-4 py-10 bg-slate-50">
            <div className="text-center mb-12">
                <h1 className="text-4xl md:text-5xl font-bold text-slate-800">
                    Welcome to Dynamic Ride Sharing
                </h1>
                <p className="text-slate-500 text-lg md:text-xl mt-3">
                    Your journey, your way. Choose a role to get started.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl">
                {/* Passenger Card */}
                <RoleCard
                    icon={<FiUser size={48} className="text-indigo-100" />}
                    title="I'm a Passenger"
                    description="Find and book affordable rides with verified drivers in minutes."
                    onLogin={() => navigate("/passenger/login")}
                    onRegister={() => navigate("/passenger/register")}
                    colorScheme="indigo"
                />

                {/* Driver Card */}
                <RoleCard
                    icon={<FaTaxi size={48} className="text-green-100" />}
                    title="I'm a Driver"
                    description="Share your ride, cover your costs, and meet new people."
                    onLogin={() => navigate("/driver/login")}
                    onRegister={() => navigate("/driver/register")}
                    colorScheme="green"
                />
            </div>
        </div>
    );
};

export default LandingPage;

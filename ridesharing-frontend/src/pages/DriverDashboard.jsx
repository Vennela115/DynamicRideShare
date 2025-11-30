import useAuth from "../hooks/useAuth";
import { Link, useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { FaStar, FaUsers } from 'react-icons/fa';
import API from '../services/api';

/**
 * A small component to display a single rating stat.
 * It's designed to fit seamlessly into your existing dashboard card.
 */
const RatingStat = ({ icon, label, value, loading }) => (
    <div className="text-center">
        <div className="p-3 bg-white/20 rounded-full inline-block">
            {icon}
        </div>
        <p className="mt-2 text-2xl font-bold text-white">
            {loading ? '...' : value}
        </p>
        <p className="text-xs text-white/80 uppercase tracking-wider">{label}</p>
    </div>
);

export default function DriverDashboard() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    
    // --- NEW STATE FOR STATS ---
    const [stats, setStats] = useState({ averageRating: 0, reviewCount: 0 });
    const [loadingStats, setLoadingStats] = useState(true);

    // --- NEW useEffect TO FETCH STATS ---
    useEffect(() => {
        const fetchStats = async () => {
            setLoadingStats(true);
            try {
                // This API endpoint returns { averageRating: 4.5, reviewCount: 12 }
                const { data } = await API.get('/rides/driver/stats');
                setStats(data);
            } catch (error) {
                console.error("Failed to fetch driver stats:", error);
            } finally {
                setLoadingStats(false);
            }
        };

        fetchStats();
    }, []); // Empty dependency array means this runs once when the component mounts

    const handleLogout = () => {
        logout();
        navigate("/");
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-green-100 to-green-200 px-4 py-10 relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 pointer-events-none"></div>

            <div className="bg-gradient-to-br from-green-500 to-green-400 shadow-2xl rounded-3xl p-8 md:p-10 flex flex-col items-center text-center transform transition-all duration-500 hover:scale-105 w-full max-w-md">
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">
                    Driver Dashboard
                </h2>
                <p className="text-white/90 text-lg md:text-xl mb-6">
                    Welcome, {user?.name || user?.email}
                </p>

                {/* --- NEW STATISTICS SECTION --- */}
                <div className="w-full bg-black/10 rounded-xl p-4 mb-6 grid grid-cols-2 gap-4">
                    <RatingStat
                        icon={<FaStar size={24} className="text-white" />}
                        label="Your Rating"
                        value={stats.averageRating > 0 ? stats.averageRating.toFixed(1) : 'N/A'}
                        loading={loadingStats}
                    />
                    <RatingStat
                        icon={<FaUsers size={24} className="text-white" />}
                        label="Total Reviews"
                        value={stats.reviewCount}
                        loading={loadingStats}
                    />
                </div>
                {/* ---------------------------- */}

                {/* Your existing links, unchanged */}
                <Link
                    to="/post-ride"
                    className="w-full py-3 mb-4 bg-white text-green-600 font-semibold rounded-xl hover:bg-white/90 transition duration-300 text-center"
                >
                    Post a Ride
                </Link>
                <Link
                    to="/my-rides"
                    className="w-full py-3 mb-4 bg-white text-green-600 font-semibold rounded-xl hover:bg-white/90 transition duration-300 text-center"
                >
                    View my Rides
                </Link>
                <Link
                    to="/payments"
                    className="w-full py-3 mb-4 bg-white text-green-600 font-semibold rounded-xl hover:bg-white/90 transition duration-300 text-center"
                >
                    My Payment History
                </Link>
                <button
                    onClick={handleLogout}
                    className="w-full py-3 bg-red-500 text-white font-semibold rounded-xl hover:bg-red-600 transition duration-300"
                >
                    Logout
                </button>
            </div>
        </div>
    );
}

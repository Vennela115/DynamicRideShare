import React, { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { FaCar, FaBars, FaTimes } from "react-icons/fa";
import useAuth from "../hooks/useAuth"; // 1. Import your custom auth hook
import NotificationBell from './NotificationBell'; 

// A reusable NavLink component for consistent styling
const CustomNavLink = ({ to, children, onClick }) => (
    <NavLink
        to={to}
        onClick={onClick}
        className={({ isActive }) =>
            `px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive
                    ? 'bg-slate-900 text-white'
                    : 'text-slate-300 hover:bg-slate-700 hover:text-white'
            }`
        }
    >
        {children}
    </NavLink>
);

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const { user, logout } = useAuth(); // 2. Get user and logout from the central context
    const navigate = useNavigate();

    const handleLogout = () => {
        logout(); // The context's logout function handles navigation
    };

    const getDashboardPath = () => {
        if (!user) return "/";
        return `/${user.role.toLowerCase()}/dashboard`;
    };

    return (
        <nav className="bg-slate-800 shadow-lg sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo and Main Links */}
                    <div className="flex items-center">
                        <Link to="/" className="flex-shrink-0 flex items-center text-white text-xl font-bold">
                            <FaCar className="mr-2 text-indigo-400" />
                            RideShare
                        </Link>
                        {/* Desktop Links */}
                        
                    </div>

                    {/* Profile and Logout Button */}
                    <div className="hidden md:flex items-center space-x-4">
                        {user ? (
                            <>
                               <div className="hidden md:block">
                            <div className="ml-10 flex items-baseline space-x-4">
                                <CustomNavLink to={getDashboardPath()}>Dashboard</CustomNavLink>
                                {/* You can add other links like "About Us" or "Contact" here */}
                            </div>
                        </div>
                            	<NotificationBell />

                                <CustomNavLink to="/profile">Profile</CustomNavLink>
                                <button
                                    onClick={handleLogout}
                                    className="px-3 py-2 rounded-md text-sm font-medium text-slate-300 bg-red-600 hover:bg-red-700 hover:text-white transition-colors"
                                >
                                    Logout
                                </button>
                            </>
                        ) : (
                            <CustomNavLink to="/">Login</CustomNavLink> // Show login if no user
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="-mr-2 flex md:hidden">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="bg-slate-800 inline-flex items-center justify-center p-2 rounded-md text-slate-400 hover:text-white hover:bg-slate-700 focus:outline-none"
                        >
                            {isOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Dropdown Menu */}
            {isOpen && (
                <div className="md:hidden">
                    <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                        <CustomNavLink to={getDashboardPath()} onClick={() => setIsOpen(false)}>Dashboard</CustomNavLink>
                        <CustomNavLink to="/profile" onClick={() => setIsOpen(false)}>Profile</CustomNavLink>
                        {user ? (
                             <button
                                onClick={() => { setIsOpen(false); handleLogout(); }}
                                className="w-full text-left block px-3 py-2 rounded-md text-base font-medium text-slate-300 bg-red-600 hover:bg-red-700 hover:text-white"
                            >
                                Logout
                            </button>
                        ) : (
                             <CustomNavLink to="/" onClick={() => setIsOpen(false)}>Login</CustomNavLink>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
}

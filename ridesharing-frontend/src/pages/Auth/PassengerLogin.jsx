import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // 1. Add useNavigate back
import useAuth from '../../hooks/useAuth';


export default function PassengerLogin() {
    
    const { login } = useAuth();
    const navigate = useNavigate(); // 2. Initialize useNavigate
    const [form, setForm] = useState({ email: '', password: '' });
    const [loading, setLoading] = useState(false);
    const [err, setErr] = useState('');
    const [welcome, setWelcome] = useState(''); // 3. ADD THE WELCOME STATE BACK

    const handleChange = (e) =>
        setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErr('');
        setWelcome('');
        setLoading(true);
        try {
            // The login function now comes from the context, but it doesn't navigate.
            // It just handles the logic of setting the user state and localStorage.
            await login(form);

            // 4. SET THE WELCOME MESSAGE IN THE COMPONENT
            setWelcome(`Welcome back! Redirecting to your dashboard...`);

            // 5. HANDLE NAVIGATION AND DELAY HERE
            setTimeout(() => {
                // The AuthContext will have already set the user state,
                // so the protected route will work correctly.
                navigate("/passenger/dashboard", { replace: true });
            }, 1500); // 1.5 second delay
            
            

        } catch (e2) {
            setErr(e2?.response?.data?.message || "Invalid credentials.");
            setLoading(false); // Ensure loading is stopped on error
        }
        // Don't set loading to false here, as we want the button to stay disabled
        // during the welcome message delay.
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-blue-50 p-6">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
                <h1 className="text-3xl font-bold text-gray-900">Passenger Login</h1>
                <p className="text-gray-600 mt-2">
                    Sign in to search & book rides instantly.
                </p>

                {err && (
                    <div className="mt-4 text-sm text-red-600 bg-red-50 border border-red-100 px-3 py-2 rounded-lg">
                        {err}
                    </div>
                )}

                {/* This JSX will now work because 'welcome' state exists */}
                {welcome && (
                    <div className="mt-4 text-sm text-green-700 bg-green-50 border border-green-200 px-3 py-2 rounded-lg font-semibold animate-pulse">
                        {welcome}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4 mt-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Email
                        </label>
                        <input
                            name="email"
                            type="email"
                            required
                            value={form.email}
                            onChange={handleChange}
                            className="mt-1 w-full rounded-xl border-gray-200 focus:border-indigo-400 focus:ring-indigo-200"
                            placeholder="you@example.com"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Password
                        </label>
                        <input
                            name="password"
                            type="password"
                            required
                            value={form.password}
                            onChange={handleChange}
                            className="mt-1 w-full rounded-xl border-gray-200 focus:border-indigo-400 focus:ring-indigo-200"
                            placeholder="••••••••"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full rounded-xl bg-indigo-600 text-white py-3 font-semibold hover:bg-indigo-700 transition disabled:opacity-70"
                    >
                        {loading ? "Signing in..." : "Login"}
                    </button>
                </form>

                <div className="mt-6 text-sm text-gray-600">
                    New here?{" "}
                    <Link
                        to="/passenger/register"
                        className="text-indigo-600 font-semibold hover:underline"
                    >
                        Create a passenger account
                    </Link>
                </div>

                <div className="mt-2 text-sm">
                    Not a passenger?{" "}
                    <Link
                        to="/driver/login"
                        className="text-emerald-600 font-semibold hover:underline"
                    >
                        Driver login
                    </Link>
                </div>
            </div>
        </div>
    );
}

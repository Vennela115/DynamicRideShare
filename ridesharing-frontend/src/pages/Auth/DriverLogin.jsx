import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import {AuthContext} from '../../contexts/AuthContext';


export default function DriverLogin() {
   
   const { login } = useContext(AuthContext);
    const [form, setForm] = useState({ email: '', password: '' });
    const [loading, setLoading] = useState(false);
    const [err, setErr] = useState('');

    const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErr('');
        setLoading(true);
        try {
            await login(form);
          
        } catch (e2) {
            setErr(e2?.response?.data?.message || "Invalid credentials.");
        } finally {
            setLoading(false);
        }
    };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 via-white to-blue-50 p-6">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
        <h1 className="text-3xl font-bold text-gray-900">Driver Login</h1>
        <p className="text-gray-600 mt-2">
          Sign in to post rides and manage bookings.
        </p>

        {err && (
          <div className="mt-4 text-sm text-red-600 bg-red-50 border border-red-100 px-3 py-2 rounded-lg">
            {err}
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
              className="mt-1 w-full rounded-xl border-gray-200 focus:border-emerald-400 focus:ring-emerald-200"
              placeholder="driver@gmail.com"
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
              className="mt-1 w-full rounded-xl border-gray-200 focus:border-emerald-400 focus:ring-emerald-200"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-emerald-600 text-white py-3 font-semibold hover:bg-emerald-700 transition disabled:opacity-70"
          >
            {loading ? "Signing in..." : "Login"}
          </button>
        </form>

        <div className="mt-6 text-sm text-gray-600">
          New to the platform?{" "}
          <Link
            to="/driver/register"
            className="text-emerald-600 font-semibold hover:underline"
          >
            Create a driver account
          </Link>
        </div>

        <div className="mt-2 text-sm">
          Not a driver?{" "}
          <Link
            to="/passenger/login"
            className="text-indigo-600 font-semibold hover:underline"
          >
            Passenger login
          </Link>
        </div>
      </div>
    </div>
  );
}

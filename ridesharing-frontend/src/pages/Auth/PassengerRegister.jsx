import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../../services/api";

export default function PassengerRegister() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    contact: "",
  });
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [ok, setOk] = useState("");

  const handleChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErr("");
    setOk("");
    setLoading(true);
    try {
      // Backend expects role too:
      const payload = { ...form, role: "PASSENGER" };
      await API.post("/auth/register", payload);
      setOk("Registration successful! Please login and  A welcome email has been sent to your inbox.");
      setTimeout(() => navigate("/passenger/login"), 1000);
    } catch (e2) {
      setErr(
        e2?.response?.data?.message ||
          "Registration failed. Please review your details."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-blue-50 p-6">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
        <h1 className="text-3xl font-bold text-gray-900">Passenger Sign up</h1>
        <p className="text-gray-600 mt-2">
          Create an account to start booking rides.
        </p>

        {err && (
          <div className="mt-4 text-sm text-red-600 bg-red-50 border border-red-100 px-3 py-2 rounded-lg">
            {err}
          </div>
        )}
        {ok && (
          <div className="mt-4 text-sm text-emerald-700 bg-emerald-50 border border-emerald-100 px-3 py-2 rounded-lg">
            {ok}
          </div>
        )}

        <form onSubmit={handleSubmit} className="grid sm:grid-cols-2 gap-4 mt-6">
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-gray-700">
              Full name
            </label>
            <input
              name="name"
              required
              value={form.name}
              onChange={handleChange}
              className="mt-1 w-full rounded-xl border-gray-200 focus:border-indigo-400 focus:ring-indigo-200"
              placeholder="Pradeep Reddy"
            />
          </div>

          <div className="sm:col-span-2">
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
              placeholder="passenger@gmail.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Phone
            </label>
            <input
              name="contact"
              required
              value={form.contact}
              onChange={handleChange}
              className="mt-1 w-full rounded-xl border-gray-200 focus:border-indigo-400 focus:ring-indigo-200"
              placeholder="9876501234"
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
            className="sm:col-span-2 w-full rounded-xl bg-indigo-600 text-white py-3 font-semibold hover:bg-indigo-700 transition disabled:opacity-70 mt-2"
          >
            {loading ? "Creating account..." : "Create account"}
          </button>
        </form>

        <div className="mt-6 text-sm text-gray-600">
          Already have an account?{" "}
          <Link
            to="/passenger/login"
            className="text-indigo-600 font-semibold hover:underline"
          >
            Login
          </Link>
        </div>

        <div className="mt-2 text-sm">
          Not a passenger?{" "}
          <Link
            to="/driver/register"
            className="text-emerald-600 font-semibold hover:underline"
          >
            Driver sign up
          </Link>
        </div>
      </div>
    </div>
  );
}

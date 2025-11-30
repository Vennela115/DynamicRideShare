import useAuth  from "../hooks/useAuth";
import { Link, useNavigate } from "react-router-dom";
import React from "react";

export default function PassengerDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
   navigate("/");
    logout();             // clear user/token
            // redirect to landing page
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-100 to-blue-200 flex flex-col items-center justify-center px-4 py-8">
      {/* Dashboard Card */}
      <div className="bg-white shadow-lg rounded-2xl p-8 max-w-md w-full text-center">
        <h2 className="text-3xl font-bold text-blue-700 mb-4">Passenger Dashboard</h2>
        <p className="text-gray-700 mb-6">
          Welcome <span className="font-medium text-blue-500">{"Passenger" ||user?.name || user?.email}</span>
        </p>

        {/* Buttons */}
        <div className="flex flex-col space-y-4">
          <Link
            to="/search-rides"
            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 rounded-lg transition duration-300"
          >
            Search Rides
          </Link>

          <Link
            to="/my-bookings"
            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 rounded-lg transition duration-300"
          >
            My Bookings
          </Link>

          <Link
            to="/payments"
            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 rounded-lg transition duration-300"
          >
            My Payment History
          </Link>

          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white font-semibold py-3 rounded-lg transition duration-300"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Footer */}
      <p className="mt-8 text-gray-500 text-sm text-center max-w-md">
        Enjoy a seamless ride-sharing experience. Stay safe and have fun!
      </p>
    </div>
  );
}

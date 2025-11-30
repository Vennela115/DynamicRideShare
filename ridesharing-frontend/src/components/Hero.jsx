import { Link } from "react-router-dom";
import React from "react";

export default function Hero() {
  return (
    <section className="bg-indigo-600 text-white py-16 text-center">
      <h1 className="text-4xl font-bold mb-4">
        Find & Share Rides Easily 🚗
      </h1>
      <p className="text-lg mb-6">
        Connect with drivers and passengers for safe, affordable, and eco-friendly travel.
      </p>
      <div className="space-x-4">
        <Link
          to="/rides"
          className="bg-white text-indigo-600 px-6 py-2 rounded-lg font-medium hover:bg-gray-200"
        >
          Search Rides
        </Link>
        <Link
          to="/post-ride"
          className="bg-yellow-400 text-black px-6 py-2 rounded-lg font-medium hover:bg-yellow-500"
        >
          Post a Ride
        </Link>
      </div>
    </section>
  );
}

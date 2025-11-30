import React from "react";

export default function RideCard({ ride }) {
  return (
    <div className="bg-white shadow-md rounded-lg p-4 border hover:shadow-lg transition">
      <h2 className="text-lg font-bold text-indigo-600">
        {ride.source} → {ride.destination}
      </h2>
      <p className="text-gray-700">Date: {ride.date}</p>
      <p className="text-gray-700">Time: {ride.time}</p>
      <p className="text-gray-700">Seats: {ride.seats}</p>
      <p className="text-gray-700">Driver: {ride.driver}</p>
      <button className="mt-3 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700">
        Book Now
      </button>
    </div>
  );
}

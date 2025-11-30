// src/components/FareCard.jsx
import React from "react";

export default function FareCard({ data }) {
  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 border">
      <h2 className="text-xl font-semibold mb-3">Fare Estimate</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div>
          <p className="text-sm text-gray-500">From</p>
          <p className="font-medium">{data.source}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">To</p>
          <p className="font-medium">{data.destination}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Distance (km)</p>
          <p className="font-medium">{Number(data.distanceKm).toFixed(2)}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Passengers</p>
          <p className="font-medium">{data.passengers ?? 1}</p>
        </div>
      </div>

      <div className="mt-6 pt-4 border-t flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500">Base Fare</p>
          <p className="font-medium">₹{data.baseFare}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Rate / km</p>
          <p className="font-medium">₹{data.ratePerKm}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Total</p>
          <p className="text-2xl font-bold">₹{Math.ceil(Number(data.totalFare) ?? 0)}</p>
        </div>
      </div>
    </div>
  );
}

import { useState } from "react";
import React from "react";

export default function RideForm({ onSubmit }) {
  const [ride, setRide] = useState({
    source: "",
    destination: "",
    date: "",
    time: "",
    seats: "",
  });

  const handleChange = (e) => {
    setRide({ ...ride, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(ride);
    setRide({ source: "", destination: "", date: "", time: "", seats: "" });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md"
    >
      <h2 className="text-xl font-bold text-indigo-600 mb-4">Post a Ride</h2>
      {["source", "destination", "date", "time", "seats"].map((field) => (
        <input
          key={field}
          type={field === "date" ? "date" : field === "time" ? "time" : "text"}
          name={field}
          placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
          value={ride[field]}
          onChange={handleChange}
          className="w-full mb-3 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-400"
          required
        />
      ))}
      <button
        type="submit"
        className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700"
      >
        Post Ride
      </button>
    </form>
  );
}

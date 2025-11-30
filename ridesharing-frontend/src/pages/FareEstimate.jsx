// src/pages/FareEstimate.jsx
import React, { useState } from "react";
import { estimateFare } from "../services/fareService";
import FareCard from "../components/FareCard";

export default function FareEstimate() {
  const [form, setForm] = useState({ source: "", destination: "", passengers: 1 });
  const [estimate, setEstimate] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleEstimate = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    setEstimate(null);
    try {
      const data = await estimateFare({
        source: form.source,
        destination: form.destination,
        passengers: Number(form.passengers || 1)
      });
      setEstimate(data);
    } catch (err) {
      setError(err?.response?.data?.error || err.message || "Failed to estimate fare");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 to-indigo-50 p-6">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-6">Fare Estimator</h1>

        <form onSubmit={handleEstimate} className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <input name="source" value={form.source} onChange={onChange} placeholder="Start (city/area)" required
            className="p-3 rounded-lg border shadow-sm focus:outline-none" />
          <input name="destination" value={form.destination} onChange={onChange} placeholder="Destination" required
            className="p-3 rounded-lg border shadow-sm focus:outline-none" />
          <div className="flex gap-2">
            <input name="passengers" type="number" min="1" value={form.passengers} onChange={onChange}
              className="w-1/2 p-3 rounded-lg border shadow-sm" />
            <button type="submit" className="w-1/2 bg-indigo-600 text-white rounded-lg font-semibold">Estimate</button>
          </div>
        </form>

        {loading && <p className="text-center">Estimating distance & fare...</p>}
        {error && <p className="text-center text-red-600 mb-4">{error}</p>}

        {estimate && <FareCard data={estimate} />}
      </div>
    </div>
  );
}

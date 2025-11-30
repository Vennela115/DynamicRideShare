// src/pages/RouteMatch.jsx
import React, { useState } from "react";
import { matchRides } from "../services/rideService";

export default function RouteMatch() {
  const [q, setQ] = useState({ source: "", destination: "", date: "" });
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const onChange = (e) => setQ({ ...q, [e.target.name]: e.target.value });

  const onSearch = async (e) => {
    e.preventDefault();
    setError(""); setLoading(true); setResults(null);
    try {
      const data = await matchRides({ ...q });
      setResults(data);
    } catch (err) {
      setError(err?.response?.data || err.message);
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">Find matching rides (direct & partial)</h1>

        <form onSubmit={onSearch} className="grid gap-3 md:grid-cols-4 mb-6">
          <input name="source" required value={q.source} onChange={onChange} placeholder="Source" className="p-3 rounded" />
          <input name="destination" required value={q.destination} onChange={onChange} placeholder="Destination" className="p-3 rounded" />
          <input name="date" type="date" required value={q.date} onChange={onChange} className="p-3 rounded" />
          <button className="bg-indigo-600 text-white rounded p-3 font-semibold">Match</button>
        </form>

        {loading && <p>Finding best matches…</p>}
        {error && <p className="text-red-600">{error}</p>}

        {results && (
          <>
            <h2 className="mb-2 text-lg">Direct Matches</h2>
            <div className="grid gap-3">
              {(results.direct || []).map((r) => (
                <div key={r.id} className="bg-white p-4 rounded-lg shadow">
                  <div className="flex justify-between">
                    <div>
                      <p className="font-semibold">{r.source} → {r.destination}</p>
                      <p className="text-sm">{r.date} {r.time}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold">₹{r.price}</p>
                      <p className="text-sm">Seats: {r.seatsAvailable}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <h2 className="mt-6 mb-2 text-lg">Partial Matches</h2>
            <div className="grid gap-3">
              {(results.partial || []).map((r) => (
                <div key={r.id} className="bg-white p-4 rounded-lg shadow">
                  <div className="flex justify-between">
                    <div>
                      <p className="font-semibold">{r.source} → {r.destination}</p>
                      <p className="text-sm">{r.date} {r.time}</p>
                      <p className="text-xs text-gray-500">Match score: {r.matchScore ?? 0}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold">₹{r.price}</p>
                      <p className="text-sm">Seats: {r.seatsAvailable}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// src/pages/PaymentsHistory.jsx
import React, { useEffect, useState } from "react";
import { getMyPayments } from "../services/paymentService";

export default function PaymentsHistory() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const data = await getMyPayments();
        setItems(data || []);
      } catch (err) {
        console.error(err);
      } finally { setLoading(false); }
    })();
  }, []);

  return (
    <div className="min-h-screen p-6 bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Transaction History</h1>

        {loading && <p>Loading...</p>}
        {!loading && items.length === 0 && <p>No transactions yet.</p>}
        <div className="grid gap-4">
          {items.map((p) => (
            <div key={p.id} className="bg-white p-4 rounded-xl shadow flex justify-between items-center">
              <div>
                <p className="font-semibold">{p.rideId ? `Ride #${p.rideId}` : "Booking"}</p>
                <p className="text-sm text-gray-500">{new Date(p.createdAt).toLocaleString()}</p>
                <p className="text-sm">Provider: {p.provider} · Status: {p.status}</p>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold">₹{Math.ceil(p.amount ?? 0)}</p>
                <p className="text-xs text-gray-500">Ref: {p.providerRef}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

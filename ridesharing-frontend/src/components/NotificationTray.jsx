// src/components/NotificationTray.jsx
import React, { useCallback, useState } from "react";
import useRealtime from "../hooks/useRealTime";

export default function NotificationTray({ driverId, passengerId }) {
  const [items, setItems] = useState([]);

  const onMessage = useCallback((msg) => {
    const entry = {
      id: Date.now(),
      type: msg.type || "NOTIFY",
      text: msg.message || JSON.stringify(msg),
      payload: msg.payload || null,
    };
    setItems((s) => [entry, ...s].slice(0, 6));
  }, []);

  useRealtime({ driverId, passengerId, onMessage });

  if (!items.length) return null;

  return (
    <div className="fixed right-4 bottom-4 w-80 z-50">
      {items.map((it) => (
        <div key={it.id} className="bg-white shadow-xl rounded-xl p-3 mb-3 border-l-4 border-blue-500">
          <div className="text-sm font-semibold">{it.type}</div>
          <div className="text-sm text-gray-700">{it.text}</div>
          {it.payload && <pre className="text-xs mt-2 bg-gray-50 p-2 rounded">{JSON.stringify(it.payload)}</pre>}
        </div>
      ))}
    </div>
  );
}

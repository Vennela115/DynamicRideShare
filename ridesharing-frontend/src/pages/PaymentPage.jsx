// src/pages/PaymentPage.jsx
import React, { useState } from "react";
import { initiatePayment, capturePayment } from "../services/paymentService";
import { useLocation, useNavigate } from "react-router-dom";

export default function PaymentPage() {
  const { state } = useLocation(); // expect { bookingId, ride, amount }
  const navigate = useNavigate();
  const bookingId = state?.bookingId;
  const ride = state?.ride;
  const [loading, setLoading] = useState(false);
  const [paid, setPaid] = useState(false);
  const [error, setError] = useState("");

  const amount = state?.amount ?? (ride?.price || 0) * (state?.seats || 1);

  const handlePay = async () => {
    setError(""); setLoading(true);
    try {
      // call backend to get order info (if any); optional
      const init = await initiatePayment({ bookingId, rideId: ride?.id, amount });
      // In real app: open provider checkout (Razorpay/Stripe) using init.orderId / clientKey
      // For now: simulate payment success
      const providerRef = "SIMULATED_" + Date.now();
      await capturePayment({
        bookingId,
        rideId: ride?.id,
        passengerId: JSON.parse(localStorage.getItem("user") || "{}").id,
        driverId: ride?.driverId || ride?.driver?.id,
        amount,
        providerRef
      });
      setPaid(true);
      setLoading(false);
      alert("Payment successful!");
      navigate("/my-bookings");
    } catch (err) {
      console.error("Payment error", err);
      setError("Payment failed: " + (err?.message || "unknown"));
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-rose-50 to-pink-50 p-6">
      <div className="w-full max-w-md bg-white rounded-2xl p-6 shadow-xl">
        <h2 className="text-xl font-semibold mb-4">Confirm & Pay</h2>

        <div className="space-y-2">
          <p><strong>Trip:</strong> {ride?.source} → {ride?.destination}</p>
          <p><strong>Seats:</strong> {state?.seats}</p>
          <p><strong>Amount:</strong> ₹{amount}</p>
        </div>

        {error && <p className="text-sm text-red-600 mt-3">{error}</p>}

        <button
          onClick={handlePay}
          disabled={loading || paid}
          className="mt-6 w-full bg-emerald-600 text-white py-3 rounded-lg font-semibold hover:bg-emerald-700 disabled:opacity-60"
        >
          {loading ? "Processing…" : (paid ? "Paid" : "Pay Now")}
        </button>
      </div>
    </div>
  );
}

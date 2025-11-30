// src/api/paymentService.js
import API from "./api";

/**
 * Initiate payment (server may create order id etc.)
 * This is a friendly wrapper — your backend may implement /payments/initiate
 */
export const initiatePayment = async ({ bookingId, rideId, amount, currency = "INR" }) => {
  // If you integrated Razorpay/Stripe, backend should return order id / client key
  const res = await API.post("/payments/initiate", { bookingId, rideId, amount, currency });
  return res.data;
};

/**
 * Capture / finalize payment after client-side payment is done.
 * POST /api/payments/capture { bookingId, rideId, passengerId, driverId, amount, providerRef }
 */
export const capturePayment = async (payload) => {
  const res = await API.post("/payments/capture", payload);
  return res.data;
};

/**
 * Get history for current logged-in user
 */
export const getMyPayments = async () => {
  const res = await API.get("/payments/history/me");
  return res.data;
};

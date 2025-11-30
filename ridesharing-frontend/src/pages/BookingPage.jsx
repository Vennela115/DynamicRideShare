// src/pages/BookingPage.jsx
import React, { useState, useEffect, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import API from '../services/api';
import { bookRide } from "../services/rideService";
import { addNotification } from '../services/notificationService';
import useAuth from '../hooks/useAuth';

export default function BookingPage() {
  const {user} = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const { ride } = location.state || {}; // ride details passed from search page

  const [passenger, setPassenger] = useState(null);
  const [seats, setSeats] = useState(1);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");

  const backendURL = "http://localhost:8080/api"; // adjust if needed

  // Load logged-in passenger
  useEffect(() => {
    const userJson = localStorage.getItem("user");
    try {
      setPassenger(userJson ? JSON.parse(userJson) : null);
    } catch {
      setPassenger(null);
    }
  }, []);

  // Guard: no ride
  if (!ride) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <div className="bg-white shadow-lg p-6 rounded-2xl w-full max-w-md text-center">
          <h2 className="text-xl font-bold mb-2 text-red-600">
            No ride selected.
          </h2>
          <p className="text-gray-600">Please search and choose a ride first.</p>
          <button
            onClick={() => navigate("/search-rides")}
            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg"
          >
            Go to Search
          </button>
        </div>
      </div>
    );
  }

  // Normalize numbers safely
  const pricePerSeat = Number(ride.price || 0);
  const seatsAvailable = Number(ride.seatsAvailable || 0);
  const confirmationRequired = Boolean(ride.confirmationRequired); // 🚨 fetched from ride, not passenger

  // Seat selection with validation
  const onSeatsChange = (e) => {
    const raw = Number(e.target.value);
    const safe = Number.isFinite(raw) ? raw : 1;
    setSeats(safe);
    setError("");
  };

  // Total fare
  const totalFare = useMemo(() => {
    return (Number.isFinite(seats) ? seats : 0) * pricePerSeat;
  }, [seats, pricePerSeat]);

  // Load Razorpay script
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handleBooking = async () => {
    // Validate
    if (seatsAvailable <= 0) {
      setError("This ride has no seats available.");
      return;
    }
    if (!Number.isInteger(seats) || seats < 1) {
      setError("Please enter a valid seat count.");
      return;
    }
    if (seats > seatsAvailable) {
      setError("Requested seats exceed available seats.");
      return;
    }

    setError("");

    // Case 1: Driver requires confirmation
    if (confirmationRequired) {
      try {
        setLoading(true);
        await bookRide(
          ride.id,
          seats,
          passenger?.name || "",
          passenger?.contact || "",
          totalFare
        );
        alert("Booking request sent ✅ Waiting for driver confirmation.");
        navigate("/passenger/dashboard");
      } catch (err) {
        console.error("Booking failed:", err);
        setError("Booking failed. Please try again.");
      } finally {
        setLoading(false);
      }
      return;
    }

    // Case 2: Direct payment
    try {
      setLoading(true);
      const orderRes = await API.post(`payments/create-order`, 
         { amount: totalFare * 100, currency: "INR" }

      );

      const options = {
        key: "rzp_test_REn7Clr0Iw5282", // ✅ your Razorpay test key
        amount: orderRes.data.amount,
        currency: orderRes.data.currency,
        name: "Dynamic Ride Sharing",
        description: "Ride Payment",
        order_id: orderRes.data.id,
        handler: async function (response) {
          try {
            await API.post(`/payments/capture`, {
              bookingId: orderRes.data.bookingId,
              rideId: ride.id,
              
              driverId: ride.driverId,
              amount: totalFare,
              providerRef: response.razorpay_payment_id,
              seats: seats,
            }
            
          );
            alert("Payment Successful & Ride Booked! ✅ and A confirmation email with your ride details has been sent.");
              if (user?.email) {
                    addNotification(`Booking confirmed for ride to ${ride.destination}!`, user.email, 'success');
                    addNotification("Your payment was successful.", user.email, 'success');
                }
            navigate("/passenger/dashboard");
          } catch (err) {
            console.error(err);
            alert("Payment capture failed!");
          }
        },
        prefill: {
          name: passenger?.name || "Test Passenger",
          email: passenger?.email || "test@example.com",
          contact: passenger?.contact || "9999999999",
        },
        theme: { color: "#3399cc" },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error("Payment init failed:", err);
      setError("Payment initiation failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-lg p-6 rounded-2xl w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Confirm Your Booking</h2>

        {/* Ride Details */}
        <p><strong>From:</strong> {ride.source}</p>
        <p><strong>To:</strong> {ride.destination}</p>
        <p><strong>Date:</strong> {String(ride.date)}</p>
        <p><strong>Time:</strong> {ride.time ?? "—"}</p>
        <p><strong>Driver:</strong> {ride.driverName ?? "—"}</p>
        <p>
          <strong>Car:</strong> {ride.driverVehicleModel ?? "—"} (
          {ride.driverLicensePlate ?? "—"})
        </p>
        <p><strong>Price per Seat:</strong> ₹{pricePerSeat}</p>
        <p><strong>Seats Available:</strong> {seatsAvailable}</p>

        {/* Passenger Info */}
        {passenger && (
          <div className="mt-3 text-sm text-gray-600">
            <p><strong>You:</strong> {passenger.name || "—"}</p>
            <p><strong>Contact:</strong> {passenger.contact || passenger.email || "—"}</p>
          </div>
        )}

        {/* Seat Selection */}
        <div className="mt-4">
          <label className="block font-medium">Number of Seats:</label>
          <input
            type="number"
            min="1"
            max={Math.max(1, seatsAvailable)}
            value={seats}
            onChange={onSeatsChange}
            className="border p-2 w-full rounded"
          />
        </div>

        {/* Fare */}
        <p className="mt-3 text-lg font-semibold">
          Total Fare: ₹{Number.isFinite(totalFare) ? totalFare : 0}
        </p>

        {/* Error */}
        {error && <p className="mt-2 text-sm text-red-600">{error}</p>}

        {/* Action Button */}
        <button
          onClick={handleBooking}
          disabled={loading}
          className="mt-4 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
        >
          {loading
            ? "Processing..."
            : confirmationRequired
            ? "Request Booking"
            : "Pay & Book"}
        </button>
      </div>
    </div>
  );
}

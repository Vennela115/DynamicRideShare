import { useState, useEffect } from "react";
import React from "react";
import API from "../services/api";
import { getProfile } from "../services/authService";
import { estimateFare } from "../services/fareService";
import { addNotification } from '../services/notificationService';
import useAuth from "../hooks/useAuth";
import { useLocation, useNavigate } from "react-router-dom";

export default function PostRide() {
  const {user} = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const [ride, setRide] = useState({
    source: "",
    destination: "",
    date: "",
    time: "",
    seatsAvailable: "",
    price: "", // numeric per-seat fare (number or "")
    requiredConfirmation: false,
  });

  const [driverCar, setDriverCar] = useState({
    carModel: "",
    carNumber: "",
  });

  const [success, setSuccess] = useState(false);
  const [calculatingFare, setCalculatingFare] = useState(false);
  const [distanceKm, setDistanceKm] = useState(null); // show distance returned by backend
  const today = new Date().toISOString().split("T")[0];

  // fetch driver profile dynamically
  useEffect(() => {
    const fetchDriverProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;
        const profile = await getProfile(token); // ensure this returns driver's vehicle fields
        if (profile) {
          setDriverCar({
            carModel: profile.driverVehicleModel  || profile.carModel || "Mahindra Scorpio-N",
            carNumber: profile.driverLicensePlate || profile.driverLicense || profile.carNumber || "TS bg 6231",
          });
        }
      } catch (err) {
        console.error("Failed to fetch driver profile:", err);
      }
    };
    fetchDriverProfile();
  }, []);

  // calculate fare when source or destination changes
  useEffect(() => {
    // small debounce to avoid too many calls while typing
    const debounce = setTimeout(async () => {
      if (!ride.source?.trim() || !ride.destination?.trim()) {
        setRide(prev => ({ ...prev, price: "" }));
        setDistanceKm(null);
        return;
      }

      setCalculatingFare(true);

      try {
        const fareData = await estimateFare({
          source: ride.source.trim(),
          destination: ride.destination.trim(),
          passengers: 1, // per-seat estimate
        });

        // Log the full response so you can inspect it in console/network
        console.log("fareData response:", fareData);

        // Extract total fare robustly (handle snake_case or camelCase)
        const total =
          fareData?.total_fare ??
          fareData?.totalFare ??
          fareData?.total ??
          fareData?.fare ??
          null;

        const distance =
          fareData?.distance_km ??
          fareData?.distanceKm ??
          fareData?.distance ??
          null;

        const totalNum = total != null ? Number(total) : NaN;

        if (!Number.isNaN(totalNum) && totalNum > 0) {
          setRide(prev => ({ ...prev, price: totalNum }));
          setDistanceKm(distance != null ? Number(distance) : null);
        } else {
          // backend didn't return a usable fare
          setRide(prev => ({ ...prev, price: 0 }));
          setDistanceKm(distance != null ? Number(distance) : null);
          console.warn("Fare API returned invalid total fare:", fareData);
        }
      } catch (err) {
        console.error("Failed to estimate fare:", err);
        setRide(prev => ({ ...prev, price: 0 }));
        setDistanceKm(null);
      } finally {
        setCalculatingFare(false);
      }
    }, 500); // 500ms debounce

    return () => clearTimeout(debounce);
  }, [ride.source, ride.destination]);

  const handleChange = (e) => {
    const { name, type, value, checked } = e.target;
    setRide(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    setSuccess(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (ride.date < today) {
      alert("Please select today or a future date!");
      return;
    }

    // Block posting if fare not yet calculated or invalid
    if (!ride.price || Number(ride.price) <= 0) {
      alert("Fare is not calculated yet or invalid. Please enter source & destination again.");
      return;
    }

    const rideData = {
      source: ride.source,
      destination: ride.destination,
      date: ride.date,
      time: ride.time,
      seatsAvailable: Number(ride.seatsAvailable),
      price: Number(ride.price), // per-seat fare
      requiredConfirmation: Boolean(ride.requiredConfirmation),
      carModel: driverCar.carModel,
      carNumber: driverCar.carNumber,
      distanceKm: distanceKm ?? undefined, // optional
    };

    try {
      await API.post("/rides/create", rideData);
      setSuccess(true);
      setRide({
        source: "",
        destination: "",
        date: "",
        time: "",
        seatsAvailable: "",
        price: "",
        requiredConfirmation: false,
      });
      setDistanceKm(null);
      alert("Ride posted successfully. Now you are redirecting to dashboard.");
      if(user?.email){
      addNotification(`Your ride ${rideData.source} to ${rideData.destination} has been posted!`,user.email, 'success');
      }
      
      
      navigate("/driver/dashboard");
    } catch (error) {
      console.error("Error posting ride:", error);
      alert("Failed to post ride. Try again.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 p-4">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-lg">
        <h2 className="text-2xl font-bold text-gray-800 text-center mb-6"> Post a Ride</h2>

        {success && (
          <div className="p-3 mb-4 text-green-800 bg-green-100 rounded-lg border border-green-300">
            ✅ Ride posted successfully!
          </div>
        )}

        <div className="mb-4 p-4 bg-gray-50 rounded-lg border">
          <p className="text-gray-700"><span className="font-semibold">Car Model:</span> {driverCar.carModel || "Not set"}</p>
          <p className="text-gray-700"><span className="font-semibold">Car Number:</span> {driverCar.carNumber || "Not set"}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="text" name="source" placeholder="Source" value={ride.source} onChange={handleChange} required className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-emerald-400 focus:outline-none" />
          <input type="text" name="destination" placeholder="Destination" value={ride.destination} onChange={handleChange} required className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-emerald-400 focus:outline-none" />
          <input type="date" name="date" value={ride.date} onChange={handleChange} required min={today} className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-emerald-400 focus:outline-none" />
          <input type="time" name="time" value={ride.time} onChange={handleChange} required className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-emerald-400 focus:outline-none" />
          <input type="number" name="seatsAvailable" value={ride.seatsAvailable} placeholder="Available Seats" onChange={handleChange} required min="1" className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-emerald-400 focus:outline-none" />

          {/* fare display and distance */}
          <div className="p-3 border rounded-lg bg-gray-50 text-gray-700">
            <div><span className="font-semibold">Fare per seat: </span>
              {calculatingFare ? "Calculating..." : (ride.price ? `₹${ride.price}` : "Enter source & destination") }
            </div>
            {distanceKm != null && <div className="text-sm text-gray-500">Distance: {distanceKm} km</div>}
          </div>

          <label className="flex items-center space-x-2 text-gray-700">
            <input type="checkbox" name="requiredConfirmation" checked={ride.requiredConfirmation} onChange={handleChange} className="h-4 w-4 text-emerald-600 focus:ring-emerald-400 border-gray-300 rounded" />
            <span>Require driver confirmation before booking</span>
          </label>

          <button type="submit" disabled={calculatingFare || !ride.price || Number(ride.price) <= 0} className="w-full bg-emerald-500 text-white py-3 rounded-lg font-semibold hover:bg-emerald-600 transition disabled:opacity-50 disabled:cursor-not-allowed">
            {calculatingFare ? "Calculating fare..." : "Post Ride"}
          </button>
        </form>
      </div>
    </div>
  );
}

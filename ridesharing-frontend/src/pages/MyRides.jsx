import React, { useEffect, useState } from "react";
import { getDriverRides, cancelRide } from "../services/rideService"; // 1. Import cancelRide
import ReviewModal from '../components/ReviewModal'; // 2. Import the modal
import { FaStar } from "react-icons/fa";
import { isPast } from 'date-fns';
import { addNotification } from '../services/notificationService';
import useAuth from "../hooks/useAuth";

export default function MyRides() {
	const {user} = useAuth();
    const [rides, setRides] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedBookingId, setSelectedBookingId] = useState(null);

    // This single fetch function can be used to refresh data after any action
    const fetchRides = async () => {
        setLoading(true);
        try {
            const data = await getDriverRides();
            setRides(data);
        } catch (err) {
            console.error("Error fetching rides:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRides();
    }, []);

    // --- HANDLER FUNCTIONS for CANCELLATION and REVIEWS ---
    const handleCancelRide = async (rideId) => {
        if (window.confirm("Are you sure you want to cancel this entire ride? All passengers will be notified.")) {
            try {
                await cancelRide(rideId);
                alert("The ride has been successfully cancelled.");
                if(user?.email){
                 addNotification("The ride has been cancelled. Passengers will be notified.", user.email,'info');
                 
                 }
                fetchRides(); // Refresh the list of rides
            } catch (error) {
                console.error("Failed to cancel ride:", error);
                alert(error.response?.data?.message || "Failed to cancel the ride.");
            }
        }
    };

    const handleOpenReviewModal = (bookingId) => {
        setSelectedBookingId(bookingId);
        setIsModalOpen(true);
    };

    const handleCloseReviewModal = () => {
        setSelectedBookingId(null);
        setIsModalOpen(false);
    };

    const handleReviewSubmitted = () => {
        alert("Thank you! Your feedback has been submitted.");
        fetchRides(); // Refresh to potentially hide the "Review" button
    };
    // --------------------------------------------------------

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <p className="text-lg font-semibold text-gray-600 animate-pulse">
                    Loading your rides...
                </p>
            </div>
        );
    }

    return (
        <>
            <div className="p-6 min-h-screen bg-slate-50">
                <h1 className="text-3xl font-bold text-center mb-8 text-slate-800">
                    My Posted Rides
                </h1>

                {rides.length === 0 ? (
                    <div className="text-center py-20 px-6 bg-white rounded-xl shadow-md">
                         <h3 className="mt-2 text-lg font-medium text-slate-900">No Rides Posted</h3>
                         <p className="mt-1 text-sm text-slate-500">When you post a new ride, it will show up here.</p>
                    </div>
                ) : (
                    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                        {rides.map((ride) => {
                            const isRideCompleted = isPast(new Date(ride.date));
                            return (
                                <div key={ride.id} className="bg-white shadow-lg rounded-2xl p-6 flex flex-col">
                                    {/* Ride Info Section */}
                                    <div className="flex-grow">
                                        <div className="flex justify-between items-start">
                                            <p className="text-xl font-bold text-indigo-600">{ride.source} → {ride.destination}</p>
                                            <span className="text-lg font-bold text-slate-800">₹{ride.price}</span>
                                        </div>
                                        <p className="text-sm text-slate-500 mt-1">{ride.date} | {ride.time}</p>
                                        <div className="mt-4 flex flex-wrap gap-2">
                                            <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                                                Seats Left: {ride.seatsAvailable}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Passengers & Review Section */}
                                    <div className="mt-4 border-t pt-4">
                                        <h3 className="font-semibold text-gray-800 mb-2">Booked Passengers:</h3>
                                        {ride.passengers && ride.passengers.length > 0 ? (
                                            <ul className="space-y-2">
                                                {ride.passengers.map((passenger) => (
                                                    <li key={passenger.id} className="p-2 bg-slate-50 rounded-lg flex justify-between items-center">
                                                        <div>
                                                            <p className="font-medium text-slate-700">{passenger.name}</p>
                                                            <p className="text-xs text-slate-500">{passenger.email}</p>
                                                        </div>
                                                        {isRideCompleted && ride.status !== 'CANCELLED' && (
                                                            <button
                                                                onClick={() => handleOpenReviewModal(passenger.bookingId)}
                                                                className="text-xs font-semibold text-amber-600 hover:text-amber-800 flex items-center"
                                                            >
                                                                <FaStar className="mr-1" /> Review
                                                            </button>
                                                        )}
                                                    </li>
                                                ))}
                                            </ul>
                                        ) : (
                                            <p className="text-sm text-slate-500 italic">No passengers have booked yet.</p>
                                        )}
                                    </div>
                                    
                                    {/* Action Buttons Section */}
                                    <div className="mt-6">
                                        {ride.status === 'CANCELLED' ? (
                                             <div className="text-center text-sm py-2 bg-red-100 text-red-600 rounded-lg font-semibold">
                                                Ride Cancelled
                                            </div>
                                        ) : !isRideCompleted ? (
                                            <button
                                                onClick={() => handleCancelRide(ride.id)}
                                                className="w-full bg-red-100 text-red-700 font-semibold py-2 rounded-lg hover:bg-red-200"
                                            >
                                                Cancel Entire Ride
                                            </button>
                                        ) : (
                                             <div className="text-center text-sm py-2 bg-green-100 text-green-600 rounded-lg font-semibold">
                                                Ride Completed
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
            
            {/* The single modal instance for reviewing any passenger */}
            <ReviewModal
                isOpen={isModalOpen}
                onRequestClose={handleCloseReviewModal}
                bookingId={selectedBookingId}
                onReviewSubmit={handleReviewSubmitted}
            />
        </>
    );
}

import React, { useEffect, useState } from "react";
import API from "../services/api";
import ReviewModal from '../components/ReviewModal'; // 1. Import the new modal component
import { FaCar, FaUser, FaCalendarAlt, FaStar } from "react-icons/fa"; // 2. Import FaStar
import { isPast } from 'date-fns'; // 3. Import date-fns for checking dates
import { cancelBooking } from '../services/rideService'
import { addNotification } from '../services/notificationService';
import useAuth from "../hooks/useAuth";

export default function BookingsPage() {
	
	const {user} = useAuth();
    // 4. All state and handler logic is now included
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedBookingId, setSelectedBookingId] = useState(null);

    const fetchBookings = async () => {
        setLoading(true); // Ensure loading is true at the start of fetch
        try {
            const response = await API.get("/bookings/me");
            setBookings(response.data);
        } catch (error) {
            console.error("Failed to fetch bookings:", error);
            // Don't alert here as it can be annoying, console error is enough
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBookings();
    }, []);
    
    const handleCancelBooking = async (bookingId) => {
        if (window.confirm("Are you sure you want to cancel this booking?")) {
            try {
                await cancelBooking(bookingId);
                
                if(user?.email){
                 addNotification("Your booking has been cancelled.",user.email, 'info');
                 }
                alert("Your booking has been successfully cancelled.");
                fetchBookings(); // Refresh the list to update the UI
            } catch (error) {
                console.error("Failed to cancel booking:", error);
                alert(error.response?.data?.message || "Failed to cancel booking.");
            }
        }
    };

    const handleOpenModal = (bookingId) => {
        setSelectedBookingId(bookingId);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setSelectedBookingId(null);
        setIsModalOpen(false);
    };
    
    const handleReviewSubmitted = () => {
        alert("Thank you! Your review has been submitted successfully.");
        // We can optionally refresh the bookings list to hide the "Leave Review" button
        // for the ride that was just reviewed.
        fetchBookings(); 
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <p className="text-lg font-semibold text-gray-600 animate-pulse">
                    Loading your bookings...
                </p>
            </div>
        );
    }

    return (
        // Use a Fragment <> to return multiple top-level elements (the page and the modal)
        <>
            <div className="p-6 min-h-screen bg-slate-50">
                <h1 className="text-3xl font-bold text-center mb-8 text-slate-800">
                    My Bookings
                </h1>

                {bookings.length === 0 ? (
                    <div className="text-center py-20 px-6 bg-white rounded-xl shadow-md">
                         <h3 className="mt-2 text-lg font-medium text-slate-900">No Bookings Yet</h3>
                         <p className="mt-1 text-sm text-slate-500">When you book a ride, it will appear here.</p>
                    </div>
                ) : (
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {bookings.map((booking) => {
                            // 5. Check if the ride's date is in the past
                            const isRideCompleted = isPast(new Date(booking.ride?.date));

                            return (
                                <div key={booking.id} className="bg-white shadow-md rounded-xl p-6 flex flex-col justify-between transition-shadow hover:shadow-lg">
                                    <div>
                                        <h2 className="text-xl font-bold text-indigo-600 mb-3">
                                            {booking.ride?.source} → {booking.ride?.destination}
                                        </h2>
                                        <div className="space-y-3 text-slate-600 text-sm">
                                            <p className="flex items-center"><FaCalendarAlt className="mr-2 text-slate-400" /> {booking.ride?.date} at {booking.ride?.time}</p>
                                            <p className="flex items-center"><FaUser className="mr-2 text-slate-400" /> Driver: {booking.driver?.name}</p>
                                            <p className="flex items-center"><FaCar className="mr-2 text-slate-400" /> {booking.driver?.vehicleModel}</p>
                                            <p className="font-semibold">Seats Booked: {booking.seatsBooked}</p>
                                        </div>
                                        
                                        
                                        
                                    </div>
                                    <div className="mt-6 border-t pt-4">
                                        {booking.status === 'CANCELLED' ? (
                                            <div className="text-center text-sm py-2 bg-red-100 text-red-600 rounded-lg font-semibold">
                                                Booking Cancelled
                                            </div>
                                        ) : isRideCompleted ? (
                                            <button
                                                onClick={() => handleOpenModal(booking.id)}
                                                className="w-full bg-amber-400 text-amber-900 font-semibold py-2 rounded-lg hover:bg-amber-500 flex items-center justify-center transition-colors"
                                            >
                                                <FaStar className="mr-2" /> Leave a Review
                                            </button>
                                        ) : (
                                            <button
                                                onClick={() => handleCancelBooking(booking.id)}
                                                className="w-full bg-red-100 text-red-700 font-semibold py-2 rounded-lg hover:bg-red-200 transition-colors"
                                            >
                                                Cancel Booking
                                            </button>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* 7. Render the modal component */}
            <ReviewModal
                isOpen={isModalOpen}
                onRequestClose={handleCloseModal}
                bookingId={selectedBookingId}
                onReviewSubmit={handleReviewSubmitted}
            />
        </>
    );
}

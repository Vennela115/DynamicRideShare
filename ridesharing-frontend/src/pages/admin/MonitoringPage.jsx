import React, { useState, useEffect } from 'react';
import { getAllRides, getAllBookings, getAllPayments } from '../../services/adminService';
import { FiMap, FiBookmark, FiCreditCard } from 'react-icons/fi';
import { format } from 'date-fns'; // A popular library for date formatting: npm install date-fns

// --- Reusable Tab Component ---
const Tab = ({ label, icon, isActive, onClick }) => (
    <button
        onClick={onClick}
        className={`flex items-center px-4 py-3 text-sm font-semibold rounded-t-lg border-b-2 outline-none focus:outline-none transition-colors ${
            isActive
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
        }`}
    >
        {icon}
        {label}
    </button>
);

// --- Table Components for each data type ---

const RidesTable = ({ rides }) => (
    <table className="w-full text-sm text-left text-slate-500">
        <thead className="text-xs text-slate-700 uppercase bg-slate-50">
            <tr>
                <th className="px-6 py-3">Route</th>
                <th className="px-6 py-3">Driver</th>
                <th className="px-6 py-3">Date & Time</th>
                <th className="px-6 py-3">Seats Left</th>
                <th className="px-6 py-3">Price</th>
                <th className="px-6 py-3">Status</th>
            </tr>
        </thead>
        <tbody>
            { Array.isArray(rides) && rides.map(ride => (
                <tr key={ride.id} className="bg-white border-b hover:bg-slate-50">
                    <td className="px-6 py-4 font-bold text-slate-900">{ride.source} → {ride.destination}</td>
                    <td className="px-6 py-4">{ride.driver?.name || 'N/A'}</td>
                    <td className="px-6 py-4">{ride.date} at {ride.time}</td>
                    <td className="px-6 py-4 font-medium text-center">{ride.seatsAvailable}</td>
                    <td className="px-6 py-4 font-semibold">₹{ride.price}</td>
                    <td className="px-6 py-4">
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                            ride.status === 'ACTIVE' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>{ride.status || 'ACTIVE'}</span>
                    </td>
                </tr>
            ))}
        </tbody>
    </table>
);

const BookingsTable = ({ bookings }) => (
    <table className="w-full text-sm text-left text-slate-500">
        <thead className="text-xs text-slate-700 uppercase bg-slate-50">
            <tr>
                <th className="px-6 py-3">Booking ID</th>
                <th className="px-6 py-3">Ride Route</th>
                <th className="px-6 py-3">Passenger</th>
                <th className="px-6 py-3">Seats</th>
                <th className="px-6 py-3">Total Fare</th>
                <th className="px-6 py-3">Status</th>
            </tr>
        </thead>
        <tbody>
            {/* Add a safety check to ensure 'bookings' is an array */}
            {Array.isArray(bookings) && bookings.map(booking => (
                <tr key={booking.id} className="bg-white border-b hover:bg-slate-50">
                    <td className="px-6 py-4 font-medium text-slate-900">#{booking.id}</td>
                    {/* Use the new flattened properties from the DTO */}
                    <td className="px-6 py-4 font-semibold text-slate-800">{booking.rideRoute}</td>
                    <td className="px-6 py-4">{booking.passengerName}</td>
                    <td className="px-6 py-4 text-center font-medium">{booking.seatsBooked}</td>
                    <td className="px-6 py-4 font-semibold">₹{(booking.totalFare || 0).toFixed(2)}</td>
                    <td className="px-6 py-4">
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                            booking.status === 'CONFIRMED' ? 'bg-blue-100 text-blue-800' : 
                            booking.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' : 
                            'bg-gray-100 text-gray-800'
                        }`}>
                            {booking.status}
                        </span>
                    </td>
                </tr>
            ))}
        </tbody>
    </table>
);


const PaymentsTable = ({ payments }) => {
    // A safe default for when payments array might not be ready
    const paymentList = Array.isArray(payments) ? payments : [];

    return (
        <table className="w-full text-sm text-left text-slate-500">
            <thead className="text-xs text-slate-700 uppercase bg-slate-50">
                <tr>
                    <th className="px-6 py-3">Payment ID</th>
                    <th className="px-6 py-3">Booking ID</th>
                    <th className="px-6 py-3">Amount</th>
                    <th className="px-6 py-3">Platform Fee</th>
                    <th className="px-6 py-3">Driver Payout</th>
                    <th className="px-6 py-3">Timestamp</th>
                    <th className="px-6 py-3">Status</th>
                </tr>
            </thead>
            <tbody>
                {paymentList.map(payment => {
                    // --- THE DEFINITIVE FIX IS HERE ---
                    // Use Number() to convert potential nulls/strings to numbers.
                    // If the value is null, Number(null) correctly returns 0.
                    const amount = Number(payment.amount);
                    const platformFee = Number(payment.platformFee);
                    const driverPayout = amount - platformFee;
                    // -----------------------------------------------------------------

                    return (
                        <tr key={payment.id} className="bg-white border-b hover:bg-slate-50">
                            <td className="px-6 py-4 font-medium text-slate-900">#{payment.id}</td>
                            <td className="px-6 py-4">#{payment.bookingId}</td>
                            <td className="px-6 py-4 font-semibold text-slate-800">
                                {/* Now these calls are always safe because the variables are guaranteed numbers */}
                                ₹{amount.toFixed(2)}
                            </td>
                            <td className="px-6 py-4 text-amber-600">
                                ₹{platformFee.toFixed(2)}
                            </td>
                            <td className="px-6 py-4 text-green-600 font-semibold">
                                ₹{driverPayout.toFixed(2)}
                            </td>
                            <td className="px-6 py-4">{payment.createdAt ? format(new Date(payment.createdAt), 'PPpp') : 'N/A'}</td>
                            <td className="px-6 py-4">
                                <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                                    {payment.status}
                                </span>
                            </td>
                        </tr>
                    );
                })}
            </tbody>
        </table>
    );
};


export default function MonitoringPage() {
    const [activeTab, setActiveTab] = useState('rides');
    const [data, setData] = useState({ rides: [], bookings: [], payments: [] });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                // Fetch all data concurrently for better performance
                const [ridesData, bookingsData, paymentsData] = await Promise.all([
                    getAllRides(),
                    getAllBookings(),
                    getAllPayments()
                ]);
                setData({ rides: ridesData, bookings: bookingsData, payments: paymentsData });
            } catch (error) {
                console.error("Failed to fetch monitoring data:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const renderContent = () => {
        if (loading) {
            return <div className="p-8 text-center text-slate-500">Loading data...</div>;
        }

        const components = {
            rides: <RidesTable rides={data.rides} />,
            bookings: <BookingsTable bookings={data.bookings} />,
            payments: <PaymentsTable payments={data.payments} />,
        };
        
        const noDataMessages = {
            rides: "No rides have been created yet.",
            bookings: "No bookings have been made yet.",
            payments: "No payments have been processed yet.",
        };

        const currentData = data[activeTab];
        return currentData && currentData.length > 0
            ? components[activeTab]
            : <p className="p-8 text-center text-slate-500">{noDataMessages[activeTab]}</p>;
    };

    return (
        <div>
            <h1 className="text-3xl font-bold text-slate-800 mb-6">Platform Monitoring</h1>
            <div className="bg-white rounded-xl shadow-md">
                <div className="border-b border-slate-200">
                    <nav className="flex space-x-2 px-6">
                        <Tab label="All Rides" icon={<FiMap className="mr-2" />} isActive={activeTab === 'rides'} onClick={() => setActiveTab('rides')} />
                        <Tab label="All Bookings" icon={<FiBookmark className="mr-2" />} isActive={activeTab === 'bookings'} onClick={() => setActiveTab('bookings')} />
                        <Tab label="All Payments" icon={<FiCreditCard className="mr-2" />} isActive={activeTab === 'payments'} onClick={() => setActiveTab('payments')} />
                    </nav>
                </div>
                <div className="overflow-x-auto">
                    {renderContent()}
                </div>
            </div>
        </div>
    );
}
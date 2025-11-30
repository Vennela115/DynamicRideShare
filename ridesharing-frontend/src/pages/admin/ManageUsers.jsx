import React, { useEffect, useState } from 'react';
import UserTable from '../../components/admin/UserTable';
import { getAllDrivers, getAllPassengers, blockUser, unblockUser } from '../../services/adminService';

export default function ManageUsers() {
    const [drivers, setDrivers] = useState([]);
    const [passengers, setPassengers] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        setLoading(true);
        try {
            const driversData = await getAllDrivers();
            const passengersData = await getAllPassengers();
            setDrivers(driversData);
            setPassengers(passengersData);
        } catch (error) {
            console.error("Failed to fetch users:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleBlock = async (userId) => {
        if (window.confirm('Are you sure you want to block this user?')) {
            await blockUser(userId);
            fetchData(); // Refresh data
        }
    };

    const handleUnblock = async (userId) => {
        await unblockUser(userId);
        fetchData(); // Refresh data
    };

    if (loading) {
         return <p className="text-center text-slate-500">Loading user data...</p>;
    }

    return (
        <div>
            <h1 className="text-3xl font-bold text-slate-800 mb-6">User Management</h1>
            <div className="space-y-8">
                <UserTable title="Drivers" users={drivers} onBlock={handleBlock} onUnblock={handleUnblock} />
                <UserTable title="Passengers" users={passengers} onBlock={handleBlock} onUnblock={handleUnblock} />
            </div>
        </div>
    );
}
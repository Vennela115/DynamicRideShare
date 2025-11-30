import React, { useEffect, useState } from 'react';
import StatCard from '../../components/admin/StatCard';
import { getDashboardSummary } from '../../services/adminService';
import { FiUsers, FiMap, FiDollarSign, FiAlertTriangle,FiBriefcase } from 'react-icons/fi';

export default function AdminDashboard() {
    const [summary, setSummary] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSummary = async () => {
            try {
                const data = await getDashboardSummary();
                setSummary(data);
            } catch (error) {
                console.error("Failed to fetch dashboard summary:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchSummary();
    }, []);

    if (loading) {
        return <p className="text-center text-slate-500">Loading dashboard...</p>;
    }
    
    return (
        <div>
            <h1 className="text-3xl font-bold text-slate-800 mb-6">Dashboard Overview</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                <StatCard
                    icon={<FiUsers />}
                    title="Total Users"
                    value={summary?.totalUsers ?? '0'}
                    color="blue"
                />
                <StatCard
                    icon={<FiMap />}
                    title="Total Rides"
                    value={summary?.totalRides ?? '0'}
                    color="green"
                />
                <StatCard
                    icon={<FiBriefcase />}
                    title="Total Driver Payouts"
                    value={`₹${summary?.totalDriverEarnings.toFixed(2) ?? '0.00'}`}
                    color="purple" // You might need to add a 'purple' color class to StatCard
                />
                <StatCard
                    icon={<FiDollarSign />}
                    title="Platform Earnings"
                    value={`₹${summary?.totalPlatformEarnings.toFixed(2) ?? '0.00'}`}
                    color="amber"
                />
                <StatCard
                    icon={<FiAlertTriangle />}
                    title="Open Disputes"
                    value={summary?.openDisputes ?? '0'}
                    color="red"
                />
            </div>
             {/* You can add charts or recent activity lists here later */}
        </div>
    );
}
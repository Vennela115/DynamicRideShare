import React, { useEffect, useState } from 'react';
import { getWeeklyReport } from '../../services/adminService'; // You will create this
import { Bar, Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend } from 'chart.js';
import { FiTrendingUp, FiDollarSign, FiUsers, FiMap } from 'react-icons/fi';

// Register the necessary components for Chart.js
ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend);

const StatCard = ({ icon, title, value, color }) => (
    <div className={`p-6 bg-white rounded-xl shadow-md flex items-center space-x-4 border-l-4 ${color}`}>
        <div className="text-3xl">{icon}</div>
        <div>
            <p className="text-sm font-medium text-slate-500">{title}</p>
            <p className="text-2xl font-bold text-slate-800">{value}</p>
        </div>
    </div>
);

export default function WeeklyReports() {
    const [reportData, setReportData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await getWeeklyReport();
                setReportData(data);
            } catch (error) {
                console.error("Failed to fetch weekly report:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) {
        return <p className="text-center text-slate-500 animate-pulse">Generating weekly report...</p>;
    }

    // --- Prepare data for charts ---
    const labels = reportData.map(d => new Date(d.date).toLocaleDateString('en-US', { weekday: 'short' }));
    const weeklyTotals = {
        rides: reportData.reduce((sum, d) => sum + d.rideCount, 0),
        earnings: reportData.reduce((sum, d) => sum + d.totalEarnings, 0),
        newUsers: reportData.reduce((sum, d) => sum + d.newUserCount, 0),
    };

    const chartOptions = {
        responsive: true,
        plugins: { legend: { position: 'top' } },
        scales: { y: { beginAtZero: true } },
    };
    
    const ridesAndEarningsData = {
        labels,
        datasets: [
            {
                label: 'Rides per Day',
                data: reportData.map(d => d.rideCount),
                backgroundColor: 'rgba(79, 70, 229, 0.6)', // Indigo
                borderColor: 'rgba(79, 70, 229, 1)',
                borderWidth: 1,
            },
            {
                label: 'Earnings per Day (₹)',
                data: reportData.map(d => d.totalEarnings),
                backgroundColor: 'rgba(5, 150, 105, 0.6)', // Emerald
                borderColor: 'rgba(5, 150, 105, 1)',
                borderWidth: 1,
            },
        ],
    };

    const newUsersData = {
        labels,
        datasets: [{
            label: 'New User Signups',
            data: reportData.map(d => d.newUserCount),
            fill: true,
            backgroundColor: 'rgba(219, 39, 119, 0.2)', // Pink
            borderColor: 'rgba(219, 39, 119, 1)',
            tension: 0.3,
        }],
    };

    return (
        <div>
            <h1 className="text-3xl font-bold text-slate-800 mb-6">Weekly Performance Report</h1>
            
            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <StatCard icon={<FiMap className="text-indigo-500" />} title="Total Rides This Week" value={weeklyTotals.rides} color="border-indigo-500" />
                <StatCard icon={<FiDollarSign className="text-emerald-500" />} title="Platform Earnings" value={`₹${weeklyTotals.earnings.toFixed(2)}`} color="border-emerald-500" />
                <StatCard icon={<FiUsers className="text-pink-500" />} title="New Users This Week" value={weeklyTotals.newUsers} color="border-pink-500" />
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white p-6 rounded-xl shadow-md">
                    <h2 className="text-xl font-bold text-slate-800 mb-4">Rides & Earnings</h2>
                    <Bar options={chartOptions} data={ridesAndEarningsData} />
                </div>
                <div className="bg-white p-6 rounded-xl shadow-md">
                     <h2 className="text-xl font-bold text-slate-800 mb-4">New User Growth</h2>
                    <Line options={chartOptions} data={newUsersData} />
                </div>
            </div>
        </div>
    );
}

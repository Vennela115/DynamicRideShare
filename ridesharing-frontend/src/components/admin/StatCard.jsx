import React from 'react';

/**
 * A reusable card component to display key statistics on the dashboard.
 * @param {{icon: React.ReactNode, title: string, value: string | number, color: string}} props
 */
export default function StatCard({ icon, title, value, color }) {
    const colorClasses = {
        blue: 'from-blue-500 to-blue-400',
        green: 'from-green-500 to-green-400',
        amber: 'from-amber-500 to-amber-400',
        red: 'from-red-500 to-red-400',
    };

    return (
        <div className={`relative p-6 text-white rounded-xl bg-gradient-to-br ${colorClasses[color] || colorClasses.blue} shadow-lg`}>
            <div className="absolute top-4 right-4 text-white opacity-20 text-5xl">
                {icon}
            </div>
            <p className="text-sm font-medium uppercase tracking-wider">{title}</p>
            <p className="mt-2 text-4xl font-bold">{value}</p>
        </div>
    );
}
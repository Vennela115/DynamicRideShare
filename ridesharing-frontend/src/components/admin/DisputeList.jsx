import React from 'react';

export default function DisputeList({ disputes, onResolve }) {
    // Add a safety check to ensure 'disputes' is an array before rendering
    if (!Array.isArray(disputes)) {
        // You can return a loading state or null
        return <p>Loading disputes...</p>;
    }

    return (
        <div className="bg-white p-6 rounded-xl shadow-md">
            <h2 className="text-xl font-bold text-slate-800 mb-4">Dispute Resolution Center</h2>
            <div className="space-y-4">
                {disputes.map((dispute) => (
                    <div key={dispute.id} className="border rounded-lg p-4 bg-slate-50">
                        <div className="flex justify-between items-start">
                            <div>
                                {/* --- THIS IS THE FIX: Use the new DTO fields --- */}
                                <p className="font-semibold text-slate-800">Booking ID: #{dispute.bookingId}</p>
                                <p className="text-sm text-slate-600 mt-1">
                                    Reported by: {dispute.reportingUserName} ({dispute.reportingUserEmail})
                                </p>
                                <p className="mt-3 text-slate-700 italic">"{dispute.reason}"</p>
                            </div>
                            <div className="text-right">
                                <span className={`px-3 py-1 text-xs font-bold rounded-full ${
                                    dispute.status === 'OPEN' ? 'bg-amber-100 text-amber-800' : 'bg-green-100 text-green-800'
                                }`}>
                                    {dispute.status}
                                </span>
                                {dispute.status === 'OPEN' && (
                                     <button
                                        onClick={() => onResolve(dispute.id)}
                                        className="mt-4 w-full text-center bg-indigo-100 hover:bg-indigo-200 text-indigo-700 font-semibold py-2 px-4 rounded-lg text-sm transition-colors"
                                    >
                                        Mark as Resolved
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
                {disputes.length === 0 && <p className="text-center p-4 text-slate-500">No open disputes.</p>}
            </div>
        </div>
    );
}

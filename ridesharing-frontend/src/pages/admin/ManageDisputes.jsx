import React, { useEffect, useState } from 'react';
import DisputeList from '../../components/admin/DisputeList';
import { getAllDisputes, resolveDispute } from '../../services/adminService';

export default function ManageDisputes() {
    const [disputes, setDisputes] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        setLoading(true);
        try {
            const data = await getAllDisputes();
            setDisputes(data);
        } catch (error) {
            console.error("Failed to fetch disputes:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleResolve = async (disputeId) => {
        if (window.confirm('Are you sure you want to resolve this dispute?')) {
            await resolveDispute(disputeId);
            fetchData(); // Refresh data
        }
    };

    if (loading) {
        return <p className="text-center text-slate-500">Loading disputes...</p>;
    }

    return (
        <div>
            <h1 className="text-3xl font-bold text-slate-800 mb-6">Manage Disputes</h1>
            <DisputeList disputes={disputes} onResolve={handleResolve} />
        </div>
    );
}
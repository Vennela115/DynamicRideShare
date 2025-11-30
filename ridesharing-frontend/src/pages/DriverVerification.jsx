import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';
import useAuth from '../hooks/useAuth';
import { FiShield, FiCheckCircle } from 'react-icons/fi';

export default function DriverVerification() {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [licenseNumber, setLicenseNumber] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await API.post('/driver/submit-verification', { licenseNumber });
            setSuccess(true);
            setTimeout(() => {
                navigate('/driver/dashboard');
            }, 3000); // Redirect after 3 seconds
        } catch (err) {
            setError(err.response?.data?.message || 'Submission failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };
    
    // If submission is successful, show a confirmation message
    if (success) {
        return (
             <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4 text-center">
                 <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
                     <FiCheckCircle className="mx-auto h-16 w-16 text-green-500" />
                     <h1 className="text-2xl font-bold text-slate-900 mt-4">Verification Submitted!</h1>
                     <p className="text-slate-600 mt-2">
                         Thank you, {user?.name}. Our team will review your details within 24-48 hours. You will be notified via email upon approval.
                     </p>
                      <p className="text-slate-600 mt-4">Redirecting you to your dashboard...</p>
                 </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
                <div className="text-center">
                    <FiShield className="mx-auto h-12 w-12 text-indigo-500" />
                    <h1 className="text-3xl font-bold text-slate-900 mt-4">Final Step: Verification</h1>
                    <p className="text-slate-600 mt-2">
                        Please provide your Driving License number for verification.
                    </p>
                </div>

                {error && <div className="mt-4 text-sm text-red-600 bg-red-50 p-3 rounded-lg">{error}</div>}

                <form onSubmit={handleSubmit} className="mt-8 space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-slate-700">Driving License Number</label>
                        <input
                            type="text"
                            value={licenseNumber}
                            onChange={(e) => setLicenseNumber(e.target.value)}
                            className="mt-1 w-full p-3 border border-slate-300 rounded-lg shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                            placeholder="e.g., AP01 20230012345"
                            required
                        />
                    </div>
                    <button type="submit" disabled={loading || !licenseNumber} className="w-full rounded-lg bg-indigo-600 text-white py-3 font-semibold hover:bg-indigo-700 transition disabled:opacity-50">
                        {loading ? 'Submitting...' : 'Submit for Review'}
                    </button>
                </form>
            </div>
        </div>
    );
}

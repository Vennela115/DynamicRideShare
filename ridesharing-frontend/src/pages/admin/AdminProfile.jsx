import React from 'react';
import { FiUser, FiMail, FiShield } from 'react-icons/fi';

export default function AdminProfile() {
    // In a real app, this user info would come from an API call or be stored in a global state/context
    const adminUser = JSON.parse(localStorage.getItem('adminUser')) || { name: 'Admin', role: 'ROLE_ADMIN' };
    const adminEmail = 'admin@rideshare.com'; // This is static based on your backend config

    return (
        <div>
            <h1 className="text-3xl font-bold text-slate-800 mb-6">Admin Profile</h1>
            <div className="bg-white p-8 rounded-xl shadow-md max-w-lg">
                <div className="flex items-center space-x-4">
                    <div className="bg-indigo-100 p-4 rounded-full">
                        <FiUser className="h-8 w-8 text-indigo-600" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-slate-900">{adminUser.name}</h2>
                        <p className="text-slate-500">Platform Administrator</p>
                    </div>
                </div>
                <div className="mt-8 border-t pt-6 space-y-4">
                    <div className="flex items-center text-slate-700">
                        <FiMail className="h-5 w-5 mr-3 text-slate-400" />
                        <span>{adminEmail}</span>
                    </div>
                    <div className="flex items-center text-slate-700">
                        <FiShield className="h-5 w-5 mr-3 text-slate-400" />
                        <span className="font-semibold">{adminUser.role}</span>
                    </div>
                </div>
                {/* You can add platform fee settings or other admin-specific profile info here */}
            </div>
        </div>
    );
}
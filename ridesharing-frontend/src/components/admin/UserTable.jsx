import React from 'react';

/**
 * A reusable table to display and manage a list of users (drivers or passengers).
 * @param {{title: string, users: Array, onBlock: Function, onUnblock: Function}} props
 */
export default function UserTable({ title, users, onBlock, onUnblock }) {
    if (!users) {
        return <p>Loading users...</p>;
    }

    return (
        <div className="bg-white p-6 rounded-xl shadow-md">
            <h2 className="text-xl font-bold text-slate-800 mb-4">{title}</h2>
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-slate-500">
                    <thead className="text-xs text-slate-700 uppercase bg-slate-50">
                        <tr>
                            <th className="px-6 py-3">Name</th>
                            <th className="px-6 py-3">Email</th>
                            <th className="px-6 py-3">Status</th>
                            <th className="px-6 py-3 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user) => (
                            <tr key={user.id} className="bg-white border-b hover:bg-slate-50">
                                <td className="px-6 py-4 font-medium text-slate-900">{user.name}</td>
                                <td className="px-6 py-4">{user.email}</td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                                        user.enabled ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                    }`}>
                                        {user.enabled ? 'Active' : 'Blocked'}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right space-x-2">
                                    {user.enabled ? (
                                        <button
                                            onClick={() => onBlock(user.id)}
                                            className="font-medium text-red-600 hover:underline"
                                        >
                                            Block
                                        </button>
                                    ) : (
                                        <button
                                            onClick={() => onUnblock(user.id)}
                                            className="font-medium text-green-600 hover:underline"
                                        >
                                            Unblock
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                 {users.length === 0 && <p className="text-center p-4 text-slate-500">No users found.</p>}
            </div>
        </div>
    );
}
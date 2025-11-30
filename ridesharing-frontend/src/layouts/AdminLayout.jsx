import React from 'react';
import { Navigate, Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { FiGrid, FiUsers, FiAlertTriangle, FiUser, FiMonitor,  FiLogOut,FiTrendingUp } from 'react-icons/fi';

const SidebarLink = ({ to, icon, children }) => {
    const location = useLocation();
    const isActive = location.pathname === to;
    return (
        <Link
            to={to}
            className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                isActive ? 'bg-indigo-600 text-white' : 'text-slate-600 hover:bg-slate-100'
            }`}
        >
            {icon}
            {children}
        </Link>
    );
};

export default function AdminLayout() {
    const navigate = useNavigate();
    const token = localStorage.getItem('adminToken');
    const user = JSON.parse(localStorage.getItem('adminUser'));

    // Protection logic: Check for token and admin role
    if (!token || user?.role !== 'ROLE_ADMIN') {
        return <Navigate to="/admin/login" />;
    }

    const handleLogout = () => {
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminUser');
        navigate('/admin/login');
    };

    return (
        <div className="flex h-screen bg-slate-50">
            {/* Sidebar */}
            <aside className="w-64 flex-shrink-0 bg-white border-r p-4 flex flex-col">
                <h1 className="text-2xl font-bold text-indigo-600 px-4">Admin Panel</h1>
                <nav className="mt-8 space-y-2">
                    <SidebarLink to="/admin/dashboard" icon={<FiGrid className="mr-3" />}>Dashboard</SidebarLink>
                    <SidebarLink to="/admin/reports/weekly" icon={<FiTrendingUp className="mr-3" />}>Weekly Reports</SidebarLink>
                    <SidebarLink to="/admin/monitoring" icon={<FiMonitor className="mr-3" />}>Monitoring</SidebarLink>
                    <SidebarLink to="/admin/users" icon={<FiUsers className="mr-3" />}>Users</SidebarLink>
                    <SidebarLink to="/admin/disputes" icon={<FiAlertTriangle className="mr-3" />}>Disputes / Issues</SidebarLink>
                    <SidebarLink to="/admin/profile" icon={<FiUser className="mr-3" />}>Profile</SidebarLink>
                </nav>
                <div className="mt-auto">
                     <button
                        onClick={handleLogout}
                        className="flex items-center w-full px-4 py-3 text-sm font-medium rounded-lg text-slate-600 hover:bg-slate-100"
                    >
                        <FiLogOut className="mr-3" />
                        Logout
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-8 overflow-y-auto">
                <Outlet /> {/* This is where the specific admin page will be rendered */}
            </main>
        </div>
    );
}

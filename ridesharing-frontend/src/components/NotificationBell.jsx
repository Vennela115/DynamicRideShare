import React, { useState, useEffect, useRef } from 'react';
import { FaBell, FaCheckCircle, FaInfoCircle } from 'react-icons/fa';
import { getNotifications, markAllAsRead } from '../services/notificationService';
import { formatDistanceToNow } from 'date-fns';
import useAuth from '../hooks/useAuth'; 

export default function NotificationBell() {
	
     const { user } = useAuth(); 
    const [isOpen, setIsOpen] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const dropdownRef = useRef(null); // To detect clicks outside the dropdown

    const updateNotifications = () => {
        if (user?.email) {
            setNotifications(getNotifications(user.email));
        }
    };

    // Effect to load notifications and listen for updates
    useEffect(() => {
        updateNotifications();
        window.addEventListener('notifications_updated', updateNotifications);
        return () => window.removeEventListener('notifications_updated', updateNotifications);
    }, [user]);

    // Effect to handle closing the dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [dropdownRef]);


    const unreadCount = notifications.filter(n => !n.read).length;

    const handleToggle = () => {
        const willOpen = !isOpen;
        setIsOpen(willOpen);
        // If opening the dropdown and there are unread items, mark them as read after a delay
        if (willOpen && unreadCount > 0) {
            setTimeout(() => {
            	if (user?.email) {
                	markAllAsRead(user.email);
                }
            }, 2000); // 2-second delay
        }
    };
    
    const iconMap = {
        success: <FaCheckCircle className="text-green-500" />,
        info: <FaInfoCircle className="text-blue-500" />,
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={handleToggle}
                className="relative p-2 rounded-full text-slate-400 hover:bg-slate-700 hover:text-white focus:outline-none transition-colors"
            >
                <FaBell size={20} />
                {unreadCount > 0 && (
                    <span className="absolute top-0 right-0 block h-4 w-4 transform -translate-y-1/2 translate-x-1/2">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-4 w-4 bg-red-500 text-white text-xs items-center justify-center">
                            {unreadCount}
                        </span>
                    </span>
                )}
            </button>

            {/* Dropdown Menu */}
            {isOpen && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-lg shadow-xl border border-slate-200 z-50 animate-fadeIn">
                    <div className="p-3 border-b flex justify-between items-center">
                        <h3 className="font-semibold text-slate-800">Notifications</h3>
                        {/* You can add a "Mark all as read" button here if desired */}
                    </div>
                    <div className="max-h-96 overflow-y-auto">
                        {notifications.length > 0 ? (
                            notifications.map(notif => (
                                <div key={notif.id} className={`p-4 border-b border-slate-100 flex items-start space-x-3 transition-colors ${!notif.read ? 'bg-indigo-50' : 'hover:bg-slate-50'}`}>
                                    <div className="flex-shrink-0 mt-1">
                                        {iconMap[notif.type] || iconMap.info}
                                    </div>
                                    <div>
                                        <p className="text-sm text-slate-700">{notif.message}</p>
                                        <p className="text-xs text-slate-400 mt-1">
                                            {formatDistanceToNow(new Date(notif.timestamp), { addSuffix: true })}
                                        </p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="p-8 text-sm text-center text-slate-500">You have no notifications.</p>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

// Add this to your index.css for the animation
/*
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-fadeIn {
  animation: fadeIn 0.3s ease-out forwards;
}
*/

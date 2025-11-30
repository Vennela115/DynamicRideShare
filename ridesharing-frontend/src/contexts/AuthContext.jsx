import React, { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';
import { addNotification } from '../services/notificationService';

// 1. EXPORT the context as a NAMED export
export const AuthContext = createContext();

// 2. EXPORT the provider as the DEFAULT export
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');
        if (storedToken && storedUser) {
            try {
                setUser(JSON.parse(storedUser));
            } catch (e) {
                // Handle case where localStorage might have invalid JSON
                localStorage.clear();
            }
        }
    }, []);

    const login = async (credentials) => {
        const { data } = await API.post('/auth/login', credentials);
        
        const userData = {
            name: data.name,
            role: data.role.replace(/^ROLE_/, ""),
            email: credentials.email,
        };

        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);
        
         addNotification(`Welcome back, ${userData.name}!`, userData.email, 'success');

        if (userData.role === 'PASSENGER' || userData.role === 'ROLE_PASSENGER' ) {
            navigate('/passenger/dashboard');
        } else if (userData.role === 'DRIVER' || userData.role === 'ROLE_DRIVER') {
            navigate('/driver/dashboard');
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        // also clear any other session-related items
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminUser');
        setUser(null);
        navigate('/');
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};



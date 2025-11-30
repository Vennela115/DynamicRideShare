// src/services/api.js
import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:8080/api", // your Spring Boot backend URL
});

// Interceptor for attaching JWT token automatically
API.interceptors.request.use(
    (config) => {
        // This function runs before any request is sent.
        
        // We prioritize the admin token for admin routes.
        const adminToken = localStorage.getItem('adminToken');
        // We also check for the regular user token for the main app.
        const userToken = localStorage.getItem('token'); 
        
        // Determine which token to use. If an admin is logged in, use their token.
        // Otherwise, use the regular user's token.
        const token = adminToken || userToken;

        if (token) {
            // If a token exists, add it to the Authorization header.
            config.headers.Authorization = `Bearer ${token}`;
        }
        
        return config; // Continue with the request.
    },
    (error) => {
        // Handle request errors here.
        return Promise.reject(error);
    }
);
export default API;

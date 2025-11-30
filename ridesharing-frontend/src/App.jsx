// src/App.js
import { Routes, Route, useLocation } from "react-router-dom";
import React from "react";
import { AuthProvider } from "./contexts/AuthContext";

// --- Main App Pages ---
import LandingPage from "./pages/Auth/LandingPage";
import PassengerLogin from "./pages/Auth/PassengerLogin";
import PassengerRegister from "./pages/Auth/PassengerRegister";
import DriverLogin from "./pages/Auth/DriverLogin";
import DriverRegister from "./pages/Auth/DriverRegister";
import BookingPage from "./pages/BookingPage";
import DriverDashboard from "./pages/DriverDashboard";
import PassengerDashboard from "./pages/PassengerDashboard";
import PostRide from "./pages/PostRide";
import SearchRides from "./pages/SearchRides";
import ProtectedRoute from "./components/ProtectedRoute";
import MyRides from "./pages/MyRides";
import BookingsPage from "./pages/BookingsPage";
import Layout from "./components/Layout";
import FareEstimate from "./pages/FareEstimate";
import RouteMatch from "./pages/RouteMatch";
import PaymentPage from "./pages/PaymentPage";
import PaymentsHistory from "./pages/PaymentsHistory";
import NotificationTray from "./components/NotificationTray";
import ProfilePage from "./pages/ProfilePage";

// --- Admin Pages ---
import AdminLogin from './pages/admin/AdminLogin';
import AdminLayout from './layouts/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import ManageUsers from './pages/admin/ManageUsers';
import ManageDisputes from './pages/admin/ManageDisputes';
import AdminProfile from './pages/admin/AdminProfile';
import MonitoringPage from './pages/admin/MonitoringPage';
import WeeklyReports from './pages/admin/WeeklyReports';


import DriverVerification from './pages/DriverVerification';

import ChatbotWidget from './components/ChatbotWidget';
/**
 * A helper component to decide whether to show the main layout or the admin interface.
 */
function AppContent() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  // If it's an admin route, render the admin routes directly.
  // The AdminLayout will handle its own structure and protection.
  if (isAdminRoute) {
    return (
      <Routes>
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<AdminLayout />}>

           <Route path="monitoring" element={<MonitoringPage />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="reports/weekly" element={<WeeklyReports />} />
          <Route path="users" element={<ManageUsers />} />
          <Route path="disputes" element={<ManageDisputes />} />
          <Route path="profile" element={<AdminProfile />} />
        </Route>
      </Routes>
    );
  }

  // Otherwise, render the main application with its own layout and auth context.
  const user = JSON.parse(localStorage.getItem("user") || "null");
  const driverId = user?.role?.toLowerCase().includes("driver") ? user.id : null;
  const passengerId = user?.role?.toLowerCase().includes("passenger") ? user.id : null;
  
  return (
    <AuthProvider>
      <Layout>
        <NotificationTray driverId={driverId} passengerId={passengerId} />
        <Routes>
          {/* Landing Page */}
          <Route path="/" element={<LandingPage />} />

          {/* Auth Routes */}
          <Route path="/passenger/login" element={<PassengerLogin />} />
          <Route path="/passenger/register" element={<PassengerRegister />} />
          <Route path="/driver/login" element={<DriverLogin />} />
          <Route path="/driver/register" element={<DriverRegister />} />
          
           <Route
        path="/driver/verify"
        element={
            <ProtectedRoute allowedRoles={["DRIVER", "ROLE_DRIVER"]}>
                <DriverVerification />
            </ProtectedRoute>
        }
    />

          {/* Dashboards */}
          <Route
            path="/passenger/dashboard"
            element={<ProtectedRoute allowedRoles={["PASSENGER", "ROLE_PASSENGER"]}><PassengerDashboard /></ProtectedRoute>}
          />
          <Route
            path="/driver/dashboard"
            element={<ProtectedRoute allowedRoles={["DRIVER", "ROLE_DRIVER"]}><DriverDashboard /></ProtectedRoute>}
          />

          {/* Ride Features */}
          <Route
            path="/post-ride"
            element={<ProtectedRoute allowedRoles={["DRIVER", "ROLE_DRIVER"]}><PostRide /></ProtectedRoute>}
          />
          <Route
            path="/search-rides"
            element={<ProtectedRoute allowedRoles={["PASSENGER", "ROLE_PASSENGER"]}><SearchRides /></ProtectedRoute>}
          />
          <Route
            path="/book-ride"
            element={<ProtectedRoute allowedRoles={["PASSENGER", "ROLE_PASSENGER"]}><BookingPage /></ProtectedRoute>}
          />
          <Route
            path="/my-rides"
            element={<ProtectedRoute allowedRoles={["DRIVER", "ROLE_DRIVER"]}><MyRides /></ProtectedRoute>}
          />
          <Route
            path="/my-bookings"
            element={<ProtectedRoute allowedRoles={["PASSENGER", "ROLE_PASSENGER"]}><BookingsPage /></ProtectedRoute>}
          />

          {/* Other public/shared routes */}
          <Route path="/fare-estimate" element={<FareEstimate />} />
          <Route path="/route-match" element={<RouteMatch />} />
          <Route path="/pay" element={<PaymentPage />} />
          <Route path="/payments" element={<PaymentsHistory />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Routes>
      </Layout>
    </AuthProvider>
  );
}


function App() {
  // We need to wrap the AppContent with the Router, but the Router is not needed inside AppContent
  // This avoids issues with hooks like useLocation
  return (
    <> {/* 2. Wrap everything in a React Fragment */}
      <AppContent /> 
      {/* Your existing component with all the routes */}
      <ChatbotWidget /> 
      {/* 3. Add the widget here, outside the main content */}
    </>
  );
}

export default App;

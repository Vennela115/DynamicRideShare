import React, { useContext } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import {AuthContext} from '../contexts/AuthContext'; // 1. Import the context

const ProtectedRoute = ({ children, allowedRoles }) => {
    // 2. Get the user object from the context - this is the single source of truth
    const { user } = useContext(AuthContext);
    const location = useLocation();

    // 3. Check if the user object exists (this means they are logged in)
    if (!user) {
        // If no user is logged in, redirect them to the landing page to choose a login.
        // We pass the current location so they can be redirected back after logging in.
        return <Navigate to="/" state={{ from: location }} replace />;
    }

    // 4. Check if the user's role is in the list of allowed roles.
    // We get the role from the reliable `user.role` property.
    const userHasRequiredRole = allowedRoles && allowedRoles.includes(user.role);

    if (!userHasRequiredRole) {
        // If the user is logged in but has the wrong role (e.g., a passenger trying to access /post-ride),
        // we send them to their own dashboard instead of kicking them out completely.
        const dashboardPath = `/${user.role.toLowerCase()}/dashboard`;
        return <Navigate to={dashboardPath} replace />;
    }

    // 5. If all checks pass, render the child component (the protected page)
    return children;
};

export default ProtectedRoute;

import API from './api'; // Your existing configured Axios instance

/**
 * Logs in an admin user.
 */
export const adminLogin = async (credentials) => {
    // Using your dedicated admin login endpoint
    const { data } = await API.post('/auth/admin/login', credentials);
    return data;
};

/**
 * Fetches the summary statistics for the dashboard.
 */
export const getDashboardSummary = async () => {
    const { data } = await API.get('/admin/dashboard/summary');
    return data;
};

/**
 * Fetches all users with the 'ROLE_DRIVER'.
 */
export const getAllDrivers = async () => {
    const { data } = await API.get('/admin/users/drivers');
    return data;
};

/**
 * Fetches all users with the 'ROLE_PASSENGER'.
 */
export const getAllPassengers = async () => {
    const { data } = await API.get('/admin/users/passengers');
    return data;
};

/**
 * Fetches all disputes.
 */
export const getAllDisputes = async () => {
    const { data } = await API.get('/admin/disputes');
    return data;
};

/**
 * Blocks a user.
 */
export const blockUser = async (userId) => {
    const { data } = await API.put(`/admin/users/${userId}/block`);
    return data;
};

/**
 * Unblocks a user.
 */
export const unblockUser = async (userId) => {
    const { data } = await API.put(`/admin/users/${userId}/unblock`);
    return data;
};

/**
 * Resolves a dispute.
 */
export const resolveDispute = async (disputeId) => {
    const { data } = await API.put(`/admin/disputes/${disputeId}/resolve`);
    return data;
};

export const getAllRides = async () => {
    const { data } = await API.get('/admin/monitoring/rides');
    return data;
};

export const getAllBookings = async () => {
    const { data } = await API.get('/admin/monitoring/bookings');
    return data;
};

export const getAllPayments = async () => {
    const { data } = await API.get('/admin/monitoring/payments');
    return data;
};

export const getWeeklyReport = async () => {
    const { data } = await API.get('/admin/reports/weekly');
    return data;
};

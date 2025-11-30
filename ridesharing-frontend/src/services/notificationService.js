/**
 * A user-aware service for managing in-app notifications.
 * Notifications are stored in localStorage under a key unique to each user.
 */

// This function creates a unique key, e.g., 'notifications_passenger@example.com'
const getNotificationKey = (userEmail) => `app_notifications_${userEmail}`;

/**
 * Adds a new notification for a specific user.
 * @param {string} message The notification message.
 * @param {string} userEmail The email of the logged-in user.
 * @param {'success' | 'info'} type The type of notification.
 */
export const addNotification = (message, userEmail, type = 'info') => {
    if (!userEmail) {
        console.error("Cannot add notification without a user email.");
        return;
    }

    try {
        const NOTIFICATION_KEY = getNotificationKey(userEmail);
        const existing = getNotifications(userEmail);
        
        const newNotification = {
            id: new Date().getTime(),
            message,
            type,
            timestamp: new Date().toISOString(),
            read: false,
        };
        
        const updated = [newNotification, ...existing];
        
        if (updated.length > 10) {
            updated.pop();
        }

        localStorage.setItem(NOTIFICATION_KEY, JSON.stringify(updated));
        window.dispatchEvent(new Event('notifications_updated'));

    } catch (error) {
        console.error("Failed to add notification:", error);
    }
};

/**
 * Retrieves notifications for a specific user.
 * @param {string} userEmail The email of the logged-in user.
 * @returns {Array} An array of notification objects.
 */
export const getNotifications = (userEmail) => {
    if (!userEmail) {
        return [];
    }
    
    try {
        const NOTIFICATION_KEY = getNotificationKey(userEmail);
        const notificationsJson = localStorage.getItem(NOTIFICATION_KEY);
        return notificationsJson ? JSON.parse(notificationsJson) : [];
    } catch (error) {
        console.error("Failed to get notifications:", error);
        return [];
    }
};

/**
 * Marks all notifications as read for a specific user.
 * @param {string} userEmail The email of the logged-in user.
 */
export const markAllAsRead = (userEmail) => {
    if (!userEmail) return;

     try {
        const NOTIFICATION_KEY = getNotificationKey(userEmail);
        const notifications = getNotifications(userEmail);
        const readNotifications = notifications.map(n => ({ ...n, read: true }));
        localStorage.setItem(NOTIFICATION_KEY, JSON.stringify(readNotifications));
        window.dispatchEvent(new Event('notifications_updated'));
    } catch (error) {
        console.error("Failed to mark notifications as read:", error);
    }
}

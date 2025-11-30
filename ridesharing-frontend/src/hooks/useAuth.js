import { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext'; // Import the actual context

/**
 * A custom hook to simplify access to the AuthContext.
 * Instead of importing useContext and AuthContext in every component,
 * you can now just import and use this hook.
 */
const useAuth = () => {
    // This calls useContext on the imported AuthContext.
    // It will return the 'value' object from your AuthProvider.
    const context = useContext(AuthContext);

    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }

    // The context value is { user, login, logout }.
    // We can add a simple 'isAuthenticated' flag for convenience.
    return {
        ...context,
        isAuthenticated: !!context.user,
    };
};

export default useAuth;

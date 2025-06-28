import { createContext, useContext, useState, useEffect } from "react";

// Create the Auth Context
export const AuthContext = createContext();

// Custom Hook for easy access
export const useAuth = () => useContext(AuthContext);

// Auth Provider Component
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null); // Logged-in user data
    const [token, setToken] = useState(null); // JWT token

    // Load from localStorage on first render
    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        const storedToken = localStorage.getItem("token");
        const loginTime = localStorage.getItem("loginTime");

        if (storedUser && storedToken && loginTime) {
            const ONE_DAY_MS = 24 * 60 * 60 * 1000;
            const age = Date.now() - parseInt(loginTime, 10);

            if (age < ONE_DAY_MS) {
                setUser(JSON.parse(storedUser));
                setToken(storedToken);
            } else {
                // Expired
                localStorage.removeItem("user");
                localStorage.removeItem("token");
                localStorage.removeItem("loginTime");
            }
        }
    }, []);



    return (
        <AuthContext.Provider value={{ user, token,setUser,setToken}}>
            {children}
        </AuthContext.Provider>
    );
};

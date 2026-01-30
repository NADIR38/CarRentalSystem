import { createContext, useContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { setAccessToken, clearAccessToken, getAccessToken } from "./tokenStore";
import api from "../utils/axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Check for existing token on mount
    useEffect(() => {
        const token = getAccessToken();
        if (token) {
            try {
                const decoded = jwtDecode(token);
                setUser({
                    id: decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"],
                    email: decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"],
                    role: decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"]
                });
                console.log(decoded);
            } catch (error) {
                console.error("Invalid token:", error);
                clearAccessToken();
            }
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        const response = await api.post("/auth/login", { email, password });
        const token = response.data.accessToken;
        setAccessToken(token);
        const decoded = jwtDecode(token);
        setUser({
            id: decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"],
            email: decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"],
            role: decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"]
        });
    };

    const register = async (fullName, email, password) => {
        const response = await api.post("/auth/register", { userName: fullName, email: email, password: password });
    };

   const logout = async () => {
  await api.post("/auth/logout");
  clearAccessToken();
  setUser(null);
};


    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 to-cyan-600">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-white mx-auto mb-4"></div>
                    <p className="text-white text-xl font-semibold">Loading...</p>
                </div>
            </div>
        );
    }

    return (
        <AuthContext.Provider value={{ user, login, logout, register }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);   

import { useEffect } from "react";
import { useAuth } from "../Auth/authContext";
import { useNavigate } from "react-router-dom";

export default function Home() {
    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!user) {
            navigate("/login");
        } else if (user.role === "admin") {
            navigate("/admin/dashboard");
        } else {
            navigate("/user/dashboard");
        }
    }, [user, navigate]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 to-cyan-600">
            <div className="text-center">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-white mx-auto mb-4"></div>
                <p className="text-white text-xl font-semibold">Redirecting...</p>
            </div>
        </div>
    );
}
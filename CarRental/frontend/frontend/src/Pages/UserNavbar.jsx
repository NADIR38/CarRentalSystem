import { useState } from "react";
import { useAuth } from "../Auth/authContext";
import { useNavigate, Link } from "react-router-dom";

export default function UserNavbar() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const { logout, user } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate("/login");
    };

    return (
        <nav className="bg-white shadow-md sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
                            <span className="text-white font-bold text-xl">🚗</span>
                        </div>
                        <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                            CarRental
                        </h1>
                    </div>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-8">

                        <Link to="/user/cars" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
                            Browse Cars
                        </Link>
                        <Link to="/user/bookings" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
                            My Bookings
                        </Link>
                    </div>

                    {/* User Menu */}
                    <div className="hidden md:flex items-center gap-4">
                        <div className="flex items-center gap-2 bg-gray-100 rounded-lg px-4 py-2">
                            <div className="w-8 h-8 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                                U
                            </div>
                            <span className="text-sm font-medium text-gray-700">{user?.email || "User"}</span>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white font-semibold px-4 py-2 rounded-lg transition-all shadow-md hover:shadow-lg"
                        >
                            Logout
                        </button>
                    </div>

                    {/* Mobile menu button */}
                    <button
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="md:hidden p-2 rounded-lg text-gray-700 hover:bg-gray-100"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </button>
                </div>

                {/* Mobile Menu */}
                {mobileMenuOpen && (
                    <div className="md:hidden py-4 border-t border-gray-200">
                        <div className="flex flex-col gap-4">
                            <Link to="/user/dashboard" className="text-gray-700 hover:text-blue-600 font-medium">
                                Dashboard
                            </Link>
                            <Link to="/user/cars" className="text-gray-700 hover:text-blue-600 font-medium">
                                Browse Cars
                            </Link>
                            <Link to="/user/bookings" className="text-gray-700 hover:text-blue-600 font-medium">
                                My Bookings
                            </Link>
                            <button
                                onClick={handleLogout}
                                className="bg-gradient-to-r from-red-500 to-pink-500 text-white font-semibold px-4 py-2 rounded-lg w-full"
                            >
                                Logout
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
}

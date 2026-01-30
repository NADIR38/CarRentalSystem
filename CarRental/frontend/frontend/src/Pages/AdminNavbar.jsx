import { Link } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../Auth/authContext";
import { useNavigate } from "react-router-dom";

export default function AdminNavbar() {
    const [isOpen, setIsOpen] = useState(false);
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    return (
        <nav className="bg-gray-900 border-b border-gray-800 fixed w-full top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <div className="flex-shrink-0">
                        <Link to="/admin/dashboard" className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                            CarRental
                        </Link>
                    </div>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-8">
                        <Link to="/admin/dashboard" className="text-gray-300 hover:text-white font-medium transition-colors">
                            Dashboard
                        </Link>
                        <Link to="/admin/cars" className="text-gray-300 hover:text-white font-medium transition-colors">
                            Cars
                        </Link>
                        <Link to="/admin/bookings" className="text-gray-300 hover:text-white font-medium transition-colors">
                            Bookings
                        </Link>
                    </div>

                    {/* User Menu */}
                    <div className="hidden md:flex items-center gap-4">
                        <div className="flex items-center gap-2 bg-gray-800 rounded-lg px-4 py-2 border border-gray-700">
                            <div className="w-8 h-8 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                                A
                            </div>
                            <span className="text-sm font-medium text-white">{user?.email || "Admin"}</span>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white font-semibold px-4 py-2 rounded-lg transition-all"
                        >
                            Logout
                        </button>
                    </div>

                    {/* Mobile menu button */}
                    <div className="md:hidden">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="text-gray-400 hover:text-white focus:outline-none"
                        >
                            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile menu */}
            {isOpen && (
                <div className="md:hidden bg-gray-900 border-t border-gray-800">
                    <div className="px-2 pt-2 pb-3 space-y-1">
                        <Link to="/admin/dashboard" className="block text-gray-300 hover:text-white font-medium px-3 py-2 rounded-md">
                            Dashboard
                        </Link>
                        <Link to="/admin/cars" className="block text-gray-300 hover:text-white font-medium px-3 py-2 rounded-md">
                            Cars
                        </Link>
                        <Link to="/admin/bookings" className="block text-gray-300 hover:text-white font-medium px-3 py-2 rounded-md">
                            Bookings
                        </Link>
                        <button
                            onClick={handleLogout}
                            className="w-full text-left bg-gradient-to-r from-red-500 to-pink-500 text-white font-semibold px-3 py-2 rounded-md mt-2"
                        >
                            Logout
                        </button>
                    </div>
                </div>
            )}
        </nav>
    );
}

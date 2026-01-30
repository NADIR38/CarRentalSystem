import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../../utils/axios";
import UserNavbar from "../UserNavbar";

export default function UserBookingsList() {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchBookings();
    }, []);

    const fetchBookings = async () => {
        try {
            setLoading(true);
            const response = await api.get("/bookings");
            setBookings(response.data);
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
                <UserNavbar />
                <div className="flex items-center justify-center h-screen">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500 mx-auto mb-4"></div>
                        <p className="text-gray-900 text-xl font-semibold">Loading bookings...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            <UserNavbar />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-24">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">My Bookings</h1>
                    <p className="text-gray-600">View and manage your car rental bookings</p>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="bg-red-50 border border-red-300 rounded-lg p-4 mb-8">
                        <p className="text-red-600">Error: {error}</p>
                    </div>
                )}

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
                        <div className="text-gray-600 text-sm mb-2">Total Bookings</div>
                        <div className="text-3xl font-bold text-gray-900">{bookings.length}</div>
                    </div>
                    <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
                        <div className="text-gray-600 text-sm mb-2">Active Bookings</div>
                        <div className="text-3xl font-bold text-green-600">
                            {bookings.filter(b => b.status === "Active").length}
                        </div>
                    </div>
                    <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
                        <div className="text-gray-600 text-sm mb-2">Completed</div>
                        <div className="text-3xl font-bold text-blue-600">
                            {bookings.filter(b => b.status === "Completed").length}
                        </div>
                    </div>
                </div>

                {/* Bookings Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {bookings.map((booking) => (
                        <div key={booking.id} className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all p-6 border border-gray-200">
                            <div className="flex items-start justify-between mb-4">
                                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center text-2xl">
                                    🚗
                                </div>
                                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${booking.status === 'Active' ? 'bg-green-100 text-green-700' :
                                        booking.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' :
                                            booking.status === 'Completed' ? 'bg-blue-100 text-blue-700' :
                                                'bg-gray-100 text-gray-700'
                                    }`}>
                                    {booking.status}
                                </span>
                            </div>

                            <h3 className="text-xl font-bold text-gray-900 mb-1">
                                {booking.carMake} {booking.carModel}
                            </h3>
                            <p className="text-gray-600 text-sm mb-4">Booking #{booking.id}</p>

                            <div className="space-y-2 mb-4">
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-gray-600">Start Date:</span>
                                    <span className="text-gray-900 font-semibold">
                                        {new Date(booking.startDate).toLocaleDateString()}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-gray-600">End Date:</span>
                                    <span className="text-gray-900 font-semibold">
                                        {new Date(booking.endDate).toLocaleDateString()}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between pt-2 border-t border-gray-200">
                                    <span className="text-gray-600 font-medium">Total:</span>
                                    <span className="text-blue-600 font-bold text-xl">${booking.totalPrice}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {bookings.length === 0 && !loading && (
                    <div className="text-center py-12 bg-white rounded-2xl shadow-lg">
                        <div className="text-gray-400 text-6xl mb-4">📅</div>
                        <p className="text-gray-600 text-lg mb-4">No bookings yet.</p>
                        <Link
                            to="/user/cars"
                            className="inline-block bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-semibold px-6 py-3 rounded-lg transition-all shadow-md"
                        >
                            Browse Cars
                        </Link>
                    </div>
                )}
            </main>
        </div>
    );
}

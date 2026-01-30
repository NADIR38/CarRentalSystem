import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../../utils/axios";
import AdminNavbar from "../AdminNavbar";

export default function AdminBookingsList() {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [search, setSearch] = useState("");
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [showStatusModal, setShowStatusModal] = useState(false);
    const [newStatus, setNewStatus] = useState("");

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

    const openStatusModal = (booking) => {
        setSelectedBooking(booking);
        setNewStatus(booking.status);
        setShowStatusModal(true);
    };

    const handleUpdateStatus = async (e) => {
        e.preventDefault();
        try {
            await api.put(`/bookings/${selectedBooking.id}/status`, JSON.stringify(newStatus), {
                headers: { "Content-Type": "application/json" }
            });
            setShowStatusModal(false);
            fetchBookings();
            alert("Booking status updated successfully!");
        } catch (error) {
            alert("Error updating status: " + error.message);
        }
    };

    const filteredBookings = bookings.filter(booking =>
        booking.userEmail?.toLowerCase().includes(search.toLowerCase()) ||
        booking.carMake?.toLowerCase().includes(search.toLowerCase()) ||
        booking.carModel?.toLowerCase().includes(search.toLowerCase()) ||
        booking.id?.toString().includes(search)
    );

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
                <AdminNavbar />
                <div className="flex items-center justify-center h-screen">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-cyan-500 mx-auto mb-4"></div>
                        <p className="text-white text-xl font-semibold">Loading bookings...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
            <AdminNavbar />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-24">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-white mb-2">Manage Bookings</h1>
                    <p className="text-gray-400">View and manage all customer bookings</p>
                </div>

                {/* Search Bar */}
                <div className="mb-8">
                    <input
                        type="text"
                        placeholder="Search by customer, car, or booking ID..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    />
                </div>

                {/* Error Message */}
                {error && (
                    <div className="bg-red-900/50 border border-red-700 rounded-lg p-4 mb-8">
                        <p className="text-red-300">Error: {error}</p>
                    </div>
                )}

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <div className="bg-gray-800/50 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-6">
                        <div className="text-gray-400 text-sm mb-2">Total Bookings</div>
                        <div className="text-3xl font-bold text-white">{bookings.length}</div>
                    </div>
                    <div className="bg-gray-800/50 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-6">
                        <div className="text-gray-400 text-sm mb-2">Active</div>
                        <div className="text-3xl font-bold text-green-400">
                            {bookings.filter(b => b.status === "Active").length}
                        </div>
                    </div>
                    <div className="bg-gray-800/50 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-6">
                        <div className="text-gray-400 text-sm mb-2">Pending</div>
                        <div className="text-3xl font-bold text-yellow-400">
                            {bookings.filter(b => b.status === "Pending").length}
                        </div>
                    </div>
                    <div className="bg-gray-800/50 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-6">
                        <div className="text-gray-400 text-sm mb-2">Completed</div>
                        <div className="text-3xl font-bold text-blue-400">
                            {bookings.filter(b => b.status === "Completed").length}
                        </div>
                    </div>
                </div>

                {/* Bookings Table */}
                <div className="bg-gray-800/50 backdrop-blur-xl border border-gray-700/50 rounded-2xl overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-900/50">
                                <tr className="border-b border-gray-700">
                                    <th className="text-left py-4 px-6 text-gray-400 font-semibold text-sm">ID</th>
                                    <th className="text-left py-4 px-6 text-gray-400 font-semibold text-sm">Customer</th>
                                    <th className="text-left py-4 px-6 text-gray-400 font-semibold text-sm">Car</th>
                                    <th className="text-left py-4 px-6 text-gray-400 font-semibold text-sm">Start Date</th>
                                    <th className="text-left py-4 px-6 text-gray-400 font-semibold text-sm">End Date</th>
                                    <th className="text-left py-4 px-6 text-gray-400 font-semibold text-sm">Amount</th>
                                    <th className="text-left py-4 px-6 text-gray-400 font-semibold text-sm">Status</th>
                                    <th className="text-left py-4 px-6 text-gray-400 font-semibold text-sm">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredBookings.map((booking) => (
                                    <tr key={booking.id} className="border-b border-gray-700/50 hover:bg-gray-700/30 transition-colors">
                                        <td className="py-4 px-6 text-white font-medium">#{booking.id}</td>
                                        <td className="py-4 px-6 text-white">{booking.userEmail}</td>
                                        <td className="py-4 px-6 text-gray-300">{booking.carMake} {booking.carModel}</td>
                                        <td className="py-4 px-6 text-gray-300 text-sm">
                                            {new Date(booking.startDate).toLocaleDateString()}
                                        </td>
                                        <td className="py-4 px-6 text-gray-300 text-sm">
                                            {new Date(booking.endDate).toLocaleDateString()}
                                        </td>
                                        <td className="py-4 px-6 text-white font-semibold">${booking.totalPrice}</td>
                                        <td className="py-4 px-6">
                                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${booking.status === 'Active' ? 'bg-green-500/20 text-green-400 border border-green-500/30' :
                                                    booking.status === 'Pending' ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' :
                                                        booking.status === 'Completed' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' :
                                                            'bg-gray-500/20 text-gray-400 border border-gray-500/30'
                                                }`}>
                                                {booking.status}
                                            </span>
                                        </td>
                                        <td className="py-4 px-6">
                                            <button
                                                onClick={() => openStatusModal(booking)}
                                                className="bg-cyan-500 hover:bg-cyan-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all"
                                            >
                                                Update Status
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {filteredBookings.length === 0 && !loading && (
                        <div className="text-center py-12">
                            <p className="text-gray-400 text-lg">No bookings found.</p>
                        </div>
                    )}
                </div>
            </main>

            {/* Status Update Modal */}
            {showStatusModal && selectedBooking && (
                <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-gray-800 rounded-2xl p-8 max-w-md w-full shadow-2xl border border-gray-700">
                        <h2 className="text-2xl font-bold text-white mb-6">
                            Update Booking Status
                        </h2>
                        <div className="mb-6">
                            <p className="text-gray-400 text-sm mb-2">Booking #{selectedBooking.id}</p>
                            <p className="text-white font-medium">{selectedBooking.carMake} {selectedBooking.carModel}</p>
                            <p className="text-gray-400 text-sm">{selectedBooking.userEmail}</p>
                        </div>
                        <form onSubmit={handleUpdateStatus} className="space-y-4">
                            <div>
                                <label className="block text-gray-300 font-medium mb-2">Status</label>
                                <select
                                    value={newStatus}
                                    onChange={(e) => setNewStatus(e.target.value)}
                                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                                    required
                                >
                                    <option value="Pending">Pending</option>
                                    <option value="Active">Active</option>
                                    <option value="Completed">Completed</option>
                                    <option value="Cancelled">Cancelled</option>
                                </select>
                            </div>

                            <div className="flex gap-4 mt-6">
                                <button
                                    type="button"
                                    onClick={() => setShowStatusModal(false)}
                                    className="flex-1 bg-gray-700 hover:bg-gray-600 text-white font-semibold py-2 rounded-lg transition-all"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-semibold py-2 rounded-lg transition-all"
                                >
                                    Update Status
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

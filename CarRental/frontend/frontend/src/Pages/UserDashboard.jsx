import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../utils/axios";
import UserNavbar from "./UserNavbar";

export default function UserDashboard() {
    const [loading, setLoading] = useState(true);
    const [dashboardData, setDashboardData] = useState(null);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            const response = await api.get("/dashboard/user");
            setDashboardData(response.data);
        } catch (error) {
            console.error("Error fetching dashboard data:", error);
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
                        <p className="text-gray-900 text-xl font-semibold">Loading dashboard...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            <UserNavbar />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">My Dashboard</h1>
                    <p className="text-gray-600">Track your bookings and activity</p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
                        <div className="flex items-start justify-between mb-4">
                            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center text-2xl">
                                📅
                            </div>
                        </div>
                        <h3 className="text-gray-600 text-sm font-medium mb-1">Active Bookings</h3>
                        <p className="text-3xl font-bold text-gray-900">{dashboardData?.activeBookings || 0}</p>
                    </div>

                    <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
                        <div className="flex items-start justify-between mb-4">
                            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center text-2xl">
                                📊
                            </div>
                        </div>
                        <h3 className="text-gray-600 text-sm font-medium mb-1">Total Bookings</h3>
                        <p className="text-3xl font-bold text-gray-900">{dashboardData?.totalBookings || 0}</p>
                    </div>

                    <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
                        <div className="flex items-start justify-between mb-4">
                            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center text-2xl">
                                💰
                            </div>
                        </div>
                        <h3 className="text-gray-600 text-sm font-medium mb-1">Total Spent</h3>
                        <p className="text-3xl font-bold text-gray-900">${dashboardData?.totalSpent?.toFixed(2) || 0}</p>
                    </div>

                    <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
                        <div className="flex items-start justify-between mb-4">
                            <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center text-2xl">
                                ⭐
                            </div>
                        </div>
                        <h3 className="text-gray-600 text-sm font-medium mb-1">Loyalty Points</h3>
                        <p className="text-3xl font-bold text-gray-900">{dashboardData?.loyaltyPoints || 0}</p>
                    </div>
                </div>

                {/* Tabs */}
                <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold text-gray-900">My Bookings</h2>
                        <Link
                            to="/user/cars"
                            className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-semibold px-4 py-2 rounded-lg transition-all shadow-md"
                        >
                            Book a Car
                        </Link>
                    </div>

                    {/* Bookings Table */}
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-gray-200">
                                    <th className="text-left py-3 px-4 text-gray-600 font-semibold text-sm">Car</th>
                                    <th className="text-left py-3 px-4 text-gray-600 font-semibold text-sm">Start Date</th>
                                    <th className="text-left py-3 px-4 text-gray-600 font-semibold text-sm">End Date</th>
                                    <th className="text-left py-3 px-4 text-gray-600 font-semibold text-sm">Status</th>
                                    <th className="text-left py-3 px-4 text-gray-600 font-semibold text-sm">Amount</th>
                                </tr>
                            </thead>
                            <tbody>
                                {dashboardData?.myBookings?.map((booking) => (
                                    <tr key={booking.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                                        <td className="py-3 px-4 text-gray-900 font-medium">
                                            {booking.carMake} {booking.carModel}
                                        </td>
                                        <td className="py-3 px-4 text-gray-600">
                                            {new Date(booking.startDate).toLocaleDateString()}
                                        </td>
                                        <td className="py-3 px-4 text-gray-600">
                                            {new Date(booking.endDate).toLocaleDateString()}
                                        </td>
                                        <td className="py-3 px-4">
                                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${booking.status === 'Active' ? 'bg-green-100 text-green-700' :
                                                    booking.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' :
                                                        booking.status === 'Completed' ? 'bg-blue-100 text-blue-700' :
                                                            'bg-gray-100 text-gray-700'
                                                }`}>
                                                {booking.status}
                                            </span>
                                        </td>
                                        <td className="py-3 px-4 text-gray-900 font-semibold">${booking.totalPrice}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {(!dashboardData?.myBookings || dashboardData.myBookings.length === 0) && (
                            <div className="text-center py-12">
                                <p className="text-gray-500">No bookings yet. Start by browsing our cars!</p>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}

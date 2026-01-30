import { useState, useEffect } from "react";
import AdminNavbar from "./AdminNavbar";
import api from "../utils/axios";

export default function AdminDashboard() {
    const [loading, setLoading] = useState(true);
    const [dashboardData, setDashboardData] = useState(null);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            const response = await api.get("/dashboard/admin");
            setDashboardData(response.data);
        } catch (error) {
            console.error("Error fetching dashboard data:", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
                <AdminNavbar />
                <div className="flex items-center justify-center h-screen">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-cyan-500 mx-auto mb-4"></div>
                        <p className="text-white text-xl font-semibold">Loading dashboard...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
            <AdminNavbar />

            <main className="pt-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-white mb-2">Admin Dashboard</h1>
                    <p className="text-gray-400">Welcome back! Here's what's happening today.</p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {[
                        { name: "Total Cars", value: dashboardData?.totalCars || 0, icon: "🚗", color: "from-blue-500 to-cyan-500" },
                        { name: "Active Bookings", value: dashboardData?.activeBookings || 0, icon: "📅", color: "from-purple-500 to-pink-500" },
                        { name: "Total Revenue", value: `$${dashboardData?.totalRevenue?.toFixed(2) || 0}`, icon: "💰", color: "from-green-500 to-emerald-500" },
                        { name: "Total Customers", value: dashboardData?.totalCustomers || 0, icon: "👥", color: "from-orange-500 to-red-500" },
                    ].map((stat, index) => (
                        <div key={index} className="relative group">
                            <div className="absolute inset-0 bg-gradient-to-r opacity-20 group-hover:opacity-30 rounded-2xl blur-xl transition-all"></div>
                            <div className="relative bg-gray-800/50 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-6 hover:border-gray-600/50 transition-all">
                                <div className="flex items-start justify-between mb-4">
                                    <div className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center text-2xl shadow-lg`}>
                                        {stat.icon}
                                    </div>
                                </div>
                                <h3 className="text-gray-400 text-sm font-medium mb-1">{stat.name}</h3>
                                <p className="text-3xl font-bold text-white">{stat.value}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Recent Bookings Table */}
                <div className="bg-gray-800/50 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-6">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h3 className="text-xl font-bold text-white">Recent Bookings</h3>
                            <p className="text-gray-400 text-sm mt-1">Latest booking activities</p>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-gray-700">
                                    <th className="text-left py-4 px-4 text-gray-400 font-semibold text-sm">ID</th>
                                    <th className="text-left py-4 px-4 text-gray-400 font-semibold text-sm">Customer</th>
                                    <th className="text-left py-4 px-4 text-gray-400 font-semibold text-sm">Car</th>
                                    <th className="text-left py-4 px-4 text-gray-400 font-semibold text-sm">Duration</th>
                                    <th className="text-left py-4 px-4 text-gray-400 font-semibold text-sm">Status</th>
                                    <th className="text-left py-4 px-4 text-gray-400 font-semibold text-sm">Amount</th>
                                </tr>
                            </thead>
                            <tbody>
                                {dashboardData?.recentBookings?.map((booking) => (
                                    <tr key={booking.id} className="border-b border-gray-700/50 hover:bg-gray-700/30 transition-colors">
                                        <td className="py-4 px-4 text-white font-medium">#{booking.id}</td>
                                        <td className="py-4 px-4 text-white">{booking.userEmail}</td>
                                        <td className="py-4 px-4 text-gray-300">{booking.carMake} {booking.carModel}</td>
                                        <td className="py-4 px-4 text-gray-300 text-sm">
                                            {new Date(booking.startDate).toLocaleDateString()} - {new Date(booking.endDate).toLocaleDateString()}
                                        </td>
                                        <td className="py-4 px-4">
                                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${booking.status === 'Active' ? 'bg-green-500/20 text-green-400 border border-green-500/30' :
                                                    booking.status === 'Pending' ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' :
                                                        'bg-gray-500/20 text-gray-400 border border-gray-500/30'
                                                }`}>
                                                {booking.status}
                                            </span>
                                        </td>
                                        <td className="py-4 px-4 text-white font-semibold">${booking.totalPrice}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {(!dashboardData?.recentBookings || dashboardData.recentBookings.length === 0) && (
                            <div className="text-center py-12">
                                <p className="text-gray-400">No bookings yet.</p>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}

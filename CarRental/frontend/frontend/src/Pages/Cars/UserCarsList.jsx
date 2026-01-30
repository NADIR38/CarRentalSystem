import { useState, useEffect } from "react";
import api from "../../utils/axios";
import UserNavbar from "../UserNavbar";

export default function UserCarsList() {
    const [cars, setCars] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [search, setSearch] = useState("");
    const [showRentModal, setShowRentModal] = useState(false);
    const [selectedCar, setSelectedCar] = useState(null);
    const [rentData, setRentData] = useState({
        startDate: "",
        endDate: ""
    });

    useEffect(() => {
        fetchCars();
    }, [search]);

    const fetchCars = async () => {
        try {
            setLoading(true);
            const response = await api.get(`/cars${search ? `?search=${search}` : ""}`);
            setCars(response.data);
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const openRentModal = (car) => {
        setSelectedCar(car);
        setShowRentModal(true);
    };

    const handleRentCar = async (e) => {
        e.preventDefault();
        try {
            await api.post("/bookings", {
                carId: selectedCar.id,
                startDate: rentData.startDate,
                endDate: rentData.endDate
            });
            setShowRentModal(false);
            setRentData({ startDate: "", endDate: "" });
            setSelectedCar(null);
            alert("Booking created successfully! Check your dashboard to view it.");
        } catch (error) {
            const errorMsg = error.response?.data || error.message;
            alert(`Error creating booking: ${typeof errorMsg === 'string' ? errorMsg : JSON.stringify(errorMsg)}`);
        }
    };

    const calculateDays = () => {
        if (!rentData.startDate || !rentData.endDate) return 0;
        const start = new Date(rentData.startDate);
        const end = new Date(rentData.endDate);
        const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
        return days > 0 ? days : 0;
    };

    const calculateTotal = () => {
        return calculateDays() * (selectedCar?.pricePerDay || 0);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
                <UserNavbar />
                <div className="flex items-center justify-center h-screen">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500 mx-auto mb-4"></div>
                        <p className="text-gray-900 text-xl font-semibold">Loading cars...</p>
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
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">Available Cars</h1>
                    <p className="text-gray-600">Browse and rent from our premium fleet</p>
                </div>

                {/* Search Bar */}
                <div className="mb-8">
                    <input
                        type="text"
                        placeholder="Search by make, model, or license plate..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
                    />
                </div>

                {/* Error Message */}
                {error && (
                    <div className="bg-red-50 border border-red-300 rounded-lg p-4 mb-8">
                        <p className="text-red-600">Error: {error}</p>
                    </div>
                )}

                {/* Cars Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {cars.map((car) => (
                        <div key={car.id} className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all p-6 border border-gray-200">
                            <div className="flex items-start justify-between mb-4">
                                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center text-3xl shadow-md">
                                    🚗
                                </div>
                                <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-semibold">
                                    Available
                                </span>
                            </div>

                            <h3 className="text-2xl font-bold text-gray-900 mb-1">
                                {car.make} {car.model}
                            </h3>
                            <p className="text-gray-600 text-sm mb-4">Year: {car.year}</p>

                            <div className="space-y-2 mb-6">
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-gray-600">License Plate:</span>
                                    <span className="text-gray-900 font-semibold">{car.licensePlate}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-600">Price per Day:</span>
                                    <span className="text-blue-600 font-bold text-2xl">${car.pricePerDay}</span>
                                </div>
                            </div>

                            <button
                                onClick={() => openRentModal(car)}
                                className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-semibold py-3 rounded-lg transition-all shadow-md hover:shadow-lg"
                            >
                                Rent Now
                            </button>
                        </div>
                    ))}
                </div>

                {cars.length === 0 && !loading && (
                    <div className="text-center py-12">
                        <p className="text-gray-600 text-lg">No cars available at the moment.</p>
                    </div>
                )}
            </main>

            {/* Rent Modal */}
            {showRentModal && selectedCar && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">
                            Rent {selectedCar.make} {selectedCar.model}
                        </h2>
                        <form onSubmit={handleRentCar} className="space-y-4">
                            <div>
                                <label className="block text-gray-700 font-medium mb-2">Start Date</label>
                                <input
                                    type="date"
                                    required
                                    min={new Date().toISOString().split('T')[0]}
                                    value={rentData.startDate}
                                    onChange={(e) => setRentData({ ...rentData, startDate: e.target.value })}
                                    className="w-full bg-gray-50 border border-gray-300 rounded-lg px-4 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-gray-700 font-medium mb-2">End Date</label>
                                <input
                                    type="date"
                                    required
                                    min={rentData.startDate || new Date().toISOString().split('T')[0]}
                                    value={rentData.endDate}
                                    onChange={(e) => setRentData({ ...rentData, endDate: e.target.value })}
                                    className="w-full bg-gray-50 border border-gray-300 rounded-lg px-4 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            {/* Summary */}
                            <div className="bg-blue-50 rounded-lg p-4 space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">Price per day:</span>
                                    <span className="font-semibold text-gray-900">${selectedCar.pricePerDay}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">Number of days:</span>
                                    <span className="font-semibold text-gray-900">{calculateDays()}</span>
                                </div>
                                <div className="border-t border-blue-200 pt-2 flex justify-between">
                                    <span className="font-bold text-gray-900">Total:</span>
                                    <span className="font-bold text-blue-600 text-xl">${calculateTotal()}</span>
                                </div>
                            </div>

                            <div className="flex gap-4 mt-6">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowRentModal(false);
                                        setRentData({ startDate: "", endDate: "" });
                                    }}
                                    className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 rounded-lg transition-all"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-semibold py-2 rounded-lg transition-all"
                                >
                                    Confirm Booking
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../../utils/axios";
import AdminNavbar from "../AdminNavbar";

export default function AdminCarsList() {
    const [cars, setCars] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [search, setSearch] = useState("");
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedCar, setSelectedCar] = useState(null);
    const [formData, setFormData] = useState({
        make: "",
        model: "",
        year: new Date().getFullYear(),
        licensePlate: "",
        pricePerDay: "",
        color: "",
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

    const handleAddCar = async (e) => {
        e.preventDefault();
        try {
            await api.post("/cars", formData);
            setShowAddModal(false);
            resetForm();
            fetchCars();
        } catch (error) {
            alert("Error adding car: " + error.message);
        }
    };

    const handleEditCar = async (e) => {
        e.preventDefault();
        try {
            await api.put(`/cars/${selectedCar.id}`, { ...selectedCar, ...formData });
            setShowEditModal(false);
            resetForm();
            fetchCars();
        } catch (error) {
            alert("Error updating car: " + error.message);
        }
    };

    const handleDeleteCar = async (id) => {
        if (!window.confirm("Are you sure you want to delete this car?")) return;
        try {
            await api.delete(`/cars/${id}`);
            fetchCars();
        } catch (error) {
            alert("Error deleting car: " + error.message);
        }
    };

    const openEditModal = (car) => {
        setSelectedCar(car);
        setFormData({
            make: car.make,
            model: car.model,
            year: car.year,
            licensePlate: car.licensePlate,
            pricePerDay: car.pricePerDay,
            color: car.color
        });
        setShowEditModal(true);
    };

    const resetForm = () => {
        setFormData({
            make: "",
            model: "",
            year: new Date().getFullYear(),
            licensePlate: "",
            pricePerDay: "",
            color: ""
        });
        setSelectedCar(null);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
                <AdminNavbar />
                <div className="flex items-center justify-center h-screen">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-cyan-500 mx-auto mb-4"></div>
                        <p className="text-white text-xl font-semibold">Loading cars...</p>
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
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-4xl font-bold text-white mb-2">Car Management</h1>
                        <p className="text-gray-400">Manage your rental fleet</p>
                    </div>
                    <button
                        onClick={() => setShowAddModal(true)}
                        className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-semibold px-6 py-3 rounded-lg transition-all shadow-md hover:shadow-lg flex items-center gap-2"
                    >
                        <span className="text-xl">+</span> Add New Car
                    </button>
                </div>

                {/* Search Bar */}
                <div className="mb-8">
                    <input
                        type="text"
                        placeholder="Search by make, model, or license plate..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    />
                </div>

                {/* Error Message */}
                {error && (
                    <div className="bg-red-500/10 border border-red-500 rounded-lg p-4 mb-8">
                        <p className="text-red-500">Error: {error}</p>
                    </div>
                )}

                {/* Cars Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {cars.map((car) => (
                        <div key={car.id} className="bg-gray-800/50 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-6 hover:shadow-xl transition-all">
                            <div className="flex items-start justify-between mb-4">
                                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center text-3xl shadow-lg">
                                    🚗
                                </div>
                                <span className="bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-xs font-semibold">
                                    Available
                                </span>
                            </div>

                            <h3 className="text-2xl font-bold text-white mb-1">
                                {car.make} {car.model}
                            </h3>
                            <p className="text-gray-400 text-sm mb-4">Year: {car.year}</p>

                            <div className="space-y-2 mb-6">
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-gray-400">License Plate:</span>
                                    <span className="text-white font-semibold">{car.licensePlate}</span>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-gray-400">Price per Day:</span>
                                    <span className="text-cyan-400 font-bold text-lg">${car.pricePerDay}</span>
                                </div>
                            </div>

                            <div className="flex gap-2">
                                <button
                                    onClick={() => openEditModal(car)}
                                    className="flex-1 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 font-semibold py-2 rounded-lg transition-all"
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() => handleDeleteCar(car.id)}
                                    className="flex-1 bg-red-500/20 hover:bg-red-500/30 text-red-400 font-semibold py-2 rounded-lg transition-all"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {cars.length === 0 && !loading && (
                    <div className="text-center py-12">
                        <p className="text-gray-400 text-lg">No cars found. Add your first car to get started!</p>
                    </div>
                )}
            </main>

            {/* Add Car Modal */}
            {showAddModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-gray-800 rounded-2xl p-8 max-w-md w-full border border-gray-700">
                        <h2 className="text-2xl font-bold text-white mb-6">Add New Car</h2>
                        <form onSubmit={handleAddCar} className="space-y-4">
                            <div>
                                <label className="block text-gray-300 mb-2">Make</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.make}
                                    onChange={(e) => setFormData({ ...formData, make: e.target.value })}
                                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                                />
                            </div>
                            <div>
                                <label className="block text-gray-300 mb-2">Model</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.model}
                                    onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                                />
                            </div>
                            <div>
                                <label className="block text-gray-300 mb-2">Year</label>
                                <input
                                    type="number"
                                    required
                                    value={formData.year}
                                    onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) })}
                                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                                />
                            </div>
                            <div>
                                <label className="block text-gray-300 mb-2">Color</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.color}
                                    onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                                />
                            </div>
                            <div>
                                <label className="block text-gray-300 mb-2">License Plate</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.licensePlate}
                                    onChange={(e) => setFormData({ ...formData, licensePlate: e.target.value })}
                                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                                />
                            </div>
                            <div>
                                <label className="block text-gray-300 mb-2">Price per Day ($)</label>
                                <input
                                    type="number"
                                    required
                                    step="0.01"
                                    value={formData.pricePerDay}
                                    onChange={(e) => setFormData({ ...formData, pricePerDay: parseFloat(e.target.value) })}
                                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                                />
                            </div>
                            <div className="flex gap-4 mt-6">
                                <button
                                    type="button"
                                    onClick={() => { setShowAddModal(false); resetForm(); }}
                                    className="flex-1 bg-gray-700 hover:bg-gray-600 text-white font-semibold py-2 rounded-lg transition-all"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-semibold py-2 rounded-lg transition-all"
                                >
                                    Add Car
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Edit Car Modal */}
            {showEditModal && selectedCar && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-gray-800 rounded-2xl p-8 max-w-md w-full border border-gray-700">
                        <h2 className="text-2xl font-bold text-white mb-6">Edit Car</h2>
                        <form onSubmit={handleEditCar} className="space-y-4">
                            <div>
                                <label className="block text-gray-300 mb-2">Make</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.make}
                                    onChange={(e) => setFormData({ ...formData, make: e.target.value })}
                                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                                />
                            </div>
                            <div>
                                <label className="block text-gray-300 mb-2">Model</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.model}
                                    onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                                />
                            </div>
                            <div>
                                <label className="block text-gray-300 mb-2">Year</label>
                                <input
                                    type="number"
                                    required
                                    value={formData.year}
                                    onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) })}
                                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                                />
                            </div>
                            <div>
                                <label className="block text-gray-300 mb-2">Color</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.color}
                                    onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                                />
                            </div>
                            <div>
                                <label className="block text-gray-300 mb-2">License Plate</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.licensePlate}
                                    onChange={(e) => setFormData({ ...formData, licensePlate: e.target.value })}
                                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                                />
                            </div>
                            <div>
                                <label className="block text-gray-300 mb-2">Price per Day ($)</label>
                                <input
                                    type="number"
                                    required
                                    step="0.01"
                                    value={formData.pricePerDay}
                                    onChange={(e) => setFormData({ ...formData, pricePerDay: parseFloat(e.target.value) })}
                                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                                />
                            </div>
                            <div className="flex gap-4 mt-6">
                                <button
                                    type="button"
                                    onClick={() => { setShowEditModal(false); resetForm(); }}
                                    className="flex-1 bg-gray-700 hover:bg-gray-600 text-white font-semibold py-2 rounded-lg transition-all"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-semibold py-2 rounded-lg transition-all"
                                >
                                    Save Changes
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

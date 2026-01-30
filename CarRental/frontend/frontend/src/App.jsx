import { useState } from 'react'

import './App.css'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from './Pages/Login.jsx';
import { AuthProvider } from './Auth/authContext.jsx';
import Register from './Pages/Register.jsx';
import Home from './Pages/Home.jsx';
import AdminDashboard from './Pages/AdminDashboard.jsx';
import UserDashboard from './Pages/UserDashboard.jsx';
import AdminCarsList from './Pages/Cars/AdminCarsList.jsx';
import UserCarsList from './Pages/Cars/UserCarsList.jsx';
import AdminBookingsList from './Pages/Bookings/AdminBookingsList.jsx';
import UserBookingsList from './Pages/Bookings/UserBookingsList.jsx';
import ProtectedRoute from './Auth/protectedRoute.jsx';
function App() {
  return (

    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/admin/dashboard" element={<ProtectedRoute allowedRoles={["admin"]}><AdminDashboard /></ProtectedRoute>} />
        <Route path="/admin/cars" element={<ProtectedRoute allowedRoles={["admin"]}><AdminCarsList /></ProtectedRoute>} />
        <Route path="/admin/bookings" element={<ProtectedRoute allowedRoles={["admin"]}><AdminBookingsList /></ProtectedRoute>} />
        <Route path="/user/dashboard" element={<ProtectedRoute allowedRoles={["user"]}><UserDashboard /></ProtectedRoute>} />
        <Route path="/user/cars" element={<ProtectedRoute allowedRoles={["user"]}><UserCarsList /></ProtectedRoute>} />
        <Route path="/user/bookings" element={<ProtectedRoute allowedRoles={["user"]}><UserBookingsList /></ProtectedRoute>} />

      </Routes>
    </BrowserRouter>

  );
}

export default App

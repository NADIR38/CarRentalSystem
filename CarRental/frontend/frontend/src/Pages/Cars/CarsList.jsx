import { useState } from "react";
import api from "../../utils/axios";
import { useEffect } from "react";

const CarsList = () => {
    const [cars, setCars] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCars = async () => {
            try {
                const response = await api.get("/cars");
                setCars(response.data);
            } catch (error) {
                setError(error);
            } finally {
                setLoading(false);
            }
        };
        fetchCars();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error.message}</div>;
    }

    return (
        <div>
            <h1>Cars List</h1>
            <ul>
                {cars.map(car => (
                    <li key={car.id}>
                        <h2>{car.make} {car.model}</h2>
                        <p>{car.year}</p>
                        <p>{car.price}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
};
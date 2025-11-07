import React, { useEffect, useState } from "react";
import axios from "axios";

export default function CartPage() {
    const [creations, setCreations] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            alert("Debes iniciar sesión para ver tu carrito.");
            setLoading(false);
            return;
        }

        axios
            .get("http://localhost:8080/api/creations/my", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            .then((res) => {
                setCreations(res.data);
            })
            .catch((err) => {
                console.error("Error al obtener las creaciones:", err);
                if (err.response?.status === 401) {
                    alert("Sesión expirada. Inicia sesión nuevamente.");
                }
            })
            .finally(() => setLoading(false));
    }, []);

    if (loading) return <p>Cargando...</p>;

    return (
        <div className="p-4 max-w-3xl mx-auto">
            <h1 className="text-3xl font-bold mb-4 text-center">Mi Carrito</h1>

            {creations.length === 0 ? (
                <p className="text-center text-gray-500">
                    No tenés creaciones en tu carrito todavía.
                </p>
            ) : (
                <ul className="space-y-4">
                    {creations.map((creation) => (
                        <li
                            key={creation.creationId}
                            className="border rounded-lg p-4 shadow-sm bg-white"
                        >
                            <p>
                                <strong>Producto:</strong>{" "}
                                {creation.product?.name || "Sin producto"}
                            </p>
                            <p>
                                <strong>Toppings:</strong>{" "}
                                {creation.toppings?.map((t) => t.name).join(", ") ||
                                    "Sin toppings"}
                            </p>
                            <p>
                                <strong>Dressings:</strong>{" "}
                                {creation.dressings?.map((d) => d.name).join(", ") ||
                                    "Sin dressings"}
                            </p>
                            <p>
                                <strong>Favorito:</strong>{" "}
                                {creation.favourite ? "Sí ❤️" : "No"}
                            </p>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
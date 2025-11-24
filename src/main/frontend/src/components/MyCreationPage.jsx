import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { authService } from "../services/authService";

export default function MyCreationsPage() {
    const [creations, setCreations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filterFavorites, setFilterFavorites] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        // Verificar autenticación
        if (!authService.isAuthenticated()) {
            alert("Debes iniciar sesión para ver tus creaciones.");
            navigate("/login");
            return;
        }
        if (authService.isAdmin()) {
            alert("Debes iniciar sesión como cliente para ver tus creaciones");
            navigate("/");
            return;
        }

        loadCreations();
    }, [filterFavorites, navigate]);

    const loadCreations = async () => {
        setLoading(true);
        try {
            const userId = authService.getUserId();
            console.log('🎨 Cargando creaciones para userId:', userId);

            if (!userId) {
                alert("Error al obtener información del usuario.");
                navigate("/login");
                return;
            }

            const token = authService.getToken();
            const endpoint = filterFavorites
                ? `http://localhost:8080/api/creations/user/${userId}/favorites`
                : `http://localhost:8080/api/creations/user/${userId}`;

            const response = await axios.get(endpoint, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            console.log('✅ Creaciones cargadas:', response.data);
            setCreations(response.data);
        } catch (error) {
            console.error("❌ Error al cargar creaciones:", error);
            if (error.response?.status === 401) {
                alert("Sesión expirada. Inicia sesión nuevamente.");
                authService.logout();
                navigate("/login");
            } else {
                alert("Error al cargar creaciones. Intenta nuevamente.");
            }
        } finally {
            setLoading(false);
        }
    };

    const toggleFavorite = async (creationId) => {
        try {
            const userId = authService.getUserId();
            const token = authService.getToken();

            await axios.post(
                `http://localhost:8080/api/creations/${creationId}/favorite?userId=${userId}`,
                {},
                { headers: { 'Authorization': `Bearer ${token}` } }
            );

            console.log('✅ Favorito actualizado');
            loadCreations(); // Recargar la lista
        } catch (error) {
            console.error("❌ Error al actualizar favorito:", error);
            alert("Error al actualizar favorito. Intenta nuevamente.");
        }
    };

    const addToCart = async (creationId) => {
        try {
            const userId = authService.getUserId();
            const token = authService.getToken();

            await axios.post(
                `http://localhost:8080/api/creations/${creationId}/add-to-cart?userId=${userId}`,
                {},
                { headers: { 'Authorization': `Bearer ${token}` } }
            );

            console.log('✅ Agregado al carrito');
            alert("¡Creación agregada al carrito!");
        } catch (error) {
            console.error("❌ Error al agregar al carrito:", error);
            alert("Error al agregar al carrito. Intenta nuevamente.");
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-teal-700 flex items-center justify-center">
                <p className="text-white text-xl">Cargando tus creaciones...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-teal-700 py-8 px-4">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-white mb-2">Mis Creaciones</h1>
                    <p className="text-teal-100">
                        Tu historial de pizzas y hamburguesas personalizadas
                    </p>
                </div>

                {/* Filtros y acciones */}
                <div className="bg-white rounded-lg shadow-lg p-4 mb-6">
                    <div className="flex flex-wrap justify-between items-center gap-4">
                        {/* Filtro de favoritos */}
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => setFilterFavorites(false)}
                                className={`px-6 py-2 rounded-lg font-semibold transition-all ${
                                    !filterFavorites
                                        ? 'bg-teal-700 text-white shadow-md'
                                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                }`}
                            >
                                📚 Todas las Creaciones
                            </button>
                            <button
                                onClick={() => setFilterFavorites(true)}
                                className={`px-6 py-2 rounded-lg font-semibold transition-all ${
                                    filterFavorites
                                        ? 'bg-teal-700 text-white shadow-md'
                                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                }`}
                            >
                                ⭐ Solo Favoritos
                            </button>
                        </div>

                        {/* Contador */}
                        <div className="text-gray-600 font-semibold">
                            {creations.length} {creations.length === 1 ? 'creación' : 'creaciones'}
                        </div>
                    </div>
                </div>

                {/* Lista de creaciones */}
                {creations.length === 0 ? (
                    <div className="bg-white rounded-lg shadow-lg p-12 text-center">
                        <div className="mb-4">
                            <svg className="w-24 h-24 mx-auto text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                            </svg>
                        </div>
                        <h2 className="text-2xl font-bold text-gray-700 mb-2">
                            {filterFavorites ? 'No tienes creaciones favoritas aún' : 'No tienes creaciones aún'}
                        </h2>
                        <p className="text-gray-500 mb-6">
                            {filterFavorites
                                ? '¡Marca tus creaciones favoritas para encontrarlas fácilmente!'
                                : '¡Empieza a crear tu pizza o hamburguesa perfecta!'}
                        </p>
                        <button
                            onClick={() => navigate("/creaciones")}
                            className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-3 px-8 rounded-lg transition-colors"
                        >
                            Crear ahora
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {creations.map((creation) => (
                            <div
                                key={creation.creationId}
                                className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow overflow-hidden"
                            >
                                {/* Header de la card */}
                                <div className={`p-4 ${
                                    creation.productType === 'PIZZA' ? 'bg-red-500' : 'bg-amber-500'
                                }`}>
                                    <div className="flex justify-between items-start">
                                        <div className="flex items-center gap-3">
                                            <span className="text-4xl">
                                                {creation.productType === 'PIZZA' ? '🍕' : '🍔'}
                                            </span>
                                            <div className="text-white">
                                                <h3 className="text-xl font-bold">
                                                    {creation.productType === 'PIZZA' ? 'Pizza' : 'Hamburguesa'}
                                                </h3>
                                                <p className="text-sm opacity-90">
                                                    {formatDate(creation.creationDate)}
                                                </p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => toggleFavorite(creation.creationId)}
                                            className="text-3xl transition-transform hover:scale-110"
                                        >
                                            {creation.favourite ? '⭐' : '☆'}
                                        </button>
                                    </div>
                                </div>

                                {/* Contenido de la card */}
                                <div className="p-4">
                                    {/* Ingredientes base */}
                                    <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                                        {creation.productType === 'PIZZA' ? (
                                            <div className="space-y-1 text-sm">
                                                <div className="flex justify-between">
                                                    <span className="font-semibold text-gray-600">Tamaño:</span>
                                                    <span className="text-gray-800">{creation.size}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="font-semibold text-gray-600">Masa:</span>
                                                    <span className="text-gray-800">{creation.dough}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="font-semibold text-gray-600">Salsa:</span>
                                                    <span className="text-gray-800">{creation.sauce}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="font-semibold text-gray-600">Queso:</span>
                                                    <span className="text-gray-800">{creation.cheese}</span>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="space-y-1 text-sm">
                                                <div className="flex justify-between">
                                                    <span className="font-semibold text-gray-600">Pan:</span>
                                                    <span className="text-gray-800">{creation.bread}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="font-semibold text-gray-600">Carne:</span>
                                                    <span className="text-gray-800">
                                                                          {creation.meat}
                                                        {creation.meatQuantity && creation.meatQuantity > 1 && (
                                                            <span className="ml-2 px-2 py-1 bg-amber-200 text-amber-800 text-xs rounded-full">
                                                                x{creation.meatQuantity}
                                                            </span>
                                                        )}
                                                    </span>
                                                </div>
                                                {creation.cheese && (
                                                    <div className="flex justify-between">
                                                        <span className="font-semibold text-gray-600">Queso:</span>
                                                        <span className="text-gray-800">{creation.cheese}</span>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>

                                    {/* Toppings */}
                                    {creation.toppings && creation.toppings.length > 0 && (
                                        <div className="mb-3">
                                            <h4 className="font-semibold text-green-700 text-sm mb-2">
                                                ✨ Toppings:
                                            </h4>
                                            <div className="flex flex-wrap gap-2">
                                                {creation.toppings.map((topping, idx) => (
                                                    <span
                                                        key={idx}
                                                        className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full"
                                                    >
                                                        {topping}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Dressings */}
                                    {creation.dressings && creation.dressings.length > 0 && (
                                        <div className="mb-3">
                                            <h4 className="font-semibold text-yellow-700 text-sm mb-2">
                                                🧂 Aderezos:
                                            </h4>
                                            <div className="flex flex-wrap gap-2">
                                                {creation.dressings.map((dressing, idx) => (
                                                    <span
                                                        key={idx}
                                                        className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full"
                                                    >
                                                        {dressing}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Información adicional */}
                                    <div className="flex items-center justify-between pt-3 border-t">
                                        <div className="text-sm text-gray-600">
                                            Pedida {creation.orderCount} {creation.orderCount === 1 ? 'vez' : 'veces'}
                                        </div>
                                        <div className="text-xl font-bold text-teal-700">
                                            ${creation.totalPrice}
                                        </div>
                                    </div>

                                    {/* Botón agregar al carrito */}
                                    <button
                                        onClick={() => addToCart(creation.creationId)}
                                        className="w-full mt-4 bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                                        </svg>
                                        Agregar al Carrito
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
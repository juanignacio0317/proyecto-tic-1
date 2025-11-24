import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { authService } from "../services/authService";

export default function AddressesPage() {
    const [addresses, setAddresses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAddForm, setShowAddForm] = useState(false);
    const [newAddress, setNewAddress] = useState("");
    const [editingAddress, setEditingAddress] = useState(null);
    const [editedAddress, setEditedAddress] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        if (!authService.isAuthenticated() || authService.isAdmin()) {
            alert("Debes iniciar sesión como cliente");
            navigate("/login");
            return;
        }

        loadAddresses();
    }, [navigate]);

    const loadAddresses = async () => {
        try {
            const userId = authService.getUserId();
            const token = authService.getToken();

            console.log('🔍 UserId:', userId);
            console.log('🔍 Token existe:', !!token);

            if (!token || !userId) {
                alert("Error de autenticación. Por favor, inicia sesión nuevamente.");
                authService.logout();
                navigate("/login");
                return;
            }

            const response = await axios.get(
                `http://localhost:8080/api/addresses/${userId}`,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            console.log('✅ Direcciones cargadas:', response.data);
            setAddresses(response.data.addresses || []);
        } catch (error) {
            console.error("❌ Error al cargar direcciones:", error);

            if (error.response?.status === 403 || error.response?.status === 401) {
                alert("Sesión expirada. Por favor, inicia sesión nuevamente.");
                authService.logout();
                navigate("/login");
            } else {
                alert("Error al cargar las direcciones");
            }
        } finally {
            setLoading(false);
        }
    };

    const handleAddAddress = async (e) => {
        e.preventDefault();

        if (!newAddress.trim()) {
            alert("Por favor, ingresa una dirección");
            return;
        }

        try {
            const userId = authService.getUserId();
            const token = authService.getToken();

            if (!token || !userId) {
                alert("Error de autenticación. Por favor, inicia sesión nuevamente.");
                authService.logout();
                navigate("/login");
                return;
            }

            await axios.post(
                `http://localhost:8080/api/addresses/${userId}`,
                { address: newAddress },
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            alert("Dirección agregada exitosamente");
            setShowAddForm(false);
            setNewAddress("");
            loadAddresses();
        } catch (error) {
            console.error("Error al agregar dirección:", error);

            if (error.response?.status === 403 || error.response?.status === 401) {
                alert("Sesión expirada. Por favor, inicia sesión nuevamente.");
                authService.logout();
                navigate("/login");
            } else if (error.response?.data?.message) {
                alert(error.response.data.message);
            } else {
                alert("Error al agregar la dirección");
            }
        }
    };

    const handleDeleteAddress = async (address) => {
        if (!window.confirm(`¿Estás seguro de eliminar la dirección "${address}"?`)) {
            return;
        }

        try {
            const userId = authService.getUserId();
            const token = authService.getToken();

            if (!token || !userId) {
                alert("Error de autenticación. Por favor, inicia sesión nuevamente.");
                authService.logout();
                navigate("/login");
                return;
            }

            await axios.delete(
                `http://localhost:8080/api/addresses/${userId}`,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                    data: { address: address }
                }
            );

            alert("Dirección eliminada");
            loadAddresses();
        } catch (error) {
            console.error("Error al eliminar dirección:", error);

            if (error.response?.status === 403 || error.response?.status === 401) {
                alert("Sesión expirada. Por favor, inicia sesión nuevamente.");
                authService.logout();
                navigate("/login");
            } else {
                alert("Error al eliminar la dirección");
            }
        }
    };

    const handleEditAddress = async (oldAddress) => {
        if (!editedAddress.trim()) {
            alert("Por favor, ingresa una dirección válida");
            return;
        }

        try {
            const userId = authService.getUserId();
            const token = authService.getToken();

            if (!token || !userId) {
                alert("Error de autenticación. Por favor, inicia sesión nuevamente.");
                authService.logout();
                navigate("/login");
                return;
            }

            await axios.put(
                `http://localhost:8080/api/addresses/${userId}?oldAddress=${encodeURIComponent(oldAddress)}`,
                { address: editedAddress },
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            alert("Dirección actualizada exitosamente");
            setEditingAddress(null);
            setEditedAddress("");
            loadAddresses();
        } catch (error) {
            console.error("Error al actualizar dirección:", error);

            if (error.response?.status === 403 || error.response?.status === 401) {
                alert("Sesión expirada. Por favor, inicia sesión nuevamente.");
                authService.logout();
                navigate("/login");
            } else {
                alert("Error al actualizar la dirección");
            }
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-teal-700 flex items-center justify-center">
                <p className="text-white text-xl">Cargando...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-teal-700 py-8 px-4">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-white mb-2">Mis Direcciones</h1>
                    <p className="text-teal-100">Gestiona tus direcciones de entrega</p>
                </div>

                <div className="mb-6 flex justify-between items-center">
                    <button
                        onClick={() => navigate(-1)}
                        className="bg-white text-teal-700 px-4 py-2 rounded-lg font-semibold hover:bg-teal-50 transition-colors flex items-center gap-2"
                    >
                        <span className="material-icons">arrow_back</span>
                        Volver
                    </button>

                    <button
                        onClick={() => setShowAddForm(!showAddForm)}
                        className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-3 px-6 rounded-lg transition-colors flex items-center gap-2"
                    >
                        <span className="material-icons">add</span>
                        {showAddForm ? 'Cancelar' : 'Agregar Dirección'}
                    </button>
                </div>

                {showAddForm && (
                    <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">Nueva Dirección</h2>
                        <form onSubmit={handleAddAddress} className="space-y-4">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Dirección *
                                </label>
                                <input
                                    type="text"
                                    value={newAddress}
                                    onChange={(e) => setNewAddress(e.target.value)}
                                    required
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                                    placeholder="Ej: Av. Italia 1122"
                                />
                            </div>

                            <button
                                type="submit"
                                className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold py-3 rounded-lg transition-colors"
                            >
                                Guardar Dirección
                            </button>
                        </form>
                    </div>
                )}

                {addresses.length === 0 ? (
                    <div className="bg-white rounded-lg shadow-lg p-12 text-center">
                        <span className="text-6xl mb-4 block">📍</span>
                        <h2 className="text-2xl font-bold text-gray-700 mb-2">
                            No tienes direcciones guardadas
                        </h2>
                        <p className="text-gray-500">
                            Agrega una dirección para facilitar tus pedidos
                        </p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {addresses.map((address, index) => (
                            <div
                                key={index}
                                className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
                            >
                                {editingAddress === address ? (
                                    <div className="space-y-4">
                                        <input
                                            type="text"
                                            value={editedAddress}
                                            onChange={(e) => setEditedAddress(e.target.value)}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                                            placeholder="Nueva dirección"
                                        />
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => handleEditAddress(address)}
                                                className="flex-1 bg-teal-600 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded-lg transition-colors"
                                            >
                                                Guardar
                                            </button>
                                            <button
                                                onClick={() => {
                                                    setEditingAddress(null);
                                                    setEditedAddress("");
                                                }}
                                                className="flex-1 bg-gray-400 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded-lg transition-colors"
                                            >
                                                Cancelar
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex justify-between items-center">
                                        <div className="flex items-center gap-3">
                                            <span className="text-3xl">📍</span>
                                            <div>
                                                <p className="text-lg font-semibold text-gray-800">{address}</p>
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => {
                                                    setEditingAddress(address);
                                                    setEditedAddress(address);
                                                }}
                                                className="text-teal-600 hover:text-teal-700 transition-colors p-2"
                                                title="Editar dirección"
                                            >
                                                <span className="material-icons">edit</span>
                                            </button>
                                            <button
                                                onClick={() => handleDeleteAddress(address)}
                                                className="text-red-500 hover:text-red-700 transition-colors p-2"
                                                title="Eliminar dirección"
                                            >
                                                <span className="material-icons">delete</span>
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
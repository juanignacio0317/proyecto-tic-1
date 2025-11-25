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
            Swal.fire({
                icon: "warning",
                title: "Acceso restringido",
                text: "Debes iniciar sesión como cliente para gestionar tus direcciones.",
                confirmButtonColor: "#1B7F79"
            }).then(() => {
                navigate("/login");
            });
            return;
        }

        loadAddresses();
    }, [navigate]);

    const loadAddresses = async () => {
        try {
            const userId = authService.getUserId();
            const token = authService.getToken();

            console.log("🔍 UserId:", userId);
            console.log("🔍 Token existe:", !!token);

            if (!token || !userId) {
                Swal.fire({
                    icon: "error",
                    title: "Error de autenticación",
                    text: "Por favor, inicia sesión nuevamente.",
                    confirmButtonColor: "#1B7F79"
                }).then(() => {
                    authService.logout();
                    navigate("/login");
                });
                return;
            }

            const response = await axios.get(
                `http://localhost:8080/api/addresses/${userId}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json"
                    }
                }
            );

            console.log("✅ Direcciones cargadas:", response.data);
            setAddresses(response.data.addresses || []);
        } catch (error) {
            console.error("❌ Error al cargar direcciones:", error);

            if (error.response?.status === 403 || error.response?.status === 401) {
                Swal.fire({
                    icon: "warning",
                    title: "Sesión expirada",
                    text: "Por favor, inicia sesión nuevamente.",
                    confirmButtonColor: "#1B7F79"
                }).then(() => {
                    authService.logout();
                    navigate("/login");
                });
            } else {
                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: "Error al cargar las direcciones.",
                    confirmButtonColor: "#1B7F79"
                });
            }
        } finally {
            setLoading(false);
        }
    };

    const handleAddAddress = async (e) => {
        e.preventDefault();

        const trimmed = newAddress.trim();
        if (!trimmed) {
            Swal.fire({
                icon: "warning",
                title: "Dirección inválida",
                text: "Por favor, ingresa una dirección.",
                confirmButtonColor: "#1B7F79"
            });
            return;
        }

        // 🚫 Evitar direcciones duplicadas (ignorando mayúsculas/minúsculas y espacios)
        const normalizedNew = trimmed.toLowerCase();
        const alreadyExists = addresses.some(
            (addr) => (addr || "").trim().toLowerCase() === normalizedNew
        );

        if (alreadyExists) {
            Swal.fire({
                icon: "info",
                title: "Dirección duplicada",
                text: "Ya tienes guardada esta dirección.",
                confirmButtonColor: "#1B7F79"
            });
            return;
        }

        try {
            const userId = authService.getUserId();
            const token = authService.getToken();

            if (!token || !userId) {
                Swal.fire({
                    icon: "error",
                    title: "Error de autenticación",
                    text: "Por favor, inicia sesión nuevamente.",
                    confirmButtonColor: "#1B7F79"
                }).then(() => {
                    authService.logout();
                    navigate("/login");
                });
                return;
            }

            await axios.post(
                `http://localhost:8080/api/addresses/${userId}`,
                { address: trimmed },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json"
                    }
                }
            );

            Swal.fire({
                icon: "success",
                title: "Dirección agregada",
                text: "La dirección fue guardada exitosamente.",
                confirmButtonColor: "#1B7F79"
            });

            setShowAddForm(false);
            setNewAddress("");
            loadAddresses();
        } catch (error) {
            console.error("Error al agregar dirección:", error);

            if (error.response?.status === 403 || error.response?.status === 401) {
                Swal.fire({
                    icon: "warning",
                    title: "Sesión expirada",
                    text: "Por favor, inicia sesión nuevamente.",
                    confirmButtonColor: "#1B7F79"
                }).then(() => {
                    authService.logout();
                    navigate("/login");
                });
            } else if (error.response?.data?.message) {
                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: error.response.data.message,
                    confirmButtonColor: "#1B7F79"
                });
            } else {
                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: "Error al agregar la dirección.",
                    confirmButtonColor: "#1B7F79"
                });
            }
        }
    };

    const handleDeleteAddress = async (address) => {
        Swal.fire({
            icon: "warning",
            title: "¿Eliminar dirección?",
            text: `¿Estás seguro de eliminar la dirección "${address}"?`,
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Sí, eliminar",
            cancelButtonText: "Cancelar"
        }).then(async (result) => {
            if (!result.isConfirmed) return;

            try {
                const userId = authService.getUserId();
                const token = authService.getToken();

                if (!token || !userId) {
                    Swal.fire({
                        icon: "error",
                        title: "Error de autenticación",
                        text: "Por favor, inicia sesión nuevamente.",
                        confirmButtonColor: "#1B7F79"
                    }).then(() => {
                        authService.logout();
                        navigate("/login");
                    });
                    return;
                }

                await axios.delete(
                    `http://localhost:8080/api/addresses/${userId}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            "Content-Type": "application/json"
                        },
                        data: { address }
                    }
                );

                Swal.fire({
                    toast: true,
                    position: "top-end",
                    icon: "success",
                    title: "Dirección eliminada",
                    showConfirmButton: false,
                    timer: 1500,
                    timerProgressBar: true
                });

                loadAddresses();
            } catch (error) {
                console.error("Error al eliminar dirección:", error);

                if (error.response?.status === 403 || error.response?.status === 401) {
                    Swal.fire({
                        icon: "warning",
                        title: "Sesión expirada",
                        text: "Por favor, inicia sesión nuevamente.",
                        confirmButtonColor: "#1B7F79"
                    }).then(() => {
                        authService.logout();
                        navigate("/login");
                    });
                } else {
                    Swal.fire({
                        icon: "error",
                        title: "Error",
                        text: "Error al eliminar la dirección.",
                        confirmButtonColor: "#1B7F79"
                    });
                }
            }
        });
    };

    const handleEditAddress = async (oldAddress) => {
        const trimmed = editedAddress.trim();

        if (!trimmed) {
            Swal.fire({
                icon: "warning",
                title: "Dirección inválida",
                text: "Por favor, ingresa una dirección válida.",
                confirmButtonColor: "#1B7F79"
            });
            return;
        }

        // 🚫 Evitar que edite a una dirección que ya existe
        const normalizedNew = trimmed.toLowerCase();
        const alreadyExists = addresses.some(
            (addr) =>
                addr !== oldAddress &&
                (addr || "").trim().toLowerCase() === normalizedNew
        );

        if (alreadyExists) {
            Swal.fire({
                icon: "info",
                title: "Dirección duplicada",
                text: "Ya tienes guardada una dirección igual.",
                confirmButtonColor: "#1B7F79"
            });
            return;
        }

        try {
            const userId = authService.getUserId();
            const token = authService.getToken();

            if (!token || !userId) {
                Swal.fire({
                    icon: "error",
                    title: "Error de autenticación",
                    text: "Por favor, inicia sesión nuevamente.",
                    confirmButtonColor: "#1B7F79"
                }).then(() => {
                    authService.logout();
                    navigate("/login");
                });
                return;
            }

            await axios.put(
                `http://localhost:8080/api/addresses/${userId}?oldAddress=${encodeURIComponent(
                    oldAddress
                )}`,
                { address: trimmed },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json"
                    }
                }
            );

            Swal.fire({
                icon: "success",
                title: "Dirección actualizada",
                text: "La dirección fue modificada exitosamente.",
                confirmButtonColor: "#1B7F79"
            });

            setEditingAddress(null);
            setEditedAddress("");
            loadAddresses();
        } catch (error) {
            console.error("Error al actualizar dirección:", error);

            if (error.response?.status === 403 || error.response?.status === 401) {
                Swal.fire({
                    icon: "warning",
                    title: "Sesión expirada",
                    text: "Por favor, inicia sesión nuevamente.",
                    confirmButtonColor: "#1B7F79"
                }).then(() => {
                    authService.logout();
                    navigate("/login");
                });
            } else {
                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: "Error al actualizar la dirección.",
                    confirmButtonColor: "#1B7F79"
                });
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
                        className="bg-white text-teal-700 px-4 py-2 rounded-lg font-semibold hover:bg-teal-50 transition-all transform hover:scale-105 flex items-center gap-2"
                    >
                        <span className="material-icons">arrow_back</span>
                        Volver
                    </button>

                    <button
                        onClick={() => setShowAddForm(!showAddForm)}
                        className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-3 px-6 rounded-lg transition-all transform hover:scale-105 flex items-center gap-2"
                    >
                        <span className="material-icons">add</span>
                        {showAddForm ? "Cancelar" : "Agregar Dirección"}
                    </button>
                </div>

                {showAddForm && (
                    <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">
                            Nueva Dirección
                        </h2>
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
                                className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold py-3 rounded-lg transition-all transform hover:scale-105"
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
                                className="bg-white rounded-lg shadow-md p-6 hover:shadow-2xl transition-all transform hover:scale-[1.02] hover:-translate-y-1"
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
                                                className="flex-1 bg-teal-600 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded-lg transition-all transform hover:scale-105"
                                            >
                                                Guardar
                                            </button>
                                            <button
                                                onClick={() => {
                                                    setEditingAddress(null);
                                                    setEditedAddress("");
                                                }}
                                                className="flex-1 bg-gray-400 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded-lg transition-all transform hover:scale-105"
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
                                                <p className="text-lg font-semibold text-gray-800">
                                                    {address}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => {
                                                    setEditingAddress(address);
                                                    setEditedAddress(address);
                                                }}
                                                className="text-teal-600 hover:text-teal-700 transition-transform transform hover:scale-110 p-2"
                                                title="Editar dirección"
                                            >
                                                <span className="material-icons">edit</span>
                                            </button>
                                            <button
                                                onClick={() => handleDeleteAddress(address)}
                                                className="text-red-500 hover:text-red-700 transition-transform transform hover:scale-110 p-2"
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

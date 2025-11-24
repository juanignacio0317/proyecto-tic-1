import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { authService } from "../services/authService";

export default function PaymentMethodsPage() {
    const [paymentMethods, setPaymentMethods] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAddForm, setShowAddForm] = useState(false);
    const [formData, setFormData] = useState({
        cardHolderName: "",
        cardNumber: "",
        expirationDate: "",
        cardBrand: "",
        cvv: ""
    });
    const navigate = useNavigate();

    useEffect(() => {
        if (!authService.isAuthenticated() || authService.isAdmin()) {
            alert("Debes iniciar sesión como cliente");
            navigate("/login");
            return;
        }

        loadPaymentMethods();
    }, [navigate]);

    const loadPaymentMethods = async () => {
        try {
            const userId = authService.getUserId();
            const token = authService.getToken();

            // ✅ LOGS DE DEBUG
            console.log('🔍 UserId:', userId);
            console.log('🔍 Token existe:', !!token);
            if (token) {
                console.log('🔍 Token preview:', token.substring(0, 30) + '...');
            }

            // ✅ VERIFICACIÓN: Si no hay token, redirigir
            if (!token) {
                console.error('❌ No hay token disponible');
                alert("Sesión expirada. Por favor, inicia sesión nuevamente.");
                authService.logout();
                navigate("/login");
                return;
            }

            // ✅ VERIFICACIÓN: Si no hay userId, redirigir
            if (!userId) {
                console.error('❌ No se pudo obtener userId');
                alert("Error al obtener información del usuario. Por favor, inicia sesión nuevamente.");
                authService.logout();
                navigate("/login");
                return;
            }

            const response = await axios.get(
                `http://localhost:8080/api/payment-methods/${userId}`,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            console.log('✅ Payment methods cargados:', response.data);
            setPaymentMethods(response.data);
        } catch (error) {
            console.error("❌ Error al cargar métodos de pago:", error);
            console.error("❌ Error response:", error.response);

            if (error.response?.status === 403) {
                alert("No tienes permisos para acceder. Por favor, inicia sesión nuevamente.");
                authService.logout();
                navigate("/login");
            } else if (error.response?.status === 401) {
                alert("Sesión expirada. Por favor, inicia sesión nuevamente.");
                authService.logout();
                navigate("/login");
            } else {
                alert("Error al cargar los métodos de pago");
            }
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;

        if (name === "cardNumber") {
            const numericValue = value.replace(/\D/g, "").slice(0, 16);
            setFormData({ ...formData, [name]: numericValue });
        } else if (name === "expirationDate") {
            let formattedValue = value.replace(/\D/g, "");
            if (formattedValue.length >= 2) {
                formattedValue = formattedValue.slice(0, 2) + "/" + formattedValue.slice(2, 4);
            }
            setFormData({ ...formData, [name]: formattedValue });
        } else if (name === "cvv") {
            const numericValue = value.replace(/\D/g, "").slice(0, 4);
            setFormData({ ...formData, [name]: numericValue });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (formData.cardNumber.length !== 16) {
            alert("El número de tarjeta debe tener 16 dígitos");
            return;
        }

        if (formData.cvv.length < 3) {
            alert("El CVV debe tener al menos 3 dígitos");
            return;
        }

        try {
            const userId = authService.getUserId();
            const token = authService.getToken();

            // ✅ VERIFICACIONES
            if (!token || !userId) {
                alert("Error de autenticación. Por favor, inicia sesión nuevamente.");
                authService.logout();
                navigate("/login");
                return;
            }

            await axios.post(
                `http://localhost:8080/api/payment-methods/${userId}`,
                formData,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            alert("Método de pago agregado exitosamente");
            setShowAddForm(false);
            setFormData({
                cardHolderName: "",
                cardNumber: "",
                expirationDate: "",
                cardBrand: "",
                cvv: ""
            });
            loadPaymentMethods();
        } catch (error) {
            console.error("Error al agregar método de pago:", error);

            if (error.response?.status === 403 || error.response?.status === 401) {
                alert("Sesión expirada. Por favor, inicia sesión nuevamente.");
                authService.logout();
                navigate("/login");
            } else {
                alert("Error al agregar el método de pago");
            }
        }
    };

    const handleDelete = async (paymentMethodId) => {
        if (!window.confirm("¿Estás seguro de eliminar esta tarjeta?")) {
            return;
        }

        try {
            const userId = authService.getUserId();
            const token = authService.getToken();

            // ✅ VERIFICACIONES
            if (!token || !userId) {
                alert("Error de autenticación. Por favor, inicia sesión nuevamente.");
                authService.logout();
                navigate("/login");
                return;
            }

            await axios.delete(
                `http://localhost:8080/api/payment-methods/${userId}/${paymentMethodId}`,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            alert("Método de pago eliminado");
            loadPaymentMethods();
        } catch (error) {
            console.error("Error al eliminar método de pago:", error);

            if (error.response?.status === 403 || error.response?.status === 401) {
                alert("Sesión expirada. Por favor, inicia sesión nuevamente.");
                authService.logout();
                navigate("/login");
            } else {
                alert("Error al eliminar el método de pago");
            }
        }
    };

    const getCardIcon = (brand) => {
        const icons = {
            'Visa': '💳',
            'Mastercard': '💳',
            'American Express': '💳',
            'Discover': '💳'
        };
        return icons[brand] || '💳';
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
                    <h1 className="text-4xl font-bold text-white mb-2">Mis Tarjetas</h1>
                    <p className="text-teal-100">Gestiona tus métodos de pago</p>
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
                        {showAddForm ? 'Cancelar' : 'Agregar Tarjeta'}
                    </button>
                </div>

                {showAddForm && (
                    <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">Nueva Tarjeta</h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Nombre del Titular *
                                </label>
                                <input
                                    type="text"
                                    name="cardHolderName"
                                    value={formData.cardHolderName}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                                    placeholder="Nombre como aparece en la tarjeta"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Número de Tarjeta *
                                </label>
                                <input
                                    type="text"
                                    name="cardNumber"
                                    value={formData.cardNumber}
                                    onChange={handleInputChange}
                                    required
                                    maxLength="16"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                                    placeholder="1234567890123456"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Fecha de Expiración *
                                    </label>
                                    <input
                                        type="text"
                                        name="expirationDate"
                                        value={formData.expirationDate}
                                        onChange={handleInputChange}
                                        required
                                        maxLength="5"
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                                        placeholder="MM/YY"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        CVV *
                                    </label>
                                    <input
                                        type="text"
                                        name="cvv"
                                        value={formData.cvv}
                                        onChange={handleInputChange}
                                        required
                                        maxLength="4"
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                                        placeholder="123"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Marca de Tarjeta *
                                </label>
                                <select
                                    name="cardBrand"
                                    value={formData.cardBrand}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                                >
                                    <option value="">Selecciona una marca</option>
                                    <option value="Visa">Visa</option>
                                    <option value="Mastercard">Mastercard</option>
                                    <option value="American Express">American Express</option>
                                    <option value="Discover">Discover</option>
                                </select>
                            </div>

                            <button
                                type="submit"
                                className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold py-3 rounded-lg transition-colors"
                            >
                                Guardar Tarjeta
                            </button>
                        </form>
                    </div>
                )}

                {paymentMethods.length === 0 ? (
                    <div className="bg-white rounded-lg shadow-lg p-12 text-center">
                        <span className="text-6xl mb-4 block">💳</span>
                        <h2 className="text-2xl font-bold text-gray-700 mb-2">
                            No tienes tarjetas guardadas
                        </h2>
                        <p className="text-gray-500">
                            Agrega una tarjeta para facilitar tus pagos
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {paymentMethods.map((method) => (
                            <div
                                key={method.idPM}
                                className="bg-gradient-to-br from-teal-600 to-teal-800 rounded-xl p-6 text-white shadow-lg hover:shadow-xl transition-shadow"
                            >
                                <div className="flex justify-between items-start mb-4">
                                    <span className="text-3xl">{getCardIcon(method.cardBrand)}</span>
                                    <button
                                        onClick={() => handleDelete(method.idPM)}
                                        className="text-white hover:text-red-200 transition-colors"
                                        title="Eliminar tarjeta"
                                    >
                                        <span className="material-icons">delete</span>
                                    </button>
                                </div>

                                <div className="mb-4">
                                    <p className="text-sm opacity-80 mb-1">Número de tarjeta</p>
                                    <p className="text-xl font-mono tracking-wider">
                                        {method.cardNumber}
                                    </p>
                                </div>

                                <div className="flex justify-between items-end">
                                    <div>
                                        <p className="text-xs opacity-80 mb-1">Titular</p>
                                        <p className="font-semibold text-sm">{method.cardHolderName}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xs opacity-80 mb-1">Vence</p>
                                        <p className="font-semibold text-sm">{method.expirationDate}</p>
                                    </div>
                                </div>

                                <div className="mt-3 pt-3 border-t border-teal-500">
                                    <p className="text-sm font-semibold">{method.cardBrand}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
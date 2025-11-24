import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { authService } from "../services/authService";
import Navbar from "./Navbar.jsx";

export default function CartPage() {
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [clientAddress, setClientAddress] = useState("");
    const [selectedAddress, setSelectedAddress] = useState("");
    const [processing, setProcessing] = useState(false);
    const navigate = useNavigate();
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("");
    const [paymentMethods, setPaymentMethods] = useState([]);
    const [clientAddresses, setClientAddresses] = useState([]);

    useEffect(() => {
        // Verificar autenticación
        if (!authService.isAuthenticated()) {
            alert("Debes iniciar sesión para ver tu carrito.");
            navigate("/login");
            return;
        }

        if (authService.isAdmin()) {
            alert("Debes iniciar sesión como cliente para ver tu carrito");
            navigate("/login");
            return;
        }

        // Obtener userId
        const userId = authService.getUserId();
        console.log('🛒 CartPage - userId obtenido:', userId);

        if (!userId) {
            console.error('❌ No se pudo obtener userId');
            alert("Error al obtener información del usuario. Por favor, inicia sesión nuevamente.");
            navigate("/login");
            return;
        }

        loadCart(userId);
        loadAddress(userId);
        loadPaymentMethods(userId);
    }, [navigate]);


    const loadPaymentMethods = async (userId) => {
        try {
            const token = authService.getToken();
            const response = await axios.get(
                `http://localhost:8080/api/payment-methods/${userId}`,
                {
                    headers: { 'Authorization': `Bearer ${token}` }
                }
            );
            setPaymentMethods(response.data);

            // Seleccionar automáticamente el primer método si existe
            if (response.data.length > 0) {
                setSelectedPaymentMethod(response.data[0].idPM);
            }
        } catch (error) {
            console.error("Error al cargar métodos de pago:", error);
        }
    };

    const loadCart = async (userId) => {
        try {
            console.log('🛒 Cargando carrito para userId:', userId);
            const token = authService.getToken();

            const response = await axios.get(`http://localhost:8080/api/cart/${userId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            console.log('✅ Carrito cargado:', response.data);
            setCartItems(response.data);
        } catch (error) {
            console.error("❌ Error al cargar el carrito:", error);
            if (error.response?.status === 401) {
                alert("Sesión expirada. Inicia sesión nuevamente.");
                authService.logout();
                navigate("/login");
            } else if (error.response?.status === 404) {
                console.log('ℹ️ Cliente no encontrado o sin items en carrito');
                setCartItems([]);
            } else {
                alert("Error al cargar el carrito. Intenta nuevamente.");
            }
        } finally {
            setLoading(false);
        }
    };

    const loadAddress = async (userId) => {
        try {
            console.log('📍 Cargando direcciones para userId:', userId);
            const token = authService.getToken();

            const response = await axios.get(`http://localhost:8080/api/addresses/${userId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            console.log('✅ Direcciones cargadas:', response.data);
            const addresses = response.data.addresses || [];
            setClientAddresses(addresses);

            if (addresses.length > 0) {
                setSelectedAddress(addresses[0]);
            }
        } catch (error) {
            console.error("❌ Error al cargar las direcciones:", error);

        }
    };

    const handleProcessCart = async () => {
        if (!selectedAddress || selectedAddress.trim() === "") {
            alert("Por favor, ingresa una dirección de entrega");
            return;
        }


        if (!selectedPaymentMethod) {
            alert("Por favor, selecciona un método de pago");
            return;
        }

        const userId = authService.getUserId();
        if (!userId) {
            alert("Error al obtener información del usuario.");
            return;
        }

        setProcessing(true);

        try {
            console.log('🚀 Procesando carrito para userId:', userId);
            const token = authService.getToken();

            await axios.post(
                `http://localhost:8080/api/cart/${userId}/process`,
                {
                    address: selectedAddress,
                    paymentMethodId: selectedPaymentMethod
                },
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            console.log('✅ Pedido procesado exitosamente');
            alert("¡Pedido procesado exitosamente! Tu orden está en cola.");
            navigate("/mis-pedidos");
        } catch (error) {
            console.error("❌ Error al procesar el carrito:", error);
            alert("Error al procesar el pedido. Intenta nuevamente.");
        } finally {
            setProcessing(false);
        }
    };

    const handleRemoveItem = async (orderId) => {
        if (!window.confirm("¿Estás seguro de eliminar este item del carrito?")) {
            return;
        }

        try {
            console.log('🗑️ Eliminando item del carrito:', orderId);
            const token = authService.getToken();

            await axios.delete(`http://localhost:8080/api/cart/item/${orderId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            console.log('✅ Item eliminado');

            // Recargar el carrito
            const userId = authService.getUserId();
            if (userId) {
                loadCart(userId);
            }

            alert("Item eliminado del carrito");
        } catch (error) {
            console.error("❌ Error al eliminar item:", error);
            alert("Error al eliminar el item. Intenta nuevamente.");
        }
    };

    const calculateTotal = () => {
        return cartItems.reduce((sum, item) => sum + parseFloat(item.totalPrice || 0), 0).toFixed(2);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-teal-700 flex items-center justify-center">
                <p className="text-white text-xl">Cargando carrito...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-teal-700 py-8 px-4">
            <div className="max-w-5xl mx-auto">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-white mb-2">Tu Carrito</h1>
                    <p className="text-teal-100">
                        Revisa tus creaciones y confirma tu pedido
                    </p>
                </div>

                {cartItems.length === 0 ? (
                    <div className="bg-white rounded-lg shadow-lg p-12 text-center">
                        <div className="mb-4">
                            <svg className="w-24 h-24 mx-auto text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                        </div>
                        <h2 className="text-2xl font-bold text-gray-700 mb-2">
                            Tu carrito está vacío
                        </h2>
                        <p className="text-gray-500 mb-6">
                            ¡Empieza a crear tu pizza o hamburguesa perfecta!
                        </p>
                        <button
                            onClick={() => navigate("/")}
                            className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-3 px-8 rounded-lg transition-colors"
                        >
                            Comenzar ahora
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Lista de items */}
                        <div className="lg:col-span-2 space-y-4">
                            {cartItems.map((item) => (
                                <div
                                    key={item.orderId}
                                    className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
                                >
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="flex items-center space-x-3">
                                            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                                                item.productType === 'PIZZA' ? 'bg-red-100' : 'bg-amber-100'
                                            }`}>
                                                <span className="text-2xl">
                                                    {item.productType === 'PIZZA' ? '🍕' : '🍔'}
                                                </span>
                                            </div>
                                            <div>
                                                <h3 className="text-lg font-bold text-gray-800">
                                                    {item.productType === 'PIZZA' ? 'Pizza' : 'Hamburguesa'} Personalizada
                                                </h3>
                                                <p className="text-sm text-gray-500">
                                                    Pedido #{item.orderId}
                                                </p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => handleRemoveItem(item.orderId)}
                                            className="text-red-500 hover:text-red-700 transition-colors"
                                            title="Eliminar del carrito"
                                        >
                                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                            </svg>
                                        </button>
                                    </div>

                                    {/* Ingredientes principales */}
                                    <div className="grid grid-cols-2 gap-3 mb-3">
                                        {item.productType === 'PIZZA' ? (
                                            <>
                                                <div className="text-sm">
                                                    <span className="font-semibold text-teal-700">Masa:</span>
                                                    <span className="ml-2 text-gray-700">{item.dough}</span>
                                                </div>
                                                <div className="text-sm">
                                                    <span className="font-semibold text-teal-700">Salsa:</span>
                                                    <span className="ml-2 text-gray-700">{item.sauce}</span>
                                                </div>
                                                <div className="text-sm">
                                                    <span className="font-semibold text-teal-700">Tamaño:</span>
                                                    <span className="ml-2 text-gray-700">{item.size}</span>
                                                </div>
                                                <div className="text-sm">
                                                    <span className="font-semibold text-teal-700">Queso:</span>
                                                    <span className="ml-2 text-gray-700">{item.cheese}</span>
                                                </div>
                                            </>
                                        ) : (
                                            <>
                                                <div className="text-sm">
                                                    <span className="font-semibold text-teal-700">Pan:</span>
                                                    <span className="ml-2 text-gray-700">{item.bread}</span>
                                                </div>
                                                <div className="text-sm">
                                                    <span className="font-semibold text-teal-700">Carne:</span>
                                                    <span className="ml-2 text-gray-700">{item.meat}</span>
                                                </div>
                                                {item.cheese && (
                                                    <div className="text-sm col-span-2">
                                                        <span className="font-semibold text-teal-700">Queso:</span>
                                                        <span className="ml-2 text-gray-700">{item.cheese}</span>
                                                    </div>
                                                )}
                                            </>
                                        )}
                                    </div>

                                    {/* Toppings */}
                                    {item.toppings && item.toppings.length > 0 && (
                                        <div className="mb-2">
                                            <span className="font-semibold text-teal-700 text-sm">Toppings: </span>
                                            <span className="text-gray-700 text-sm">
                                                {item.toppings.join(", ")}
                                            </span>
                                        </div>
                                    )}

                                    {/* Dressings */}
                                    {item.dressings && item.dressings.length > 0 && (
                                        <div className="mb-2">
                                            <span className="font-semibold text-teal-700 text-sm">Aderezos: </span>
                                            <span className="text-gray-700 text-sm">
                                                {item.dressings.join(", ")}
                                            </span>
                                        </div>
                                    )}

                                    {/* Extras */}
                                    {(item.beverage || item.sideOrder) && (
                                        <div className="border-t pt-3 mt-3 space-y-1">
                                            {item.beverage && (
                                                <div className="text-sm">
                                                    <span className="font-semibold text-teal-700">Bebida:</span>
                                                    <span className="ml-2 text-gray-700">{item.beverage}</span>
                                                </div>
                                            )}
                                            {item.sideOrder && (
                                                <div className="text-sm">
                                                    <span className="font-semibold text-teal-700">Acompañamiento:</span>
                                                    <span className="ml-2 text-gray-700">{item.sideOrder}</span>
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {/* Precio */}
                                    <div className="border-t pt-3 mt-3 flex justify-end">
                                        <span className="text-2xl font-bold text-teal-700">
                                            ${item.totalPrice}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Resumen y dirección */}
                        <div className="lg:col-span-1">
                            <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
                                <h2 className="text-2xl font-bold text-gray-800 mb-6">
                                    Resumen del Pedido
                                </h2>

                                {/* ✅ SECCIÓN DE MÉTODO DE PAGO AGREGADA */}
                                <div className="mb-6">
                                    <div className="flex justify-between items-center mb-2">
                                        <label className="block text-sm font-semibold text-gray-700">
                                            Método de Pago *
                                        </label>
                                        <button
                                            onClick={() => navigate('/mis-tarjetas')}
                                            className="text-xs text-teal-600 hover:text-teal-700 font-semibold flex items-center gap-1"
                                        >
                                            <span className="material-icons" style={{ fontSize: '16px' }}>add</span>
                                            Agregar tarjeta
                                        </button>
                                    </div>

                                    {paymentMethods.length === 0 ? (
                                        <div className="text-center p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                                            <p className="text-sm text-yellow-800 mb-2">
                                                No tienes tarjetas guardadas
                                            </p>
                                            <button
                                                onClick={() => navigate('/mis-tarjetas')}
                                                className="text-sm text-teal-600 hover:text-teal-700 font-semibold"
                                            >
                                                Agregar una tarjeta
                                            </button>
                                        </div>
                                    ) : (
                                        <select
                                            value={selectedPaymentMethod}
                                            onChange={(e) => setSelectedPaymentMethod(e.target.value)}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                                        >
                                            <option value="">Selecciona un método de pago</option>
                                            {paymentMethods.map((method) => (
                                                <option key={method.idPM} value={method.idPM}>
                                                    {method.cardBrand} - {method.cardNumber}
                                                </option>
                                            ))}
                                        </select>
                                    )}
                                </div>

                                {/* Dirección de entrega */}
                                <div className="mb-6">
                                    <div className="flex justify-between items-center mb-2">
                                        <label className="block text-sm font-semibold text-gray-700">
                                            Dirección de Entrega *
                                        </label>
                                        <button
                                            onClick={() => navigate('/mis-direcciones')}
                                            className="text-xs text-teal-600 hover:text-teal-700 font-semibold flex items-center gap-1"
                                        >
                                            <span className="material-icons" style={{ fontSize: '16px' }}>add</span>
                                            Agregar dirección
                                        </button>
                                    </div>

                                    {clientAddresses.length === 0 ? (
                                        <textarea
                                            value={selectedAddress}
                                            onChange={(e) => setSelectedAddress(e.target.value)}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-none"
                                            rows="3"
                                            placeholder="Ingresa tu dirección de entrega"
                                        />
                                    ) : (
                                        <>
                                            <select
                                                value={selectedAddress}
                                                onChange={(e) => setSelectedAddress(e.target.value)}
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent mb-2"
                                            >
                                                <option value="">Selecciona una dirección</option>
                                                {clientAddresses.map((addr, index) => (
                                                    <option key={index} value={addr}>
                                                        {addr}
                                                    </option>
                                                ))}
                                                <option value="__new__">✏️ Escribir otra dirección</option>
                                            </select>

                                            {selectedAddress === "__new__" && (
                                                <textarea
                                                    onChange={(e) => setSelectedAddress(e.target.value)}
                                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-none"
                                                    rows="3"
                                                    placeholder="Escribe tu dirección de entrega"
                                                />
                                            )}
                                        </>
                                    )}
                                </div>

                                {/* Total de items */}
                                <div className="border-t border-b py-4 mb-4">
                                    <div className="flex justify-between mb-2">
                                        <span className="text-gray-600">Items</span>
                                        <span className="font-semibold">{cartItems.length}</span>
                                    </div>
                                    <div className="flex justify-between text-lg font-bold">
                                        <span className="text-gray-800">Total</span>
                                        <span className="text-teal-700">${calculateTotal()}</span>
                                    </div>
                                </div>


                                <button
                                    onClick={handleProcessCart}
                                    disabled={processing || !selectedAddress || !selectedPaymentMethod}
                                    className={`w-full py-4 rounded-lg font-bold text-white transition-all transform hover:scale-105 ${
                                        processing || !selectedAddress || !selectedPaymentMethod
                                            ? 'bg-gray-400 cursor-not-allowed'
                                            : 'bg-yellow-500 hover:bg-yellow-600 shadow-lg'
                                    }`}
                                >
                                    {processing ? (
                                        <span className="flex items-center justify-center">
                                            <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                            </svg>
                                            Procesando...
                                        </span>
                                    ) : (
                                        'Confirmar Pedido'
                                    )}
                                </button>

                                <p className="text-xs text-gray-500 text-center mt-4">
                                    Tu pedido será preparado inmediatamente después de confirmar
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { authService } from "../services/authService";

export default function MyOrdersPage() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState('all');
    const navigate = useNavigate();

    useEffect(() => {
        // Verificar autenticación
        if (!authService.isAuthenticated()) {
            alert("Debes iniciar sesión para ver tus pedidos.");
            navigate("/login");
            return;
        }
        if (authService.isAdmin()) {
            alert("Debes iniciar sesión como cliente para ver tu carrito");
            navigate("/");
            return;
        }

        loadOrders();
    }, [statusFilter, navigate]);

    const loadOrders = async () => {
        setLoading(true);
        try {
            const userId = authService.getUserId();
            console.log('📦 Cargando pedidos para userId:', userId);

            if (!userId) {
                alert("Error al obtener información del usuario.");
                navigate("/");
                return;
            }

            const token = authService.getToken();
            const endpoint = statusFilter === 'all'
                ? `http://localhost:8080/api/orders/user/${userId}`
                : `http://localhost:8080/api/orders/user/${userId}/status/${statusFilter}`;

            const response = await axios.get(endpoint, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            console.log('✅ Pedidos cargados:', response.data);
            setOrders(response.data);
        } catch (error) {
            console.error("❌ Error al cargar pedidos:", error);
            if (error.response?.status === 401) {
                alert("Sesión expirada. Inicia sesión nuevamente.");
                authService.logout();
                navigate("/login");
            } else {
                alert("Error al cargar pedidos. Intenta nuevamente.");
            }
        } finally {
            setLoading(false);
        }
    };

    const cancelOrder = async (orderId) => {
        if (!window.confirm("¿Estás seguro de que quieres cancelar este pedido?")) {
            return;
        }

        try {
            const userId = authService.getUserId();
            const token = authService.getToken();

            await axios.delete(
                `http://localhost:8080/api/orders/${orderId}/cancel?userId=${userId}`,
                { headers: { 'Authorization': `Bearer ${token}` } }
            );

            console.log('✅ Pedido cancelado');
            alert("Pedido cancelado exitosamente");
            loadOrders(); // Recargar la lista
        } catch (error) {
            console.error("❌ Error al cancelar pedido:", error);
            alert(error.response?.data || "Error al cancelar pedido. Intenta nuevamente.");
        }
    };

    const getStatusInfo = (status) => {
        const statusLower = status?.toLowerCase() || '';

        switch (statusLower) {
            case 'in queue':
                return {
                    text: 'En Cola',
                    emoji: '🕐',
                    bgColor: 'bg-blue-100',
                    textColor: 'text-blue-800',
                    borderColor: 'border-blue-300',
                    description: 'Tu pedido está esperando a ser preparado'
                };
            case 'in preparation':
                return {
                    text: 'En Preparación',
                    emoji: '👨‍🍳',
                    bgColor: 'bg-yellow-100',
                    textColor: 'text-yellow-800',
                    borderColor: 'border-yellow-300',
                    description: 'Tu pedido se está preparando'
                };
            case 'on the way':
                return {
                    text: 'En Camino',
                    emoji: '🚗',
                    bgColor: 'bg-purple-100',
                    textColor: 'text-purple-800',
                    borderColor: 'border-purple-300',
                    description: 'Tu pedido está en camino'
                };
            case 'delivered':
                return {
                    text: 'Entregado',
                    emoji: '✅',
                    bgColor: 'bg-green-100',
                    textColor: 'text-green-800',
                    borderColor: 'border-green-300',
                    description: 'Pedido entregado exitosamente'
                };
            case 'cancelled':
                return {
                    text: 'Cancelado',
                    emoji: '❌',
                    bgColor: 'bg-red-100',
                    textColor: 'text-red-800',
                    borderColor: 'border-red-300',
                    description: 'Pedido cancelado'
                };
            default:
                return {
                    text: status,
                    emoji: '❓',
                    bgColor: 'bg-gray-100',
                    textColor: 'text-gray-800',
                    borderColor: 'border-gray-300',
                    description: 'Estado desconocido'
                };
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
                <p className="text-white text-xl">Cargando tus pedidos...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-teal-700 py-8 px-4">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-white mb-2">Mis Pedidos</h1>
                    <p className="text-teal-100">
                        Historial y seguimiento de tus pedidos
                    </p>
                </div>

                {/* Filtros */}
                <div className="bg-white rounded-lg shadow-lg p-4 mb-6">
                    <div className="flex flex-wrap justify-between items-center gap-4">
                        {/* Filtros de estado */}
                        <div className="flex flex-wrap items-center gap-2">
                            <button
                                onClick={() => setStatusFilter('all')}
                                className={`px-4 py-2 rounded-lg font-semibold transition-all text-sm ${
                                    statusFilter === 'all'
                                        ? 'bg-teal-700 text-white shadow-md'
                                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                }`}
                            >
                                📋 Todos
                            </button>
                            <button
                                onClick={() => setStatusFilter('in queue')}
                                className={`px-4 py-2 rounded-lg font-semibold transition-all text-sm ${
                                    statusFilter === 'in queue'
                                        ? 'bg-teal-700 text-white shadow-md'
                                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                }`}
                            >
                                🕐 En Cola
                            </button>
                            <button
                                onClick={() => setStatusFilter('in preparation')}
                                className={`px-4 py-2 rounded-lg font-semibold transition-all text-sm ${
                                    statusFilter === 'in preparation'
                                        ? 'bg-teal-700 text-white shadow-md'
                                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                }`}
                            >
                                👨‍🍳 En Preparación
                            </button>
                            <button
                                onClick={() => setStatusFilter('on the way')}
                                className={`px-4 py-2 rounded-lg font-semibold transition-all text-sm ${
                                    statusFilter === 'on the way'
                                        ? 'bg-teal-700 text-white shadow-md'
                                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                }`}
                            >
                                🚗 En Camino
                            </button>
                            <button
                                onClick={() => setStatusFilter('delivered')}
                                className={`px-4 py-2 rounded-lg font-semibold transition-all text-sm ${
                                    statusFilter === 'delivered'
                                        ? 'bg-teal-700 text-white shadow-md'
                                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                }`}
                            >
                                ✅ Entregados
                            </button>
                        </div>

                        {/* Contador */}
                        <div className="text-gray-600 font-semibold">
                            {orders.length} {orders.length === 1 ? 'pedido' : 'pedidos'}
                        </div>
                    </div>
                </div>

                {/* Lista de pedidos */}
                {orders.length === 0 ? (
                    <div className="bg-white rounded-lg shadow-lg p-12 text-center">
                        <div className="mb-4">
                            <svg className="w-24 h-24 mx-auto text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                            </svg>
                        </div>
                        <h2 className="text-2xl font-bold text-gray-700 mb-2">
                            {statusFilter === 'all'
                                ? 'No tienes pedidos aún'
                                : `No tienes pedidos ${getStatusInfo(statusFilter).text.toLowerCase()}`}
                        </h2>
                        <p className="text-gray-500 mb-6">
                            ¡Haz tu primer pedido y disfruta de nuestras deliciosas creaciones!
                        </p>
                        <button
                            onClick={() => navigate("/mis-creaciones")}
                            className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-3 px-8 rounded-lg transition-colors"
                        >
                            Ver mis creaciones
                        </button>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {orders.map((order) => {
                            const statusInfo = getStatusInfo(order.orderStatus);

                            return (
                                <div
                                    key={order.orderId}
                                    className={`bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden border-l-4 ${statusInfo.borderColor}`}
                                >
                                    <div className="p-6">
                                        {/* Header del pedido */}
                                        <div className="flex justify-between items-start mb-4">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-3 mb-2">
                                                    <span className="text-3xl">
                                                        {order.productType === 'PIZZA' ? '🍕' : '🍔'}
                                                    </span>
                                                    <div>
                                                        <h3 className="text-xl font-bold text-gray-800">
                                                            Pedido #{order.orderId}
                                                        </h3>
                                                        <p className="text-sm text-gray-500">
                                                            {formatDate(order.orderDate)}
                                                        </p>
                                                    </div>
                                                </div>

                                                {/* Badge de estado */}
                                                <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg ${statusInfo.bgColor} ${statusInfo.textColor} font-semibold`}>
                                                    <span className="text-xl">{statusInfo.emoji}</span>
                                                    <div>
                                                        <div className="font-bold">{statusInfo.text}</div>
                                                        <div className="text-xs opacity-75">{statusInfo.description}</div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Precio */}
                                            <div className="text-right">
                                                <div className="text-3xl font-bold text-teal-700">
                                                    ${order.totalPrice}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Detalles del pedido */}
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4 pt-4 border-t">
                                            {/* Columna izquierda: Producto */}
                                            <div>
                                                <h4 className="font-semibold text-gray-700 mb-3">
                                                    {order.productType === 'PIZZA' ? '🍕 Pizza' : '🍔 Hamburguesa'}
                                                </h4>

                                                <div className="space-y-2 text-sm">
                                                    {order.productType === 'PIZZA' ? (
                                                        <>
                                                            <div><strong>Tamaño:</strong> {order.size}</div>
                                                            <div><strong>Masa:</strong> {order.dough}</div>
                                                            <div><strong>Salsa:</strong> {order.sauce}</div>
                                                            <div><strong>Queso:</strong> {order.cheese}</div>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <div><strong>Carne:</strong> {order.meat}
                                                                {order.meatQuantity && order.meatQuantity > 1 && (
                                                                    <span style={{
                                                                        marginLeft: '8px',
                                                                        padding: '2px 8px',
                                                                        backgroundColor: '#fef3c7',
                                                                        color: '#92400e',
                                                                        borderRadius: '12px',
                                                                        fontSize: '11px',
                                                                        fontWeight: 'bold'
                                                                    }}>
                                                                        x{order.meatQuantity}
                                                                         </span>
                                                                )}
                                                            </div>
                                                            <div><strong>Carne:</strong> {order.meat}</div>
                                                            {order.cheese && <div><strong>Queso:</strong> {order.cheese}</div>}
                                                        </>
                                                    )}
                                                </div>

                                                {/* Toppings */}
                                                {order.toppings && order.toppings.length > 0 && (
                                                    <div className="mt-3">
                                                        <strong className="text-green-700 text-sm">✨ Toppings:</strong>
                                                        <div className="flex flex-wrap gap-1 mt-1">
                                                            {order.toppings.map((topping, idx) => (
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
                                                {order.dressings && order.dressings.length > 0 && (
                                                    <div className="mt-3">
                                                        <strong className="text-yellow-700 text-sm">🧂 Aderezos:</strong>
                                                        <div className="flex flex-wrap gap-1 mt-1">
                                                            {order.dressings.map((dressing, idx) => (
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
                                            </div>

                                            {/* Columna derecha: Dirección y extras */}
                                            <div>
                                                {/* Dirección */}
                                                <div className="mb-4">
                                                    <h4 className="font-semibold text-gray-700 mb-2">📍 Dirección de Entrega</h4>
                                                    <p className="text-sm text-gray-600">
                                                        {order.orderAddress || 'No especificada'}
                                                    </p>
                                                </div>

                                                {/* Extras */}
                                                {(order.beverage || order.sideOrder) && (
                                                    <div>
                                                        <h4 className="font-semibold text-gray-700 mb-2">➕ Extras</h4>
                                                        <div className="space-y-1 text-sm">
                                                            {order.beverage && (
                                                                <div>🥤 {order.beverage}</div>
                                                            )}
                                                            {order.sideOrder && (
                                                                <div>🍟 {order.sideOrder}</div>
                                                            )}
                                                        </div>
                                                    </div>
                                                )}

                                                {/* Botón cancelar */}
                                                {order.canCancel && (
                                                    <button
                                                        onClick={() => cancelOrder(order.orderId)}
                                                        className="mt-4 w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
                                                    >
                                                        ❌ Cancelar Pedido
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
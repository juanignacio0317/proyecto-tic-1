import React, { useState, useEffect } from 'react';
import { ingredientService } from '../services/ingredientService';
import { administratorService } from '../services/administratorService';
import { authService } from '../services/authService';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function AdminPage() {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('orders');
    const [loading, setLoading] = useState(false);

    // Estados para ingredientes
    const [breads, setBreads] = useState([]);
    const [meats, setMeats] = useState([]);
    const [cheeses, setCheeses] = useState([]);
    const [toppings, setToppings] = useState([]);
    const [dressings, setDressings] = useState([]);

    // Estados para ingredientes de pizza
    const [sizes, setSizes] = useState([]);
    const [doughs, setDoughs] = useState([]);
    const [sauces, setSauces] = useState([]);

    // Estados para productos extras
    const [beverages, setBeverages] = useState([]);
    const [sideOrders, setSideOrders] = useState([]);

    // Estados para pedidos
    const [orders, setOrders] = useState([]);
    const [statusFilter, setStatusFilter] = useState('all');

    // Estados para administradores
    const [administrators, setAdministrators] = useState([]);

    // Estado del formulario de ingredientes
    const [formData, setFormData] = useState({
        type: '',
        price: '',
        available: true
    });

    // Estado del formulario de administradores
    const [adminFormData, setAdminFormData] = useState({
        name: '',
        surname: '',
        email: '',
        password: ''
    });

    // Verificar que sea admin
    useEffect(() => {
        if (!authService.isAdmin()) {
            Swal.fire({
                icon: 'error',
                title: 'Acceso denegado',
                text: 'No tienes permisos para acceder a esta página.',
                confirmButtonColor: '#1B7F79'
            }).then(() => navigate('/'));
        }
    }, [navigate]);

    // Cargar datos según la pestaña activa
    useEffect(() => {
        if (activeTab === 'orders') {
            loadOrders();
        } else if (activeTab === 'administrators') {
            loadAdministrators();
        } else {
            loadIngredients();
        }
    }, [activeTab, statusFilter]);

    // ==================== PEDIDOS ====================

    const loadOrders = async () => {
        setLoading(true);
        try {
            const token = authService.getToken();
            let url = 'http://localhost:8080/api/admin/orders/active';

            if (statusFilter !== 'all') {
                url = `http://localhost:8080/api/admin/orders/status/${statusFilter}`;
            }

            const response = await axios.get(url, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            setOrders(response.data);
        } catch (error) {
            console.error('Error al cargar pedidos:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error al cargar pedidos',
                text: error.message || 'Intenta nuevamente más tarde.',
                confirmButtonColor: '#1B7F79'
            });
        } finally {
            setLoading(false);
        }
    };

    const loadDefaultData = async () => {
        const result = await Swal.fire({
            icon: 'question',
            title: `¿Cargar datos predeterminados?`,
            text: `Se cargarán datos para ${getTabLabel(activeTab)}. Esto NO borrará los existentes.`,
            showCancelButton: true,
            confirmButtonText: 'Sí, cargar',
            cancelButtonText: 'Cancelar',
            confirmButtonColor: '#1B7F79',
            cancelButtonColor: '#6b7280'
        });

        if (!result.isConfirmed) return;

        setLoading(true);
        try {
            const token = authService.getToken();
            const endpoint = `http://localhost:8080/api/admin/init-data/${activeTab}`;

            const response = await axios.post(endpoint, {}, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            const data = response.data || {};
            Swal.fire({
                icon: 'success',
                title: 'Datos cargados',
                html: `
                    <p>${data.message || 'Operación realizada correctamente.'}</p>
                    <p><strong>Creados:</strong> ${data.created ?? '-'}</p>
                    <p><strong>Total:</strong> ${data.total ?? '-'}</p>
                `,
                confirmButtonColor: '#1B7F79'
            });
            loadIngredients();
        } catch (error) {
            console.error('Error al cargar datos predeterminados:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: error.response?.data || error.message || 'No se pudieron cargar los datos.',
                confirmButtonColor: '#1B7F79'
            });
        } finally {
            setLoading(false);
        }
    };

    const advanceOrderStatus = async (orderId) => {
        const result = await Swal.fire({
            icon: 'question',
            title: 'Avanzar estado del pedido',
            text: '¿Quieres avanzar este pedido al siguiente estado?',
            showCancelButton: true,
            confirmButtonText: 'Sí, avanzar',
            cancelButtonText: 'Cancelar',
            confirmButtonColor: '#1B7F79',
            cancelButtonColor: '#6b7280'
        });

        if (!result.isConfirmed) return;

        try {
            const token = authService.getToken();
            await axios.post(
                `http://localhost:8080/api/admin/orders/${orderId}/advance`,
                {},
                { headers: { 'Authorization': `Bearer ${token}` } }
            );

            Swal.fire({
                icon: 'success',
                title: 'Estado actualizado',
                text: 'El pedido fue actualizado correctamente.',
                confirmButtonColor: '#1B7F79'
            });
            loadOrders();
        } catch (error) {
            console.error('Error al actualizar estado:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: error.response?.data || error.message || 'No se pudo actualizar el pedido.',
                confirmButtonColor: '#1B7F79'
            });
        }
    };

    const getStatusBadgeClass = (status) => {
        const statusLower = status.toLowerCase();
        switch (statusLower) {
            case 'in queue':
                return 'bg-info';
            case 'in preparation':
                return 'bg-warning text-dark';
            case 'on the way':
                return 'bg-primary';
            case 'delivered':
                return 'bg-success';
            default:
                return 'bg-secondary';
        }
    };

    const getStatusText = (status) => {
        const statusLower = status.toLowerCase();
        switch (statusLower) {
            case 'in queue':
                return 'En Cola';
            case 'in preparation':
                return 'En Preparación';
            case 'on the way':
                return 'En Camino';
            case 'delivered':
                return 'Entregado';
            default:
                return status;
        }
    };

    const getNextStatusText = (status) => {
        const statusLower = status.toLowerCase();
        switch (statusLower) {
            case 'in queue':
                return 'Iniciar Preparación';
            case 'in preparation':
                return 'Enviar';
            case 'on the way':
                return 'Marcar Entregado';
            default:
                return 'Avanzar';
        }
    };

    // ==================== ADMINISTRADORES ====================

    const loadAdministrators = async () => {
        setLoading(true);
        try {
            const admins = await administratorService.getAllAdministrators();
            setAdministrators(admins);
        } catch (error) {
            console.error('Error al cargar administradores:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error al cargar administradores',
                text: error.message || 'Intenta nuevamente.',
                confirmButtonColor: '#1B7F79'
            });
        } finally {
            setLoading(false);
        }
    };

    const handleAdminSubmit = async (e) => {
        e.preventDefault();

        if (!adminFormData.name || !adminFormData.surname || !adminFormData.email || !adminFormData.password) {
            Swal.fire({
                icon: 'warning',
                title: 'Campos incompletos',
                text: 'Por favor completa todos los campos.',
                confirmButtonColor: '#1B7F79'
            });
            return;
        }

        if (adminFormData.password.length < 6) {
            Swal.fire({
                icon: 'warning',
                title: 'Contraseña muy corta',
                text: 'La contraseña debe tener al menos 6 caracteres.',
                confirmButtonColor: '#1B7F79'
            });
            return;
        }

        setLoading(true);
        try {
            await administratorService.createAdministrator(adminFormData);
            Swal.fire({
                icon: 'success',
                title: 'Administrador creado',
                text: 'El administrador fue creado exitosamente.',
                confirmButtonColor: '#1B7F79'
            });
            setAdminFormData({ name: '', surname: '', email: '', password: '' });
            loadAdministrators();
        } catch (error) {
            console.error('Error:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error al crear administrador',
                text: error.message || 'Intenta nuevamente.',
                confirmButtonColor: '#1B7F79'
            });
        } finally {
            setLoading(false);
        }
    };

    const deleteAdmin = async (id, email) => {
        const result = await Swal.fire({
            icon: 'warning',
            title: 'Eliminar administrador',
            text: `¿Estás seguro de eliminar al administrador ${email}?`,
            showCancelButton: true,
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar',
            confirmButtonColor: '#d33',
            cancelButtonColor: '#6b7280'
        });

        if (!result.isConfirmed) return;

        try {
            await administratorService.deleteAdministrator(id);
            Swal.fire({
                icon: 'success',
                title: 'Administrador eliminado',
                text: 'El administrador fue eliminado correctamente.',
                confirmButtonColor: '#1B7F79'
            });
            loadAdministrators();
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error al eliminar',
                text: error.message || 'No se pudo eliminar el administrador.',
                confirmButtonColor: '#1B7F79'
            });
        }
    };

    // ==================== INGREDIENTES ====================

    const loadIngredients = async () => {
        setLoading(true);
        try {
            switch (activeTab) {
                case 'breads':
                    setBreads(await ingredientService.getAllBreads());
                    break;
                case 'meats':
                    setMeats(await ingredientService.getAllMeats());
                    break;
                case 'cheeses':
                    setCheeses(await ingredientService.getAllCheeses());
                    break;
                case 'toppings':
                    setToppings(await ingredientService.getAllToppings());
                    break;
                case 'dressings':
                    setDressings(await ingredientService.getAllDressings());
                    break;
                case 'sizes':
                    setSizes(await ingredientService.getAllSizes());
                    break;
                case 'doughs':
                    setDoughs(await ingredientService.getAllDoughs());
                    break;
                case 'sauces':
                    setSauces(await ingredientService.getAllSauces());
                    break;
                case 'beverages':
                    setBeverages(await ingredientService.getAllBeverages());
                    break;
                case 'sideorders':
                    setSideOrders(await ingredientService.getAllSideOrders());
                    break;
                default:
                    break;
            }
        } catch (error) {
            console.error('Error al cargar ingredientes:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error al cargar ingredientes',
                text: error.message || 'Intenta nuevamente.',
                confirmButtonColor: '#1B7F79'
            });
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.type || !formData.price) {
            Swal.fire({
                icon: 'warning',
                title: 'Campos incompletos',
                text: 'Por favor completa todos los campos.',
                confirmButtonColor: '#1B7F79'
            });
            return;
        }

        setLoading(true);
        try {
            const data = {
                type: formData.type,
                price: parseFloat(formData.price),
                available: formData.available
            };

            switch (activeTab) {
                case 'breads':
                    await ingredientService.createBread(data);
                    break;
                case 'meats':
                    await ingredientService.createMeat(data);
                    break;
                case 'cheeses':
                    await ingredientService.createCheese(data);
                    break;
                case 'toppings':
                    await ingredientService.createTopping(data);
                    break;
                case 'dressings':
                    await ingredientService.createDressing(data);
                    break;
                case 'sizes':
                    await ingredientService.createSize(data);
                    break;
                case 'doughs':
                    await ingredientService.createDough(data);
                    break;
                case 'sauces':
                    await ingredientService.createSauce(data);
                    break;
                case 'beverages':
                    await ingredientService.createBeverage(data);
                    break;
                case 'sideorders':
                    await ingredientService.createSideOrder(data);
                    break;
                default:
                    break;
            }

            Swal.fire({
                icon: 'success',
                title: 'Ingrediente creado',
                text: 'El ingrediente fue creado exitosamente.',
                confirmButtonColor: '#1B7F79'
            });
            setFormData({ type: '', price: '', available: true });
            loadIngredients();
        } catch (error) {
            console.error('Error:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error al crear ingrediente',
                text: error.message || 'Intenta nuevamente.',
                confirmButtonColor: '#1B7F79'
            });
        } finally {
            setLoading(false);
        }
    };

    const toggleAvailability = async (type, currentAvailability) => {
        try {
            switch (activeTab) {
                case 'breads':
                    await ingredientService.updateBreadAvailability(type, !currentAvailability);
                    break;
                case 'meats':
                    await ingredientService.updateMeatAvailability(type, !currentAvailability);
                    break;
                case 'cheeses':
                    await ingredientService.updateCheeseAvailability(type, !currentAvailability);
                    break;
                case 'toppings':
                    await ingredientService.updateToppingAvailability(type, !currentAvailability);
                    break;
                case 'dressings':
                    await ingredientService.updateDressingAvailability(type, !currentAvailability);
                    break;
                case 'sizes':
                    await ingredientService.updateSizeAvailability(type, !currentAvailability);
                    break;
                case 'doughs':
                    await ingredientService.updateDoughAvailability(type, !currentAvailability);
                    break;
                case 'sauces':
                    await ingredientService.updateSauceAvailability(type, !currentAvailability);
                    break;
                case 'beverages':
                    await ingredientService.updateBeverageAvailability(type, !currentAvailability);
                    break;
                case 'sideorders':
                    await ingredientService.updateSideOrderAvailability(type, !currentAvailability);
                    break;
                default:
                    break;
            }
            loadIngredients();
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error al actualizar disponibilidad',
                text: error.message || 'Intenta nuevamente.',
                confirmButtonColor: '#1B7F79'
            });
        }
    };

    const updatePrice = async (type) => {
        const { value, isConfirmed } = await Swal.fire({
            title: 'Actualizar precio',
            text: `Ingresa el nuevo precio para "${type}":`,
            input: 'number',
            inputAttributes: {
                min: '0',
                step: '0.01'
            },
            showCancelButton: true,
            confirmButtonText: 'Guardar',
            cancelButtonText: 'Cancelar',
            confirmButtonColor: '#1B7F79',
            cancelButtonColor: '#6b7280'
        });

        if (!isConfirmed) return;
        const newPrice = parseFloat(value);

        if (isNaN(newPrice)) {
            Swal.fire({
                icon: 'warning',
                title: 'Precio inválido',
                text: 'Debes ingresar un número válido.',
                confirmButtonColor: '#1B7F79'
            });
            return;
        }

        try {
            switch (activeTab) {
                case 'breads':
                    await ingredientService.updateBreadPrice(type, newPrice);
                    break;
                case 'meats':
                    await ingredientService.updateMeatPrice(type, newPrice);
                    break;
                case 'cheeses':
                    await ingredientService.updateCheesePrice(type, newPrice);
                    break;
                case 'toppings':
                    await ingredientService.updateToppingPrice(type, newPrice);
                    break;
                case 'dressings':
                    await ingredientService.updateDressingPrice(type, newPrice);
                    break;
                case 'sizes':
                    await ingredientService.updateSizePrice(type, newPrice);
                    break;
                case 'doughs':
                    await ingredientService.updateDoughPrice(type, newPrice);
                    break;
                case 'sauces':
                    await ingredientService.updateSaucePrice(type, newPrice);
                    break;
                case 'beverages':
                    await ingredientService.updateBeveragePrice(type, newPrice);
                    break;
                case 'sideorders':
                    await ingredientService.updateSideOrderPrice(type, newPrice);
                    break;
                default:
                    break;
            }

            Swal.fire({
                icon: 'success',
                title: 'Precio actualizado',
                text: 'El precio se actualizó correctamente.',
                confirmButtonColor: '#1B7F79'
            });
            loadIngredients();
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error al actualizar precio',
                text: error.message || 'Intenta nuevamente.',
                confirmButtonColor: '#1B7F79'
            });
        }
    };

    const getCurrentIngredients = () => {
        switch (activeTab) {
            case 'breads': return breads;
            case 'meats': return meats;
            case 'cheeses': return cheeses;
            case 'toppings': return toppings;
            case 'dressings': return dressings;
            case 'sizes': return sizes;
            case 'doughs': return doughs;
            case 'sauces': return sauces;
            case 'beverages': return beverages;
            case 'sideorders': return sideOrders;
            default: return [];
        }
    };

    const getTabLabel = (tab) => {
        const labels = {
            orders: 'Gestión de Pedidos',
            breads: 'Panes',
            meats: 'Carnes',
            cheeses: 'Quesos',
            toppings: 'Toppings',
            dressings: 'Aderezos',
            sizes: 'Tamaños',
            doughs: 'Masas',
            sauces: 'Salsas',
            beverages: 'Bebidas',
            sideorders: 'Acompañamientos',
            administrators: 'Administradores'
        };
        return labels[tab];
    };

    // ------------- JSX (sin cambios salvo la lógica de arriba) -------------

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#1D7B74] to-[#166863]">
            <div className="container mx-auto px-4 py-8">
                {/* Header */}
                <div className="bg-white rounded-3 shadow-lg p-4 mb-4">
                    <div className="d-flex justify-content-between align-items-center">
                        <h1 className="h2 fw-bold mb-0" style={{ color: '#1B7F79' }}>
                            Panel de Administración
                        </h1>
                        <button
                            onClick={() => navigate('/')}
                            className="btn"
                            style={{ backgroundColor: '#F2C94C', color: '#1B7F79' }}
                        >
                            Volver al Inicio
                        </button>
                    </div>
                </div>

                {/* Sección COCINA - INGREDIENTES DE HAMBURGUESAS */}
                <div className="bg-white rounded-3 shadow-lg p-3 mb-4">
                    <h3 className="h5 fw-bold mb-3" style={{ color: '#1B7F79' }}>
                        🍔 INGREDIENTES DE HAMBURGUESAS
                    </h3>
                    <div className="d-flex gap-2 flex-wrap">
                        <button
                            onClick={() => setActiveTab('orders')}
                            className={`btn ${activeTab === 'orders' ? 'btn-primary' : 'btn-outline-secondary'}`}
                            style={
                                activeTab === 'orders'
                                    ? { backgroundColor: '#1B7F79', borderColor: '#1B7F79' }
                                    : {}
                            }
                        >
                            📦 {getTabLabel('orders')}
                        </button>
                        {['breads', 'meats', 'cheeses', 'toppings', 'dressings'].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`btn ${activeTab === tab ? 'btn-primary' : 'btn-outline-secondary'}`}
                                style={
                                    activeTab === tab
                                        ? { backgroundColor: '#1B7F79', borderColor: '#1B7F79' }
                                        : {}
                                }
                            >
                                {getTabLabel(tab)}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Sección COCINA - INGREDIENTES DE PIZZAS */}
                <div className="bg-white rounded-3 shadow-lg p-3 mb-4">
                    <h3 className="h5 fw-bold mb-3" style={{ color: '#1B7F79' }}>
                        🍕 INGREDIENTES DE PIZZAS
                    </h3>
                    <div className="d-flex gap-2 flex-wrap">
                        {['sizes', 'doughs', 'sauces'].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`btn ${activeTab === tab ? 'btn-primary' : 'btn-outline-secondary'}`}
                                style={
                                    activeTab === tab
                                        ? { backgroundColor: '#1B7F79', borderColor: '#1B7F79' }
                                        : {}
                                }
                            >
                                {getTabLabel(tab)}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Sección COCINA - EXTRAS */}
                <div className="bg-white rounded-3 shadow-lg p-3 mb-4">
                    <h3 className="h5 fw-bold mb-3" style={{ color: '#1B7F79' }}>
                        ➕ EXTRAS
                    </h3>
                    <div className="d-flex gap-2 flex-wrap">
                        {['beverages', 'sideorders'].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`btn ${activeTab === tab ? 'btn-primary' : 'btn-outline-secondary'}`}
                                style={
                                    activeTab === tab
                                        ? { backgroundColor: '#1B7F79', borderColor: '#1B7F79' }
                                        : {}
                                }
                            >
                                {getTabLabel(tab)}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Sección ADMINISTRACIÓN */}
                <div className="bg-white rounded-3 shadow-lg p-3 mb-4">
                    <h3 className="h5 fw-bold mb-3" style={{ color: '#1B7F79' }}>
                        ⚙️ ADMINISTRACIÓN
                    </h3>
                    <div className="d-flex gap-2 flex-wrap">
                        <button
                            onClick={() => setActiveTab('administrators')}
                            className={`btn ${
                                activeTab === 'administrators' ? 'btn-primary' : 'btn-outline-secondary'
                            }`}
                            style={
                                activeTab === 'administrators'
                                    ? { backgroundColor: '#1B7F79', borderColor: '#1B7F79' }
                                    : {}
                            }
                        >
                            👥 {getTabLabel('administrators')}
                        </button>
                    </div>
                </div>

                {/* ==================== CONTENIDO: ADMINISTRADORES ==================== */}
                {activeTab === 'administrators' && (
                    <div className="row g-4">
                        {/* Formulario para crear admin */}
                        <div className="col-lg-4">
                            <div className="bg-white rounded-3 shadow-lg p-4">
                                <h3 className="h4 fw-bold mb-4" style={{ color: '#1B7F79' }}>
                                    ➕ Crear Administrador
                                </h3>

                                <form onSubmit={handleAdminSubmit}>
                                    <div className="mb-3">
                                        <label className="form-label fw-semibold">Nombre</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={adminFormData.name}
                                            onChange={(e) =>
                                                setAdminFormData({ ...adminFormData, name: e.target.value })
                                            }
                                            placeholder="Ej: Juan"
                                            required
                                        />
                                    </div>

                                    <div className="mb-3">
                                        <label className="form-label fw-semibold">Apellido</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={adminFormData.surname}
                                            onChange={(e) =>
                                                setAdminFormData({ ...adminFormData, surname: e.target.value })
                                            }
                                            placeholder="Ej: Pérez"
                                            required
                                        />
                                    </div>

                                    <div className="mb-3">
                                        <label className="form-label fw-semibold">Email</label>
                                        <input
                                            type="email"
                                            className="form-control"
                                            value={adminFormData.email}
                                            onChange={(e) =>
                                                setAdminFormData({ ...adminFormData, email: e.target.value })
                                            }
                                            placeholder="admin@pizzumburgum.com"
                                            required
                                        />
                                    </div>

                                    <div className="mb-3">
                                        <label className="form-label fw-semibold">Contraseña</label>
                                        <input
                                            type="password"
                                            className="form-control"
                                            value={adminFormData.password}
                                            onChange={(e) =>
                                                setAdminFormData({ ...adminFormData, password: e.target.value })
                                            }
                                            placeholder="Mínimo 6 caracteres"
                                            required
                                            minLength="6"
                                        />
                                        <small className="text-muted">Mínimo 6 caracteres</small>
                                    </div>

                                    <button
                                        type="submit"
                                        className="btn w-100 fw-bold"
                                        style={{ backgroundColor: '#F2C94C', color: '#1B7F79' }}
                                        disabled={loading}
                                    >
                                        {loading ? 'Creando...' : '✅ Crear Administrador'}
                                    </button>
                                </form>
                            </div>
                        </div>

                        {/* Lista de administradores */}
                        <div className="col-lg-8">
                            <div className="bg-white rounded-3 shadow-lg p-4">
                                <div className="d-flex justify-content-between align-items-center mb-4">
                                    <h3 className="h4 fw-bold mb-0" style={{ color: '#1B7F79' }}>
                                        👥 Lista de Administradores
                                    </h3>
                                    <button
                                        onClick={loadAdministrators}
                                        className="btn btn-sm btn-outline-primary"
                                    >
                                        🔄 Actualizar
                                    </button>
                                </div>

                                {loading ? (
                                    <div className="text-center py-5">
                                        <div
                                            className="spinner-border"
                                            style={{ color: '#1B7F79' }}
                                            role="status"
                                        >
                                            <span className="visually-hidden">Cargando...</span>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="table-responsive">
                                        <table className="table table-hover">
                                            <thead>
                                            <tr>
                                                <th style={{ width: '60px' }}>ID</th>
                                                <th>Nombre</th>
                                                <th>Apellido</th>
                                                <th>Email</th>
                                                <th style={{ width: '100px' }}>Rol</th>
                                                <th style={{ width: '100px' }}>Acciones</th>
                                            </tr>
                                            </thead>
                                            <tbody>
                                            {administrators.length === 0 ? (
                                                <tr>
                                                    <td
                                                        colSpan="6"
                                                        className="text-center py-4 text-muted"
                                                    >
                                                        No hay administradores registrados
                                                    </td>
                                                </tr>
                                            ) : (
                                                administrators.map((admin) => (
                                                    <tr key={admin.userId}>
                                                        <td className="fw-bold">#{admin.userId}</td>
                                                        <td>{admin.name}</td>
                                                        <td>{admin.surname}</td>
                                                        <td>{admin.email}</td>
                                                        <td>
                                                            <span className="badge bg-danger">
                                                                {admin.role}
                                                            </span>
                                                        </td>
                                                        <td>
                                                            <button
                                                                onClick={() =>
                                                                    deleteAdmin(
                                                                        admin.userId,
                                                                        admin.email
                                                                    )
                                                                }
                                                                className="btn btn-sm btn-outline-danger"
                                                                title="Eliminar administrador"
                                                            >
                                                                🗑️
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))
                                            )}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* ==================== CONTENIDO: PEDIDOS ==================== */}
                {activeTab === 'orders' && (
                    <div className="bg-white rounded-3 shadow-lg p-4">
                        {/* Filtros de estado */}
                        <div className="d-flex justify-content-between align-items-center mb-4">
                            <h3 className="h4 fw-bold mb-0" style={{ color: '#1B7F79' }}>
                                Gestión de Pedidos
                            </h3>
                            <div className="d-flex gap-2">
                                <select
                                    className="form-select"
                                    value={statusFilter}
                                    onChange={(e) => setStatusFilter(e.target.value)}
                                    style={{ width: '200px' }}
                                >
                                    <option value="all">Todos los activos</option>
                                    <option value="in queue">En Cola</option>
                                    <option value="in preparation">En Preparación</option>
                                    <option value="on the way">En Camino</option>
                                </select>
                                <button
                                    onClick={loadOrders}
                                    className="btn btn-sm btn-outline-primary"
                                >
                                    🔄 Actualizar
                                </button>
                            </div>
                        </div>

                        {loading ? (
                            <div className="text-center py-5">
                                <div
                                    className="spinner-border"
                                    style={{ color: '#1B7F79' }}
                                    role="status"
                                >
                                    <span className="visually-hidden">Cargando...</span>
                                </div>
                            </div>
                        ) : orders.length === 0 ? (
                            <div className="text-center py-5">
                                <p className="text-muted">No hay pedidos activos</p>
                            </div>
                        ) : (
                            <div className="table-responsive">
                                <table className="table table-hover">
                                    <thead>
                                    <tr>
                                        <th style={{ width: '80px' }}>Pedido #</th>
                                        <th style={{ width: '150px' }}>Cliente</th>
                                        <th style={{ width: '120px' }}>Producto</th>
                                        <th style={{ width: '300px' }}>Detalles de la Orden</th>
                                        <th style={{ width: '150px' }}>Dirección</th>
                                        <th style={{ width: '80px' }}>Total</th>
                                        <th style={{ width: '130px' }}>Estado</th>
                                        <th style={{ width: '150px' }}>Acción</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {orders.map((order) => (
                                        <tr key={order.orderId}>
                                            <td className="fw-bold">#{order.orderId}</td>
                                            <td>
                                                <div>{order.clientName}</div>
                                                <small className="text-muted">
                                                    {order.clientEmail}
                                                </small>
                                            </td>
                                            <td>
                                                <span
                                                    className="badge"
                                                    style={{
                                                        backgroundColor:
                                                            order.productType === 'PIZZA'
                                                                ? '#ef4444'
                                                                : '#f59e0b'
                                                    }}
                                                >
                                                    {order.productType === 'PIZZA'
                                                        ? '🍕 Pizza'
                                                        : '🍔 Hamburguesa'}
                                                </span>
                                            </td>
                                            <td>
                                                <div
                                                    className="small"
                                                    style={{ lineHeight: '1.6' }}
                                                >
                                                    {/* Ingredientes base */}
                                                    <div className="mb-2 p-2 bg-light rounded">
                                                        {order.productType === 'PIZZA' ? (
                                                            <>
                                                                <div>
                                                                    <strong>🍕 Tamaño:</strong>{' '}
                                                                    {order.size}
                                                                </div>
                                                                <div>
                                                                    <strong>🥖 Masa:</strong>{' '}
                                                                    {order.dough}
                                                                </div>
                                                                <div>
                                                                    <strong>🍅 Salsa:</strong>{' '}
                                                                    {order.sauce}
                                                                </div>
                                                                <div>
                                                                    <strong>🧀 Queso:</strong>{' '}
                                                                    {order.cheese}
                                                                </div>
                                                            </>
                                                        ) : (
                                                            <>
                                                                <div>
                                                                    <strong>🥖 Pan:</strong>{' '}
                                                                    {order.bread}
                                                                </div>
                                                                <div>
                                                                    <strong>🥩 Carne:</strong>{' '}
                                                                    {order.meat}
                                                                    {order.meatQuantity &&
                                                                        order.meatQuantity > 1 && (
                                                                            <span
                                                                                style={{
                                                                                    marginLeft:
                                                                                        '8px',
                                                                                    padding:
                                                                                        '2px 8px',
                                                                                    backgroundColor:
                                                                                        '#fef3c7',
                                                                                    color:
                                                                                        '#92400e',
                                                                                    borderRadius:
                                                                                        '12px',
                                                                                    fontSize:
                                                                                        '11px',
                                                                                    fontWeight:
                                                                                        'bold'
                                                                                }}
                                                                            >
                                                                                x
                                                                                {
                                                                                    order.meatQuantity
                                                                                }
                                                                            </span>
                                                                        )}
                                                                </div>
                                                                {order.cheese && (
                                                                    <div>
                                                                        <strong>🧀 Queso:</strong>{' '}
                                                                        {order.cheese}
                                                                    </div>
                                                                )}
                                                            </>
                                                        )}
                                                    </div>

                                                    {/* Toppings */}
                                                    {order.toppings &&
                                                        order.toppings.length > 0 && (
                                                            <div className="mb-2 p-2 bg-success bg-opacity-10 rounded border border-success border-opacity-25">
                                                                <strong className="text-success d-block mb-1">
                                                                    ✨ Toppings:
                                                                </strong>
                                                                <div className="ps-2">
                                                                    {order.toppings.map(
                                                                        (topping, idx) => (
                                                                            <div
                                                                                key={idx}
                                                                                className="text-success"
                                                                            >
                                                                                ✓ {topping}
                                                                            </div>
                                                                        )
                                                                    )}
                                                                </div>
                                                            </div>
                                                        )}

                                                    {/* Dressings */}
                                                    {order.dressings &&
                                                        order.dressings.length > 0 && (
                                                            <div className="mb-2 p-2 bg-warning bg-opacity-10 rounded border border-warning border-opacity-25">
                                                                <strong className="text-warning d-block mb-1">
                                                                    🧂 Aderezos:
                                                                </strong>
                                                                <div className="ps-2">
                                                                    {order.dressings.map(
                                                                        (dressing, idx) => (
                                                                            <div
                                                                                key={idx}
                                                                                className="text-warning"
                                                                            >
                                                                                ✓ {dressing}
                                                                            </div>
                                                                        )
                                                                    )}
                                                                </div>
                                                            </div>
                                                        )}

                                                    {/* Extras */}
                                                    {(order.beverage || order.sideOrder) && (
                                                        <div className="p-2 bg-info bg-opacity-10 rounded border border-info border-opacity-25">
                                                            <strong className="text-info d-block mb-1">
                                                                ➕ Extras:
                                                            </strong>
                                                            <div className="ps-2">
                                                                {order.beverage && (
                                                                    <div className="text-info">
                                                                        ✓ Bebida:{' '}
                                                                        {order.beverage}
                                                                    </div>
                                                                )}
                                                                {order.sideOrder && (
                                                                    <div className="text-info">
                                                                        ✓ Acompañamiento:{' '}
                                                                        {order.sideOrder}
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            </td>
                                            <td>
                                                <small>
                                                    {order.orderAddress || 'No especificada'}
                                                </small>
                                            </td>
                                            <td className="fw-bold">
                                                ${order.totalPrice}
                                            </td>
                                            <td>
                                                <span
                                                    className={`badge ${getStatusBadgeClass(
                                                        order.orderStatus
                                                    )}`}
                                                >
                                                    {getStatusText(order.orderStatus)}
                                                </span>
                                            </td>
                                            <td>
                                                {order.orderStatus.toLowerCase() !==
                                                    'delivered' && (
                                                        <button
                                                            onClick={() =>
                                                                advanceOrderStatus(order.orderId)
                                                            }
                                                            className="btn btn-sm"
                                                            style={{
                                                                backgroundColor: '#F2C94C',
                                                                color: '#1B7F79',
                                                                fontWeight: 'bold'
                                                            }}
                                                        >
                                                            ▶{' '}
                                                            {getNextStatusText(
                                                                order.orderStatus
                                                            )}
                                                        </button>
                                                    )}
                                            </td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                )}

                {/* ==================== CONTENIDO: INGREDIENTES ==================== */}
                {activeTab !== 'orders' && activeTab !== 'administrators' && (
                    <div className="row g-4">
                        {/* Formulario para agregar */}
                        <div className="col-lg-4">
                            <div className="bg-white rounded-3 shadow-lg p-4">
                                <h3 className="h4 fw-bold mb-4" style={{ color: '#1B7F79' }}>
                                    Agregar {getTabLabel(activeTab)}
                                </h3>

                                <form onSubmit={handleSubmit}>
                                    <div className="mb-3">
                                        <label className="form-label fw-semibold">Nombre</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={formData.type}
                                            onChange={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    type: e.target.value
                                                })
                                            }
                                            placeholder="Ej: Pan Integral"
                                            required
                                        />
                                    </div>

                                    <div className="mb-3">
                                        <label className="form-label fw-semibold">
                                            Precio ($)
                                        </label>
                                        <input
                                            type="number"
                                            step="0.01"
                                            className="form-control"
                                            value={formData.price}
                                            onChange={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    price: e.target.value
                                                })
                                            }
                                            placeholder="Ej: 50"
                                            required
                                        />
                                    </div>

                                    <div className="mb-3 form-check">
                                        <input
                                            type="checkbox"
                                            className="form-check-input"
                                            id="available"
                                            checked={formData.available}
                                            onChange={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    available: e.target.checked
                                                })
                                            }
                                        />
                                        <label
                                            className="form-check-label"
                                            htmlFor="available"
                                        >
                                            Disponible
                                        </label>
                                    </div>

                                    <button
                                        type="submit"
                                        className="btn w-100 fw-bold"
                                        style={{
                                            backgroundColor: '#F2C94C',
                                            color: '#1B7F79'
                                        }}
                                        disabled={loading}
                                    >
                                        {loading ? 'Guardando...' : 'Agregar Ingrediente'}
                                    </button>
                                </form>
                            </div>
                        </div>

                        {/* Lista de ingredientes */}
                        <div className="col-lg-8">
                            <div className="bg-white rounded-3 shadow-lg p-4">
                                <div className="d-flex justify-content-between align-items-center mb-4">
                                    <h3 className="h4 fw-bold mb-0" style={{ color: '#1B7F79' }}>
                                        Lista de {getTabLabel(activeTab)}
                                    </h3>
                                    <button
                                        onClick={loadDefaultData}
                                        className="btn btn-sm"
                                        style={{
                                            backgroundColor: '#F2C94C',
                                            color: '#1B7F79',
                                            fontWeight: 'bold'
                                        }}
                                        disabled={loading}
                                    >
                                        ⚡ Cargar Predeterminados
                                    </button>
                                </div>

                                {loading ? (
                                    <div className="text-center py-5">
                                        <div
                                            className="spinner-border"
                                            style={{ color: '#1B7F79' }}
                                            role="status"
                                        >
                                        <span className="visually-hidden">
                                            Cargando...
                                        </span>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="table-responsive">
                                        <table className="table table-hover">
                                            <thead>
                                            <tr>
                                                <th>Nombre</th>
                                                <th>Precio</th>
                                                <th>Estado</th>
                                                <th>Acciones</th>
                                            </tr>
                                            </thead>
                                            <tbody>
                                            {getCurrentIngredients().length === 0 ? (
                                                <tr>
                                                    <td
                                                        colSpan="4"
                                                        className="text-center py-4 text-muted"
                                                    >
                                                        No hay ingredientes registrados
                                                    </td>
                                                </tr>
                                            ) : (
                                                getCurrentIngredients().map(
                                                    (ingredient, index) => (
                                                        <tr key={index}>
                                                            <td className="fw-semibold">
                                                                {ingredient.type}
                                                            </td>
                                                            <td>${ingredient.price}</td>
                                                            <td>
                                                                <span
                                                                    className={`badge ${
                                                                        ingredient.available
                                                                            ? 'bg-success'
                                                                            : 'bg-secondary'
                                                                    }`}
                                                                >
                                                                    {ingredient.available
                                                                        ? 'Disponible'
                                                                        : 'No disponible'}
                                                                </span>
                                                            </td>
                                                            <td>
                                                                <div className="d-flex gap-2">
                                                                    <button
                                                                        onClick={() =>
                                                                            toggleAvailability(
                                                                                ingredient.type,
                                                                                ingredient.available
                                                                            )
                                                                        }
                                                                        className="btn btn-sm btn-outline-primary"
                                                                        title="Cambiar disponibilidad"
                                                                    >
                                                                        {ingredient.available
                                                                            ? '🔒'
                                                                            : '✅'}
                                                                    </button>
                                                                    <button
                                                                        onClick={() =>
                                                                            updatePrice(
                                                                                ingredient.type
                                                                            )
                                                                        }
                                                                        className="btn btn-sm btn-outline-warning"
                                                                        title="Cambiar precio"
                                                                    >
                                                                        💲
                                                                    </button>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    )
                                                )
                                            )}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

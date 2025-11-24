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
            alert('No tienes permisos para acceder a esta página');
            navigate('/');
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

            console.log('✅ Pedidos cargados:', response.data);
            setOrders(response.data);
        } catch (error) {
            console.error('❌ Error al cargar pedidos:', error);
            alert('Error al cargar pedidos: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    const advanceOrderStatus = async (orderId) => {
        if (!window.confirm('¿Avanzar este pedido al siguiente estado?')) {
            return;
        }

        try {
            const token = authService.getToken();
            await axios.post(
                `http://localhost:8080/api/admin/orders/${orderId}/advance`,
                {},
                { headers: { 'Authorization': `Bearer ${token}` } }
            );

            alert('✅ Estado actualizado exitosamente');
            loadOrders();
        } catch (error) {
            console.error('❌ Error al actualizar estado:', error);
            alert('Error: ' + (error.response?.data || error.message));
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
            alert('Error al cargar administradores: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleAdminSubmit = async (e) => {
        e.preventDefault();

        if (!adminFormData.name || !adminFormData.surname || !adminFormData.email || !adminFormData.password) {
            alert('Por favor completa todos los campos');
            return;
        }

        if (adminFormData.password.length < 6) {
            alert('La contraseña debe tener al menos 6 caracteres');
            return;
        }

        setLoading(true);
        try {
            await administratorService.createAdministrator(adminFormData);
            alert('✅ ¡Administrador creado exitosamente!');
            setAdminFormData({ name: '', surname: '', email: '', password: '' });
            loadAdministrators();
        } catch (error) {
            console.error('Error:', error);
            alert('Error al crear administrador: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    const deleteAdmin = async (id, email) => {
        if (!window.confirm(`¿Estás seguro de eliminar al administrador ${email}?`)) {
            return;
        }

        try {
            await administratorService.deleteAdministrator(id);
            alert('✅ Administrador eliminado exitosamente');
            loadAdministrators();
        } catch (error) {
            alert('Error al eliminar administrador: ' + error.message);
        }
    };

    // ==================== INGREDIENTES ====================

    const loadIngredients = async () => {
        setLoading(true);
        try {
            switch (activeTab) {
                case 'breads':
                    const breadsData = await ingredientService.getAllBreads();
                    setBreads(breadsData);
                    break;
                case 'meats':
                    const meatsData = await ingredientService.getAllMeats();
                    setMeats(meatsData);
                    break;
                case 'cheeses':
                    const cheesesData = await ingredientService.getAllCheeses();
                    setCheeses(cheesesData);
                    break;
                case 'toppings':
                    const toppingsData = await ingredientService.getAllToppings();
                    setToppings(toppingsData);
                    break;
                case 'dressings':
                    const dressingsData = await ingredientService.getAllDressings();
                    setDressings(dressingsData);
                    break;
            }
        } catch (error) {
            console.error('Error al cargar ingredientes:', error);
            alert('Error al cargar ingredientes: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.type || !formData.price) {
            alert('Por favor completa todos los campos');
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
            }

            alert('¡Ingrediente creado exitosamente!');
            setFormData({ type: '', price: '', available: true });
            loadIngredients();
        } catch (error) {
            console.error('Error:', error);
            alert('Error al crear ingrediente: ' + error.message);
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
            }
            loadIngredients();
        } catch (error) {
            alert('Error al actualizar disponibilidad: ' + error.message);
        }
    };

    const updatePrice = async (type) => {
        const newPrice = prompt('Ingresa el nuevo precio:');
        if (!newPrice || isNaN(newPrice)) return;

        try {
            switch (activeTab) {
                case 'breads':
                    await ingredientService.updateBreadPrice(type, parseFloat(newPrice));
                    break;
                case 'meats':
                    await ingredientService.updateMeatPrice(type, parseFloat(newPrice));
                    break;
                case 'cheeses':
                    await ingredientService.updateCheesePrice(type, parseFloat(newPrice));
                    break;
                case 'toppings':
                    await ingredientService.updateToppingPrice(type, parseFloat(newPrice));
                    break;
                case 'dressings':
                    await ingredientService.updateDressingPrice(type, parseFloat(newPrice));
                    break;
            }
            loadIngredients();
        } catch (error) {
            alert('Error al actualizar precio: ' + error.message);
        }
    };

    const getCurrentIngredients = () => {
        switch (activeTab) {
            case 'breads': return breads;
            case 'meats': return meats;
            case 'cheeses': return cheeses;
            case 'toppings': return toppings;
            case 'dressings': return dressings;
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
            dressings: 'Salsas',
            administrators: 'Administradores'
        };
        return labels[tab];
    };

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

                {/* Sección COCINA */}
                <div className="bg-white rounded-3 shadow-lg p-3 mb-4">
                    <h3 className="h5 fw-bold mb-3" style={{ color: '#1B7F79' }}>
                        🍽️ COCINA
                    </h3>
                    <div className="d-flex gap-2 flex-wrap">
                        <button
                            onClick={() => setActiveTab('orders')}
                            className={`btn ${activeTab === 'orders' ? 'btn-primary' : 'btn-outline-secondary'}`}
                            style={activeTab === 'orders' ? {
                                backgroundColor: '#1B7F79',
                                borderColor: '#1B7F79'
                            } : {}}
                        >
                            📦 {getTabLabel('orders')}
                        </button>
                        {['breads', 'meats', 'cheeses', 'toppings', 'dressings'].map(tab => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`btn ${activeTab === tab ? 'btn-primary' : 'btn-outline-secondary'}`}
                                style={activeTab === tab ? {
                                    backgroundColor: '#1B7F79',
                                    borderColor: '#1B7F79'
                                } : {}}
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
                            className={`btn ${activeTab === 'administrators' ? 'btn-primary' : 'btn-outline-secondary'}`}
                            style={activeTab === 'administrators' ? {
                                backgroundColor: '#1B7F79',
                                borderColor: '#1B7F79'
                            } : {}}
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
                                            onChange={(e) => setAdminFormData({ ...adminFormData, name: e.target.value })}
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
                                            onChange={(e) => setAdminFormData({ ...adminFormData, surname: e.target.value })}
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
                                            onChange={(e) => setAdminFormData({ ...adminFormData, email: e.target.value })}
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
                                            onChange={(e) => setAdminFormData({ ...adminFormData, password: e.target.value })}
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
                                        <div className="spinner-border" style={{ color: '#1B7F79' }} role="status">
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
                                                    <td colSpan="6" className="text-center py-4 text-muted">
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
                                                                onClick={() => deleteAdmin(admin.userId, admin.email)}
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
                                <div className="spinner-border" style={{ color: '#1B7F79' }} role="status">
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
                                                <small className="text-muted">{order.clientEmail}</small>
                                            </td>
                                            <td>
                                                    <span className="badge" style={{
                                                        backgroundColor: order.productType === 'PIZZA' ? '#ef4444' : '#f59e0b'
                                                    }}>
                                                        {order.productType === 'PIZZA' ? '🍕 Pizza' : '🍔 Hamburguesa'}
                                                    </span>
                                            </td>
                                            <td>
                                                <div className="small" style={{ lineHeight: '1.6' }}>
                                                    {/* Ingredientes base */}
                                                    <div className="mb-2 p-2 bg-light rounded">
                                                        {order.productType === 'PIZZA' ? (
                                                            <>
                                                                <div><strong>🍕 Tamaño:</strong> {order.size}</div>
                                                                <div><strong>🥖 Masa:</strong> {order.dough}</div>
                                                                <div><strong>🍅 Salsa:</strong> {order.sauce}</div>
                                                                <div><strong>🧀 Queso:</strong> {order.cheese}</div>
                                                            </>
                                                        ) : (
                                                            <>
                                                                <div><strong>🥖 Pan:</strong> {order.bread}</div>
                                                                <div><strong>🥩 Carne:</strong> {order.meat}</div>
                                                                {order.cheese && (
                                                                    <div><strong>🧀 Queso:</strong> {order.cheese}</div>
                                                                )}
                                                            </>
                                                        )}
                                                    </div>

                                                    {/* Toppings */}
                                                    {order.toppings && order.toppings.length > 0 && (
                                                        <div className="mb-2 p-2 bg-success bg-opacity-10 rounded border border-success border-opacity-25">
                                                            <strong className="text-success d-block mb-1">✨ Toppings:</strong>
                                                            <div className="ps-2">
                                                                {order.toppings.map((topping, idx) => (
                                                                    <div key={idx} className="text-success">
                                                                        ✓ {topping}
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    )}

                                                    {/* Dressings */}
                                                    {order.dressings && order.dressings.length > 0 && (
                                                        <div className="mb-2 p-2 bg-warning bg-opacity-10 rounded border border-warning border-opacity-25">
                                                            <strong className="text-warning d-block mb-1">🧂 Aderezos:</strong>
                                                            <div className="ps-2">
                                                                {order.dressings.map((dressing, idx) => (
                                                                    <div key={idx} className="text-warning">
                                                                        ✓ {dressing}
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    )}

                                                    {/* Extras */}
                                                    {(order.beverage || order.sideOrder) && (
                                                        <div className="p-2 bg-info bg-opacity-10 rounded border border-info border-opacity-25">
                                                            <strong className="text-info d-block mb-1">➕ Extras:</strong>
                                                            <div className="ps-2">
                                                                {order.beverage && (
                                                                    <div className="text-info">✓ Bebida: {order.beverage}</div>
                                                                )}
                                                                {order.sideOrder && (
                                                                    <div className="text-info">✓ Acompañamiento: {order.sideOrder}</div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            </td>
                                            <td>
                                                <small>{order.orderAddress || 'No especificada'}</small>
                                            </td>
                                            <td className="fw-bold">${order.totalPrice}</td>
                                            <td>
                                                    <span className={`badge ${getStatusBadgeClass(order.orderStatus)}`}>
                                                        {getStatusText(order.orderStatus)}
                                                    </span>
                                            </td>
                                            <td>
                                                {order.orderStatus.toLowerCase() !== 'delivered' && (
                                                    <button
                                                        onClick={() => advanceOrderStatus(order.orderId)}
                                                        className="btn btn-sm"
                                                        style={{
                                                            backgroundColor: '#F2C94C',
                                                            color: '#1B7F79',
                                                            fontWeight: 'bold'
                                                        }}
                                                    >
                                                        ▶ {getNextStatusText(order.orderStatus)}
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
                                            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                            placeholder="Ej: Pan Integral"
                                            required
                                        />
                                    </div>

                                    <div className="mb-3">
                                        <label className="form-label fw-semibold">Precio ($)</label>
                                        <input
                                            type="number"
                                            step="0.01"
                                            className="form-control"
                                            value={formData.price}
                                            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
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
                                            onChange={(e) => setFormData({ ...formData, available: e.target.checked })}
                                        />
                                        <label className="form-check-label" htmlFor="available">
                                            Disponible
                                        </label>
                                    </div>

                                    <button
                                        type="submit"
                                        className="btn w-100 fw-bold"
                                        style={{ backgroundColor: '#F2C94C', color: '#1B7F79' }}
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
                                <h3 className="h4 fw-bold mb-4" style={{ color: '#1B7F79' }}>
                                    Lista de {getTabLabel(activeTab)}
                                </h3>

                                {loading ? (
                                    <div className="text-center py-5">
                                        <div className="spinner-border" style={{ color: '#1B7F79' }} role="status">
                                            <span className="visually-hidden">Cargando...</span>
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
                                                    <td colSpan="4" className="text-center py-4 text-muted">
                                                        No hay ingredientes registrados
                                                    </td>
                                                </tr>
                                            ) : (
                                                getCurrentIngredients().map((ingredient, index) => (
                                                    <tr key={index}>
                                                        <td className="fw-semibold">{ingredient.type}</td>
                                                        <td>${ingredient.price}</td>
                                                        <td>
                                                                <span className={`badge ${ingredient.available ? 'bg-success' : 'bg-secondary'}`}>
                                                                    {ingredient.available ? 'Disponible' : 'No disponible'}
                                                                </span>
                                                        </td>
                                                        <td>
                                                            <div className="d-flex gap-2">
                                                                <button
                                                                    onClick={() => toggleAvailability(ingredient.type, ingredient.available)}
                                                                    className="btn btn-sm btn-outline-primary"
                                                                    title="Cambiar disponibilidad"
                                                                >
                                                                    {ingredient.available ? '🔒' : '✅'}
                                                                </button>
                                                                <button
                                                                    onClick={() => updatePrice(ingredient.type)}
                                                                    className="btn btn-sm btn-outline-warning"
                                                                    title="Cambiar precio"
                                                                >
                                                                    💲
                                                                </button>
                                                            </div>
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
            </div>
        </div>
    );
}
import React, { useState, useEffect } from 'react';
import { ingredientService } from '../services/ingredientService';
import { authService } from '../services/authService';
import { useNavigate } from 'react-router-dom';

export default function AdminPage() {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('breads');
    const [loading, setLoading] = useState(false);

    // Estados para cada tipo de ingrediente
    const [breads, setBreads] = useState([]);
    const [meats, setMeats] = useState([]);
    const [cheeses, setCheeses] = useState([]);
    const [toppings, setToppings] = useState([]);
    const [dressings, setDressings] = useState([]);

    // Estado del formulario
    const [formData, setFormData] = useState({
        type: '',
        price: '',
        available: true
    });

    // Verificar que sea admin
    useEffect(() => {
        if (!authService.isAdmin()) {
            alert('No tienes permisos para acceder a esta página');
            navigate('/');
        }
    }, [navigate]);

    // Cargar ingredientes según la pestaña activa
    useEffect(() => {
        loadIngredients();
    }, [activeTab]);

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
            breads: 'Panes',
            meats: 'Carnes',
            cheeses: 'Quesos',
            toppings: 'Toppings',
            dressings: 'Salsas'
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
                            Panel de Administración - Ingredientes
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

                <div className="row g-4">
                    {/* Navegación de pestañas */}
                    <div className="col-12">
                        <div className="bg-white rounded-3 shadow-lg p-3">
                            <div className="d-flex gap-2 flex-wrap">
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
                    </div>

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
            </div>
        </div>
    );
}
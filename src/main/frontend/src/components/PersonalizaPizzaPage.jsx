import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { authService } from '../services/authService';
import { pizzaService } from '../services/pizzaService';

export default function PersonalizaPizzaPage() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [loadingData, setLoadingData] = useState(true);

    // Estado para la construcción de la pizza
    const [pizza, setPizza] = useState({
        size: null,
        dough: null,
        sauce: null,
        cheese: null,
        toppings: []
    });

    // Opciones disponibles (ahora se cargarán del backend)
    const [opciones, setOpciones] = useState({
        sizes: [],
        doughs: [],
        sauces: [],
        cheeses: [],
        toppings: []
    });

    // Colores por defecto
    const coloresPorDefecto = {
        size: '#E8E8E8',
        dough: '#F5DEB3',
        sauce: '#C0392B',
        cheese: '#F8F1B8',
        topping: '#90EE90'
    };

    const asignarColor = (nombre, tipo) => {
        if (!nombre) {
            return coloresPorDefecto[tipo] || '#CCCCCC';
        }

        const nombreLower = nombre.toLowerCase();

        // Colores para masas
        if (tipo === 'dough') {
            if (nombreLower.includes('clásica') || nombreLower.includes('clasica')) return '#F5DEB3';
            if (nombreLower.includes('piedra')) return '#E6C28B';
            if (nombreLower.includes('napolitana')) return '#D2A679';
            if (nombreLower.includes('integral')) return '#C49A6C';
            return '#F5DEB3';
        }

        // Colores para salsas
        if (tipo === 'sauce') {
            if (nombreLower.includes('tomate')) return '#C0392B';
            if (nombreLower.includes('pomodoro')) return '#D35400';
            if (nombreLower.includes('blanca')) return '#FDF5E6';
            if (nombreLower.includes('bbq')) return '#8B4513';
            if (nombreLower.includes('4 quesos')) return '#F5E0A3';
            return '#C0392B';
        }

        // Colores para quesos
        if (tipo === 'cheese') {
            if (nombreLower.includes('muzzarella') || nombreLower.includes('mozza')) return '#F8F1B8';
            if (nombreLower.includes('4 quesos')) return '#F7E7A9';
            if (nombreLower.includes('cheddar')) return '#F4B350';
            if (nombreLower.includes('parmesano')) return '#F5E0A3';
            if (nombreLower.includes('roquefort')) return '#E6E6FA';
            return '#F8F1B8';
        }

        // Colores para toppings
        if (tipo === 'topping') {
            if (nombreLower.includes('lechuga')) return '#90EE90';
            if (nombreLower.includes('tomate')) return '#FF6347';
            if (nombreLower.includes('cebolla')) return '#F5F5DC';
            if (nombreLower.includes('pepino')) return '#8FBC8F';
            if (nombreLower.includes('bacon')) return '#8B4513';
            if (nombreLower.includes('huevo')) return '#FFD700';
            if (nombreLower.includes('champiñon') || nombreLower.includes('champignon')) return '#D2B48C';
            if (nombreLower.includes('jalapeño') || nombreLower.includes('jalapeno')) return '#228B22';
            if (nombreLower.includes('cebolla caramelizada')) return '#D2691E';
            if (nombreLower.includes('aguacate') || nombreLower.includes('palta')) return '#7CFC00';
            return '#90EE90';
        }

        return coloresPorDefecto[tipo] || '#CCCCCC';
    };

    // Cargar datos del backend al montar el componente
    useEffect(() => {
        cargarDatosIniciales();
    }, []);

    const cargarDatosIniciales = async () => {
        try {
            setLoadingData(true);
            console.log('🍕 Iniciando carga de ingredientes de pizza...');

            const [sizes, doughs, sauces, cheeses, toppings] = await Promise.all([
                pizzaService.getAllSizes(),
                pizzaService.getAllDoughs(),
                pizzaService.getAllSauces(),
                pizzaService.getAllCheeses(),
                pizzaService.getAllToppings()
            ]);

            console.log('✅ Datos cargados:', { sizes, doughs, sauces, cheeses, toppings });

            // Formatear los datos para el frontend
            setOpciones({
                sizes: Array.isArray(sizes) ? sizes
                    .filter(size => size.available)
                    .map(size => ({
                        id: size.id?.toString() || '',
                        nombre: size.type || 'Sin nombre',
                        precio: parseFloat(size.price) || 0,
                        color: asignarColor(size.type || '', 'size')
                    })) : [],

                doughs: Array.isArray(doughs) ? doughs
                    .filter(dough => dough.available)
                    .map(dough => ({
                        id: dough.id?.toString() || '',
                        nombre: dough.type || 'Sin nombre',
                        precio: parseFloat(dough.price) || 0,
                        color: asignarColor(dough.type || '', 'dough')
                    })) : [],

                sauces: Array.isArray(sauces) ? sauces
                    .filter(sauce => sauce.available)
                    .map(sauce => ({
                        id: sauce.id?.toString() || '',
                        nombre: sauce.type || 'Sin nombre',
                        precio: parseFloat(sauce.price) || 0,
                        color: asignarColor(sauce.type || '', 'sauce')
                    })) : [],

                cheeses: Array.isArray(cheeses) ? cheeses
                    .filter(cheese => cheese.available)
                    .map(cheese => ({
                        id: cheese.id?.toString() || '',
                        nombre: cheese.type || 'Sin nombre',
                        precio: parseFloat(cheese.price) || 0,
                        color: asignarColor(cheese.type || '', 'cheese')
                    })) : [],

                toppings: Array.isArray(toppings) ? toppings
                    .filter(topping => topping.available)
                    .map(topping => ({
                        id: topping.id?.toString() || '',
                        nombre: topping.type || 'Sin nombre',
                        precio: parseFloat(topping.price) || 0,
                        color: asignarColor(topping.type || '', 'topping')
                    })) : []
            });

            console.log('✅ Opciones formateadas correctamente');

        } catch (error) {
            console.error('❌ Error al cargar ingredientes:', error);
            alert('Error al cargar los ingredientes. Por favor, recarga la página.');
        } finally {
            setLoadingData(false);
        }
    };

    const calcularPrecio = () => {
        let total = 0;

        if (pizza.size) {
            const size = opciones.sizes.find(s => s.id === pizza.size);
            if (size) total += size.precio;
        }
        if (pizza.dough) {
            const dough = opciones.doughs.find(d => d.id === pizza.dough);
            if (dough) total += dough.precio;
        }
        if (pizza.sauce) {
            const sauce = opciones.sauces.find(s => s.id === pizza.sauce);
            if (sauce) total += sauce.precio;
        }
        if (pizza.cheese) {
            const cheese = opciones.cheeses.find(c => c.id === pizza.cheese);
            if (cheese) total += cheese.precio;
        }
        pizza.toppings.forEach(t => {
            const topping = opciones.toppings.find(top => top.id === t);
            if (topping) total += topping.precio;
        });

        return total;
    };

    const agregarAlCarrito = async () => {
        if (!pizza.size || !pizza.dough || !pizza.sauce) {
            alert('Debes seleccionar al menos tamaño, masa y salsa');
            return;
        }

        if (!authService.isAuthenticated()) {
            const confirmLogin = window.confirm(
                'Debes iniciar sesión para guardar tu pizza. ¿Deseas ir al login?'
            );
            if (confirmLogin) {
                navigate('/login');
            }
            return;
        }

        try {
            setLoading(true);

            const userId = authService.getUserId();
            console.log('===== DEBUG USERID =====');
            console.log('userId obtenido:', userId);
            console.log('========================');

            if (!userId) {
                alert('No se pudo obtener tu ID de usuario. Por favor, inicia sesión nuevamente.');
                navigate('/login');
                return;
            }

            // Obtener los objetos completos de las selecciones
            const sizeSeleccionado = opciones.sizes.find(s => s.id === pizza.size);
            const doughSeleccionado = opciones.doughs.find(d => d.id === pizza.dough);
            const sauceSeleccionado = opciones.sauces.find(s => s.id === pizza.sauce);
            const cheeseSeleccionado = pizza.cheese ? opciones.cheeses.find(c => c.id === pizza.cheese) : null;

            // Validar que se encontraron todos los ingredientes
            if (!sizeSeleccionado) {
                alert('Error: No se encontró el tamaño seleccionado');
                return;
            }
            if (!doughSeleccionado) {
                alert('Error: No se encontró la masa seleccionada');
                return;
            }
            if (!sauceSeleccionado) {
                alert('Error: No se encontró la salsa seleccionada');
                return;
            }

            console.log('===== INGREDIENTES SELECCIONADOS =====');
            console.log('Size:', sizeSeleccionado);
            console.log('Dough:', doughSeleccionado);
            console.log('Sauce:', sauceSeleccionado);
            console.log('Cheese:', cheeseSeleccionado);
            console.log('======================================');

            // Obtener nombres de toppings
            const toppingNombres = pizza.toppings
                .map(id => {
                    const topping = opciones.toppings.find(t => t.id === id);
                    return topping ? topping.nombre : null;
                })
                .filter(nombre => nombre !== null);

            console.log('Topping nombres:', toppingNombres);

            // Preparar datos enviando los nombres exactos (type) de la BD
            const pizzaData = {
                userId: parseInt(userId),
                size: sizeSeleccionado.nombre,        // Nombre del tamaño
                dough: doughSeleccionado.nombre,      // Nombre de la masa
                sauce: sauceSeleccionado.nombre,      // Nombre de la salsa
                cheese: cheeseSeleccionado ? cheeseSeleccionado.nombre : null,
                toppings: toppingNombres,             // Array de nombres
                orderDate: new Date().toISOString()
            };

            console.log('===== DATOS A ENVIAR AL BACKEND =====');
            console.log(JSON.stringify(pizzaData, null, 2));
            console.log('=====================================');

            const response = await pizzaService.createPizza(pizzaData);

            // Limpiar formulario
            setPizza({
                size: null,
                dough: null,
                sauce: null,
                cheese: null,
                toppings: []
            });

            alert(`¡Pizza guardada exitosamente! 🍕`);

        } catch (error) {
            console.error('===== ERROR COMPLETO =====');
            console.error('Error:', error);
            console.error('Message:', error.message);
            console.error('==========================');

            // Mensaje más informativo
            if (error.message.includes('not found')) {
                alert('Error: Alguno de los ingredientes seleccionados no existe en la base de datos.\n\nPor favor, verifica que los ingredientes estén creados correctamente en el panel de administración.');
            } else {
                alert('Error al guardar la pizza: ' + error.message);
            }
        } finally {
            setLoading(false);
        }
    };

    const toggleItem = (campo, id) => {
        // toppings: multi selección
        if (campo === 'toppings') {
            const items = pizza.toppings;
            if (items.includes(id)) {
                setPizza({ ...pizza, toppings: items.filter(item => item !== id) });
            } else {
                setPizza({ ...pizza, toppings: [...items, id] });
            }
        } else {
            // size, dough, sauce, cheese: selección única
            setPizza({ ...pizza, [campo]: pizza[campo] === id ? null : id });
        }
    };

    // Función para repartir toppings alrededor del círculo
    const getToppingPosition = (index, total) => {
        const radius = 40;
        const center = 65;
        const angle = (2 * Math.PI * index) / total;

        return {
            left: center + radius * Math.cos(angle) - 7,
            top: center + radius * Math.sin(angle) - 7
        };
    };

    // Mostrar loading mientras se cargan los datos
    if (loadingData) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-[#1D7B74] to-[#166863] d-flex justify-content-center align-items-center">
                <div className="text-center text-white">
                    <div className="spinner-border" role="status" style={{ width: '3rem', height: '3rem' }}>
                        <span className="visually-hidden">Cargando...</span>
                    </div>
                    <p className="mt-3 h5">Cargando ingredientes...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#1D7B74] to-[#166863]">
            <div className="container mx-auto px-4 py-8">
                <div className="row g-4">
                    {/* Panel de construcción */}
                    <div className="col-lg-8">
                        <div className="bg-white rounded-3 shadow-lg p-4">
                            <h2 className="h3 fw-bold mb-4" style={{ color: '#1B7F79' }}>
                                Armá tu Pizza
                            </h2>

                            {/* 1. Tamaño */}
                            <div className="mb-4">
                                <h3 className="h5 fw-bold mb-3" style={{ color: '#1B7F79' }}>
                                    1. Elegí el Tamaño
                                    {opciones.sizes.length === 0 && <span className="small text-muted ms-2">(No hay tamaños disponibles)</span>}
                                </h3>
                                <div className="row g-3">
                                    {opciones.sizes.map(size => (
                                        <div key={size.id} className="col-12 col-md-4">
                                            <button
                                                onClick={() => toggleItem('size', size.id)}
                                                className={`w-100 p-3 rounded-3 border-2 transition-all ${
                                                    pizza.size === size.id
                                                        ? 'border-success bg-light'
                                                        : 'border-secondary bg-white'
                                                }`}
                                                style={{
                                                    borderStyle: 'solid',
                                                    borderColor: pizza.size === size.id ? '#1B7F79' : '#dee2e6'
                                                }}
                                                disabled={loading}
                                            >
                                                <p className="fw-semibold small mb-1">{size.nombre}</p>
                                                <p className="small mb-0" style={{ color: '#1B7F79' }}>
                                                    ${size.precio}
                                                </p>
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* 2. Masa (Dough) */}
                            <div className="mb-4">
                                <h3 className="h5 fw-bold mb-3" style={{ color: '#1B7F79' }}>
                                    2. Elegí la Masa
                                    {opciones.doughs.length === 0 && <span className="small text-muted ms-2">(No hay masas disponibles)</span>}
                                </h3>
                                <div className="row g-3">
                                    {opciones.doughs.map(dough => (
                                        <div key={dough.id} className="col-6 col-md-3">
                                            <button
                                                onClick={() => toggleItem('dough', dough.id)}
                                                className={`w-100 p-3 rounded-3 border-2 transition-all ${
                                                    pizza.dough === dough.id
                                                        ? 'border-success bg-light'
                                                        : 'border-secondary bg-white'
                                                }`}
                                                style={{
                                                    borderStyle: 'solid',
                                                    borderColor: pizza.dough === dough.id ? '#1B7F79' : '#dee2e6'
                                                }}
                                                disabled={loading}
                                            >
                                                <div
                                                    className="w-100 rounded-2 mb-2"
                                                    style={{
                                                        backgroundColor: dough.color,
                                                        height: '60px'
                                                    }}
                                                ></div>
                                                <p className="fw-semibold small mb-1">{dough.nombre}</p>
                                                <p className="small mb-0" style={{ color: '#1B7F79' }}>
                                                    ${dough.precio}
                                                </p>
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* 3. Salsa */}
                            <div className="mb-4">
                                <h3 className="h5 fw-bold mb-3" style={{ color: '#1B7F79' }}>
                                    3. Elegí la Salsa
                                    {opciones.sauces.length === 0 && <span className="small text-muted ms-2">(No hay salsas disponibles)</span>}
                                </h3>
                                <div className="row g-3">
                                    {opciones.sauces.map(sauce => (
                                        <div key={sauce.id} className="col-6 col-md-3">
                                            <button
                                                onClick={() => toggleItem('sauce', sauce.id)}
                                                className={`w-100 p-3 rounded-3 border-2 transition-all ${
                                                    pizza.sauce === sauce.id
                                                        ? 'border-success bg-light'
                                                        : 'border-secondary bg-white'
                                                }`}
                                                style={{
                                                    borderStyle: 'solid',
                                                    borderColor: pizza.sauce === sauce.id ? '#1B7F79' : '#dee2e6'
                                                }}
                                                disabled={loading}
                                            >
                                                <div
                                                    className="w-100 rounded-2 mb-2"
                                                    style={{
                                                        backgroundColor: sauce.color,
                                                        height: '48px'
                                                    }}
                                                ></div>
                                                <p className="fw-semibold small mb-1">{sauce.nombre}</p>
                                                <p className="small mb-0" style={{ color: '#1B7F79' }}>
                                                    ${sauce.precio}
                                                </p>
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* 4. Queso */}
                            <div className="mb-4">
                                <h3 className="h5 fw-bold mb-3" style={{ color: '#1B7F79' }}>
                                    4. Agregá Queso (opcional)
                                    {opciones.cheeses.length === 0 && <span className="small text-muted ms-2">(No hay quesos disponibles)</span>}
                                </h3>
                                <div className="row g-3">
                                    {opciones.cheeses.map(cheese => (
                                        <div key={cheese.id} className="col-6 col-md-3">
                                            <button
                                                onClick={() => toggleItem('cheese', cheese.id)}
                                                className={`w-100 p-3 rounded-3 border-2 transition-all ${
                                                    pizza.cheese === cheese.id
                                                        ? 'border-success bg-light'
                                                        : 'border-secondary bg-white'
                                                }`}
                                                style={{
                                                    borderStyle: 'solid',
                                                    borderColor: pizza.cheese === cheese.id ? '#1B7F79' : '#dee2e6'
                                                }}
                                                disabled={loading}
                                            >
                                                <div
                                                    className="w-100 rounded-2 mb-2"
                                                    style={{
                                                        backgroundColor: cheese.color,
                                                        height: '48px'
                                                    }}
                                                ></div>
                                                <p className="fw-semibold small mb-1">{cheese.nombre}</p>
                                                <p className="small mb-0" style={{ color: '#1B7F79' }}>
                                                    ${cheese.precio}
                                                </p>
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* 5. Toppings */}
                            {opciones.toppings.length > 0 && (
                                <div className="mb-4">
                                    <h3 className="h5 fw-bold mb-3" style={{ color: '#1B7F79' }}>
                                        5. Agregá Toppings
                                    </h3>
                                    <div className="row g-3">
                                        {opciones.toppings.map(topping => (
                                            <div key={topping.id} className="col-6 col-md-4">
                                                <button
                                                    onClick={() => toggleItem('toppings', topping.id)}
                                                    className={`w-100 p-3 rounded-3 border-2 transition-all ${
                                                        pizza.toppings.includes(topping.id)
                                                            ? 'border-success bg-light'
                                                            : 'border-secondary bg-white'
                                                    }`}
                                                    style={{
                                                        borderStyle: 'solid',
                                                        borderColor: pizza.toppings.includes(topping.id) ? '#1B7F79' : '#dee2e6'
                                                    }}
                                                    disabled={loading}
                                                >
                                                    <div
                                                        className="w-100 rounded-2 mb-2"
                                                        style={{
                                                            backgroundColor: topping.color,
                                                            height: '40px'
                                                        }}
                                                    ></div>
                                                    <p className="fw-semibold small mb-1">{topping.nombre}</p>
                                                    <p className="small mb-0" style={{ color: '#1B7F79' }}>
                                                        ${topping.precio}
                                                    </p>
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Panel de resumen / vista de la pizza */}
                    <div className="col-lg-4">
                        <div className="bg-white rounded-3 shadow-lg p-4 sticky-top" style={{ top: '100px' }}>
                            <h3 className="h4 fw-bold mb-4" style={{ color: '#1B7F79' }}>
                                Tu Pizza
                            </h3>

                            {/* Visualización de la pizza */}
                            <div className="bg-light rounded-3 p-4 mb-4 d-flex flex-column align-items-center">
                                <div
                                    className="position-relative d-flex align-items-center justify-content-center"
                                    style={{ width: '180px', height: '180px' }}
                                >
                                    {/* Masa */}
                                    {pizza.dough && opciones.doughs.find(d => d.id === pizza.dough) && (
                                        <div
                                            style={{
                                                position: 'absolute',
                                                width: '180px',
                                                height: '180px',
                                                borderRadius: '50%',
                                                backgroundColor: opciones.doughs.find(d => d.id === pizza.dough).color
                                            }}
                                        ></div>
                                    )}
                                    {/* Salsa */}
                                    {pizza.sauce && opciones.sauces.find(s => s.id === pizza.sauce) && (
                                        <div
                                            style={{
                                                position: 'absolute',
                                                width: '150px',
                                                height: '150px',
                                                borderRadius: '50%',
                                                backgroundColor: opciones.sauces.find(s => s.id === pizza.sauce).color,
                                                opacity: 0.9
                                            }}
                                        ></div>
                                    )}
                                    {/* Queso */}
                                    {pizza.cheese && opciones.cheeses.find(c => c.id === pizza.cheese) && (
                                        <div
                                            style={{
                                                position: 'absolute',
                                                width: '130px',
                                                height: '130px',
                                                borderRadius: '50%',
                                                backgroundColor: opciones.cheeses.find(c => c.id === pizza.cheese).color,
                                                opacity: 0.9
                                            }}
                                        ></div>
                                    )}
                                    {/* Toppings repartidos */}
                                    {pizza.toppings.length > 0 && (
                                        <div
                                            style={{
                                                position: 'absolute',
                                                width: '130px',
                                                height: '130px',
                                                top: '25px',
                                                left: '25px'
                                            }}
                                        >
                                            {pizza.toppings.map((t, index) => {
                                                const pos = getToppingPosition(index, pizza.toppings.length);
                                                const topping = opciones.toppings.find(top => top.id === t);
                                                if (!topping) return null;

                                                return (
                                                    <div
                                                        key={t + '-' + index}
                                                        style={{
                                                            position: 'absolute',
                                                            width: '14px',
                                                            height: '14px',
                                                            borderRadius: '50%',
                                                            backgroundColor: topping.color,
                                                            top: `${pos.top}px`,
                                                            left: `${pos.left}px`
                                                        }}
                                                    ></div>
                                                );
                                            })}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Detalles de selección */}
                            <div className="mb-4">
                                {pizza.size && opciones.sizes.find(s => s.id === pizza.size) && (
                                    <div className="d-flex justify-content-between mb-2 small">
                                        <span>Tamaño: {opciones.sizes.find(s => s.id === pizza.size).nombre}</span>
                                        <span className="fw-semibold">
                                            ${opciones.sizes.find(s => s.id === pizza.size).precio}
                                        </span>
                                    </div>
                                )}
                                {pizza.dough && opciones.doughs.find(d => d.id === pizza.dough) && (
                                    <div className="d-flex justify-content-between mb-2 small">
                                        <span>Masa: {opciones.doughs.find(d => d.id === pizza.dough).nombre}</span>
                                        <span className="fw-semibold">
                                            ${opciones.doughs.find(d => d.id === pizza.dough).precio}
                                        </span>
                                    </div>
                                )}
                                {pizza.sauce && opciones.sauces.find(s => s.id === pizza.sauce) && (
                                    <div className="d-flex justify-content-between mb-2 small">
                                        <span>Salsa: {opciones.sauces.find(s => s.id === pizza.sauce).nombre}</span>
                                        <span className="fw-semibold">
                                            ${opciones.sauces.find(s => s.id === pizza.sauce).precio}
                                        </span>
                                    </div>
                                )}
                                {pizza.cheese && opciones.cheeses.find(c => c.id === pizza.cheese) && (
                                    <div className="d-flex justify-content-between mb-2 small">
                                        <span>Queso: {opciones.cheeses.find(c => c.id === pizza.cheese).nombre}</span>
                                        <span className="fw-semibold">
                                            ${opciones.cheeses.find(c => c.id === pizza.cheese).precio}
                                        </span>
                                    </div>
                                )}
                                {pizza.toppings.map(t => {
                                    const topping = opciones.toppings.find(top => top.id === t);
                                    return topping ? (
                                        <div key={t} className="d-flex justify-content-between mb-2 small">
                                            <span>{topping.nombre}</span>
                                            <span className="fw-semibold">
                                                ${topping.precio}
                                            </span>
                                        </div>
                                    ) : null;
                                })}
                            </div>

                            <div className="border-top pt-3 mb-4">
                                <div className="d-flex justify-content-between h4 fw-bold" style={{ color: '#1B7F79' }}>
                                    <span>Total:</span>
                                    <span>${calcularPrecio()}</span>
                                </div>
                            </div>

                            <button
                                onClick={agregarAlCarrito}
                                disabled={loading || !pizza.size || !pizza.dough || !pizza.sauce}
                                className="btn btn-lg w-100 fw-bold shadow"
                                style={{
                                    backgroundColor: (loading || !pizza.size || !pizza.dough || !pizza.sauce) ? '#ccc' : '#F2C94C',
                                    color: '#1B7F79',
                                    border: 'none',
                                    cursor: (loading || !pizza.size || !pizza.dough || !pizza.sauce) ? 'not-allowed' : 'pointer'
                                }}
                            >
                                {loading ? (
                                    <>
                                        <span
                                            className="spinner-border spinner-border-sm me-2"
                                            role="status"
                                            aria-hidden="true"
                                        ></span>
                                        Guardando...
                                    </>
                                ) : (
                                    'Agregar al Carrito'
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
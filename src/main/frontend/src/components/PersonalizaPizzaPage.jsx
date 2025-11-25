import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { authService } from '../services/authService';
//import { pizzaService } from '../services/pizzaService';

export default function PersonalizaPizzaPage() {
    const navigate = useNavigate();
    const [carrito, setCarrito] = useState([]);
    const [loading, setLoading] = useState(false);

    // Estado para la construcción de la pizza
    const [pizza, setPizza] = useState({
        size: null,
        dough: null,
        sauce: null,
        cheese: null,
        toppings: []
    });

    // Opciones disponibles
    const opciones = {
        sizes: [
            { id: '201', nombre: 'Pequeña (20 cm)', precio: 180 },
            { id: '202', nombre: 'Mediana (30 cm)', precio: 260 },
            { id: '203', nombre: 'Grande (40 cm)', precio: 340 }
        ],
        doughs: [
            { id: '211', nombre: 'Clásica', precio: 80, color: '#F5DEB3' },
            { id: '212', nombre: 'A la piedra', precio: 90, color: '#E6C28B' },
            { id: '213', nombre: 'Pan tipo napolitana', precio: 100, color: '#D2A679' },
            { id: '214', nombre: 'Integral', precio: 95, color: '#C49A6C' }
        ],
        sauces: [
            { id: '221', nombre: 'Salsa de Tomate', precio: 40, color: '#C0392B' },
            { id: '222', nombre: 'Pomodoro rústica', precio: 50, color: '#D35400' },
            { id: '223', nombre: 'Salsa Blanca', precio: 55, color: '#FDF5E6' },
            { id: '224', nombre: 'BBQ', precio: 50, color: '#8B4513' }
        ],
        cheeses: [
            { id: '231', nombre: 'Muzzarella', precio: 70, color: '#F8F1B8' },
            { id: '232', nombre: '4 Quesos', precio: 90, color: '#F7E7A9' },
            { id: '233', nombre: 'Cheddar', precio: 80, color: '#F4B350' },
            { id: '234', nombre: 'Parmesano', precio: 85, color: '#F5E0A3' }
        ],
        toppings: [
            { id: '241', nombre: 'Pepperoni', precio: 40, color: '#B22222' },
            { id: '242', nombre: 'Jamón', precio: 35, color: '#F5A9B8' },
            { id: '243', nombre: 'Champiñones', precio: 30, color: '#D3D3D3' },
            { id: '244', nombre: 'Aceitunas', precio: 25, color: '#556B2F' },
            { id: '245', nombre: 'Morrones', precio: 30, color: '#FF6347' },
            { id: '246', nombre: 'Cebolla Morada', precio: 25, color: '#BA55D3' },
            { id: '247', nombre: 'Ananá', precio: 35, color: '#FFE066' }
        ]
    };

    const calcularPrecio = () => {
        let total = 0;

        if (pizza.size) {
            total += opciones.sizes.find(s => s.id === pizza.size).precio;
        }
        if (pizza.dough) {
            total += opciones.doughs.find(d => d.id === pizza.dough).precio;
        }
        if (pizza.sauce) {
            total += opciones.sauces.find(s => s.id === pizza.sauce).precio;
        }
        if (pizza.cheese) {
            total += opciones.cheeses.find(c => c.id === pizza.cheese).precio;
        }
        pizza.toppings.forEach(t => {
            total += opciones.toppings.find(top => top.id === t).precio;
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

            const pizzaData = {
                sizeId: parseInt(pizza.size),
                doughId: parseInt(pizza.dough),
                sauceId: parseInt(pizza.sauce),
                cheeseId: pizza.cheese ? parseInt(pizza.cheese) : null,
                toppingIds: pizza.toppings.map(id => parseInt(id))
            };

            console.log('Enviando pizza:', pizzaData);

            const response = await pizzaService.createPizza(pizzaData);

            setPizza({
                size: null,
                dough: null,
                sauce: null,
                cheese: null,
                toppings: []
            });

            alert(`¡Pizza guardada exitosamente! 🍕\nPrecio total: $${response.price}`);

        } catch (error) {
            console.error('Error:', error);
            alert('Error al guardar la pizza: ' + error.message);
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

    // 🔥 NUEVO: función para repartir toppings alrededor del círculo
    const getToppingPosition = (index, total) => {
        const radius = 40; // qué tan lejos del centro van los toppings
        const center = 65; // centro del círculo (130 / 2)
        const angle = (2 * Math.PI * index) / total;

        return {
            left: center + radius * Math.cos(angle) - 7, // 7 = radio del chip (14/2)
            top: center + radius * Math.sin(angle) - 7
        };
    };

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
                                    {pizza.dough && (
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
                                    {pizza.sauce && (
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
                                    {pizza.cheese && (
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
                                                top: '25px',  // (180 - 130) / 2
                                                left: '25px'
                                            }}
                                        >
                                            {pizza.toppings.map((t, index) => {
                                                const pos = getToppingPosition(index, pizza.toppings.length);
                                                const color = opciones.toppings.find(top => top.id === t).color;

                                                return (
                                                    <div
                                                        key={t + '-' + index}
                                                        style={{
                                                            position: 'absolute',
                                                            width: '14px',
                                                            height: '14px',
                                                            borderRadius: '50%',
                                                            backgroundColor: color,
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
                                {pizza.size && (
                                    <div className="d-flex justify-content-between mb-2 small">
                                        <span>Tamaño: {opciones.sizes.find(s => s.id === pizza.size).nombre}</span>
                                        <span className="fw-semibold">
                                            ${opciones.sizes.find(s => s.id === pizza.size).precio}
                                        </span>
                                    </div>
                                )}
                                {pizza.dough && (
                                    <div className="d-flex justify-content-between mb-2 small">
                                        <span>Masa: {opciones.doughs.find(d => d.id === pizza.dough).nombre}</span>
                                        <span className="fw-semibold">
                                            ${opciones.doughs.find(d => d.id === pizza.dough).precio}
                                        </span>
                                    </div>
                                )}
                                {pizza.sauce && (
                                    <div className="d-flex justify-content-between mb-2 small">
                                        <span>Salsa: {opciones.sauces.find(s => s.id === pizza.sauce).nombre}</span>
                                        <span className="fw-semibold">
                                            ${opciones.sauces.find(s => s.id === pizza.sauce).precio}
                                        </span>
                                    </div>
                                )}
                                {pizza.cheese && (
                                    <div className="d-flex justify-content-between mb-2 small">
                                        <span>Queso: {opciones.cheeses.find(c => c.id === pizza.cheese).nombre}</span>
                                        <span className="fw-semibold">
                                            ${opciones.cheeses.find(c => c.id === pizza.cheese).precio}
                                        </span>
                                    </div>
                                )}
                                {pizza.toppings.map(t => (
                                    <div key={t} className="d-flex justify-content-between mb-2 small">
                                        <span>{opciones.toppings.find(top => top.id === t).nombre}</span>
                                        <span className="fw-semibold">
                                            ${opciones.toppings.find(top => top.id === t).precio}
                                        </span>
                                    </div>
                                ))}
                            </div>

                            <div className="border-top pt-3 mb-4">
                                <div className="d-flex justify-content-between h4 fw-bold" style={{ color: '#1B7F79' }}>
                                    <span>Total:</span>
                                    <span>${calcularPrecio()}</span>
                                </div>
                            </div>

                            <button
                                onClick={agregarAlCarrito}
                                disabled={loading}
                                className="btn btn-lg w-100 fw-bold shadow"
                                style={{
                                    backgroundColor: loading ? '#ccc' : '#F2C94C',
                                    color: '#1B7F79',
                                    border: 'none',
                                    cursor: loading ? 'not-allowed' : 'pointer'
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

import React, { useState } from 'react';

export default function PersonalizaPage() {
    const [carrito, setCarrito] = useState([]);

    // Estado para la construcción de la hamburguesa
    const [burger, setBurger] = useState({
        pan: null,
        carne: null,
        queso: null,
        toppings: [],
        salsas: []
    });

    // Opciones disponibles
    const opciones = {
        panes: [
            { id: 'clasico', nombre: 'Pan Clásico', precio: 50, color: '#D4A574' },
            { id: 'integral', nombre: 'Pan Integral', precio: 60, color: '#8B6F47' },
            { id: 'sesamo', nombre: 'Pan con Sésamo', precio: 55, color: '#C19A6B' },
            { id: 'brioche', nombre: 'Pan Brioche', precio: 70, color: '#E5C29F' }
        ],
        carnes: [
            { id: 'res', nombre: 'Carne de Res', precio: 120, color: '#8B4513' },
            { id: 'pollo', nombre: 'Pechuga de Pollo', precio: 100, color: '#D2B48C' },
            { id: 'cerdo', nombre: 'Carne de Cerdo', precio: 110, color: '#A0522D' },
        ],
        quesos: [
            { id: 'cheddar', nombre: 'Queso Cheddar', precio: 30, color: '#FFA500' },
            { id: 'americano', nombre: 'Queso Americano', precio: 25, color: '#FFD700' },
            { id: 'suizo', nombre: 'Queso Suizo', precio: 35, color: '#F5DEB3' },
            { id: 'azul', nombre: 'Queso Azul', precio: 40, color: '#E6E6FA' }
        ],
        toppings: [
            { id: 'lechuga', nombre: 'Lechuga', precio: 10, color: '#90EE90' },
            { id: 'tomate', nombre: 'Tomate', precio: 10, color: '#FF6347' },
            { id: 'cebolla', nombre: 'Cebolla', precio: 10, color: '#F5F5DC' },
            { id: 'pepinillos', nombre: 'Pepinillos', precio: 15, color: '#8FBC8F' },
            { id: 'jalapeños', nombre: 'Jalapeños', precio: 15, color: '#228B22' },
            { id: 'aguacate', nombre: 'Aguacate', precio: 25, color: '#7CFC00' }
        ],
        salsas: [
            { id: 'ketchup', nombre: 'Ketchup', precio: 5, color: '#DC143C' },
            { id: 'mostaza', nombre: 'Mostaza', precio: 5, color: '#FFD700' },
            { id: 'mayonesa', nombre: 'Mayonesa', precio: 5, color: '#FFFACD' },
            { id: 'bbq', nombre: 'Salsa BBQ', precio: 10, color: '#8B4513' },
            { id: 'ranch', nombre: 'Salsa Alioli', precio: 10, color: '#F5F5DC' },
            { id: 'picante', nombre: 'Salsa Picante', precio: 10, color: '#FF4500' }
        ]
    };

    const calcularPrecio = () => {
        let total = 0;
        if (burger.pan) total += opciones.panes.find(p => p.id === burger.pan).precio;
        if (burger.carne) total += opciones.carnes.find(c => c.id === burger.carne).precio;
        if (burger.queso) total += opciones.quesos.find(q => q.id === burger.queso).precio;
        burger.toppings.forEach(v => {
            total += opciones.toppings.find(veg => veg.id === v).precio;
        });
        burger.salsas.forEach(s => {
            total += opciones.salsas.find(sal => sal.id === s).precio;
        });
        return total;
    };

    const agregarAlCarrito = () => {
        if (!burger.pan || !burger.carne) {
            alert('Debes seleccionar al menos un pan y una carne');
            return;
        }
        setCarrito([...carrito, { ...burger, precio: calcularPrecio(), id: Date.now() }]);
        setBurger({
            pan: null,
            carne: null,
            queso: null,
            toppings: [],
            salsas: []
        });
        alert('¡Hamburguesa agregada al carrito!');
    };

    const toggleItem = (categoria, id) => {
        if (categoria === 'toppings' || categoria === 'salsas') {
            const items = burger[categoria];
            if (items.includes(id)) {
                setBurger({ ...burger, [categoria]: items.filter(item => item !== id) });
            } else {
                setBurger({ ...burger, [categoria]: [...items, id] });
            }
        } else {
            setBurger({ ...burger, [categoria]: burger[categoria] === id ? null : id });
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#1D7B74] to-[#166863]">
            <div className="container mx-auto px-4 py-8">
                <div className="row g-4">
                    {/* Panel de construcción */}
                    <div className="col-lg-8">
                        <div className="bg-white rounded-3 shadow-lg p-4">
                            <h2 className="h3 fw-bold mb-4" style={{ color: '#1B7F79' }}>
                                Armá tu Hamburguesa
                            </h2>

                            {/* Selección de Pan */}
                            <div className="mb-4">
                                <h3 className="h5 fw-bold mb-3" style={{ color: '#1B7F79' }}>
                                    1. Elegí tu Pan
                                </h3>
                                <div className="row g-3">
                                    {opciones.panes.map(pan => (
                                        <div key={pan.id} className="col-5 col-md-3">
                                            <button
                                                onClick={() => toggleItem('pan', pan.id)}
                                                className={`w-100 p-3 rounded-3 border-2 transition-all ${
                                                    burger.pan === pan.id
                                                        ? 'border-success bg-light'
                                                        : 'border-secondary bg-white'
                                                }`}
                                                style={{
                                                    borderStyle: 'solid',
                                                    borderColor: burger.pan === pan.id ? '#1B7F79' : '#dee2e6'
                                                }}
                                            >
                                                <div
                                                    className="w-100 rounded-2 mb-2"
                                                    style={{
                                                        backgroundColor: pan.color,
                                                        height: '60px'
                                                    }}
                                                ></div>
                                                <p className="fw-semibold small mb-1">{pan.nombre}</p>
                                                <p className="small mb-0" style={{ color: '#1B7F79' }}>
                                                    ${pan.precio}
                                                </p>
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Selección de Carne */}
                            <div className="mb-4">
                                <h3 className="h5 fw-bold mb-3" style={{ color: '#1B7F79' }}>
                                    2. Elegí tu Carne
                                </h3>
                                <div className="row g-3">
                                    {opciones.carnes.map(carne => (
                                        <div key={carne.id} className="col-6 col-md-4">
                                            <button
                                                onClick={() => toggleItem('carne', carne.id)}
                                                className={`w-100 p-3 rounded-3 border-2 transition-all ${
                                                    burger.carne === carne.id
                                                        ? 'border-success bg-light'
                                                        : 'border-secondary bg-white'
                                                }`}
                                                style={{
                                                    borderStyle: 'solid',
                                                    borderColor: burger.carne === carne.id ? '#1B7F79' : '#dee2e6'
                                                }}
                                            >
                                                <div
                                                    className="w-100 rounded-2 mb-2"
                                                    style={{
                                                        backgroundColor: carne.color,
                                                        height: '60px'
                                                    }}
                                                ></div>
                                                <p className="fw-semibold small mb-1">{carne.nombre}</p>
                                                <p className="small mb-0" style={{ color: '#1B7F79' }}>
                                                    ${carne.precio}
                                                </p>
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Selección de Queso */}
                            <div className="mb-4">
                                <h3 className="h5 fw-bold mb-3" style={{ color: '#1B7F79' }}>
                                    3. Agregá Queso (opcional)
                                </h3>
                                <div className="row g-3">
                                    {opciones.quesos.map(queso => (
                                        <div key={queso.id} className="col-6 col-md-3">
                                            <button
                                                onClick={() => toggleItem('queso', queso.id)}
                                                className={`w-100 p-3 rounded-3 border-2 transition-all ${
                                                    burger.queso === queso.id
                                                        ? 'border-success bg-light'
                                                        : 'border-secondary bg-white'
                                                }`}
                                                style={{
                                                    borderStyle: 'solid',
                                                    borderColor: burger.queso === queso.id ? '#1B7F79' : '#dee2e6'
                                                }}
                                            >
                                                <div
                                                    className="w-100 rounded-2 mb-2"
                                                    style={{
                                                        backgroundColor: queso.color,
                                                        height: '60px'
                                                    }}
                                                ></div>
                                                <p className="fw-semibold small mb-1">{queso.nombre}</p>
                                                <p className="small mb-0" style={{ color: '#1B7F79' }}>
                                                    ${queso.precio}
                                                </p>
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Selección de toppings */}
                            <div className="mb-4">
                                <h3 className="h5 fw-bold mb-3" style={{ color: '#1B7F79' }}>
                                    4. Agregá toppings
                                </h3>
                                <div className="row g-3">
                                    {opciones.toppings.map(vegetal => (
                                        <div key={vegetal.id} className="col-6 col-md-4">
                                            <button
                                                onClick={() => toggleItem('toppings', vegetal.id)}
                                                className={`w-100 p-3 rounded-3 border-2 transition-all ${
                                                    burger.toppings.includes(vegetal.id)
                                                        ? 'border-success bg-light'
                                                        : 'border-secondary bg-white'
                                                }`}
                                                style={{
                                                    borderStyle: 'solid',
                                                    borderColor: burger.toppings.includes(vegetal.id) ? '#1B7F79' : '#dee2e6'
                                                }}
                                            >
                                                <div
                                                    className="w-100 rounded-2 mb-2"
                                                    style={{
                                                        backgroundColor: vegetal.color,
                                                        height: '48px'
                                                    }}
                                                ></div>
                                                <p className="fw-semibold small mb-1">{vegetal.nombre}</p>
                                                <p className="small mb-0" style={{ color: '#1B7F79' }}>
                                                    ${vegetal.precio}
                                                </p>
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Selección de Salsas */}
                            <div className="mb-4">
                                <h3 className="h5 fw-bold mb-3" style={{ color: '#1B7F79' }}>
                                    5. Elegí tus Salsas
                                </h3>
                                <div className="row g-3">
                                    {opciones.salsas.map(salsa => (
                                        <div key={salsa.id} className="col-6 col-md-4">
                                            <button
                                                onClick={() => toggleItem('salsas', salsa.id)}
                                                className={`w-100 p-3 rounded-3 border-2 transition-all ${
                                                    burger.salsas.includes(salsa.id)
                                                        ? 'border-success bg-light'
                                                        : 'border-secondary bg-white'
                                                }`}
                                                style={{
                                                    borderStyle: 'solid',
                                                    borderColor: burger.salsas.includes(salsa.id) ? '#1B7F79' : '#dee2e6'
                                                }}
                                            >
                                                <div
                                                    className="w-100 rounded-2 mb-2"
                                                    style={{
                                                        backgroundColor: salsa.color,
                                                        height: '48px'
                                                    }}
                                                ></div>
                                                <p className="fw-semibold small mb-1">{salsa.nombre}</p>
                                                <p className="small mb-0" style={{ color: '#1B7F79' }}>
                                                    ${salsa.precio}
                                                </p>
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Panel de resumen */}
                    <div className="col-lg-4">
                        <div className="bg-white rounded-3 shadow-lg p-4 sticky-top" style={{ top: '100px' }}>
                            <h3 className="h4 fw-bold mb-4" style={{ color: '#1B7F79' }}>
                                Tu Hamburguesa
                            </h3>

                            {/* Visualización de la hamburguesa */}
                            <div className="bg-light rounded-3 p-4 mb-4">
                                <div className="d-flex flex-column gap-2">
                                    {burger.pan && (
                                        <div
                                            className="rounded-top"
                                            style={{
                                                backgroundColor: opciones.panes.find(p => p.id === burger.pan).color,
                                                height: '48px',
                                                borderTopLeftRadius: '50%',
                                                borderTopRightRadius: '50%'
                                            }}
                                        ></div>
                                    )}
                                    {burger.salsas.map(salsa => (
                                        <div
                                            key={salsa}
                                            className="rounded"
                                            style={{
                                                backgroundColor: opciones.salsas.find(s => s.id === salsa).color,
                                                height: '8px'
                                            }}
                                        ></div>
                                    ))}
                                    {burger.toppings.map(vegetal => (
                                        <div
                                            key={vegetal}
                                            className="rounded"
                                            style={{
                                                backgroundColor: opciones.toppings.find(v => v.id === vegetal).color,
                                                height: '16px'
                                            }}
                                        ></div>
                                    ))}
                                    {burger.queso && (
                                        <div
                                            className="rounded"
                                            style={{
                                                backgroundColor: opciones.quesos.find(q => q.id === burger.queso).color,
                                                height: '24px'
                                            }}
                                        ></div>
                                    )}
                                    {burger.carne && (
                                        <div
                                            className="rounded"
                                            style={{
                                                backgroundColor: opciones.carnes.find(c => c.id === burger.carne).color,
                                                height: '64px'
                                            }}
                                        ></div>
                                    )}
                                    {burger.pan && (
                                        <div
                                            className="rounded-bottom"
                                            style={{
                                                backgroundColor: opciones.panes.find(p => p.id === burger.pan).color,
                                                height: '48px',
                                                borderBottomLeftRadius: '50%',
                                                borderBottomRightRadius: '50%'
                                            }}
                                        ></div>
                                    )}
                                </div>
                            </div>

                            {/* Detalles */}
                            <div className="mb-4">
                                {burger.pan && (
                                    <div className="d-flex justify-content-between mb-2 small">
                                        <span>Pan: {opciones.panes.find(p => p.id === burger.pan).nombre}</span>
                                        <span className="fw-semibold">${opciones.panes.find(p => p.id === burger.pan).precio}</span>
                                    </div>
                                )}
                                {burger.carne && (
                                    <div className="d-flex justify-content-between mb-2 small">
                                        <span>{opciones.carnes.find(c => c.id === burger.carne).nombre}</span>
                                        <span className="fw-semibold">${opciones.carnes.find(c => c.id === burger.carne).precio}</span>
                                    </div>
                                )}
                                {burger.queso && (
                                    <div className="d-flex justify-content-between mb-2 small">
                                        <span>{opciones.quesos.find(q => q.id === burger.queso).nombre}</span>
                                        <span className="fw-semibold">${opciones.quesos.find(q => q.id === burger.queso).precio}</span>
                                    </div>
                                )}
                                {burger.toppings.map(v => (
                                    <div key={v} className="d-flex justify-content-between mb-2 small">
                                        <span>{opciones.toppings.find(veg => veg.id === v).nombre}</span>
                                        <span className="fw-semibold">${opciones.toppings.find(veg => veg.id === v).precio}</span>
                                    </div>
                                ))}
                                {burger.salsas.map(s => (
                                    <div key={s} className="d-flex justify-content-between mb-2 small">
                                        <span>{opciones.salsas.find(sal => sal.id === s).nombre}</span>
                                        <span className="fw-semibold">${opciones.salsas.find(sal => sal.id === s).precio}</span>
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
                                className="btn btn-lg w-100 fw-bold shadow"
                                style={{
                                    backgroundColor: '#F2C94C',
                                    color: '#1B7F79',
                                    border: 'none'
                                }}
                            >
                                Agregar al Carrito
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
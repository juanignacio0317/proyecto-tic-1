import React, { useState, useEffect } from 'react';
import { burgerService } from '../services/burgerService';
import { authService } from '../services/authService';
import { useNavigate } from 'react-router-dom';

export default function PersonalizaPage() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [loadingData, setLoadingData] = useState(true);

    if (authService.isAdmin()) {
        alert("Debes iniciar sesión como cliente para crear tu propia hamburguesa");
        navigate("/login");
        return;
    }

    // Estado para la construcción de la hamburguesa
    const [burger, setBurger] = useState({
        pan: null,
        carne: null,
        queso: null,
        toppings: [],
        salsas: []
    });

    const [opciones, setOpciones] = useState({
        panes: [],
        carnes: [],
        quesos: [],
        toppings: [],
        salsas: []
    });
    const coloresPorDefecto = {
        pan: '#D4A574',
        carne: '#8B4513',
        queso: '#FFA500',
        topping: '#90EE90',
        salsa: '#DC143C'
    };


    const asignarColor = (nombre, tipo) => {
        // Manejar valores undefined o null
        if (!nombre) {
            return coloresPorDefecto[tipo] || '#CCCCCC';
        }

        const nombreLower = nombre.toLowerCase();

        // Colores para panes
        if (tipo === 'pan') {
            if (nombreLower.includes('integral')) return '#8B6F47';
            if (nombreLower.includes('sésamo') || nombreLower.includes('sesamo')) return '#C19A6B';
            if (nombreLower.includes('brioche')) return '#E5C29F';
            return '#D4A574';
        }

        // Colores para carnes
        if (tipo === 'carne') {
            if (nombreLower.includes('res') || nombreLower.includes('vaca')) return '#8B4513';
            if (nombreLower.includes('pollo')) return '#D2B48C';
            if (nombreLower.includes('cerdo')) return '#A0522D';
            if (nombreLower.includes('salmón') || nombreLower.includes('salmon')) return '#FA8072';
            if (nombreLower.includes('lentejas') || nombreLower.includes('soja')) return '#8B7355';
            return '#8B4513';
        }

        // Colores para quesos
        if (tipo === 'queso') {
            if (nombreLower.includes('cheddar')) return '#FFA500';
            if (nombreLower.includes('americano')) return '#FFD700';
            if (nombreLower.includes('suizo')) return '#F5DEB3';
            if (nombreLower.includes('azul')) return '#E6E6FA';
            if (nombreLower.includes('mozza') || nombreLower.includes('muzza')) return '#FFF8DC';
            return '#FFA500';
        }

        // Colores para toppings
        if (tipo === 'topping') {
            if (nombreLower.includes('lechuga')) return '#90EE90';
            if (nombreLower.includes('tomate')) return '#FF6347';
            if (nombreLower.includes('cebolla')) return '#F5F5DC';
            if (nombreLower.includes('pepinillo')) return '#8FBC8F';
            if (nombreLower.includes('morrón') || nombreLower.includes('morron') || nombreLower.includes('pimiento')) return '#228B22';
            if (nombreLower.includes('palta') || nombreLower.includes('aguacate')) return '#7CFC00';
            if (nombreLower.includes('champiñon') || nombreLower.includes('champignon')) return '#D2B48C';
            return '#90EE90';
        }

        // Colores para salsas
        if (tipo === 'salsa') {
            if (nombreLower.includes('ketchup')) return '#DC143C';
            if (nombreLower.includes('mostaza')) return '#FFD700';
            if (nombreLower.includes('mayo')) return '#FFFACD';
            if (nombreLower.includes('bbq')) return '#8B4513';
            if (nombreLower.includes('alioli')) return '#F5F5DC';
            if (nombreLower.includes('picante')) return '#FF4500';
            return '#DC143C';
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

            console.log('Iniciando carga de datos...');

            // Cargar todos los datos en paralelo
            const [panes, carnes, toppings, salsas] = await Promise.all([
                burgerService.getAllBreads(),
                burgerService.getAllMeats(),
                burgerService.getAllToppings(),
                burgerService.getAllDressings()
            ]);

            console.log('Datos cargados del backend:', { panes, carnes, toppings, salsas });

            // Separar toppings en quesos y vegetales
            // CAMBIO: Usar 'type' en lugar de 'name'
            const quesos = toppings.filter(t =>
                (t.type && t.type.toLowerCase().includes('queso')) ||
                (t.name && t.name.toLowerCase().includes('queso'))
            );
            const vegetales = toppings.filter(t =>
                !(t.type && t.type.toLowerCase().includes('queso')) &&
                !(t.name && t.name.toLowerCase().includes('queso'))
            );

            console.log('Quesos encontrados:', quesos);
            console.log('Vegetales encontrados:', vegetales);

            // Formatear los datos para el frontend
            // CAMBIO: Usar 'type' como nombre principal
            setOpciones({
                panes: Array.isArray(panes) ? panes
                    .filter(pan => pan.available)
                    .map(pan => ({
                        id: pan.id?.toString() || '',
                        nombre: pan.type || pan.name || 'Sin nombre',
                        precio: parseFloat(pan.price) || 0,
                        color: asignarColor(pan.type || pan.name || '', 'pan')
                    })) : [],
                carnes: Array.isArray(carnes) ? carnes
                    .filter(carne => carne.available)
                    .map(carne => ({
                        id: carne.id?.toString() || '',
                        nombre: carne.type || carne.name || 'Sin nombre',
                        precio: parseFloat(carne.price) || 0,
                        color: asignarColor(carne.type || carne.name || '', 'carne')
                    })) : [],
                quesos: Array.isArray(quesos) ? quesos
                    .filter(queso => queso.available)
                    .map(queso => ({
                        id: queso.id?.toString() || '',
                        nombre: queso.type || queso.name || 'Sin nombre',
                        precio: parseFloat(queso.price) || 0,
                        color: asignarColor(queso.type || queso.name || '', 'queso')
                    })) : [],
                toppings: Array.isArray(vegetales) ? vegetales
                    .filter(topping => topping.available)
                    .map(topping => ({
                        id: topping.id?.toString() || '',
                        nombre: topping.type || topping.name || 'Sin nombre',
                        precio: parseFloat(topping.price) || 0,
                        color: asignarColor(topping.type || topping.name || '', 'topping')
                    })) : [],
                salsas: Array.isArray(salsas) ? salsas
                    .filter(salsa => salsa.available)
                    .map(salsa => ({
                        id: salsa.id?.toString() || '',
                        nombre: salsa.type || salsa.name || 'Sin nombre',
                        precio: parseFloat(salsa.price) || 0,
                        color: asignarColor(salsa.type || salsa.name || '', 'salsa')
                    })) : []
            });

            console.log('Opciones formateadas correctamente');

        } catch (error) {
            console.error('Error al cargar datos:', error);
            alert('Error al cargar los ingredientes. Por favor, recarga la página.');
        } finally {
            setLoadingData(false);
        }
    };

    const calcularPrecio = () => {
        let total = 0;
        if (burger.pan) {
            const pan = opciones.panes.find(p => p.id === burger.pan);
            if (pan) total += pan.precio;
        }
        if (burger.carne) {
            const carne = opciones.carnes.find(c => c.id === burger.carne);
            if (carne) total += carne.precio;
        }
        if (burger.queso) {
            const queso = opciones.quesos.find(q => q.id === burger.queso);
            if (queso) total += queso.precio;
        }
        burger.toppings.forEach(v => {
            const topping = opciones.toppings.find(veg => veg.id === v);
            if (topping) total += topping.precio;
        });
        burger.salsas.forEach(s => {
            const salsa = opciones.salsas.find(sal => sal.id === s);
            if (salsa) total += salsa.precio;
        });
        return total;
    };

    const agregarAlCarrito = async () => {
        if (!burger.pan || !burger.carne) {
            alert('Debes seleccionar al menos un pan y una carne');
            return;
        }

        // Verificar autenticación
        if (!authService.isAuthenticated()) {
            const confirmLogin = window.confirm(
                'Debes iniciar sesión para guardar tu creación. ¿Deseas ir al login?'
            );
            if (confirmLogin) {
                navigate('/login');
            }
            return;
        }

        try {
            setLoading(true);

            // OBTENER EL USER ID CON LOGS DE DEBUG
            const userId = authService.getUserId();
            console.log('===== DEBUG USERID =====');
            console.log('userId obtenido:', userId);
            console.log('tipo de userId:', typeof userId);
            console.log('token:', localStorage.getItem('token'));
            console.log('userId en localStorage:', localStorage.getItem('userId'));
            console.log('========================');

            if (!userId) {
                alert('No se pudo obtener tu ID de usuario. Por favor, inicia sesión nuevamente.');
                navigate('/login');
                return;
            }

            // Convertir IDs a nombres
            const panSeleccionado = opciones.panes.find(p => p.id === burger.pan);
            const carneSeleccionada = opciones.carnes.find(c => c.id === burger.carne);
            const quesoSeleccionado = burger.queso ? opciones.quesos.find(q => q.id === burger.queso) : null;

            console.log('Pan seleccionado:', panSeleccionado);
            console.log('Carne seleccionada:', carneSeleccionada);
            console.log('Queso seleccionado:', quesoSeleccionado);

            // Obtener nombres de toppings (vegetales)
            const toppingNombres = burger.toppings.map(id => {
                const topping = opciones.toppings.find(t => t.id === id);
                return topping ? topping.nombre : null;
            }).filter(nombre => nombre !== null);

            // Obtener nombres de salsas
            const salsaNombres = burger.salsas.map(id => {
                const salsa = opciones.salsas.find(s => s.id === id);
                return salsa ? salsa.nombre : null;
            }).filter(nombre => nombre !== null);

            // Si hay queso seleccionado, agregarlo a los toppings
            if (quesoSeleccionado) {
                toppingNombres.push(quesoSeleccionado.nombre);
            }

            // Preparar datos en el formato que espera el backend
            const burgerData = {
                userId: parseInt(userId),
                bread: panSeleccionado.nombre,
                meat: carneSeleccionada.nombre,
                cheese: quesoSeleccionado ? quesoSeleccionado.nombre : null,
                toppings: toppingNombres,
                dressings: salsaNombres,
                orderDate: new Date().toISOString()
            };

            console.log('===== DATOS A ENVIAR =====');
            console.log('burgerData completo:', JSON.stringify(burgerData, null, 2));
            console.log('==========================');

            // Enviar al backend
            const response = await burgerService.createBurger(burgerData);

            // Limpiar el formulario
            setBurger({
                pan: null,
                carne: null,
                queso: null,
                toppings: [],
                salsas: []
            });

            alert(`¡Hamburguesa guardada exitosamente! 🍔`);

        } catch (error) {
            console.error('Error completo:', error);
            alert('Error al guardar la hamburguesa: ' + error.message);
        } finally {
            setLoading(false);
        }
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
                                Armá tu Hamburguesa
                            </h2>

                            {/* Selección de Pan */}
                            <div className="mb-4">
                                <h3 className="h5 fw-bold mb-3" style={{ color: '#1B7F79' }}>
                                    1. Elegí tu Pan {opciones.panes.length === 0 && <span className="small text-muted">(No hay panes disponibles)</span>}
                                </h3>
                                <div className="row g-3">
                                    {opciones.panes.map(pan => (
                                        <div key={pan.id} className="col-6 col-md-3">
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
                                                disabled={loading}
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
                                    2. Elegí tu Carne {opciones.carnes.length === 0 && <span className="small text-muted">(No hay carnes disponibles)</span>}
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
                                                disabled={loading}
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
                            {opciones.quesos.length > 0 && (
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
                                                    disabled={loading}
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
                            )}

                            {/* Selección de toppings */}
                            {opciones.toppings.length > 0 && (
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
                                                    disabled={loading}
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
                            )}

                            {/* Selección de Salsas */}
                            {opciones.salsas.length > 0 && (
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
                                                    disabled={loading}
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
                            )}
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
                                                backgroundColor: opciones.panes.find(p => p.id === burger.pan)?.color || '#D4A574',
                                                height: '48px',
                                                borderTopLeftRadius: '50%',
                                                borderTopRightRadius: '50%'
                                            }}
                                        ></div>
                                    )}
                                    {burger.salsas.map(salsa => {
                                        const salsaObj = opciones.salsas.find(s => s.id === salsa);
                                        return salsaObj ? (
                                            <div
                                                key={salsa}
                                                className="rounded"
                                                style={{
                                                    backgroundColor: salsaObj.color,
                                                    height: '8px'
                                                }}
                                            ></div>
                                        ) : null;
                                    })}
                                    {burger.toppings.map(vegetal => {
                                        const vegetalObj = opciones.toppings.find(v => v.id === vegetal);
                                        return vegetalObj ? (
                                            <div
                                                key={vegetal}
                                                className="rounded"
                                                style={{
                                                    backgroundColor: vegetalObj.color,
                                                    height: '16px'
                                                }}
                                            ></div>
                                        ) : null;
                                    })}
                                    {burger.queso && (
                                        <div
                                            className="rounded"
                                            style={{
                                                backgroundColor: opciones.quesos.find(q => q.id === burger.queso)?.color || '#FFA500',
                                                height: '24px'
                                            }}
                                        ></div>
                                    )}
                                    {burger.carne && (
                                        <div
                                            className="rounded"
                                            style={{
                                                backgroundColor: opciones.carnes.find(c => c.id === burger.carne)?.color || '#8B4513',
                                                height: '64px'
                                            }}
                                        ></div>
                                    )}
                                    {burger.pan && (
                                        <div
                                            className="rounded-bottom"
                                            style={{
                                                backgroundColor: opciones.panes.find(p => p.id === burger.pan)?.color || '#D4A574',
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
                                {burger.pan && opciones.panes.find(p => p.id === burger.pan) && (
                                    <div className="d-flex justify-content-between mb-2 small">
                                        <span>Pan: {opciones.panes.find(p => p.id === burger.pan).nombre}</span>
                                        <span className="fw-semibold">${opciones.panes.find(p => p.id === burger.pan).precio}</span>
                                    </div>
                                )}
                                {burger.carne && opciones.carnes.find(c => c.id === burger.carne) && (
                                    <div className="d-flex justify-content-between mb-2 small">
                                        <span>{opciones.carnes.find(c => c.id === burger.carne).nombre}</span>
                                        <span className="fw-semibold">${opciones.carnes.find(c => c.id === burger.carne).precio}</span>
                                    </div>
                                )}
                                {burger.queso && opciones.quesos.find(q => q.id === burger.queso) && (
                                    <div className="d-flex justify-content-between mb-2 small">
                                        <span>{opciones.quesos.find(q => q.id === burger.queso).nombre}</span>
                                        <span className="fw-semibold">${opciones.quesos.find(q => q.id === burger.queso).precio}</span>
                                    </div>
                                )}
                                {burger.toppings.map(v => {
                                    const topping = opciones.toppings.find(veg => veg.id === v);
                                    return topping ? (
                                        <div key={v} className="d-flex justify-content-between mb-2 small">
                                            <span>{topping.nombre}</span>
                                            <span className="fw-semibold">${topping.precio}</span>
                                        </div>
                                    ) : null;
                                })}
                                {burger.salsas.map(s => {
                                    const salsa = opciones.salsas.find(sal => sal.id === s);
                                    return salsa ? (
                                        <div key={s} className="d-flex justify-content-between mb-2 small">
                                            <span>{salsa.nombre}</span>
                                            <span className="fw-semibold">${salsa.precio}</span>
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
                                disabled={loading || !burger.pan || !burger.carne}
                                className="btn btn-lg w-100 fw-bold shadow"
                                style={{
                                    backgroundColor: (loading || !burger.pan || !burger.carne) ? '#ccc' : '#F2C94C',
                                    color: '#1B7F79',
                                    border: 'none',
                                    cursor: (loading || !burger.pan || !burger.carne) ? 'not-allowed' : 'pointer'
                                }}
                            >
                                {loading ? (
                                    <>
                                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
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
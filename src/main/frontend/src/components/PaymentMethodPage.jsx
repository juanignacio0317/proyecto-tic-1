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
            navigate("/login");
            return;
        }

        loadPaymentMethods();
    }, [navigate]);

    const loadPaymentMethods = async () => {
        try {
            const userId = authService.getUserId();
            const token = authService.getToken();

            console.log("🔍 UserId:", userId);
            console.log("🔍 Token existe:", !!token);

            if (!token) {
                console.error("❌ No hay token disponible");
                Swal.fire({
                    icon: "warning",
                    title: "Sesión expirada",
                    text: "Por favor, inicia sesión nuevamente.",
                    confirmButtonColor: "#1B7F79"
                }).then(() => {
                    authService.logout();
                    navigate("/login");
                });
                return;
            }

            if (!userId) {
                console.error("❌ No se pudo obtener userId");
                Swal.fire({
                    icon: "error",
                    title: "Error de sesión",
                    text: "No se pudo obtener la información del usuario.",
                    confirmButtonColor: "#1B7F79"
                }).then(() => {
                    authService.logout();
                    navigate("/login");
                });
                return;
            }

            const response = await axios.get(
                `http://localhost:8080/api/payment-methods/${userId}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json"
                    }
                }
            );

            console.log("✅ Payment methods cargados:", response.data);
            setPaymentMethods(response.data);
        } catch (error) {
            console.error("❌ Error al cargar métodos de pago:", error);

            if (error.response?.status === 403) {
                Swal.fire({
                    icon: "error",
                    title: "Acceso denegado",
                    text: "No tienes permisos para acceder. Inicia sesión nuevamente.",
                    confirmButtonColor: "#1B7F79"
                }).then(() => {
                    authService.logout();
                    navigate("/login");
                });
            } else if (error.response?.status === 401) {
                Swal.fire({
                    icon: "warning",
                    title: "Sesión expirada",
                    text: "Por favor, inicia sesión nuevamente.",
                    confirmButtonColor: "#1B7F79"
                }).then(() => {
                    authService.logout();
                    navigate("/login");
                });
            } else {
                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: "Error al cargar los métodos de pago.",
                    confirmButtonColor: "#1B7F79"
                });
            }
        } finally {
            setLoading(false);
        }
    };

    const formatCardNumber = (value) => {
        const digits = value.replace(/\D/g, "").slice(0, 16);
        return digits.replace(/(.{4})/g, "$1 ").trim();
    };

    const getCardNumberDigits = (value) => value.replace(/\s/g, "");

    // 🔍 Detectar marca automáticamente según los dígitos
    const detectCardBrand = (digits) => {
        if (!digits) return "";

        if (/^4/.test(digits)) {
            return "Visa";
        }
        if (/^5[1-5]/.test(digits)) {
            return "Mastercard";
        }
        if (/^3[47]/.test(digits)) {
            return "American Express";
        }
        if (/^(6011|65|64[4-9])/.test(digits)) {
            return "Discover";
        }
        return "";
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;

        if (name === "cardNumber") {
            const digits = value.replace(/\D/g, "").slice(0, 16);
            const formatted = formatCardNumber(value);
            const brand = detectCardBrand(digits);

            setFormData((prev) => ({
                ...prev,
                cardNumber: formatted,
                cardBrand: brand
            }));
        } else if (name === "expirationDate") {
            let formattedValue = value.replace(/\D/g, "");
            if (formattedValue.length >= 2) {
                formattedValue =
                    formattedValue.slice(0, 2) + "/" + formattedValue.slice(2, 4);
            }
            formattedValue = formattedValue.slice(0, 5);
            setFormData({ ...formData, [name]: formattedValue });
        } else if (name === "cvv") {
            const numericValue = value.replace(/\D/g, "").slice(0, 3);
            setFormData({ ...formData, [name]: numericValue });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const cleanCardNumber = getCardNumberDigits(formData.cardNumber);

        if (cleanCardNumber.length !== 16) {
            Swal.fire({
                icon: "warning",
                title: "Número de tarjeta inválido",
                text: "El número de tarjeta debe tener exactamente 16 dígitos.",
                confirmButtonColor: "#1B7F79"
            });
            return;
        }

        if (formData.cvv.length !== 3) {
            Swal.fire({
                icon: "warning",
                title: "CVV inválido",
                text: "El CVV debe tener exactamente 3 dígitos.",
                confirmButtonColor: "#1B7F79"
            });
            return;
        }

        // 🧠 Detectar marca al enviar (por si acaso)
        const detectedBrand = detectCardBrand(cleanCardNumber);
        if (!detectedBrand) {
            Swal.fire({
                icon: "warning",
                title: "No pudimos detectar la marca",
                text: "Verifica el número de la tarjeta. Solo se aceptan Visa, Mastercard, American Express o Discover.",
                confirmButtonColor: "#1B7F79"
            });
            return;
        }

        // 🚫 Evitar tarjetas repetidas
        const alreadyExists = paymentMethods.some((pm) => {
            const existingClean = getCardNumberDigits(pm.cardNumber || "");
            return existingClean === cleanCardNumber;
        });

        if (alreadyExists) {
            Swal.fire({
                icon: "warning",
                title: "Tarjeta ya registrada",
                text: "Ya tienes registrada una tarjeta con este número.",
                confirmButtonColor: "#1B7F79"
            });
            return;
        }

        try {
            const userId = authService.getUserId();
            const token = authService.getToken();

            if (!token || !userId) {
                Swal.fire({
                    icon: "error",
                    title: "Error de autenticación",
                    text: "Por favor, inicia sesión nuevamente.",
                    confirmButtonColor: "#1B7F79"
                }).then(() => {
                    authService.logout();
                    navigate("/login");
                });
                return;
            }

            const payload = {
                ...formData,
                cardNumber: cleanCardNumber,
                cardBrand: detectedBrand // 👈 siempre mandamos la detectada
            };

            await axios.post(
                `http://localhost:8080/api/payment-methods/${userId}`,
                payload,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json"
                    }
                }
            );

            Swal.fire({
                icon: "success",
                title: "Tarjeta agregada",
                text: "El método de pago fue agregado exitosamente.",
                confirmButtonColor: "#1B7F79"
            });

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
                Swal.fire({
                    icon: "warning",
                    title: "Sesión expirada",
                    text: "Por favor, inicia sesión nuevamente.",
                    confirmButtonColor: "#1B7F79"
                }).then(() => {
                    authService.logout();
                    navigate("/login");
                });
            } else {
                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: "Error al agregar el método de pago.",
                    confirmButtonColor: "#1B7F79"
                });
            }
        }
    };

    const handleDelete = async (paymentMethodId) => {
        Swal.fire({
            icon: "warning",
            title: "¿Eliminar tarjeta?",
            text: "¿Estás seguro de eliminar esta tarjeta?",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Sí, eliminar",
            cancelButtonText: "Cancelar"
        }).then(async (result) => {
            if (!result.isConfirmed) return;

            try {
                const userId = authService.getUserId();
                const token = authService.getToken();

                if (!token || !userId) {
                    Swal.fire({
                        icon: "error",
                        title: "Error de autenticación",
                        text: "Por favor, inicia sesión nuevamente.",
                        confirmButtonColor: "#1B7F79"
                    }).then(() => {
                        authService.logout();
                        navigate("/login");
                    });
                    return;
                }

                await axios.delete(
                    `http://localhost:8080/api/payment-methods/${userId}/${paymentMethodId}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            "Content-Type": "application/json"
                        }
                    }
                );

                Swal.fire({
                    toast: true,
                    position: "top-end",
                    icon: "success",
                    title: "Método de pago eliminado",
                    showConfirmButton: false,
                    timer: 1500,
                    timerProgressBar: true
                });

                loadPaymentMethods();
            } catch (error) {
                console.error("Error al eliminar método de pago:", error);

                if (error.response?.status === 403 || error.response?.status === 401) {
                    Swal.fire({
                        icon: "warning",
                        title: "Sesión expirada",
                        text: "Por favor, inicia sesión nuevamente.",
                        confirmButtonColor: "#1B7F79"
                    }).then(() => {
                        authService.logout();
                        navigate("/login");
                    });
                } else {
                    Swal.fire({
                        icon: "error",
                        title: "Error",
                        text: "Error al eliminar el método de pago.",
                        confirmButtonColor: "#1B7F79"
                    });
                }
            }
        });
    };

    const getCardLogoUrl = (brand) => {
        switch (brand) {
            case "Visa":
                return "https://upload.wikimedia.org/wikipedia/commons/4/41/Visa_Logo.png";
            case "Mastercard":
                return "https://upload.wikimedia.org/wikipedia/commons/0/04/Mastercard-logo.png";
            case "American Express":
                return "https://upload.wikimedia.org/wikipedia/commons/3/30/American_Express_logo_%282018%29.svg";
            case "Discover":
                return "https://upload.wikimedia.org/wikipedia/commons/5/50/Discover_Card_logo.svg";
            default:
                return "https://upload.wikimedia.org/wikipedia/commons/5/5e/Credit-card-512.png";
        }
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
                        className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-3 px-6 rounded-lg transition-all transform hover:scale-105 flex items-center gap-2"
                    >
                        <span className="material-icons">add</span>
                        {showAddForm ? "Cancelar" : "Agregar Tarjeta"}
                    </button>
                </div>

                {showAddForm && (
                    <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">
                            Nueva Tarjeta
                        </h2>
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
                                    maxLength={19}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent font-mono tracking-widest"
                                    placeholder="1234 5678 9012 3456"
                                />
                                <p className="text-xs text-gray-500 mt-1">
                                    Detectamos la marca automáticamente a partir del número.
                                </p>
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
                                        maxLength={5}
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
                                        maxLength={3}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                                        placeholder="123"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Marca detectada
                                </label>
                                <input
                                    type="text"
                                    value={formData.cardBrand || "—"}
                                    readOnly
                                    className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-gray-50 text-gray-700"
                                />
                            </div>

                            <button
                                type="submit"
                                className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold py-3 rounded-lg transition-all transform hover:scale-105"
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
                                className="bg-gradient-to-br from-teal-600 to-teal-800 rounded-xl p-6 text-white shadow-lg transform transition duration-300 hover:scale-105 hover:-translate-y-1 hover:shadow-2xl"
                            >
                                <div className="flex justify-between items-start mb-4">
                                    <div className="w-14 h-9 bg-white rounded-md flex items-center justify-center overflow-hidden">
                                        <img
                                            src={getCardLogoUrl(method.cardBrand)}
                                            alt={method.cardBrand}
                                            className="w-full h-full object-contain"
                                        />
                                    </div>
                                    <button
                                        onClick={() => handleDelete(method.idPM)}
                                        className="text-white hover:text-red-200 transition-transform duration-150 hover:scale-110"
                                        title="Eliminar tarjeta"
                                    >
                                        <span className="material-icons">delete</span>
                                    </button>
                                </div>

                                <div className="mb-4">
                                    <p className="text-sm opacity-80 mb-1">
                                        Número de tarjeta
                                    </p>
                                    <p className="text-xl font-mono tracking-wider">
                                        {method.cardNumber}
                                    </p>
                                </div>

                                <div className="flex justify-between items-end">
                                    <div>
                                        <p className="text-xs opacity-80 mb-1">Titular</p>
                                        <p className="font-semibold text-sm">
                                            {method.cardHolderName}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xs opacity-80 mb-1">Vence</p>
                                        <p className="font-semibold text-sm">
                                            {method.expirationDate}
                                        </p>
                                    </div>
                                </div>

                                <div className="mt-3 pt-3 border-t border-teal-500">
                                    <p className="text-sm font-semibold">
                                        {method.cardBrand}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

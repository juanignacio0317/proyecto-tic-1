import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authService } from "../services/authService";

export default function Register() {
    const navigate = useNavigate();

    // Datos de cuenta
    const [nombre, setNombre] = useState("");
    const [apellido, setApellido] = useState("");
    const [telefono, setTelefono] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmar, setConfirmar] = useState("");
    const [direccion, setDireccion] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    // Modal metodo de pago
    const [showPMModal, setShowPMModal] = useState(false);
    const [pmError, setPmError] = useState("");

    // Estado del metodo de pago
    const [pmHolder, setPmHolder] = useState("");
    const [pmNumber, setPmNumber] = useState("");
    const [pmExpiry, setPmExpiry] = useState("");
    const [pmCvv, setPmCvv] = useState("");
    const [pmSaved, setPmSaved] = useState(false);
    const [pmSummary, setPmSummary] = useState("");
    const [pmBrand, setPmBrand] = useState("");

    // Utils
    const onlyDigits = (s) => s.replace(/\D/g, "");

    const detectBrand = (num) => {
        const n = onlyDigits(num);
        if (/^4\d{12,18}$/.test(n)) return "Visa";
        const p2 = parseInt(n.slice(0, 2) || "0", 10);
        const p4 = parseInt(n.slice(0, 4) || "0", 10);
        if ((p2 >= 51 && p2 <= 55) || (p4 >= 2221 && p4 <= 2720)) return "Mastercard";
        return "Unsupported";
    };

    const isValidExpiry = (mmYY) => {
        if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(mmYY)) return false;
        const [mm, yy] = mmYY.split("/").map((v) => parseInt(v, 10));
        const now = new Date();
        const curYY = now.getFullYear() % 100;
        const curMM = now.getMonth() + 1;
        return yy > curYY || (yy === curYY && mm >= curMM);
    };

    const isValidCard = (num) => {
        const n = onlyDigits(num);
        if (n.length < 13 || n.length > 19) return false;
        let sum = 0, alt = false;
        for (let i = n.length - 1; i >= 0; i--) {
            let d = parseInt(n[i], 10);
            if (alt) {
                d *= 2;
                if (d > 9) d -= 9;
            }
            sum += d;
            alt = !alt;
        }
        return sum % 10 === 0;
    };

    const isValidCvv = (cvv) => /^\d{3}$/.test(cvv);
    const maskCard = (num) => `•••• ${onlyDigits(num).slice(-4)}`;

    useEffect(() => {
        document.body.style.overflow = showPMModal ? "hidden" : "";
        return () => (document.body.style.overflow = "");
    }, [showPMModal]);

    const openPMModal = () => {
        setPmError("");
        setShowPMModal(true);
    };
    const closePMModal = () => setShowPMModal(false);

    const handleCardNumberChange = (e) => {
        const digits = onlyDigits(e.target.value).slice(0, 19);
        const pretty = digits.replace(/(\d{4})(?=\d)/g, "$1 ");
        setPmNumber(pretty);
    };

    const handleExpiryChange = (e) => {
        let v = e.target.value;
        v = v.replace(/\D/g, "").slice(0, 4);
        if (v.length >= 3) v = v.slice(0, 2) + "/" + v.slice(2);
        setPmExpiry(v);
    };

    const handleCvvChange = (e) => {
        setPmCvv(onlyDigits(e.target.value).slice(0, 3));
    };

    const handleTelefonoChange = (e) => {
        setTelefono(onlyDigits(e.target.value).slice(0, 15));
    };

    const savePaymentMethod = () => {
        const brand = detectBrand(pmNumber);

        if (!pmHolder.trim() || !pmNumber.trim() || !pmExpiry.trim() || !pmCvv.trim()) {
            setPmError("Completá todos los campos del método de pago.");
            return;
        }
        if (brand === "Unsupported") {
            setPmError("Solo se aceptan tarjetas Visa o Mastercard.");
            return;
        }
        if (!isValidCard(pmNumber)) {
            setPmError("Número de tarjeta inválido.");
            return;
        }
        if (!isValidExpiry(pmExpiry)) {
            setPmError("Fecha de vencimiento inválida (formato MM/YY y no vencida).");
            return;
        }
        if (!isValidCvv(pmCvv)) {
            setPmError("CVV inválido (debe tener 3 dígitos).");
            return;
        }

        setPmSaved(true);
        setPmBrand(brand);
        setPmSummary(`${brand} ${maskCard(pmNumber)}`);
        setShowPMModal(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (!nombre || !apellido || !telefono || !email || !password || !confirmar) {
            setError("Completá todos los campos.");
            return;
        }
        if (onlyDigits(telefono).length < 8) {
            setError("Ingresá un teléfono válido (al menos 8 dígitos).");
            return;
        }
        if (password !== confirmar) {
            setError("Las contraseñas no coinciden.");
            return;
        }
        if (password.length<8){
            setError("La contraseña no es válida (al menos 8 caracteres).");
            return;
        }
        if (!pmSaved) {
            setError("Agregá un método de pago para continuar.");
            return;
        }
        if (!direccion.trim()) {
            setError("Completá tu dirección.");
            return;
        }

        setLoading(true);

        try {
            const userData = {
                name: nombre,
                surname: apellido,
                phone: telefono,
                address: direccion,
                email: email,
                password: password,
                paymentMethod: {
                    cardHolderName: pmHolder,
                    cardNumber: onlyDigits(pmNumber),
                    cardBrand: pmBrand,
                    expirationDate: pmExpiry,
                    cvv: pmCvv
                }
            };

            await authService.register(userData);

            Swal.fire({
                icon: "success",
                title: "¡Cuenta creada con éxito!",
                text: "Tu cuenta fue creada con éxito, seras redirigido al inicio.",
                timer:1000,
                showConfirmButton: false,

            }).then(() => {
                window.location.href = "/";
            });
        } catch (err) {
            setError(err.message || "Error al crear la cuenta");
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#1D7B74] to-[#1B7F79] px-3 relative">
            <button
                onClick={() => navigate("/")}
                className="absolute top-6 right-6 flex items-center gap-2 text-[#FDF8E7] border border-[#FDF8E7]/60 rounded-full px-4 py-2 backdrop-blur-sm bg-white/10 hover:bg-white/20 transition-all duration-300 shadow-sm"
            >
                <span className="hidden sm:inline font-medium">Volver al inicio</span>
                <i className="bi bi-arrow-right-circle"></i>
            </button>

            <div className="bg-[#FDF8E7] rounded-3xl shadow-lg w-full max-w-md p-6 sm:p-8">
                <div className="text-center mb-6">
                    <h1 className="font-brand text-3xl font-bold text-[#1B7F79]">Crear cuenta</h1>
                    <p className="text-[#1B7F79]/80 mt-2 text-sm">Registrate para personalizar tus pedidos</p>
                </div>

                {error && (
                    <div className="alert alert-danger py-2 mb-4 text-center" role="alert">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="row">
                        <div className="col-12 col-sm-6 mb-3">
                            <label className="form-label fw-semibold text-[#1B7F79]">Nombre</label>
                            <input
                                type="text"
                                className="form-control rounded-3"
                                placeholder="Tu nombre"
                                value={nombre}
                                onChange={(e) => setNombre(e.target.value)}
                            />
                        </div>
                        <div className="col-12 col-sm-6 mb-3">
                            <label className="form-label fw-semibold text-[#1B7F79]">Apellido</label>
                            <input
                                type="text"
                                className="form-control rounded-3"
                                placeholder="Tu apellido"
                                value={apellido}
                                onChange={(e) => setApellido(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="mb-3">
                        <label className="form-label fw-semibold text-[#1B7F79]">Teléfono</label>
                        <input
                            type="tel"
                            inputMode="numeric"
                            className="form-control rounded-3"
                            placeholder="099 999 999"
                            value={telefono}
                            onChange={handleTelefonoChange}
                        />
                    </div>

                    <div className="mb-3">
                        <label className="form-label fw-semibold text-[#1B7F79]">Dirección</label>
                        <input
                            type="text"
                            className="form-control rounded-3"
                            placeholder="Calle y número"
                            value={direccion}
                            onChange={(e) => setDireccion(e.target.value)}
                        />
                    </div>

                    <div className="mb-3">
                        <label className="form-label fw-semibold text-[#1B7F79]">Correo electrónico</label>
                        <input
                            type="email"
                            className="form-control rounded-3"
                            placeholder="tu@correo.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    <div className="mb-3">
                        <label className="form-label fw-semibold text-[#1B7F79]">Contraseña</label>
                        <input
                            type="password"
                            className="form-control rounded-3"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    <div className="mb-4">
                        <label className="form-label fw-semibold text-[#1B7F79]">Confirmar contraseña</label>
                        <input
                            type="password"
                            className="form-control rounded-3"
                            placeholder="••••••••"
                            value={confirmar}
                            onChange={(e) => setConfirmar(e.target.value)}
                        />
                    </div>

                    <div className="mb-4">
                        <div className="d-flex align-items-center justify-content-between">
                            <label className="form-label fw-semibold text-[#1B7F79] m-0">
                                Método de pago <span className="text-danger">*</span>
                            </label>
                            <button
                                type="button"
                                onClick={openPMModal}
                                className="btn btn-sm rounded-pill px-3 py-1 fw-semibold text-[#FDF8E7]"
                                style={{ backgroundColor: "#1D7B74" }}
                            >
                                {pmSaved ? "Editar" : "Agregar"}
                            </button>
                        </div>

                        {pmSaved ? (
                            <div className="mt-2 rounded-3 px-3 py-2 bg-white border border-[#1B7F79]/20 d-flex align-items-center gap-2">
                                <i className="bi bi-credit-card-2-front"></i>
                                <span className="text-sm text-[#1B7F79]">{pmSummary}</span>
                            </div>
                        ) : (
                            <div className="mt-2 rounded-3 px-3 py-2 bg-white border border-amber-400/40">
                                <span className="text-sm text-amber-600">Aún no agregaste un método de pago.</span>
                            </div>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="btn w-100 rounded-3 py-2 fw-semibold text-[#FDF8E7] bg-[#1D7B74] hover:bg-[#1B7F79] transition-colors duration-200"
                    >
                        {loading ? "Creando cuenta..." : "Crear cuenta"}
                    </button>
                </form>

                <div className="text-center mt-4">
                    <span className="text-sm text-[#1B7F79]/80">¿Ya tenés cuenta? </span>
                    <Link to="/login" className="text-[#1B7F79] text-sm fw-medium text-decoration-none">
                        Iniciar sesión
                    </Link>
                </div>
            </div>

            {showPMModal && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center" aria-modal="true" role="dialog">
                    <div className="absolute inset-0 bg-black/50" onClick={closePMModal} />
                    <div className="relative z-[61] w-[92%] max-w-md rounded-2xl bg-white shadow-xl p-6">
                        <div className="d-flex align-items-center justify-content-between mb-1">
                            <h2 className="text-xl font-semibold text-[#1B7F79] m-0">Método de pago</h2>
                            <button
                                type="button"
                                onClick={closePMModal}
                                className="text-[#1B7F79]/70 hover:text-[#1B7F79]"
                                aria-label="Cerrar"
                            >
                                <i className="bi bi-x-lg"></i>
                            </button>
                        </div>
                        <p className="text-sm text-[#1B7F79]/70 mb-3">Guardá una tarjeta Visa o Mastercard.</p>

                        {pmError && (
                            <div className="alert alert-danger py-2 mb-3" role="alert">
                                {pmError}
                            </div>
                        )}

                        <div className="mb-3">
                            <label className="form-label fw-semibold text-[#1B7F79]">Nombre en la tarjeta</label>
                            <input
                                type="text"
                                className="form-control rounded-3"
                                placeholder="Como figura en la tarjeta"
                                value={pmHolder}
                                onChange={(e) => setPmHolder(e.target.value)}
                            />
                        </div>

                        <div className="mb-3">
                            <label className="form-label fw-semibold text-[#1B7F79]">Número de tarjeta</label>
                            <input
                                inputMode="numeric"
                                className="form-control rounded-3"
                                placeholder="1234 5678 9012 3456"
                                value={pmNumber}
                                onChange={handleCardNumberChange}
                            />
                        </div>

                        <div className="row g-2 mb-4">
                            <div className="col-6">
                                <label className="form-label fw-semibold text-[#1B7F79]">
                                    Vencimiento <span className="text-xs">(MM/YY)</span>
                                </label>
                                <input
                                    inputMode="numeric"
                                    className="form-control rounded-3"
                                    placeholder="MM/YY"
                                    value={pmExpiry}
                                    onChange={handleExpiryChange}
                                    maxLength={5}
                                />
                            </div>
                            <div className="col-6">
                                <label className="form-label fw-semibold text-[#1B7F79]">CVV</label>
                                <input
                                    inputMode="numeric"
                                    className="form-control rounded-3"
                                    placeholder="***"
                                    value={pmCvv}
                                    onChange={handleCvvChange}
                                    maxLength={3}
                                />
                            </div>
                        </div>

                        <div className="d-flex gap-2 justify-content-end">
                            <button
                                type="button"
                                onClick={closePMModal}
                                className="btn rounded-3 px-3"
                                style={{ backgroundColor: "#E7F6F4", color: "#1B7F79" }}
                            >
                                Cancelar
                            </button>
                            <button
                                type="button"
                                onClick={savePaymentMethod}
                                className="btn rounded-3 px-3 text-[#FDF8E7]"
                                style={{ backgroundColor: "#1D7B74" }}
                            >
                                Guardar método
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </main>
    );
}
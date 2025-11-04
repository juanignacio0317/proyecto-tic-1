import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authService } from "../services/authService"; // Ajusta la ruta según tu estructura

export default function Register() {
    const navigate = useNavigate();
    const [nombre, setNombre] = useState("");
    const [apellido, setApellido] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmar, setConfirmar] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        // Validaciones
        if (!nombre || !apellido || !email || !password || !confirmar) {
            setError("Completá todos los campos.");
            return;
        }

        if (password !== confirmar) {
            setError("Las contraseñas no coinciden.");
            return;
        }

        if (password.length < 6) {
            setError("La contraseña debe tener al menos 6 caracteres.");
            return;
        }

        try {
            setLoading(true);

            // Llamada al backend
            await authService.register(nombre, apellido, email, password);


            alert(`¡Bienvenido/a ${nombre}! Tu cuenta fue creada correctamente.`);


            navigate("/");

        } catch (err) {
            setError(err.message || "Error al crear la cuenta. Intenta de nuevo.");
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
                    <h1 className="font-brand text-3xl font-bold text-[#1B7F79]">
                        Crear cuenta
                    </h1>
                    <p className="text-[#1B7F79]/80 mt-2 text-sm">
                        Registrate para personalizar tus pedidos
                    </p>
                </div>

                {/* Error */}
                {error && (
                    <div className="alert alert-danger py-2 mb-4 text-center" role="alert">
                        {error}
                    </div>
                )}

                {/* Formulario */}
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label className="form-label fw-semibold text-[#1B7F79]">
                            Nombre
                        </label>
                        <input
                            type="text"
                            className="form-control rounded-3"
                            placeholder="Tu nombre"
                            value={nombre}
                            onChange={(e) => setNombre(e.target.value)}
                            disabled={loading}
                        />
                    </div>

                    <div className="mb-3">
                        <label className="form-label fw-semibold text-[#1B7F79]">
                            Apellido
                        </label>
                        <input
                            type="text"
                            className="form-control rounded-3"
                            placeholder="Tu apellido"
                            value={apellido}
                            onChange={(e) => setApellido(e.target.value)}
                            disabled={loading}
                        />
                    </div>

                    <div className="mb-3">
                        <label className="form-label fw-semibold text-[#1B7F79]">
                            Correo electrónico
                        </label>
                        <input
                            type="email"
                            className="form-control rounded-3"
                            placeholder="tu@correo.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            disabled={loading}
                        />
                    </div>

                    <div className="mb-3">
                        <label className="form-label fw-semibold text-[#1B7F79]">
                            Contraseña
                        </label>
                        <input
                            type="password"
                            className="form-control rounded-3"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            disabled={loading}
                        />
                    </div>

                    <div className="mb-3">
                        <label className="form-label fw-semibold text-[#1B7F79]">
                            Confirmar contraseña
                        </label>
                        <input
                            type="password"
                            className="form-control rounded-3"
                            placeholder="••••••••"
                            value={confirmar}
                            onChange={(e) => setConfirmar(e.target.value)}
                            disabled={loading}
                        />
                    </div>

                    <button
                        type="submit"
                        className="btn w-100 rounded-3 py-2 fw-semibold text-[#FDF8E7] bg-[#1D7B74] hover:bg-[#1B7F79] transition-colors duration-200"
                        disabled={loading}
                    >
                        {loading ? (
                            <>
                                <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                                Creando cuenta...
                            </>
                        ) : (
                            "Crear cuenta"
                        )}
                    </button>
                </form>

                <div className="text-center mt-4">
                    <span className="text-sm text-[#1B7F79]/80">¿Ya tenés cuenta? </span>
                    <Link
                        to="/login"
                        className="text-[#1B7F79] text-sm fw-medium text-decoration-none"
                    >
                        Iniciar sesión
                    </Link>
                </div>
            </div>
        </main>
    );
}
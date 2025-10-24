import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function LoginPage() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!email){
            setError("Ingrese un email válido.");
            return;
        }else if (!password)
            setError("Ingrese una contraseña válida.");
        return;
        setError("");

    };

    return (
        <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#1D7B74] to-[#1B7F79] px-3">
            <button
                onClick={() => navigate("/")}
                className="absolute top-6 right-6 flex items-center gap-2 text-[#FDF8E7] border border-[#FDF8E7]/60 rounded-full px-4 py-2 backdrop-blur-sm bg-white/10 hover:bg-white/20 transition-all duration-300 shadow-sm"
            >

                <span className="hidden sm:inline font-medium">Volver al inicio</span>
                <i className="bi bi-arrow-right-circle"></i>
            </button>
            <div className="bg-[#FDF8E7] rounded-2xl shadow-lg w-full max-w-md p-6 sm:p-8">
                {/* Brand */}
                <div className="text-center mb-6">
                    <h1 className="font-brand text-3xl font-bold text-[#1B7F79]">
                        Pizz<span className="opacity-90">UM</span> & Burg<span className="opacity-90">UM</span>
                    </h1>
                    <p className="text-[#1B7F79]/80 mt-2 text-sm">
                        Entrá para armar tu pizza o burger a medida
                    </p>
                </div>

                {/* Error */}
                {error && (
                    <div className="alert alert-danger py-2 mb-4 text-center" role="alert">
                        {error}
                    </div>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label htmlFor="email" className="form-label fw-semibold text-[#1B7F79]">
                            Correo electrónico
                        </label>
                        <input
                            id="email"
                            type="email"
                            className="form-control rounded-3 focus:ring-2 focus:ring-[#1B7F79]"
                            placeholder="tu@correo.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    <div className="mb-3">
                        <label htmlFor="password" className="form-label fw-semibold text-[#1B7F79]">
                            Contraseña
                        </label>
                        <input
                            id="password"
                            type="password"
                            className="form-control rounded-3 focus:ring-2 focus:ring-[#1B7F79]"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    <button
                        type="submit"
                        className="btn w-100 rounded-3 py-2 fw-semibold text-[#FDF8E7] bg-[#1D7B74] hover:bg-[#1B7F79] transition-colors duration-200"
                    >
                        Iniciar sesión
                    </button>
                </form>

                {/* Links */}
                <div className="text-center mt-4">
                    <a
                        href="/register"
                        className="text-[#1B7F79] text-sm text-decoration-none hover:opacity-80 fw-medium"
                    >
                        ¿No tenés cuenta? Registrate
                    </a>
                </div>
            </div>
        </main>
    );
}
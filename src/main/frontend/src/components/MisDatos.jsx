import React, { useState, useEffect } from "react";
import { PersonCircle, Lock, Envelope, Phone, ShieldCheck } from "react-bootstrap-icons";
import NavbarComponent from "./Navbar";

const MisDatos = () => {
    const [userData, setUserData] = useState(null);
    const [showPasswordForm, setShowPasswordForm] = useState(false);
    const [passwordData, setPasswordData] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchUserData();
    }, []);

    const fetchUserData = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await fetch("http://localhost:8080/api/users/profile", {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                setUserData(data);
            } else {
                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: "No se pudieron cargar tus datos.",
                    confirmButtonColor: "#1B7F79"
                });
            }
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "Ocurrió un error al cargar tus datos.",
                confirmButtonColor: "#1B7F79"
            });
        }
    };

    const handlePasswordChange = (e) => {
        setPasswordData({
            ...passwordData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmitPassword = async (e) => {
        e.preventDefault();
        setLoading(true);

        if (passwordData.newPassword.length < 6) {
            Swal.fire({
                icon: "warning",
                title: "Contraseña muy corta",
                text: "La nueva contraseña debe tener al menos 6 caracteres.",
                confirmButtonColor: "#1B7F79"
            });
            setLoading(false);
            return;
        }

        if (passwordData.newPassword !== passwordData.confirmPassword) {
            Swal.fire({
                icon: "warning",
                title: "Las contraseñas no coinciden",
                text: "Verifica que la nueva contraseña y la confirmación sean iguales.",
                confirmButtonColor: "#1B7F79"
            });
            setLoading(false);
            return;
        }

        try {
            const token = localStorage.getItem("token");
            const response = await fetch(
                "http://localhost:8080/api/users/change-password",
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    },
                    body: JSON.stringify(passwordData)
                }
            );

            const data = await response.json();

            if (response.ok) {
                Swal.fire({
                    icon: "success",
                    title: "Contraseña actualizada",
                    text: "Tu contraseña se cambió correctamente.",
                    confirmButtonColor: "#1B7F79"
                });
                setPasswordData({
                    currentPassword: "",
                    newPassword: "",
                    confirmPassword: ""
                });
                setShowPasswordForm(false);
            } else {
                Swal.fire({
                    icon: "error",
                    title: "No se pudo actualizar",
                    text: data.error || "Revisa los datos e intenta nuevamente.",
                    confirmButtonColor: "#1B7F79"
                });
            }
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "Ocurrió un error al cambiar la contraseña.",
                confirmButtonColor: "#1B7F79"
            });
        } finally {
            setLoading(false);
        }
    };

    if (!userData) {
        return (
            <>
                <NavbarComponent />
                <div
                    style={{
                        minHeight: "100vh",
                        backgroundColor: "#1D7B74",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center"
                    }}
                >
                    <div
                        className="spinner-border text-warning"
                        role="status"
                        style={{ width: "3rem", height: "3rem" }}
                    >
                        <span className="visually-hidden">Cargando...</span>
                    </div>
                </div>
            </>
        );
    }

    const isAdmin = userData.role === "ADMIN";

    return (
        <>
            <NavbarComponent />
            <div
                style={{
                    minHeight: "100vh",
                    backgroundColor: "#1D7B74",
                    paddingTop: "40px",
                    paddingBottom: "60px"
                }}
            >
                <div className="container" style={{ maxWidth: "960px" }}>
                    {/* CARD PRINCIPAL */}
                    <div className="bg-white rounded-4 shadow-sm p-4 p-md-5">
                        {/* Header usuario */}
                        <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-4 mb-4">
                            <div className="d-flex align-items-center gap-3">
                                <div
                                    style={{
                                        width: "82px",
                                        height: "82px",
                                        borderRadius: "50%",
                                        background:
                                            "radial-gradient(circle at 30% 30%, #FDF8E7, #F2C94C)",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center"
                                    }}
                                >
                                    <PersonCircle size={56} style={{ color: "#1D7B74" }} />
                                </div>
                                <div>
                                    <h2
                                        className="mb-1"
                                        style={{ fontWeight: 600, fontSize: "1.6rem", color: "#134A46" }}
                                    >
                                        {userData.name} {userData.surname}
                                    </h2>
                                    <div
                                        style={{
                                            fontSize: "0.95rem",
                                            color: "#6b7280",
                                            wordBreak: "break-all"
                                        }}
                                    >
                                        {userData.email}
                                    </div>
                                </div>
                            </div>

                            {isAdmin && (
                                <span
                                    className="d-inline-flex align-items-center gap-2 px-3 py-2 rounded-pill"
                                    style={{
                                        backgroundColor: "#E0F2F1",
                                        color: "#0f766e",
                                        fontSize: "0.85rem",
                                        fontWeight: 600
                                    }}
                                >
                  <ShieldCheck size={18} />
                  Administrador
                </span>
                            )}
                        </div>

                        <hr className="my-4" />

                        {/* Contenido dos columnas */}
                        <div className="row g-4">
                            {/* Columna izquierda: datos básicos */}
                            <div className="col-12 col-md-6">
                                <h5
                                    className="mb-3"
                                    style={{ fontWeight: 600, color: "#134A46", fontSize: "1.05rem" }}
                                >
                                    Datos personales
                                </h5>

                                <div className="d-flex flex-column gap-3">
                                    <div className="d-flex gap-3 align-items-center p-3 rounded-3 border border-light-subtle">
                                        <div
                                            className="rounded-3 d-flex align-items-center justify-content-center"
                                            style={{
                                                width: "44px",
                                                height: "44px",
                                                backgroundColor: "#E0F2F1"
                                            }}
                                        >
                                            <PersonCircle size={22} style={{ color: "#0f766e" }} />
                                        </div>
                                        <div>
                                            <div
                                                style={{
                                                    fontSize: "0.8rem",
                                                    textTransform: "uppercase",
                                                    letterSpacing: "0.04em",
                                                    color: "#9ca3af"
                                                }}
                                            >
                                                Nombre
                                            </div>
                                            <div style={{ fontSize: "0.98rem", color: "#111827" }}>
                                                {userData.name}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="d-flex gap-3 align-items-center p-3 rounded-3 border border-light-subtle">
                                        <div
                                            className="rounded-3 d-flex align-items-center justify-content-center"
                                            style={{
                                                width: "44px",
                                                height: "44px",
                                                backgroundColor: "#E0F2F1"
                                            }}
                                        >
                                            <PersonCircle size={22} style={{ color: "#0f766e" }} />
                                        </div>
                                        <div>
                                            <div
                                                style={{
                                                    fontSize: "0.8rem",
                                                    textTransform: "uppercase",
                                                    letterSpacing: "0.04em",
                                                    color: "#9ca3af"
                                                }}
                                            >
                                                Apellido
                                            </div>
                                            <div style={{ fontSize: "0.98rem", color: "#111827" }}>
                                                {userData.surname}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="d-flex gap-3 align-items-center p-3 rounded-3 border border-light-subtle">
                                        <div
                                            className="rounded-3 d-flex align-items-center justify-content-center"
                                            style={{
                                                width: "44px",
                                                height: "44px",
                                                backgroundColor: "#E0F2F1"
                                            }}
                                        >
                                            <Envelope size={22} style={{ color: "#0f766e" }} />
                                        </div>
                                        <div style={{ flex: 1 }}>
                                            <div
                                                style={{
                                                    fontSize: "0.8rem",
                                                    textTransform: "uppercase",
                                                    letterSpacing: "0.04em",
                                                    color: "#9ca3af"
                                                }}
                                            >
                                                Email
                                            </div>
                                            <div
                                                style={{
                                                    fontSize: "0.98rem",
                                                    color: "#111827",
                                                    wordBreak: "break-all"
                                                }}
                                            >
                                                {userData.email}
                                            </div>
                                        </div>
                                    </div>

                                    {!isAdmin && userData.phone && (
                                        <div className="d-flex gap-3 align-items-center p-3 rounded-3 border border-light-subtle">
                                            <div
                                                className="rounded-3 d-flex align-items-center justify-content-center"
                                                style={{
                                                    width: "44px",
                                                    height: "44px",
                                                    backgroundColor: "#E0F2F1"
                                                }}
                                            >
                                                <Phone size={22} style={{ color: "#0f766e" }} />
                                            </div>
                                            <div>
                                                <div
                                                    style={{
                                                        fontSize: "0.8rem",
                                                        textTransform: "uppercase",
                                                        letterSpacing: "0.04em",
                                                        color: "#9ca3af"
                                                    }}
                                                >
                                                    Teléfono
                                                </div>
                                                <div style={{ fontSize: "0.98rem", color: "#111827" }}>
                                                    {userData.phone}
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Columna derecha: seguridad */}
                            <div className="col-12 col-md-6">
                                <div className="d-flex justify-content-between align-items-center mb-3">
                                    <h5
                                        className="mb-0"
                                        style={{
                                            fontWeight: 600,
                                            color: "#134A46",
                                            fontSize: "1.05rem"
                                        }}
                                    >
                                        <Lock size={18} className="me-2" />
                                        Seguridad
                                    </h5>
                                    <button
                                        type="button"
                                        className="btn btn-sm"
                                        onClick={() => {
                                            setShowPasswordForm((prev) => !prev);
                                            setPasswordData({
                                                currentPassword: "",
                                                newPassword: "",
                                                confirmPassword: ""
                                            });
                                        }}
                                        style={{
                                            borderRadius: "999px",
                                            padding: "6px 16px",
                                            fontSize: "0.85rem",
                                            border: "1px solid #1D7B74",
                                            color: showPasswordForm ? "#1D7B74" : "#FDF8E7",
                                            backgroundColor: showPasswordForm ? "#FDF8E7" : "#1D7B74"
                                        }}
                                    >
                                        {showPasswordForm ? "Cerrar" : "Cambiar contraseña"}
                                    </button>
                                </div>

                                {!showPasswordForm ? (
                                    <div
                                        className="border border-light-subtle rounded-3 p-4 text-muted"
                                        style={{ fontSize: "0.95rem" }}
                                    >
                                        Tu contraseña está protegida. Podés actualizarla cuando quieras
                                        desde este apartado.
                                    </div>
                                ) : (
                                    <form onSubmit={handleSubmitPassword}>
                                        <div className="mb-3">
                                            <label
                                                className="form-label"
                                                style={{ fontSize: "0.9rem", color: "#4b5563" }}
                                            >
                                                Contraseña actual
                                            </label>
                                            <input
                                                type="password"
                                                className="form-control"
                                                name="currentPassword"
                                                value={passwordData.currentPassword}
                                                onChange={handlePasswordChange}
                                                required
                                                placeholder="Ingresa tu contraseña actual"
                                                style={{ borderRadius: "10px" }}
                                            />
                                        </div>

                                        <div className="mb-3">
                                            <label
                                                className="form-label"
                                                style={{ fontSize: "0.9rem", color: "#4b5563" }}
                                            >
                                                Nueva contraseña
                                            </label>
                                            <input
                                                type="password"
                                                className="form-control"
                                                name="newPassword"
                                                value={passwordData.newPassword}
                                                onChange={handlePasswordChange}
                                                required
                                                minLength={6}
                                                placeholder="Mínimo 6 caracteres"
                                                style={{ borderRadius: "10px" }}
                                            />
                                        </div>

                                        <div className="mb-4">
                                            <label
                                                className="form-label"
                                                style={{ fontSize: "0.9rem", color: "#4b5563" }}
                                            >
                                                Confirmar nueva contraseña
                                            </label>
                                            <input
                                                type="password"
                                                className="form-control"
                                                name="confirmPassword"
                                                value={passwordData.confirmPassword}
                                                onChange={handlePasswordChange}
                                                required
                                                placeholder="Repite la nueva contraseña"
                                                style={{ borderRadius: "10px" }}
                                            />
                                        </div>

                                        <button
                                            type="submit"
                                            className="btn w-100"
                                            disabled={loading}
                                            style={{
                                                backgroundColor: "#F2C94C",
                                                borderColor: "#F2C94C",
                                                color: "#134A46",
                                                fontWeight: 600,
                                                borderRadius: "999px",
                                                padding: "10px 16px",
                                                boxShadow: "0 6px 12px rgba(242, 201, 76, 0.35)"
                                            }}
                                        >
                                            {loading ? "Guardando..." : "Guardar nueva contraseña"}
                                        </button>
                                    </form>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default MisDatos;

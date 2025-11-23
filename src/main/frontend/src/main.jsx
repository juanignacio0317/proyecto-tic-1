import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import Login from "./components/Login.jsx";
import Register from "./components/Register.jsx";
import PersonalizaPage from "./components/PersonalizaPage.jsx";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "./index.css";
import CartPage from "./components/CartPage.jsx";
import AdminPage from "./components/AdminPage.jsx";
import { authService } from "./services/authService";
import MyCreationsPage from "./components/MyCreationPage.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
        <BrowserRouter>
            <Routes>
                {/* Página principal */}
                <Route path="/" element={<App />} />

                {/* Login / Registro */}
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                {/* Otras páginas */}
                <Route path="/personaliza" element={<PersonalizaPage />} />
                <Route path="/carrito" element={<CartPage />} />

                {/* Panel de administración */}
                <Route
                    path="/admin"
                    element={
                        authService.isAdmin()
                            ? <AdminPage />
                            : <Navigate to="/login" replace />   // ✅ redirige al login si no es admin
                    }
                />
                <Route path="/mis-creaciones" element={<MyCreationsPage />} />
            </Routes>
        </BrowserRouter>
    </React.StrictMode>
);

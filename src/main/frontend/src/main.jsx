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
import MyOrdersPage from "./components/MyOrderPage.jsx";
import PaymentMethodsPage from "./components/PaymentMethodPage.jsx";
import AddressesPage from "./components/AddressPage.jsx";
import PersonalizaPizzaPage from "./components/PersonalizaPizzaPage.jsx";
import MisDatos from './components/MisDatos';
import CreationPage from "./components/CreationPage.jsx";


ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
        <BrowserRouter>
            <Routes>
                {/* Página principal */}
                <Route path="/" element={<App />} />

                {/* Login / Registro */}
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                <Route path="/personaliza" element={<PersonalizaPage />} />
                <Route path="/personalizapizza" element={<PersonalizaPizzaPage />} />
                <Route path="/carrito" element={<CartPage />} />
                <Route path="/elige-tipo" element={<CreationPage/>} />


                {/* Panel de administración */}
                <Route
                    path="/admin"
                    element={
                        authService.isAdmin()
                            ? <AdminPage />
                            : <Navigate to="/login" replace />   // redirige al login si no es admin
                    }
                />
                <Route path="/mis-creaciones" element={<MyCreationsPage />} />
                <Route path="/mis-pedidos" element={<MyOrdersPage />} />
                <Route path="/mis-tarjetas" element={<PaymentMethodsPage />} />
                <Route path="/mis-direcciones" element={<AddressesPage />} />
                <Route path="/mis-datos" element={<MisDatos />} />



            </Routes>
        </BrowserRouter>
    </React.StrictMode>
);

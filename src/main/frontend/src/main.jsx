import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import Login from './components/Login.jsx'
import Register from './components/Register.jsx'
import PersonalizaPage from './components/PersonalizaPage.jsx'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import CartPage from "./components/CartPage.jsx";

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<App />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/personaliza" element={<PersonalizaPage />} />
                <Route path="/carrito" element={<CartPage />} />


            </Routes>
        </BrowserRouter>
    </React.StrictMode>,
)

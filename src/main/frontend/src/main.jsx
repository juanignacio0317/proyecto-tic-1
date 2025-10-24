import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import Login from './components/Login.jsx'
import PersonalizaPage from './components/PersonalizaPage.jsx'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import Navbar from './components/Navbar.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <BrowserRouter>
            <Navbar />
            <Routes>
                <Route path="/" element={<App />} />
                <Route path="/login" element={<Login />} />



                <Route path="/personaliza" element={<PersonalizaPage />} />
            </Routes>
            <footer className="py-4 text-center text-sm text-neutral-500">
                © {new Date().getFullYear()} JAM Consultancy & Services | Todos los derechos reservados
            </footer>
        </BrowserRouter>
    </React.StrictMode>,
)
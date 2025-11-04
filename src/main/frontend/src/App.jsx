import React from 'react'
import Navbar from './components/Navbar.jsx'
import HeroSection from './components/HeroSection.jsx'
import ProductosDestacados from './components/ProductosDestacados.jsx'
import FeaturesSection from "./components/FeaturesSection.jsx"
import Footer from "./components/Footer.jsx"
export default function App(){
    return (
        <main>
            <Navbar/>
            <HeroSection />
            <FeaturesSection />
            <ProductosDestacados />
            <Footer/>
        </main>
    )
}
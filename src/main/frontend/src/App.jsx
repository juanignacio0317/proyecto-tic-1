import React from 'react'
import HeroSection from './components/HeroSection.jsx'
import ProductosDestacados from './components/ProductosDestacados.jsx'
import FeaturesSection from "./components/FeaturesSection.jsx"

export default function App(){
    return (
        <main>
            <HeroSection />
            <FeaturesSection />
            <ProductosDestacados />
        </main>
    )
}
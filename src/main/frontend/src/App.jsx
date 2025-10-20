import React from 'react'
import Navbar from './components/Navbar.jsx'
import HeroSection from './components/HeroSection.jsx'
import ProductosDestacados from './components/ProductosDestacados.jsx'

export default function App(){
  return (
    <>
      <Navbar />
      <main>
        <HeroSection />
        <ProductosDestacados />
      </main>
      <footer className="py-4 text-center text-sm text-neutral-500">
        © {new Date().getFullYear()} PizzUM & BurgUM
      </footer>
    </>
  )
}

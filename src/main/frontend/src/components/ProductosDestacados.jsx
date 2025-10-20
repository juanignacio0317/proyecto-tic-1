import React from 'react'
import BurgerSVG from '../assets/hero-burger.svg?url'
import PizzaSVG from '../assets/hero-pizza.svg?url'

function Panel({title, subtitle, cta, href, img}){
  return (
    <div className="split-panel h-100 d-flex flex-column flex-md-row align-items-center gap-4">
      <div className="flex-fill">
        <h2 className="fw-bold display-6 mb-2">{title}</h2>
        <p className="text-secondary fs-5 mb-3">{subtitle}</p>
        <a href={href} className="callout-link">Más información →</a>
      </div>
      <div className="flex-fill text-center">
        <img src={img} alt="" className="img-fluid" style={{maxHeight:'260px'}}/>
      </div>
    </div>
  )
}

export default function ProductosDestacados(){
  return (
    <section className="py-5" id="menú">
      <div className="container">
        <div className="row g-4">
          <div className="col-12 col-md-6">
            <Panel
              title="Hamburguesas personalizadas"
              subtitle="Probá nuestra increíble personalización: elegí panes, carnes, toppings y salsas."
              cta="Personalizar hamburguesa"
              href="#personalización"
              img={BurgerSVG}
            />
          </div>
          <div className="col-12 col-md-6">
            <Panel
              title="Pizzas personalizadas"
              subtitle="Armá tu pizza a medida: tamaño, masa, queso y toppings al gusto."
              cta="Personalizar pizza"
              href="#personalización"
              img={PizzaSVG}
            />
          </div>
        </div>
      </div>
    </section>
  )
}

import React from 'react'
import BurgerSVG from '../assets/hero-burger.svg?url'
import PizzaSVG from '../assets/hero-pizza.svg?url'

function Panel({ title, subtitle, cta, href, img }) {
    return (
        <div
            className="h-100 d-flex flex-column flex-md-row align-items-center gap-4 p-5 bg-white border border-gray-200 text-gray-800 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 hover:scale-[1.01]"
            style={{ minHeight: '330px' }}
        >
            <div className="flex-fill" data-aos="fade-right"
                 data-aos-delay="0">
                <h2 className="fw-bold text-3xl mb-2 text-gray-900">{title}</h2>
                <p className="text-lg text-gray-600 mb-3">{subtitle}</p>
                <a
                    href={href}
                    className="inline-block mt-2 text-[#1D7B74] font-medium hover:underline"
                >
                    {cta} →
                </a>
            </div>

            <div className="flex-fill text-center">
                <img
                    src={img}
                    alt=""
                    className="img-fluid transition-transform duration-300 hover:scale-105"
                    style={{ maxHeight: '300px' }}
                />
            </div>
        </div>
    )
}

export default function ProductosDestacados() {
    return (
        <section className="pt-28 pb-60 bg-white" id="menú" >
            <div className="container mx-auto px-4">
                <h2 className="text-4xl font-bold text-center text-gray-900 mb-12">
                    ¡Haz tu creación {' '} <span className=" font-bold text-[#1D7B74]">
            ahora!
          </span>
                </h2>

                <div className="row g-5">
                    <div className="col-12 col-md-6">
                        <Panel
                            title="Hamburguesas personalizadas"
                            subtitle="Probá nuestra increíble personalización: elegí panes, carnes, toppings y salsas."
                            cta="Personalizar hamburguesa"
                            href="/personaliza"
                            img={BurgerSVG}
                        />
                    </div>
                    <div className="col-12 col-md-6">
                        <Panel
                            title="Pizzas personalizadas"
                            subtitle="Armá tu pizza a medida: tamaño, masa, queso y toppings al gusto."
                            cta="Personalizar pizza"
                            href="/personalizapizza"
                            img={PizzaSVG}
                        />
                    </div>
                </div>
            </div>
        </section>
    )
}

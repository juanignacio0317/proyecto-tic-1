import React from 'react'

export default function FeaturesSection() {
    const items = [
        { title: 'Ingredientes frescos', desc: 'Seleccionados a diario para un sabor auténtico.', icon: 'bi-basket2' },
        { title: 'Diseñá a tu gusto', desc: 'Elegí masa, pan, salsas y toppings sin límites.', icon: 'bi-sliders' },
        { title: 'Entrega rápida', desc: 'Tu pedido caliente, en el momento justo.', icon: 'bi-truck' },
        { title: 'Hecho con pasión', desc: 'Recetas propias y técnica artesanal.', icon: 'bi-heart-fill' },
    ]

    return (
        <section className="pt-20 pb-72 bg-gradient-to-r from-[#1D7B74] via-[#1F8B83] to-[#2FA29A] text-center text-white">
            <div className="container mx-auto px-4">
                {/* Slogan integrado */}
                <p
                    className="display-5 fw-bold mb-4 text-[#FDF8E7]"
                >
                    La pizza y la burger que imaginás,{" "}
                    <span className="fw-bolder text-[#FFF6DB]">¡ahora existe!</span>
                </p>




                {/* Features */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-4xl mx-auto">
                    {items.map((it, i) => (
                        <div
                            key={i}
                            className="flex flex-col items-center md:items-start text-center md:text-left gap-3 transition-transform duration-200 hover:scale-[1.03]"
                        >
                            <div className="flex items-center justify-center w-16 h-16 rounded-full bg-white/15 text-white">
                                <i className={`bi ${it.icon} text-3xl`} />
                            </div>
                            <h3 className="text-2xl font-semibold">{it.title}</h3>
                            <p className="text-base text-white/90 max-w-md">{it.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}


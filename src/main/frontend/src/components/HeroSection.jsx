
import BurgerSVG from '../assets/hero-burger.svg?url'
import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'

export default function HeroSection() {
  useEffect(() => {
    if (window.AOS) {
      window.AOS.init({
        duration: 1000,
        easing: 'ease-out', //api para las animaciones
        once: true,
        offset: 100,
      })
    }
  }, [])
  return (
      <section
          id="inicio"
          className="bg-[#1D7B74] text-[#FDF8E7] py-5"
      >
        <div className="container">
          <div className="row align-items-center g-4">
            <div className="col-lg-6">
              <h1 className="display-5 fw-bold leading-tight mb-3 " data-aos="fade-right" data-aos-delay="0">
                Diseñá tu pizza o hamburguesa perfecta
              </h1>
              <p className="fs-5 opacity-95 mb-4" data-aos="fade-up" data-aos-delay="0">
                Elegí tamaño, ingredientes y salsas. En minutos, tu creación única está en camino.
              </p>

              <div className="d-flex gap-3">
                <Link
                    to="/personaliza"
                    className="btn fw-semibold btn-lg text-[#1B7F79] border-0 shadow-sm"
                    style={{
                      backgroundColor: '#F2C94C',
                    }}
                >
                  Comenzar ahora
                </Link>
              </div>
            </div>

            <div className="col-lg-6 text-center">
              <img
                  src={BurgerSVG}
                  alt="Ilustración de hamburguesa"
                  className="img-fluid"
                  style={{ maxHeight: '360px' }}
              />
            </div>
          </div>
        </div>
      </section>
  )
}
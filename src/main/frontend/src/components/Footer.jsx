import React from "react"

export default function Footer() {
    return (
        <footer className="bg-gradient-to-r from-[#1D7B74] via-[#1F8B83] to-[#2FA29A] text-white py-10">
            <div className="container mx-auto px-6 flex flex-col md:flex-row items-center md:items-start justify-between text-center md:text-left gap-8">

                {/* Marca */}
                <div className="md:w-1/2">
                    <h2 className="text-2xl font-semibold mb-3 tracking-wide">PizzUM & BurgUM</h2>
                    <p className="text-sm opacity-90 leading-relaxed max-w-sm mx-auto md:mx-0">
                        Tu sabor, tu creación <br />
                        Armá tus combinaciones únicas con ingredientes frescos y 100% uruguayos.
                    </p>
                </div>

                {/* Redes sociales */}
                <div className="md:w-1/2 md:text-right">
                    <h3 className="text-lg font-semibold mb-4">Seguinos</h3>
                    <div className="flex justify-center md:justify-end space-x-6 text-2xl">
                        <a
                            href="https://www.instagram.com"
                            target="_blank"
                            rel="noreferrer"
                            className="hover:scale-110 transition-transform"
                        >
                            <i className="bi bi-instagram"></i>
                        </a>
                        <a
                            href="https://www.facebook.com"
                            target="_blank"
                            rel="noreferrer"
                            className="hover:scale-110 transition-transform"
                        >
                            <i className="bi bi-facebook"></i>
                        </a>
                        <a
                            href="https://www.twitter.com"
                            target="_blank"
                            rel="noreferrer"
                            className="hover:scale-110 transition-transform"
                        >
                            <i className="bi bi-twitter-x"></i>
                        </a>
                    </div>
                </div>
            </div>


            <div className="mt-10 border-t border-white/30 pt-4 text-center text-xs opacity-80">
                © {new Date().getFullYear()} PizzUM & BurgUM — Todos los derechos reservados.
            </div>
        </footer>
    )
}

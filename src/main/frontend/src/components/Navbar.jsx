import React, { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";

export default function Navbar() {
  const [atTop, setAtTop] = useState(true);

  useEffect(() => {
    const onScroll = () => setAtTop(window.scrollY < 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const items = [
    { label: "Inicio", href: "#inicio" },
    { label: "Creaciones", href: "#creaciones" },
    { label: "Inicio de sesión", to: "/login", isRoute: true },
    { label: "Carrito", href: "#carrito" },
  ];

  const linkBase =
      "transition-colors duration-300 fw-medium " +
      (atTop ? "text-[#FDF8E7]" : "text-[#1B7F79]");

  return (
      <header
          className={
              "sticky top-0 z-50 transition-[box-shadow] duration-300 " +
              (atTop ? "" : "shadow-md")
          }
      >
        <div className="relative">
          {/* fondo gradiente al tope */}
          <div
              className="absolute inset-0 bg-[#1D7B74] transition-opacity duration-300"
              style={{ opacity: atTop ? 1 : 0 }}
              aria-hidden="true"
          />
          {/* fondo blanco al hacer scroll */}
          <div
              className="absolute inset-0 bg-white transition-opacity duration-300"
              style={{ opacity: atTop ? 0 : 1 }}
              aria-hidden="true"
          />

          <nav className="relative container py-3 d-flex align-items-center justify-content-between font-brand">
            {/* Logo -> vuelve a la landing usando Router */}
            <Link
                to="/"
                className={
                    "fw-bold h4 m-0 transition-colors duration-300 " +
                    (atTop ? "text-[#FDF8E7]" : "text-[#1B7F79]")
                }
            >
              Pizz<span className="opacity-90">UM</span> & Burg
              <span className="opacity-90">UM</span>
            </Link>

            {/* Links */}
            <ul className="list-unstyled d-flex gap-4 m-0">
              {items.map((item) => (
                  <li key={item.label}>
                    {item.isRoute ? (
                        <NavLink
                            to={item.to}
                            className={({ isActive }) =>
                                linkBase +
                                (isActive ? " underline underline-offset-4" : "")
                            }
                        >
                          {item.label}
                        </NavLink>
                    ) : (
                        <a href={item.href} className={linkBase}>
                          {item.label}
                        </a>
                    )}
                  </li>
              ))}
            </ul>
          </nav>
        </div>
      </header>
  );
}

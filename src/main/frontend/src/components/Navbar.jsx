import React, { useEffect, useState } from "react";
import { Link, NavLink, useNavigate, useLocation } from "react-router-dom";
import { authService } from "../services/authService";

export default function Navbar() {
  const [atTop, setAtTop] = useState(true);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setAtTop(window.scrollY < 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);


  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    setUser(currentUser);
  }, [location]);

  const handleLogout = () => {
    authService.logout();
    setUser(null);
    navigate("/");
  };


  const items = [
    { label: "Inicio", href: "#inicio", icon: "home"},

    user
        ? { label: "Mis Creaciones", to: "/mis-creaciones", isRoute: true, icon: "local_pizza"}
        : { label: "Creaciones", href: "#creaciones", icon: "local_pizza"},

    // Agregar Mis Pedidos solo si el usuario está logueado
    ...(user
            ? [{ label: "Mis Pedidos", to: "/mis-pedidos", isRoute: true }]
            : []
    ),

    ...(authService.isAdmin()
            ? [{ label: "Administración", to: "/admin", isRoute: true, isAdmin: true }]
            : []
    ),

    user
        ? { label: `Hola, ${user.name}`, isUser: true }
        : { label: "Inicio de sesión", to: "/login", isRoute: true, icon: "person"},
    { label: "Carrito", to: "/carrito", isRoute: true, icon: "shopping_cart"  },
  ];

  const linkBase =
      "transition-colors duration-300 fw-medium " +
      (atTop ? "text-[#FDF8E7]" : "text-[#1B7F79]");


  const adminLinkStyle = (isActive) =>
      linkBase +
      (isActive ? " underline underline-offset-4" : "");

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
            <ul className="list-unstyled d-flex gap-4 m-0 align-items-center">
              {items.map((item, index) => (
                  <li key={index}>
                    {item.isUser ? (
                        <div className="d-flex align-items-center gap-3">
                          <span className={linkBase}>
                            {item.label}
                          </span>
                          <button
                              onClick={handleLogout}
                              className={`${linkBase} border-0 bg-transparent p-0`}
                              style={{ cursor: 'pointer' }}
                              title="Cerrar sesión"
                          >
                            <i className="bi bi-box-arrow-right"></i>
                          </button>
                        </div>
                    ) : item.isRoute ? (
                        <NavLink
                            to={item.to}
                            className={({ isActive }) =>
                                // Usar estilo especial si es link de admin
                                item.isAdmin
                                    ? adminLinkStyle(isActive)
                                    : linkBase + (isActive ? " underline underline-offset-4" : "")
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
  )
}

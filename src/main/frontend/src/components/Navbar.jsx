import React, { useEffect, useState } from "react";
import { Link, NavLink, useNavigate, useLocation } from "react-router-dom";
import { authService } from "../services/authService";

export default function Navbar() {
  const [atTop, setAtTop] = useState(true);
  const [user, setUser] = useState(null);
  const [showUserMenu, setShowUserMenu] = useState(false);
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

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showUserMenu && !event.target.closest('.user-menu-container')) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showUserMenu]);

  const handleLogout = () => {
    Swal.fire({
      title: "¿Cerrar sesión?",
      text: "¿Seguro que querés salir de tu cuenta?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#1B7F79",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, salir",
      cancelButtonText: "Cancelar"
    }).then((result) => {
      if (result.isConfirmed) {
        authService.logout();
        setUser(null);
        setShowUserMenu(false);

        Swal.fire({
          icon: "success",
          title: "Sesión cerrada",
          timer: 1200,
          showConfirmButton: false,
        }).then(() => {
          navigate("/");
        });
      }
    });
  };

  const items = [
    { label: "Inicio", href: "/", icon: "home"},

    authService.isAdmin()
        ? { }
        : { label: "Mis Creaciones", to: "/mis-creaciones", isRoute: true, icon: "restaurant"},

    ...(authService.isAdmin()
            ? []
            : [{ label: "Mis Pedidos", to: "/mis-pedidos", isRoute: true, icon: "receipt_long" }]
    ),

    ...(authService.isAdmin()
            ? [{ label: "Administración", to: "/admin", isRoute: true, isAdmin: true, icon: "admin_panel_settings" }]
            : []
    ),

    ...(authService.isAdmin()
            ? []
            : [{ label: "Carrito", to: "/carrito", isRoute: true, icon: "shopping_cart" }]
    ),
  ];

  const linkBase =
      "transition-colors duration-300 fw-medium d-flex align-items-center gap-2 " +
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
          <div
              className="absolute inset-0 bg-[#1D7B74] transition-opacity duration-300"
              style={{ opacity: atTop ? 1 : 0 }}
              aria-hidden="true"
          />
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

            <ul className="list-unstyled d-flex gap-4 m-0 align-items-center">
              {items.map((item, index) => (
                  <li key={index}>
                    {item.isRoute ? (
                        <NavLink
                            to={item.to}
                            className={({ isActive }) =>
                                item.isAdmin
                                    ? adminLinkStyle(isActive)
                                    : linkBase + (isActive ? " underline underline-offset-4" : "")
                            }
                        >
                          {item.icon && <span className="material-icons" style={{ fontSize: '20px' }}>{item.icon}</span>}
                          <span>{item.label}</span>
                        </NavLink>
                    ) : (
                        <a href={item.href} className={linkBase}>
                          {item.icon && <span className="material-icons" style={{ fontSize: '20px' }}>{item.icon}</span>}
                          <span>{item.label}</span>
                        </a>
                    )}
                  </li>
              ))}

              {user ? (
                  <li className="user-menu-container position-relative">
                    <button
                        onClick={() => setShowUserMenu(!showUserMenu)}
                        className={`${linkBase} border-0 bg-transparent p-0`}
                        style={{ cursor: 'pointer' }}
                    >
                      <span className="material-icons" style={{ fontSize: '20px' }}>person</span>
                      <span>Hola, {user.name}</span>
                      <span className="material-icons" style={{ fontSize: '16px' }}>
                        {showUserMenu ? 'expand_less' : 'expand_more'}
                      </span>
                    </button>

                    {showUserMenu && (
                        <div className="position-absolute end-0 mt-2 bg-white rounded shadow-lg"
                             style={{
                               minWidth: '200px',
                               zIndex: 1000,
                               border: '1px solid #e5e7eb'
                             }}>
                          <ul className="list-unstyled m-0 py-2">
                            {/* Mis Datos */}
                            <li>
                              <button
                                  onClick={() => {
                                    navigate('/mis-datos');
                                    setShowUserMenu(false);
                                  }}
                                  className="w-100 text-start px-4 py-2 border-0 bg-transparent d-flex align-items-center gap-2 text-gray-700 hover:bg-gray-100"
                                  style={{ cursor: 'pointer' }}
                              >
                                <span className="material-icons" style={{ fontSize: '20px' }}>account_circle</span>
                                <span>Mis Datos</span>
                              </button>
                            </li>

                            {/* Opciones solo para usuarios (no admins) */}
                            {!authService.isAdmin() && (
                                <>
                                  <li>
                                    <button
                                        onClick={() => {
                                          navigate('/mis-tarjetas');
                                          setShowUserMenu(false);
                                        }}
                                        className="w-100 text-start px-4 py-2 border-0 bg-transparent d-flex align-items-center gap-2 text-gray-700 hover:bg-gray-100"
                                        style={{ cursor: 'pointer' }}
                                    >
                                      <span className="material-icons" style={{ fontSize: '20px' }}>credit_card</span>
                                      <span>Mis Tarjetas</span>
                                    </button>
                                  </li>
                                  <li>
                                    <button
                                        onClick={() => {
                                          navigate('/mis-direcciones');
                                          setShowUserMenu(false);
                                        }}
                                        className="w-100 text-start px-4 py-2 border-0 bg-transparent d-flex align-items-center gap-2 text-gray-700 hover:bg-gray-100"
                                        style={{ cursor: 'pointer' }}
                                    >
                                      <span className="material-icons" style={{ fontSize: '20px' }}>location_on</span>
                                      <span>Mis Direcciones</span>
                                    </button>
                                  </li>
                                </>
                            )}

                            <li className="border-top my-1"></li>

                            <li>
                              <button
                                  onClick={handleLogout}
                                  className="w-100 text-start px-4 py-2 border-0 bg-transparent d-flex align-items-center gap-2 text-red-600 hover:bg-red-50"
                                  style={{ cursor: 'pointer' }}
                              >
                                <span className="material-icons" style={{ fontSize: '20px' }}>logout</span>
                                <span>Cerrar Sesión</span>
                              </button>
                            </li>
                          </ul>
                        </div>
                    )}
                  </li>
              ) : (
                  <li>
                    <NavLink to="/login" className={linkBase}>
                      <span className="material-icons" style={{ fontSize: '20px' }}>login</span>
                      <span>Inicio de sesión</span>
                    </NavLink>
                  </li>
              )}
            </ul>
          </nav>
        </div>
      </header>
  );
}
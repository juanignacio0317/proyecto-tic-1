import React, { useEffect, useState } from "react";
import { Link, NavLink, useNavigate, useLocation } from "react-router-dom";
import { authService } from "../services/authService";

export default function Navbar() {
  const [atTop, setAtTop] = useState(true);
  const [user, setUser] = useState(null);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const isLightBg = !atTop || isMobileMenuOpen; // blanco cuando scrolleás o abrís menú mobile

  useEffect(() => {
    const onScroll = () => setAtTop(window.scrollY < 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    setUser(currentUser);
    setIsMobileMenuOpen(false);
    setShowUserMenu(false);
  }, [location]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showUserMenu && !event.target.closest(".user-menu-container")) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
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
      cancelButtonText: "Cancelar",
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

  // items según admin / usuario
  const items = [
    { label: "Inicio", href: "/", icon: "home" },
    !authService.isAdmin() && {
      label: "Mis Creaciones",
      to: "/mis-creaciones",
      isRoute: true,
      icon: "restaurant",
    },
    !authService.isAdmin() && {
      label: "Mis Pedidos",
      to: "/mis-pedidos",
      isRoute: true,
      icon: "receipt_long",
    },
    authService.isAdmin() && {
      label: "Administración",
      to: "/admin",
      isRoute: true,
      isAdmin: true,
      icon: "admin_panel_settings",
    },
    !authService.isAdmin() && {
      label: "Carrito",
      to: "/carrito",
      isRoute: true,
      icon: "shopping_cart",
    },
  ].filter(Boolean);

  // estilos base
  const linkBaseDesktop =
      "transition-colors duration-300 fw-medium d-flex align-items-center gap-2 " +
      (isLightBg ? "text-[#1B7F79]" : "text-[#FDF8E7]");

  const linkBaseMobile =
      "fw-medium d-flex align-items-center gap-2 text-[#1B7F79]";

  const adminLinkStyle = (isActive, isMobile) =>
      (isMobile ? linkBaseMobile : linkBaseDesktop) +
      (isActive ? " underline underline-offset-4" : "");

  const renderNavItems = (isMobile = false) => {
    const base = isMobile ? linkBaseMobile : linkBaseDesktop;

    return items.map((item, index) => (
        <li key={index}>
          {item.isRoute ? (
              <NavLink
                  to={item.to}
                  className={({ isActive }) =>
                      item.isAdmin
                          ? adminLinkStyle(isActive, isMobile)
                          : base + (isActive ? " underline underline-offset-4" : "")
                  }
                  onClick={() => isMobile && setIsMobileMenuOpen(false)}
              >
                {item.icon && (
                    <span className="material-icons" style={{ fontSize: "20px" }}>
                {item.icon}
              </span>
                )}
                <span>{item.label}</span>
              </NavLink>
          ) : (
              <a
                  href={item.href}
                  className={base}
                  onClick={() => isMobile && setIsMobileMenuOpen(false)}
              >
                {item.icon && (
                    <span className="material-icons" style={{ fontSize: "20px" }}>
                {item.icon}
              </span>
                )}
                <span>{item.label}</span>
              </a>
          )}
        </li>
    ));
  };

  const userMenuButton = (isMobile = false, extraClasses = "") => {
    const base = isMobile ? linkBaseMobile : linkBaseDesktop;

    return (
        <button
            onClick={() => setShowUserMenu((prev) => !prev)}
            className={`${base} border-0 bg-transparent p-0 ${extraClasses}`}
            style={{ cursor: "pointer" }}
        >
        <span className="material-icons" style={{ fontSize: "20px" }}>
          person
        </span>
          <span>Hola, {user?.name}</span>
          <span className="material-icons" style={{ fontSize: "16px" }}>
          {showUserMenu ? "expand_less" : "expand_more"}
        </span>
        </button>
    );
  };

  return (
      <header
          className={
              "sticky top-0 z-50 transition-colors duration-300 " +
              (isLightBg ? "bg-white shadow-md" : "bg-[#1D7B74]")
          }
      >
        <nav className="container py-3 d-flex align-items-center justify-content-between font-brand">
          {/* LOGO */}
          <Link
              to="/"
              className={
                  "fw-bold m-0 d-flex flex-column lh-1 " +
                  (isLightBg ? "text-[#1B7F79]" : "text-[#FDF8E7]")
              }
          >
          <span className="fs-4">
            Pizz<span className="opacity-90">UM</span> & Burg
            <span className="opacity-90">UM</span>
          </span>
            <span
                className="small fw-normal opacity-75"
                style={{ fontSize: "0.7rem", letterSpacing: "0.08em" }}
            >
            hecho para vos • fresh & fast
          </span>
          </Link>

          {/* DESKTOP MENU */}
          <div className="d-none d-lg-flex align-items-center gap-4">
            <ul className="list-unstyled d-flex gap-4 m-0 align-items-center">
              {renderNavItems(false)}

              {user ? (
                  <li className="user-menu-container position-relative">
                    {userMenuButton(false)}

                    {showUserMenu && (
                        <div
                            className="position-absolute end-0 mt-2 bg-white rounded-3 shadow-lg"
                            style={{
                              minWidth: "220px",
                              zIndex: 1000,
                              border: "1px solid #e5e7eb",
                            }}
                        >
                          <ul className="list-unstyled m-0 py-2">
                            <li>
                              <button
                                  onClick={() => {
                                    navigate("/mis-datos");
                                    setShowUserMenu(false);
                                  }}
                                  className="w-100 text-start px-4 py-2 border-0 bg-transparent d-flex align-items-center gap-2 text-gray-700 hover:bg-gray-100"
                                  style={{ cursor: "pointer" }}
                              >
                          <span
                              className="material-icons"
                              style={{ fontSize: "20px" }}
                          >
                            account_circle
                          </span>
                                <span>Mis Datos</span>
                              </button>
                            </li>

                            {/* Opciones solo para usuarios (no admins) */}
                            {!authService.isAdmin() && (
                                <>
                                  <li>
                                    <button
                                        onClick={() => {
                                          navigate("/mis-tarjetas");
                                          setShowUserMenu(false);
                                        }}
                                        className="w-100 text-start px-4 py-2 border-0 bg-transparent d-flex align-items-center gap-2 text-gray-700 hover:bg-gray-100"
                                        style={{ cursor: "pointer" }}
                                    >
                              <span
                                  className="material-icons"
                                  style={{ fontSize: "20px" }}
                              >
                                credit_card
                              </span>
                                      <span>Mis Tarjetas</span>
                                    </button>
                                  </li>
                                  <li>
                                    <button
                                        onClick={() => {
                                          navigate("/mis-direcciones");
                                          setShowUserMenu(false);
                                        }}
                                        className="w-100 text-start px-4 py-2 border-0 bg-transparent d-flex align-items-center gap-2 text-gray-700 hover:bg-gray-100"
                                        style={{ cursor: "pointer" }}
                                    >
                              <span
                                  className="material-icons"
                                  style={{ fontSize: "20px" }}
                              >
                                location_on
                              </span>
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
                                  style={{ cursor: "pointer" }}
                              >
                          <span
                              className="material-icons"
                              style={{ fontSize: "20px" }}
                          >
                            logout
                          </span>
                                <span>Cerrar Sesión</span>
                              </button>
                            </li>
                          </ul>
                        </div>
                    )}
                  </li>
              ) : (
                  <li>
                    <NavLink to="/login" className={linkBaseDesktop}>
                  <span className="material-icons" style={{ fontSize: "20px" }}>
                    login
                  </span>
                      <span>Inicio de sesión</span>
                    </NavLink>
                  </li>
              )}
            </ul>
          </div>

          {/* BOTÓN HAMBURGUESA (MOBILE) */}
          <button
              className="d-lg-none border-0 px-3 py-2 d-flex align-items-center justify-content-center shadow-sm"
              style={{
                cursor: "pointer",
                borderRadius: "8px",
                backgroundColor: isLightBg ? "#1B7F79" : "rgba(255,255,255,0.20)",
                transition: "background 0.2s ease"
              }}
              onClick={() => {
                setIsMobileMenuOpen((prev) => !prev);
                setShowUserMenu(false);
              }}
              aria-label="Abrir menú"
          >
  <span
      className="material-icons"
      style={{
        fontSize: "26px",
        color: "#FFFFFF"
      }}
  >
    {isMobileMenuOpen ? "close" : "fastfood"}
  </span>
          </button>

        </nav>

        {/* PANEL MOBILE */}
        {isMobileMenuOpen && (
            <div
                className="d-lg-none border-top border-gray-200 bg-white shadow-lg"
                style={{ animation: "slideDown 0.25s ease-out" }}
            >
              <div className="container py-3">
                <ul className="list-unstyled m-0 d-flex flex-column gap-2">
                  {renderNavItems(true)}

                  {user ? (
                      <li className="user-menu-container mt-2">
                        {userMenuButton(true, "w-100 justify-content-between")}

                        {showUserMenu && (
                            <div
                                className="mt-2 bg-white rounded-3 shadow-sm"
                                style={{ border: "1px solid #e5e7eb" }}
                            >
                              <ul className="list-unstyled m-0 py-2">
                                <li>
                                  <button
                                      onClick={() => {
                                        navigate("/mis-datos");
                                        setShowUserMenu(false);
                                        setIsMobileMenuOpen(false);
                                      }}
                                      className="w-100 text-start px-4 py-2 border-0 bg-transparent d-flex align-items-center gap-2 text-gray-700 hover:bg-gray-100"
                                      style={{ cursor: "pointer" }}
                                  >
                            <span
                                className="material-icons"
                                style={{ fontSize: "20px" }}
                            >
                              account_circle
                            </span>
                                    <span>Mis Datos</span>
                                  </button>
                                </li>

                                {!authService.isAdmin() && (
                                    <>
                                      <li>
                                        <button
                                            onClick={() => {
                                              navigate("/mis-tarjetas");
                                              setShowUserMenu(false);
                                              setIsMobileMenuOpen(false);
                                            }}
                                            className="w-100 text-start px-4 py-2 border-0 bg-transparent d-flex align-items-center gap-2 text-gray-700 hover:bg-gray-100"
                                            style={{ cursor: "pointer" }}
                                        >
                                <span
                                    className="material-icons"
                                    style={{ fontSize: "20px" }}
                                >
                                  credit_card
                                </span>
                                          <span>Mis Tarjetas</span>
                                        </button>
                                      </li>
                                      <li>
                                        <button
                                            onClick={() => {
                                              navigate("/mis-direcciones");
                                              setShowUserMenu(false);
                                              setIsMobileMenuOpen(false);
                                            }}
                                            className="w-100 text-start px-4 py-2 border-0 bg-transparent d-flex align-items-center gap-2 text-gray-700 hover:bg-gray-100"
                                            style={{ cursor: "pointer" }}
                                        >
                                <span
                                    className="material-icons"
                                    style={{ fontSize: "20px" }}
                                >
                                  location_on
                                </span>
                                          <span>Mis Direcciones</span>
                                        </button>
                                      </li>
                                    </>
                                )}

                                <li className="border-top my-1"></li>

                                <li>
                                  <button
                                      onClick={() => {
                                        setIsMobileMenuOpen(false);
                                        handleLogout();
                                      }}
                                      className="w-100 text-start px-4 py-2 border-0 bg-transparent d-flex align-items-center gap-2 text-red-600 hover:bg-red-50"
                                      style={{ cursor: "pointer" }}
                                  >
                            <span
                                className="material-icons"
                                style={{ fontSize: "20px" }}
                            >
                              logout
                            </span>
                                    <span>Cerrar Sesión</span>
                                  </button>
                                </li>
                              </ul>
                            </div>
                        )}
                      </li>
                  ) : (
                      <li className="mt-2">
                        <NavLink
                            to="/login"
                            className={linkBaseMobile + " w-100 justify-content-start"}
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                    <span
                        className="material-icons"
                        style={{ fontSize: "20px" }}
                    >
                      login
                    </span>
                          <span>Inicio de sesión</span>
                        </NavLink>
                      </li>
                  )}
                </ul>
              </div>
            </div>
        )}
      </header>
  );
}

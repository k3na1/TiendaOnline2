import { useEffect, useState } from "react";
import "../assets/styles/header.css";

export default function Navbar() {
  const [usuario, setUsuario] = useState(null);

  useEffect(() => {
    const cargarUsuario = () => {
      const usuarioGuardado = JSON.parse(localStorage.getItem("usuarioLogueado"));
      setUsuario(usuarioGuardado || null);
    };

    cargarUsuario(); // carga inicial
    window.addEventListener("usuarioActualizado", cargarUsuario);
    window.addEventListener("storage", cargarUsuario);

    return () => {
      window.removeEventListener("usuarioActualizado", cargarUsuario);
      window.removeEventListener("storage", cargarUsuario);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("usuarioLogueado");
    localStorage.removeItem("carrito");
    setUsuario(null);
    window.location.href = "/";
  };

  // ✅ Botón que se muestra solo a Admin o Vendedor
  const renderBotonAdmin = () => {
    if (!usuario) return null;
    if (usuario.tipo === "Administrador") {
      return (
        <a href="/admin" className="btn btn-outline-light fw-bold">
          Panel de Administración
        </a>
      );
    } else if (usuario.tipo === "Vendedor") {
      return (
        <a href="/admin/productos" className="btn btn-outline-light fw-bold">
          Panel de Vendedor
        </a>
      );
    }
    return null;
  };

  return (
    <header>
      <nav className="navbar navbar-expand-lg">
        <div className="container-fluid d-flex justify-content-between align-items-center px-4">
          {/* Título */}
          <div className="navbar-title">CoffeeShop</div>

          {/* Enlaces principales */}
          <div className="navbar-links d-none d-lg-flex gap-3">
            <a href="/">Inicio</a>
            <a href="/productos">Productos</a>
            <a href="/contacto">Contacto</a>
            <a href="/blogs">Blogs</a>
            <a href="/nosotros">Nosotros</a>
            <a href="/carrito">🛒 Carrito</a>
          </div>

          {/* Zona derecha */}
          <div className="navbar-auth d-flex gap-3 align-items-center">
            {usuario ? (
              <>
                {renderBotonAdmin()}
                <span style={{ color: "#fff", fontWeight: "bold" }}>
                  Bienvenido, {usuario.nombre}
                </span>
                <button
                  onClick={handleLogout}
                  className="btn btn-warning fw-bold text-dark"
                >
                  Cerrar sesión
                </button>
              </>
            ) : (
              <>
                <a href="/registro" className="btn btn-warning fw-bold text-dark">
                  Registro
                </a>
                <a href="/login" className="btn btn-warning fw-bold text-dark">
                  Login
                </a>
              </>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
}

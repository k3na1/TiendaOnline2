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

    // escucha cambios manuales
    window.addEventListener("usuarioActualizado", cargarUsuario);
    window.addEventListener("storage", cargarUsuario); // por si cambia desde otra pestaña

    return () => {
        window.removeEventListener("usuarioActualizado", cargarUsuario);
        window.removeEventListener("storage", cargarUsuario);
    };
  }, []);


  const handleLogout = () => {
    localStorage.removeItem("usuarioLogueado");
    localStorage.removeItem("carrito"); // opcional: limpia el carrito al salir
    setUsuario(null);
    window.location.href = "/"; // redirigir al inicio
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

          {/* Zona derecha: Registro/Login o Usuario activo */}
          <div className="navbar-auth d-flex gap-3 align-items-center">
            {usuario ? (
              <>
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

import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom"; // <--- Usamos Link y useNavigate
import "../assets/styles/header.css";

export default function Navbar() {
  const [usuario, setUsuario] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const cargarUsuario = () => {
      const usuarioGuardado = JSON.parse(localStorage.getItem("usuarioLogueado"));
      setUsuario(usuarioGuardado || null);
    };

    cargarUsuario();
    // Escuchamos el evento personalizado que creamos en el Login
    window.addEventListener("usuarioActualizado", cargarUsuario);
    
    return () => {
      window.removeEventListener("usuarioActualizado", cargarUsuario);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("usuarioLogueado");
    localStorage.removeItem("carrito");
    setUsuario(null);
    navigate("/"); // Usamos navigate en lugar de window.location para no recargar
  };

  // ✅ Lógica corregida: Normalizamos a minúsculas para comparar
  const renderBotonAdmin = () => {
    if (!usuario || !usuario.tipo) return null;

    const rol = usuario.tipo.toLowerCase(); // Convertimos a minúscula (Admin -> admin)

    // Aceptamos "administrador" (hardcode) y "admin" (base de datos)
    if (rol === "administrador" || rol === "admin") {
      return (
        <Link to="/admin" className="btn btn-outline-light fw-bold">
          Panel de Administración
        </Link>
      );
    } 
    
    // Aceptamos "vendedor"
    if (rol === "vendedor") {
      return (
        <Link to="/admin/productos" className="btn btn-outline-light fw-bold">
          Panel de Vendedor
        </Link>
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

          {/* Enlaces principales (Usando Link para no recargar página) */}
          <div className="navbar-links d-none d-lg-flex gap-3">
            <Link to="/">Inicio</Link>
            <Link to="/productos">Productos</Link>
            <Link to="/contacto">Contacto</Link>
            <Link to="/blogs">Blogs</Link>
            <Link to="/nosotros">Nosotros</Link>
            <Link to="/carrito">🛒 Carrito</Link>
          </div>

          {/* Zona derecha (Usuario) */}
          <div className="navbar-auth d-flex gap-3 align-items-center">
            {usuario ? (
              <>
                {renderBotonAdmin()}
                <span style={{ color: "#fff", fontWeight: "bold" }}>
                  Hola, {usuario.nombre}
                </span>
                <button
                  onClick={handleLogout}
                  className="btn btn-warning fw-bold text-dark"
                >
                  Salir
                </button>
              </>
            ) : (
              <>
                <Link to="/registro" className="btn btn-warning fw-bold text-dark">
                  Registro
                </Link>
                <Link to="/login" className="btn btn-warning fw-bold text-dark">
                  Login
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
}
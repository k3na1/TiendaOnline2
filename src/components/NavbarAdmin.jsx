import "../assets/styles/admin.css";
import { Link, useNavigate, useLocation } from "react-router-dom"; // <--- Importar Link
import { useEffect, useState } from "react";

export default function NavbarAdmin() {
  const navigate = useNavigate();
  const location = useLocation();
  const [usuario, setUsuario] = useState(null);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("usuarioLogueado"));
    if (!user) {
      navigate("/login");
      return;
    }
    setUsuario(user);
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("usuarioLogueado");
    navigate("/login");
  };

  const seccionesBase = [
    { nombre: "Perfil", ruta: "/admin/perfil" },
    { nombre: "Dashboard", ruta: "/admin" },
    { nombre: "Usuarios", ruta: "/admin/usuarios" },
    { nombre: "Productos", ruta: "/admin/productos" },
    { nombre: "Categorías", ruta: "/admin/categorias" },
    { nombre: "Boletas", ruta: "/admin/boletas" },
  ];

  // 🔹 Filtrado robusto (Mayúsculas/Minúsculas)
  const seccionesFiltradas = seccionesBase.filter((sec) => {
    if (!usuario || !usuario.tipo) return false;

    const rol = usuario.tipo.toLowerCase(); // Normalizar a minúscula

    // 👑 Admin ve todo (acepta "admin" y "administrador")
    if (rol === "administrador" || rol === "admin") return true;

    // 🛒 Vendedor ve solo productos/boletas/categorías
    if (rol === "vendedor")
      return ["Productos", "Boletas", "Categorías", "Perfil"].includes(sec.nombre);

    return false;
  });

  const esRutaActiva = (ruta) => location.pathname === ruta;

  return (
    <aside className="navbar-admin-left d-flex flex-column align-items-start p-4">
      <h4 className="fw-bold mb-4 text-light">CoffeeStore</h4>

      {usuario && (
        <p className="text-light mb-3">
          Rol: <span className="fw-bold text-warning" style={{textTransform: 'capitalize'}}>{usuario.tipo}</span>
        </p>
      )}

      <nav className="d-flex flex-column w-100 gap-2">
        {seccionesFiltradas.map((sec) => (
          <Link
            key={sec.ruta}
            to={sec.ruta} // Usamos 'to' en vez de 'href'
            className={`admin-link ${esRutaActiva(sec.ruta) ? "active" : ""}`}
          >
            {sec.nombre}
          </Link>
        ))}
      </nav>

      <hr className="border-secondary w-100 my-4" />

      <button
        onClick={() => navigate("/")}
        className="btn-tienda btn btn-warning fw-bold text-dark w-100 mb-2"
      >
        Volver a la tienda
      </button>

      <button
        onClick={handleLogout}
        className="btn btn-outline-light fw-bold w-100"
      >
        Cerrar sesión
      </button>
    </aside>
  );
}
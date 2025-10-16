import "../assets/styles/admin.css";
import { useNavigate, useLocation } from "react-router-dom";

export default function NavbarAdmin() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem("usuarioLogueado");
    navigate("/login");
  };

  const esRutaActiva = (ruta) => location.pathname === ruta;

  return (
    <aside className="navbar-admin-left d-flex flex-column align-items-start p-4">
      <h4 className="fw-bold mb-4 text-light">CoffeeStore</h4>

      <nav className="d-flex flex-column w-100 gap-2">
        <a
          href="/admin"
          className={`admin-link ${esRutaActiva("/admin") ? "active" : ""}`}
        >
          Dashboard
        </a>
        <a
          href="/admin/usuarios"
          className={`admin-link ${esRutaActiva("/admin/usuarios") ? "active" : ""}`}
        >
          Usuarios
        </a>
        <a
          href="/admin/productos"
          className={`admin-link ${esRutaActiva("/admin/productos") ? "active" : ""}`}
        >
          Productos
        </a>
      </nav>

      <hr className="border-secondary w-100 my-4" />

      <button
        onClick={handleLogout}
        className="btn btn-outline-light fw-bold w-100"
      >
        Cerrar sesión
      </button>
    </aside>
  );
}

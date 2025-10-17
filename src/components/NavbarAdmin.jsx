import "../assets/styles/admin.css";
import { useNavigate, useLocation } from "react-router-dom";

export default function NavbarAdmin() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem("usuarioLogueado");
    navigate("/login");
  };

  // 🔹 Lista de secciones del panel
  const secciones = [
    { nombre: "Dashboard", ruta: "/admin" },
    { nombre: "Usuarios", ruta: "/admin/usuarios" },
    { nombre: "Productos", ruta: "/admin/productos" },
    // 👇 si luego agregas más, simplemente añade aquí:
    // { nombre: "Pedidos", ruta: "/admin/pedidos" },
    // { nombre: "Reportes", ruta: "/admin/reportes" },
  ];

  const esRutaActiva = (ruta) => location.pathname === ruta;

  return (
    <aside className="navbar-admin-left d-flex flex-column align-items-start p-4">
      <h4 className="fw-bold mb-4 text-light">CoffeeStore</h4>

      <nav className="d-flex flex-column w-100 gap-2">
        {secciones.map((sec) => (
          <a
            key={sec.ruta}
            href={sec.ruta}
            className={`admin-link ${esRutaActiva(sec.ruta) ? "active" : ""}`}
          >
            {sec.nombre}
          </a>
        ))}
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

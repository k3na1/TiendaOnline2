import "../assets/styles/admin.css";
import { useNavigate, useLocation } from "react-router-dom";
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

  // 🔹 Determinar secciones visibles según rol
  const seccionesBase = [
    { nombre: "Dashboard", ruta: "/admin" },
    { nombre: "Usuarios", ruta: "/admin/usuarios" },
    { nombre: "Productos", ruta: "/admin/productos" },
    { nombre: "Boletas", ruta: "/admin/boletas" },
  ];

  const seccionesFiltradas = seccionesBase.filter((sec) => {
    if (!usuario) return false;

    // 👑 El Administrador ve todo
    if (usuario.tipo === "Administrador") return true;

    // 🛒 El Vendedor solo ve Productos y Boletas
    if (usuario.tipo === "Vendedor")
      return ["Productos", "Boletas"].includes(sec.nombre);

    // 🚫 Cualquier otro rol no ve nada
    return false;
  });

  const esRutaActiva = (ruta) => location.pathname === ruta;

  return (
    <aside className="navbar-admin-left d-flex flex-column align-items-start p-4">
      <h4 className="fw-bold mb-4 text-light">CoffeeStore</h4>

      {usuario && (
        <p className="text-light mb-3">
          Rol: <span className="fw-bold">{usuario.tipo}</span>
        </p>
      )}

      <nav className="d-flex flex-column w-100 gap-2">
        {seccionesFiltradas.map((sec) => (
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

      {/* 🔙 Nuevo botón: Volver a la tienda */}
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

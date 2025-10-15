import { useState } from "react";
import "../assets/styles/admin.css";
import { useNavigate } from "react-router-dom";

export default function NavbarAdmin() {
  const navigate = useNavigate();
  const [abierto, setAbierto] = useState(true);

  const handleLogout = () => {
    localStorage.removeItem("usuarioLogueado");
    navigate("/login");
  };

  const toggleMenu = () => setAbierto(!abierto);

  return (
    <>
      {/* Botón hamburguesa */}
      <button className="admin-toggle-btn" onClick={toggleMenu}>
        ☰
      </button>

      <aside className={`navbar-admin-right ${abierto ? "open" : "closed"}`}>
        <h4 className="fw-bold mb-4 text-light">CoffeeStore</h4>
        <nav className="d-flex flex-column w-100 gap-2">
          <a href="/admin" className="admin-link active">
            Dashboard
          </a>
          <a href="/admin/usuarios" className="admin-link">
            Usuarios
          </a>
          <a href="/admin/productos" className="admin-link">
            Productos
          </a>
        </nav>

        <hr className="border-secondary w-100 my-4" />

        <button onClick={handleLogout} className="btn btn-warning fw-bold w-100">
          Cerrar sesión
        </button>
      </aside>
    </>
  );
}

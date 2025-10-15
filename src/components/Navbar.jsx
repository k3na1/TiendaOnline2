import { useEffect, useState } from "react";
import "../assets/styles/header.css";

export default function Navbar() {
    const [usuario, setUsuario] = useState(null);

    useEffect(() => {
        const usuarioLogueado = JSON.parse(localStorage.getItem("usuario"));
        if (usuarioLogueado) {
            setUsuario(usuarioLogueado);
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("usuarioLogueado");
        window.location.href = "/"; // Redirigir a la página de login
    }

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

            {/* Login / Registro o Usuario */}
            <div className="navbar-auth d-flex gap-3">
                {usuario ? (
                <>
                    <span style={{ color: "#fff", fontWeight: "bold" }}>
                    Bienvenido, {usuario.nombre}
                    </span>
                    <button
                    onClick={handleLogout}
                    className="btn btn-warning fw-bold"
                    >
                    Cerrar sesión
                    </button>
                </>
                ) : (
                <>
                    <a href="/registro" className="btn btn-warning fw-bold">
                    Registro
                    </a>
                    <a href="/login" className="btn btn-warning fw-bold">
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

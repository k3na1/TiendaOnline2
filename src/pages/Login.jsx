import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../assets/styles/registro.css"; // mismo estilo del registro

export default function Login() {
  const navigate = useNavigate();

  // Usuarios base (hardcodeados)
  const usuariosBase = [
    {
      run: "19011022K",
      nombre: "Juan",
      apellidos: "Pérez",
      correo: "admin@duoc.cl",
      tipo: "Administrador",
      password: "1234",
    },
    {
      run: "20011033L",
      nombre: "María",
      apellidos: "González",
      correo: "vendedor@gmail.com",
      tipo: "Vendedor",
      password: "1234",
    },
    {
      run: "21022044M",
      nombre: "Carlos",
      apellidos: "Ramírez",
      correo: "cliente@gmail.com",
      tipo: "Cliente",
      password: "1234",
    },
  ];

  const [form, setForm] = useState({ correo: "", password: "" });
  const [errores, setErrores] = useState({});

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validar = () => {
    const err = {};
    if (form.correo.trim() === "") err.correo = "El correo es obligatorio";
    if (form.password.trim() === "")
      err.password = "La contraseña es obligatoria";
    setErrores(err);
    return Object.keys(err).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validar()) return;

    // Usuarios almacenados en localStorage
    const usuariosRegistrados =
      JSON.parse(localStorage.getItem("usuarios")) || [];

    // Unir base + registrados
    const usuariosTotales = [...usuariosBase, ...usuariosRegistrados];

    // Buscar coincidencia
    const usuario = usuariosTotales.find(
      (u) =>
        u.correo.toLowerCase() === form.correo.toLowerCase() &&
        u.password === form.password
    );

    if (!usuario) {
      alert("Correo o contraseña incorrectos ❌");
      return;
    }

    // Guardar sesión
    localStorage.setItem("usuarioLogueado", JSON.stringify(usuario));

    window.dispatchEvent(new Event("usuarioActualizado"));

    alert(`Bienvenido ${usuario.nombre} 👋 (Rol: ${usuario.tipo})`);

    // Redirección según rol
    if (usuario.tipo === "Administrador") {
      navigate("/admin");
    } else if (usuario.tipo === "Vendedor") {
      navigate("/admin/productos");
    } else {
      navigate("/");
    }
  };

  return (
    <main className="container my-5">
      <h1 className="text-center mb-4 fw-bold text-coffee">
        Inicio de Sesión
      </h1>

      <form
        onSubmit={handleSubmit}
        className="mx-auto bg-light p-4 rounded-3 shadow-sm"
        style={{ maxWidth: "500px" }}
      >
        {/* Correo */}
        <div className="mb-3">
          <label htmlFor="correo" className="form-label fw-bold">
            Correo:
          </label>
          <input
            type="email"
            id="correo"
            name="correo"
            value={form.correo}
            onChange={handleChange}
            className="form-control"
          />
          <small className="text-danger">{errores.correo}</small>
        </div>

        {/* Contraseña */}
        <div className="mb-3">
          <label htmlFor="password" className="form-label fw-bold">
            Contraseña:
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            className="form-control"
          />
          <small className="text-danger">{errores.password}</small>
        </div>

        {/* Botón */}
        <div className="text-center">
          <button
            type="submit"
            className="btn btn-warning fw-bold text-dark px-4"
          >
            Ingresar
          </button>
        </div>

        {/* Enlace de registro */}
        <div className="text-center mt-3">
          <p>
            ¿No tienes cuenta?{" "}
            <a href="/registro" className="text-decoration-none text-coffee">
              Regístrate aquí
            </a>
          </p>
        </div>
      </form>
    </main>
  );
}

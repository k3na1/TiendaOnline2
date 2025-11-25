import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios"; // <--- Importamos Axios
import "../assets/styles/registro.css";

export default function Login() {
  const navigate = useNavigate();

  const API_URL = import.meta.env.VITE_BACKEND_URL;

  // 1. TUS USUARIOS FIJOS (HARDCODED) - Siempre funcionarán
  const usuariosBase = [
    {
      id: 99999, // ID falso para diferenciarlos
      run: "19011022K",
      nombre: "Juan",
      apellidos: "Pérez",
      correo: "admin@duoc.cl",
      tipo: "Admin",
      password: "1234",
    },
    {
      id: 88888,
      run: "20011033L",
      nombre: "María",
      apellidos: "González",
      correo: "vendedor@gmail.com",
      tipo: "Vendedor",
      password: "1234",
    },
    {
      id: 77777,
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
    if (form.password.trim() === "") err.password = "La contraseña es obligatoria";
    setErrores(err);
    return Object.keys(err).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validar()) return;

    try {
      // ---------------------------------------------------------
      // INTENTO 1: LOGIN REAL (Backend con Token)
      // ---------------------------------------------------------
      const respuesta = await axios.post(API_URL + "/api/users/login", {
        correo: form.correo,
        password: form.password
      });

      // Si el backend responde 200 OK, extraemos el token y el usuario
      const { token, usuario } = respuesta.data;

      // 1. GUARDAMOS EL TOKEN (¡Vital para que funcione la seguridad!)
      localStorage.setItem("token", token);

      // 2. Guardamos datos del usuario para el Navbar
      // (Normalizamos la primera letra del rol a Mayúscula: "admin" -> "Admin")
      usuario.tipo = usuario.tipo.charAt(0).toUpperCase() + usuario.tipo.slice(1);
      localStorage.setItem("usuarioLogueado", JSON.stringify(usuario));
      
      // 3. Notificamos al resto de la app
      window.dispatchEvent(new Event("usuarioActualizado"));

      alert(`Bienvenido ${usuario.nombre} 👋`);
      redirigir(usuario);

    } catch (error) {
      console.error("Login backend falló:", error);

      // ---------------------------------------------------------
      // INTENTO 2: FALLBACK (Usuarios Hardcodeados)
      // ---------------------------------------------------------
      // Si el servidor falla o no encuentra el usuario, buscamos en tu lista local 'usuariosBase'
      const usuarioLocal = usuariosBase.find(
        (u) => u.correo === form.correo && u.password === form.password
      );

      if (usuarioLocal) {
        alert(`Entrando en Modo Local como ${usuarioLocal.nombre} (Sin Token de servidor)`);
        
        // Guardamos al usuario local, pero OJO: No guardamos Token porque no tenemos uno real.
        // Podrás ver el panel, pero si intentas guardar cosas en la BD te dará error.
        localStorage.setItem("usuarioLogueado", JSON.stringify(usuarioLocal));
        window.dispatchEvent(new Event("usuarioActualizado"));
        
        redirigir(usuarioLocal);
      } else {
        // Si no está en el backend ni en los locales
        alert("Correo o contraseña incorrectos ❌");
      }
    }
  };

  // Función auxiliar para no repetir los 'if' de redirección
  const redirigir = (usuario) => {
    const rol = usuario.tipo.toLowerCase();
    if (rol === "administrador" || rol === "admin") {
      navigate("/admin");
    } else if (rol === "vendedor") {
      navigate("/admin/productos");
    } else {
      navigate("/");
    }
  };

  return (
    <main className="container my-5">
        {/* ... (TU JSX SE MANTIENE IGUAL) ... */}
        {/* Solo copio el form para referencia, usa el tuyo completo */}
        <h1 className="text-center mb-4 fw-bold text-coffee">Inicio de Sesión</h1>
        <form onSubmit={handleSubmit} className="mx-auto bg-light p-4 rounded-3 shadow-sm" style={{ maxWidth: "500px" }}>
            <div className="mb-3">
            <label htmlFor="correo" className="form-label fw-bold">Correo:</label>
            <input type="email" id="correo" name="correo" value={form.correo} onChange={handleChange} className="form-control" />
            <small className="text-danger">{errores.correo}</small>
            </div>
            <div className="mb-3">
            <label htmlFor="password" className="form-label fw-bold">Contraseña:</label>
            <input type="password" id="password" name="password" value={form.password} onChange={handleChange} className="form-control" />
            <small className="text-danger">{errores.password}</small>
            </div>
            <div className="text-center">
            <button type="submit" className="btn btn-warning fw-bold text-dark px-4">Ingresar</button>
            </div>
            <div className="text-center mt-3">
            <p>¿No tienes cuenta? <a href="/registro" className="text-decoration-none text-coffee">Regístrate aquí</a></p>
            </div>
        </form>
    </main>
  );
}
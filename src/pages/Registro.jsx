import { useState } from "react";
import "../assets/styles/registro.css";

export default function Registro() {
  const [form, setForm] = useState({
    run: "",
    nombre: "",
    apellidos: "",
    correo: "",
    fecha: "",
    direccion: "",
    region: "",
    comuna: "",
    password: "",
  });

  const [errores, setErrores] = useState({});
  const [comunas, setComunas] = useState([]);

  const regiones = {
    Metropolitana: ["Santiago", "Puente Alto", "Maipú"],
    Valparaíso: ["Valparaíso", "Viña del Mar", "Quilpué"],
    Biobío: ["Concepción", "Talcahuano", "Los Ángeles"],
  };

  // Manejo de cambios
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });

    if (e.target.name === "region") {
      setComunas(regiones[e.target.value] || []);
      setForm({ ...form, region: e.target.value, comuna: "" });
    }
  };

  // Obtener usuarios guardados
  const getUsuarios = () => JSON.parse(localStorage.getItem("usuarios")) || [];

  // Guardar nuevo usuario
  const saveUsuario = (usuario) => {
    let usuarios = getUsuarios();

    // RUN duplicado
    if (usuarios.some((u) => u.run === usuario.run)) {
      alert("El RUN ya está registrado ❌");
      return false;
    }

    usuarios.push(usuario);
    localStorage.setItem("usuarios", JSON.stringify(usuarios));
    return true;
  };

  // Validaciones
  const validar = () => {
    const err = {};
    const emailRegex = /^[a-zA-Z0-9._%+-]+@(duoc\.cl|profesor\.duoc\.cl|gmail\.com)$/;

    if (!/^[0-9]{7,8}[0-9Kk]$/.test(form.run))
      err.run = "RUN inválido (sin puntos ni guion, ej: 19011022K)";

    if (!form.nombre || form.nombre.length > 50)
      err.nombre = "El nombre es obligatorio (máx. 50 caracteres)";

    if (!form.apellidos || form.apellidos.length > 100)
      err.apellidos = "Los apellidos son obligatorios (máx. 100 caracteres)";

    if (!emailRegex.test(form.correo))
      err.correo = "Correo inválido (solo @duoc.cl, @profesor.duoc.cl o @gmail.com)";

    if (!form.direccion || form.direccion.length > 300)
      err.direccion = "La dirección es obligatoria (máx. 300 caracteres)";

    if (!form.region) err.region = "Debe seleccionar una región";
    if (!form.comuna) err.comuna = "Debe seleccionar una comuna";

    if (form.password.length < 4 || form.password.length > 10)
      err.password = "La contraseña debe tener entre 4 y 10 caracteres";

    setErrores(err);
    return Object.keys(err).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validar()) return;

    const nuevoUsuario = { ...form, tipo: "Cliente" };
    if (saveUsuario(nuevoUsuario)) {
      alert("Registro exitoso ✅");
      setForm({
        run: "",
        nombre: "",
        apellidos: "",
        correo: "",
        fecha: "",
        direccion: "",
        region: "",
        comuna: "",
        password: "",
      });
      setErrores({});
    }
  };

  return (
    <main className="container my-5">
      <h1 className="text-center mb-4 fw-bold text-coffee">Registro de Usuario</h1>

      <form
        onSubmit={handleSubmit}
        className="mx-auto bg-light p-4 rounded-3 shadow-sm"
        style={{ maxWidth: "700px" }}
      >
        {/* RUN */}
        <div className="mb-3">
          <label htmlFor="run" className="form-label fw-bold">RUN:</label>
          <input
            type="text"
            id="run"
            name="run"
            value={form.run}
            onChange={handleChange}
            className="form-control"
          />
          <small className="text-danger">{errores.run}</small>
        </div>

        {/* Nombre */}
        <div className="mb-3">
          <label htmlFor="nombre" className="form-label fw-bold">Nombre:</label>
          <input
            type="text"
            id="nombre"
            name="nombre"
            value={form.nombre}
            onChange={handleChange}
            className="form-control"
          />
          <small className="text-danger">{errores.nombre}</small>
        </div>

        {/* Apellidos */}
        <div className="mb-3">
          <label htmlFor="apellidos" className="form-label fw-bold">Apellidos:</label>
          <input
            type="text"
            id="apellidos"
            name="apellidos"
            value={form.apellidos}
            onChange={handleChange}
            className="form-control"
          />
          <small className="text-danger">{errores.apellidos}</small>
        </div>

        {/* Correo */}
        <div className="mb-3">
          <label htmlFor="correo" className="form-label fw-bold">Correo:</label>
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

        {/* Fecha */}
        <div className="mb-3">
          <label htmlFor="fecha" className="form-label fw-bold">Fecha de nacimiento:</label>
          <input
            type="date"
            id="fecha"
            name="fecha"
            value={form.fecha}
            onChange={handleChange}
            className="form-control"
          />
        </div>

        {/* Dirección */}
        <div className="mb-3">
          <label htmlFor="direccion" className="form-label fw-bold">Dirección:</label>
          <input
            type="text"
            id="direccion"
            name="direccion"
            value={form.direccion}
            onChange={handleChange}
            className="form-control"
          />
          <small className="text-danger">{errores.direccion}</small>
        </div>

        {/* Región y Comuna */}
        <div className="row">
          <div className="col-md-6 mb-3">
            <label htmlFor="region" className="form-label fw-bold">Región:</label>
            <select
              id="region"
              name="region"
              value={form.region}
              onChange={handleChange}
              className="form-select"
            >
              <option value="">Seleccione región</option>
              {Object.keys(regiones).map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
            <small className="text-danger">{errores.region}</small>
          </div>

          <div className="col-md-6 mb-3">
            <label htmlFor="comuna" className="form-label fw-bold">Comuna:</label>
            <select
              id="comuna"
              name="comuna"
              value={form.comuna}
              onChange={handleChange}
              className="form-select"
            >
              <option value="">Seleccione comuna</option>
              {comunas.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
            <small className="text-danger">{errores.comuna}</small>
          </div>
        </div>

        {/* Contraseña */}
        <div className="mb-3">
          <label htmlFor="password" className="form-label fw-bold">Contraseña:</label>
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
          <button type="submit" className="btn btn-warning fw-bold text-dark">
            Registrarse
          </button>
        </div>
      </form>
    </main>
  );
}

import { useState, useEffect } from "react";
import axios from "axios"; // <--- Importar Axios
import "../../assets/styles/dashboard.css";

export default function AdminUsuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [filtro, setFiltro] = useState("");
  const [modalAbierto, setModalAbierto] = useState(false);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [loading, setLoading] = useState(true);

  const API_URL = import.meta.env.VITE_BACKEND_URL;

  // Estado del formulario
  const [usuarioActual, setUsuarioActual] = useState({
    id: null, // Necesitamos el ID para editar en BD
    run: "",
    tipo: "",
    nombre: "",
    apellidos: "",
    correo: "",
    password: "",
  });

  // 1. Cargar Usuarios
  const cargarUsuarios = async () => {
    try {
      setLoading(true);
      const response = await axios.get(API_URL + "/api/users");
      setUsuarios(response.data);
    } catch (error) {
      console.error(error);
      alert("Error cargando usuarios");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarUsuarios();
  }, []);

  // 2. Modal Nuevo
  const abrirModalNuevo = () => {
    setModoEdicion(false);
    setUsuarioActual({
      id: null,
      run: "",
      tipo: "Cliente", // Por defecto
      nombre: "",
      apellidos: "",
      correo: "",
      password: "",
    });
    setModalAbierto(true);
  };

  // 3. Modal Editar
  const abrirModalEditar = (user) => {
    setModoEdicion(true);
    setUsuarioActual({
      id: user.id, // Guardamos ID
      run: user.run,
      tipo: user.tipo, // Admin, Cliente, etc.
      nombre: user.nombre,
      apellidos: user.apellidos,
      correo: user.correo,
      password: user.password || "", // A veces no traemos la pass por seguridad
    });
    setModalAbierto(true);
  };

  // 4. Eliminar
  const eliminarUsuario = async (id) => {
    if (confirm("¿Eliminar este usuario de la base de datos?")) {
      try {
        await axios.delete(`${API_URL}/api/users/${id}`);
        cargarUsuarios();
        alert("Usuario eliminado");
      } catch (error) {
        alert("Error al eliminar usuario");
      }
    }
  };

  // 5. Guardar (Crear o Editar)
  const guardarUsuario = async (e) => {
    e.preventDefault();
    
    try {
      if (modoEdicion) {
        // ACTUALIZAR
        // Usamos el endpoint normal para datos básicos
        await axios.put(`${API_URL}/api/users/${usuarioActual.id}`, usuarioActual);
        
        // TRUCO: Si cambiaste el rol, necesitamos llamar al endpoint especial que creamos ayer
        // (Si decidiste usar la "Opción 1" de desarrollo donde updateUser acepta 'tipo', esto ya funciona solo.
        // Si usaste la "Opción 2" segura, descomenta la siguiente línea):
        
        await axios.put(`${API_URL}/api/users/${usuarioActual.id}/role`, { tipo: usuarioActual.tipo });

        alert("Usuario actualizado");
      } else {
        // CREAR
        await axios.post(API_URL + "/api/users", usuarioActual);
        alert("Usuario creado");
      }
      setModalAbierto(false);
      cargarUsuarios();
    } catch (error) {
      console.error(error);
      alert("Error al guardar usuario. Revisa que el RUN/Correo no estén repetidos.");
    }
  };

  // Filtros visuales (Frontend)
  const filtrados = usuarios.filter((u) => {
    const texto = (u.run + " " + u.nombre + " " + u.correo).toLowerCase();
    const coincideBusqueda = texto.includes(busqueda.toLowerCase());
    // Normalizamos mayúsculas/minúsculas para el filtro de tipo
    const tipoUser = u.tipo ? u.tipo.toLowerCase() : "";
    const filtroLower = filtro.toLowerCase();
    const coincideTipo = filtro ? tipoUser === filtroLower : true;
    
    return coincideBusqueda && coincideTipo;
  });

  // Contadores (Ajustados a minúsculas/mayúsculas por seguridad)
  const total = usuarios.length;
  const vendedores = usuarios.filter((u) => u.tipo && u.tipo.toLowerCase() === "vendedor").length;
  const clientes = usuarios.filter((u) => u.tipo && u.tipo.toLowerCase() === "cliente").length;
  const admins = usuarios.filter((u) => u.tipo && u.tipo.toLowerCase() === "administrador").length || 
                  usuarios.filter((u) => u.tipo && u.tipo.toLowerCase() === "admin").length;

  return (
    <div className="admin-dashboard">
      <h1 className="mb-4 fw-bold text-light">Gestión de Usuarios</h1>

      {/* Resumen */}
      <section className="summary">
        <div className="pill">Totales: <strong>{total}</strong></div>
        <div className="pill">Administradores: <strong>{admins}</strong></div>
        <div className="pill">Vendedores: <strong>{vendedores}</strong></div>
        <div className="pill">Clientes: <strong>{clientes}</strong></div>
      </section>

      {/* Acciones */}
      <section className="actions">
        <button className="btn-primary" onClick={abrirModalNuevo}>
          + Nuevo usuario
        </button>
        <input
          type="search"
          placeholder="Buscar por RUN, nombre o correo..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
        />
        <select value={filtro} onChange={(e) => setFiltro(e.target.value)}>
          <option value="">Todos los tipos</option>
          <option value="Administrador">Administrador</option>
          <option value="Vendedor">Vendedor</option>
          <option value="Cliente">Cliente</option>
        </select>
      </section>

      {/* Tabla */}
      <section className="panel">
        <h2 className="panel-title">Base de Datos</h2>
        {loading ? <p className="text-center">Cargando...</p> : (
        <table className="tabla">
          <thead>
            <tr>
              <th>ID</th>
              <th>RUN</th>
              <th>Nombre</th>
              <th>Correo</th>
              <th>Tipo</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filtrados.length === 0 ? (
              <tr><td colSpan="6">Sin resultados</td></tr>
            ) : (
              filtrados.map((u) => (
                <tr key={u.id}>
                  <td>{u.id}</td>
                  <td>{u.run}</td>
                  <td>{u.nombre} {u.apellidos}</td>
                  <td>{u.correo}</td>
                  <td>
                    <span className={`badge ${u.tipo === 'admin' ? 'bg-danger' : 'bg-secondary'}`}>
                        {u.tipo}
                    </span>
                  </td>
                  <td>
                    <button className="btn-primary" onClick={() => abrirModalEditar(u)}>Editar</button>
                    <button className="btn-danger" onClick={() => eliminarUsuario(u.id)}>Eliminar</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        )}
      </section>

      {/* Modal */}
      {modalAbierto && (
        <div className="modal">
          <form className="forms" onSubmit={guardarUsuario}>
            <h3>{modoEdicion ? "Editar usuario" : "Nuevo usuario"}</h3>

            <label>RUN
              <input
                type="number" // Cambiamos a number para evitar problemas con BD INT
                value={usuarioActual.run}
                onChange={(e) => setUsuarioActual({ ...usuarioActual, run: e.target.value })}
                required
                disabled={modoEdicion} // No se suele editar el RUN
              />
            </label>

            <label>Tipo
              <select
                value={usuarioActual.tipo}
                onChange={(e) => setUsuarioActual({ ...usuarioActual, tipo: e.target.value })}
                required
              >
                <option value="">Seleccione...</option>
                <option value="admin">Administrador</option>
                <option value="vendedor">Vendedor</option>
                <option value="cliente">Cliente</option>
              </select>
            </label>

            <label>Nombre
              <input
                type="text"
                value={usuarioActual.nombre}
                onChange={(e) => setUsuarioActual({ ...usuarioActual, nombre: e.target.value })}
                required
              />
            </label>

            <label>Apellidos
              <input
                type="text"
                value={usuarioActual.apellidos}
                onChange={(e) => setUsuarioActual({ ...usuarioActual, apellidos: e.target.value })}
                required
              />
            </label>

            <label>Correo
              <input
                type="email"
                value={usuarioActual.correo}
                onChange={(e) => setUsuarioActual({ ...usuarioActual, correo: e.target.value })}
                required
              />
            </label>

            <label>Password
              <input
                type="password"
                placeholder={modoEdicion ? "(Dejar en blanco para no cambiar)" : "Contraseña"}
                value={usuarioActual.password}
                onChange={(e) => setUsuarioActual({ ...usuarioActual, password: e.target.value })}
                required={!modoEdicion}
              />
            </label>

            <div className="form-actions">
              <button type="submit" className="btn-primary">Guardar</button>
              <button type="button" onClick={() => setModalAbierto(false)}>Cancelar</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
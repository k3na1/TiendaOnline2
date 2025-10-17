import { useState, useEffect } from "react";
import "../../assets/styles/dashboard.css";


export default function AdminUsuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [filtro, setFiltro] = useState("");
  const [modalAbierto, setModalAbierto] = useState(false);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [usuarioActual, setUsuarioActual] = useState({
    run: "",
    tipo: "",
    nombre: "",
    apellidos: "",
    correo: "",
    password: "",
  });

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("usuarios")) || [];
    setUsuarios(data);
  }, []);

  const guardarUsuarios = (arr) => {
    localStorage.setItem("usuarios", JSON.stringify(arr));
    setUsuarios(arr);
  };

  const abrirModalNuevo = () => {
    setModoEdicion(false);
    setUsuarioActual({
      run: "",
      tipo: "",
      nombre: "",
      apellidos: "",
      correo: "",
      password: "",
    });
    setModalAbierto(true);
  };

  const abrirModalEditar = (user) => {
    setModoEdicion(true);
    setUsuarioActual(user);
    setModalAbierto(true);
  };

  const eliminarUsuario = (run) => {
    if (confirm("¿Eliminar este usuario?")) {
      const nuevos = usuarios.filter((u) => u.run !== run);
      guardarUsuarios(nuevos);
    }
  };

  const guardarUsuario = (e) => {
    e.preventDefault();
    const nuevos = [...usuarios];
    if (modoEdicion) {
      const idx = nuevos.findIndex((u) => u.run === usuarioActual.run);
      if (idx >= 0) nuevos[idx] = usuarioActual;
    } else {
      nuevos.push(usuarioActual);
    }
    guardarUsuarios(nuevos);
    setModalAbierto(false);
  };

  const filtrados = usuarios.filter((u) => {
    const coincideBusqueda =
      u.run.includes(busqueda) ||
      u.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      u.correo.toLowerCase().includes(busqueda.toLowerCase());
    const coincideTipo = filtro ? u.tipo === filtro : true;
    return coincideBusqueda && coincideTipo;
  });

  const total = usuarios.length;
  const vendedores = usuarios.filter((u) => u.tipo === "Vendedor").length;
  const clientes = usuarios.filter((u) => u.tipo === "Cliente").length;
  const admins = usuarios.filter((u) => u.tipo === "Administrador").length;

  return (
    <div className="admin-dashboard">
      <h1 className="mb-4 fw-bold text-light">Usuarios</h1>

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
          <option>Administrador</option>
          <option>Vendedor</option>
          <option>Cliente</option>
        </select>
      </section>

      {/* Tabla */}
      <section className="panel">
        <h2 className="panel-title">Listado</h2>
        <table className="tabla">
          <thead>
            <tr>
              <th>RUN</th>
              <th>Nombre</th>
              <th>Correo</th>
              <th>Tipo</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filtrados.length === 0 ? (
              <tr><td colSpan="5">Sin resultados</td></tr>
            ) : (
              filtrados.map((u) => (
                <tr key={u.run}>
                  <td>{u.run}</td>
                  <td>{u.nombre} {u.apellidos}</td>
                  <td>{u.correo}</td>
                  <td>{u.tipo}</td>
                  <td>
                    <button className="btn-primary" onClick={() => abrirModalEditar(u)}>Editar</button>
                    <button className="btn-danger" onClick={() => eliminarUsuario(u.run)}>Eliminar</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </section>

      {/* Modal */}
      {modalAbierto && (
        <div className="modal">
          <form className="forms" onSubmit={guardarUsuario}>
            <h3>{modoEdicion ? "Editar usuario" : "Nuevo usuario"}</h3>

            <label>RUN
              <input
                type="text"
                value={usuarioActual.run}
                onChange={(e) => setUsuarioActual({ ...usuarioActual, run: e.target.value })}
                required
                disabled={modoEdicion}
              />
            </label>

            <label>Tipo
              <select
                value={usuarioActual.tipo}
                onChange={(e) => setUsuarioActual({ ...usuarioActual, tipo: e.target.value })}
                required
              >
                <option value="">Seleccione...</option>
                <option>Administrador</option>
                <option>Vendedor</option>
                <option>Cliente</option>
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
                value={usuarioActual.password}
                onChange={(e) => setUsuarioActual({ ...usuarioActual, password: e.target.value })}
                required
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

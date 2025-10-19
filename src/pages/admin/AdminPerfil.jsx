import { useState, useEffect } from "react";
import "../../assets/styles/dashboard.css";

export default function AdminPerfil() {
  const [usuario, setUsuario] = useState(null);
  const [editando, setEditando] = useState(false);
  const [datosEditados, setDatosEditados] = useState({});

  // Cargar usuario actual
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("usuarioLogueado"));
    if (user) {
      setUsuario(user);
      setDatosEditados(user);
    }
  }, []);

  const handleChange = (e) => {
    setDatosEditados({ ...datosEditados, [e.target.name]: e.target.value });
  };

  const guardarCambios = () => {
    // Actualizar en localStorage
    localStorage.setItem("usuarioLogueado", JSON.stringify(datosEditados));

    // Actualizar también en la lista general de usuarios
    const listaUsuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
    const index = listaUsuarios.findIndex((u) => u.correo === usuario.correo);
    if (index !== -1) {
      listaUsuarios[index] = datosEditados;
      localStorage.setItem("usuarios", JSON.stringify(listaUsuarios));
    }

    setUsuario(datosEditados);
    setEditando(false);
    alert("✅ Datos actualizados correctamente");
  };

  if (!usuario) {
    return (
      <div className="admin-dashboard">
        <h1>Perfil</h1>
        <p>No hay un usuario logueado actualmente.</p>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      <h1 className="titulo">Mi Perfil</h1>

      <div className="panel" style={{ maxWidth: "600px", margin: "0 auto" }}>
        {!editando ? (
          <>
            <h3>Información del usuario</h3>
            <p><strong>Nombre:</strong> {usuario.nombre}</p>
            <p><strong>Correo:</strong> {usuario.correo}</p>
            <p><strong>Tipo de usuario:</strong> {usuario.tipo}</p>
            {usuario.direccion && <p><strong>Dirección:</strong> {usuario.direccion}</p>}
            {usuario.telefono && <p><strong>Teléfono:</strong> {usuario.telefono}</p>}
            <div style={{ marginTop: "1rem" }}>
              <button className="btn-primary" onClick={() => setEditando(true)}>
                Editar perfil
              </button>
            </div>
          </>
        ) : (
          <form className="forms">
            <h3>Editar Perfil</h3>

            <label>Nombre</label>
            <input
              type="text"
              name="nombre"
              value={datosEditados.nombre || ""}
              onChange={handleChange}
            />

            <label>Correo electrónico</label>
            <input
              type="email"
              name="correo"
              value={datosEditados.correo || ""}
              onChange={handleChange}
            />

            <label>Contraseña</label>
            <input
              type="password"
              name="contraseña"
              value={datosEditados.contraseña || ""}
              onChange={handleChange}
            />

            <div className="form-actions">
              <button
                type="button"
                className="btn-primary"
                onClick={guardarCambios}
              >
                Guardar
              </button>
              <button
                type="button"
                className="btn-danger"
                onClick={() => {
                  setEditando(false);
                  setDatosEditados(usuario);
                }}
              >
                Cancelar
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

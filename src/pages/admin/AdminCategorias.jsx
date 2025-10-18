import { useEffect, useState } from "react";
import "../../assets/styles/dashboard.css";

export default function AdminCategorias() {
  const [categorias, setCategorias] = useState([]);
  const [nombre, setNombre] = useState("");
  const [editando, setEditando] = useState(null);

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("categorias")) || [];
    setCategorias(data);
  }, []);

  // Guardar cambios en localStorage
  const guardarCategorias = (nuevas) => {
    setCategorias(nuevas);
    localStorage.setItem("categorias", JSON.stringify(nuevas));
  };

  // Crear nueva categoría
  const handleAgregar = () => {
    if (!nombre.trim()) {
      alert("Por favor, ingresa un nombre para la categoría.");
      return;
    }

    const existe = categorias.some(
      (cat) => cat.nombre.toLowerCase() === nombre.trim().toLowerCase()
    );
    if (existe) {
      alert("Ya existe una categoría con ese nombre.");
      return;
    }

    const nuevaCategoria = {
      id: Date.now(),
      nombre: nombre.trim(),
    };

    const nuevas = [...categorias, nuevaCategoria];
    guardarCategorias(nuevas);
    setNombre("");
  };

  // Editar categoría
  const handleEditar = (id) => {
    const categoria = categorias.find((c) => c.id === id);
    setEditando(categoria);
    setNombre(categoria.nombre);
  };

  const handleGuardarEdicion = () => {
    if (!nombre.trim()) return;

    const nuevas = categorias.map((cat) =>
      cat.id === editando.id ? { ...cat, nombre: nombre.trim() } : cat
    );
    guardarCategorias(nuevas);
    setEditando(null);
    setNombre("");
  };

  // Eliminar categoría
  const handleEliminar = (id) => {
    if (!window.confirm("¿Seguro que deseas eliminar esta categoría?")) return;

    const nuevas = categorias.filter((cat) => cat.id !== id);
    guardarCategorias(nuevas);
  };

  return (
    <main className="admin-dashboard">
      <h1 className="fw-bold mb-4">Categorías</h1>

      {/* Formulario */}
      <div className="panel">
        <h4 className="panel-title">{editando ? "Editar categoría" : "Agregar nueva categoría"}</h4>
        <div className="actions d-flex flex-wrap gap-3 align-items-center">
          <input
            type="search"
            placeholder="Nombre de categoría"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
          />
          {editando ? (
            <>
              <button className="btn btn-success fw-bold" onClick={handleGuardarEdicion}>
                💾 Guardar cambios
              </button>
              <button
                className="btn btn-secondary fw-bold"
                onClick={() => {
                  setEditando(null);
                  setNombre("");
                }}
              >
                Cancelar
              </button>
            </>
          ) : (
            <button className="btn btn-warning fw-bold text-dark" onClick={handleAgregar}>
              ➕ Agregar
            </button>
          )}
        </div>
      </div>

      {/* Tabla de categorías */}
      <div className="panel">
        <h4 className="panel-title">Listado de categorías</h4>
          <table className="tabla">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {categorias.length > 0 ? (
                categorias.map((cat) => (
                  <tr key={cat.id}>
                    <td>{cat.id}</td>
                    <td>{cat.nombre}</td>
                    <td>
                      <button
                        className="btn btn-sm btn-primary me-2"
                        onClick={() => handleEditar(cat.id)}
                      >
                        Editar
                      </button>
                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() => handleEliminar(cat.id)}
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="text-center text-muted py-3">
                    No hay categorías registradas.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
    </main>
  );
}

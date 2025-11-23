import { useEffect, useState } from "react";
import axios from "axios"; // <--- 1. Importamos Axios
import "../../assets/styles/dashboard.css";

export default function AdminCategorias() {
  const [categorias, setCategorias] = useState([]);
  const [nombre, setNombre] = useState("");
  const [editando, setEditando] = useState(null);
  const [loading, setLoading] = useState(true);

  // 2. Cargar categorías desde la BD
  const cargarCategorias = async () => {
    try {
      setLoading(true);
      const response = await axios.get("http://localhost:3001/api/categories");
      setCategorias(response.data);
    } catch (error) {
      console.error("Error al cargar categorías:", error);
      alert("No se pudieron cargar las categorías del servidor.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarCategorias();
  }, []);

  // 3. Crear nueva categoría (POST)
  const handleAgregar = async () => {
    if (!nombre.trim()) {
      alert("Por favor, ingresa un nombre para la categoría.");
      return;
    }

    try {
      // Enviamos el nombre al backend
      await axios.post("http://localhost:3001/api/categories", {
        nombre: nombre.trim(),
      });
      
      // Limpiamos y recargamos la lista
      setNombre("");
      cargarCategorias();
      alert("Categoría creada con éxito");

    } catch (error) {
      console.error(error);
      // Si el backend devuelve error 400 (ej: nombre duplicado)
      if (error.response && error.response.status === 400) {
        alert(error.response.data.message || "Error al crear la categoría");
      } else {
        alert("Ocurrió un error al conectar con el servidor");
      }
    }
  };

  // Preparar edición
  const handleEditar = (categoria) => {
    setEditando(categoria);
    setNombre(categoria.nombre);
  };

  // 4. Guardar edición (PUT)
  const handleGuardarEdicion = async () => {
    if (!nombre.trim()) return;

    try {
      await axios.put(`http://localhost:3001/api/categories/${editando.id}`, {
        nombre: nombre.trim(),
      });

      setEditando(null);
      setNombre("");
      cargarCategorias(); // Recargar lista
      alert("Categoría actualizada");

    } catch (error) {
      console.error(error);
      alert("Error al actualizar la categoría");
    }
  };

  // 5. Eliminar categoría (DELETE)
  const handleEliminar = async (id) => {
    // Advertencia extra porque esto afecta productos
    if (!window.confirm("¿Seguro que deseas eliminar esta categoría? Los productos que pertenezcan a ella quedarán 'Sin Categoría'.")) return;

    try {
      await axios.delete(`http://localhost:3001/api/categories/${id}`);
      cargarCategorias(); // Recargar lista
    } catch (error) {
      console.error(error);
      alert("Error al eliminar la categoría");
    }
  };

  return (
    <main className="admin-dashboard">
      <h1 className="fw-bold mb-4">Gestión de Categorías</h1>

      {/* Formulario */}
      <div className="panel">
        <h4 className="panel-title">{editando ? "Editar categoría" : "Agregar nueva categoría"}</h4>
        <div className="actions d-flex flex-wrap gap-3 align-items-center">
          <input
            type="search" // Usamos estilo search pero es input texto
            placeholder="Nombre de categoría (ej: Tecnología)"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
          />
          {editando ? (
            <>
              <button className="btn btn-success fw-bold" onClick={handleGuardarEdicion}>
                💾 Actualizar
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
        
        {loading ? (
          <div className="text-center py-3">Cargando datos...</div>
        ) : (
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
                        onClick={() => handleEditar(cat)}
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
        )}
      </div>
    </main>
  );
}
import { useState, useEffect } from "react";
import axios from "axios"; // <--- Importamos Axios
import "../../assets/styles/dashboard.css";

export default function AdminProductos() {
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [modalAbierto, setModalAbierto] = useState(false);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [mostrarCriticos, setMostrarCriticos] = useState(false);
  const [loading, setLoading] = useState(true);

  // Estado del formulario
  const [productoActual, setProductoActual] = useState({
    id: "",
    nombre: "",
    descripcion: "",
    precio: "",
    stock: "",
    imagen: "",
    categoriaId: "", // Ahora usamos el ID de la categoría, no el nombre
  });

  // 1. CARGAR DATOS DEL BACKEND
  const cargarDatos = async () => {
    try {
      setLoading(true);
      const [resProductos, resCategorias] = await Promise.all([
        axios.get("http://localhost:3001/api/products"),
        axios.get("http://localhost:3001/api/categories"),
      ]);
      setProductos(resProductos.data);
      setCategorias(resCategorias.data);
    } catch (error) {
      console.error("Error cargando datos:", error);
      alert("Error al conectar con el servidor");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  // 2. ABRIR MODAL (NUEVO)
  const abrirModalNuevo = () => {
    setModoEdicion(false);
    setProductoActual({
      id: "",
      nombre: "",
      descripcion: "",
      precio: "",
      stock: "",
      imagen: "",
      categoriaId: "",
    });
    setModalAbierto(true);
  };

  // 3. ABRIR MODAL (EDITAR)
  const abrirModalEditar = (p) => {
    setModoEdicion(true);
    setProductoActual({
      id: p.id,
      nombre: p.nombre,
      descripcion: p.descripcion,
      precio: p.precio,
      stock: p.stock,
      imagen: p.imagen || "",
      categoriaId: p.categoria ? p.categoria.id : "", // Extraemos el ID si tiene categoría
    });
    setModalAbierto(true);
  };

  // 4. ELIMINAR (DELETE)
  const eliminarProducto = async (id) => {
    if (confirm("¿Estás seguro de eliminar este producto de la base de datos?")) {
      try {
        await axios.delete(`http://localhost:3001/api/products/${id}`);
        // Recargamos la lista visualmente
        cargarDatos();
        alert("Producto eliminado correctamente");
      } catch (error) {
        console.error(error);
        alert("No se pudo eliminar el producto (quizás ya tiene ventas asociadas)");
      }
    }
  };

  // 5. GUARDAR (POST / PUT)
  const guardarProducto = async (e) => {
    e.preventDefault();

    try {
      // Preparamos los datos (asegurando que números sean números)
      const datosAEnviar = {
        nombre: productoActual.nombre,
        descripcion: productoActual.descripcion,
        precio: parseInt(productoActual.precio),
        stock: parseInt(productoActual.stock),
        imagen: productoActual.imagen,
        categoriaId: productoActual.categoriaId ? parseInt(productoActual.categoriaId) : null,
      };

      if (modoEdicion) {
        // ACTUALIZAR (PUT)
        await axios.put(`http://localhost:3001/api/products/${productoActual.id}`, datosAEnviar);
        alert("Producto actualizado exitosamente");
      } else {
        // CREAR (POST)
        await axios.post("http://localhost:3001/api/products", datosAEnviar);
        alert("Producto creado exitosamente");
      }

      setModalAbierto(false);
      cargarDatos(); // Recargar la tabla
    } catch (error) {
      console.error(error);
      alert("Error al guardar el producto. Revisa la consola.");
    }
  };

  // 🔎 Filtros de búsqueda (frontend)
  let filtrados = productos.filter((p) =>
    (p.nombre + p.id).toLowerCase().includes(busqueda.toLowerCase())
  );

  const productosCriticos = productos.filter((p) => parseInt(p.stock) <= 10);

  if (mostrarCriticos) {
    filtrados = filtrados.filter((p) => parseInt(p.stock) <= 10);
  }

  return (
    <div className="admin-dashboard">
      <h1 className="titulo">Gestión de Productos</h1>

      {/* 🔍 Acciones */}
      <section className="actions">
        <button className="btn-primary" onClick={abrirModalNuevo}>
          + Nuevo producto
        </button>
        <input
          type="search"
          placeholder="Buscar por ID o nombre..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
        />
      </section>

      {/* ⚠️ Alerta de Stock */}
      <section className="stock-alert" style={{ marginBottom: "1rem" }}>
        <label style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <input
            type="checkbox"
            checked={mostrarCriticos}
            onChange={(e) => setMostrarCriticos(e.target.checked)}
          />
          Mostrar solo productos con bajo stock
        </label>
        <p style={{ marginTop: "0.5rem", color: productosCriticos.length > 0 ? "#c0392b" : "#27ae60" }}>
          {productosCriticos.length > 0
            ? `${productosCriticos.length} producto(s) con stock crítico`
            : "Todos los productos tienen stock saludable"}
        </p>
      </section>

      {/* 📋 Tabla */}
      <section className="panel">
        <h2 className="panel-title">Inventario Actual</h2>
        
        {loading ? (
           <div className="text-center py-4">Cargando datos...</div>
        ) : (
          <table className="tabla">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Categoría</th>
                <th>Precio</th>
                <th>Stock</th>
                <th>Imagen</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filtrados.length === 0 ? (
                <tr>
                  <td colSpan="7">No se encontraron productos</td>
                </tr>
              ) : (
                filtrados.map((p) => (
                  <tr
                    key={p.id}
                    style={{
                      backgroundColor:
                        parseInt(p.stock) <= 10 ? "rgba(255, 0, 0, 0.08)" : "transparent",
                    }}
                  >
                    <td>{p.id}</td>
                    <td>{p.nombre}</td>
                    {/* Accedemos al objeto categoria.nombre de forma segura */}
                    <td>{p.categoria ? p.categoria.nombre : <span className="text-muted">Sin categoría</span>}</td>
                    <td>${p.precio.toLocaleString("es-CL")}</td>
                    <td style={{ fontWeight: "bold", color: parseInt(p.stock) <= 10 ? "#c0392b" : "inherit" }}>
                      {p.stock}
                    </td>
                    <td>
                      {p.imagen ? (
                        <img
                          src={p.imagen}
                          alt={p.nombre}
                          style={{ width: "40px", height: "40px", objectFit: "cover", borderRadius: "4px" }}
                        />
                      ) : (
                        "—"
                      )}
                    </td>
                    <td>
                      <div style={{display: 'flex', gap: '5px'}}>
                        <button className="btn-primary" style={{padding: '5px 10px', fontSize: '0.8rem'}} onClick={() => abrirModalEditar(p)}>
                          Editar
                        </button>
                        <button className="btn-danger" style={{padding: '5px 10px', fontSize: '0.8rem'}} onClick={() => eliminarProducto(p.id)}>
                          Eliminar
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </section>

      {/* 🟡 Modal */}
      {modalAbierto && (
        <div className="modal">
          <form className="forms-producto" onSubmit={guardarProducto}>
            <h3>{modoEdicion ? `Editar Producto #${productoActual.id}` : "Nuevo Producto"}</h3>

            {/* NOTA: Ya no pedimos ID manual, la base de datos lo genera sola */}

            <label>
              Nombre
              <input
                type="text"
                value={productoActual.nombre}
                onChange={(e) =>
                  setProductoActual({ ...productoActual, nombre: e.target.value })
                }
                required
              />
            </label>

            <label>
              Descripción
              <textarea
                value={productoActual.descripcion}
                onChange={(e) =>
                  setProductoActual({
                    ...productoActual,
                    descripcion: e.target.value,
                  })
                }
                placeholder="Descripción del producto..."
                rows={3}
              />
            </label>

            <label>
              Categoría
              <select
                className="form-control"
                value={productoActual.categoriaId}
                onChange={(e) =>
                  setProductoActual({
                    ...productoActual,
                    categoriaId: e.target.value,
                  })
                }
              >
                <option value="">-- Sin categoría --</option>
                {categorias.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.nombre}
                  </option>
                ))}
              </select>
            </label>

            <div className="d-flex gap-2">
              <label style={{ flex: 1 }}>
                Precio (CLP)
                <input
                  type="number"
                  value={productoActual.precio}
                  onChange={(e) =>
                    setProductoActual({ ...productoActual, precio: e.target.value })
                  }
                  required
                />
              </label>

              <label style={{ flex: 1 }}>
                Stock
                <input
                  type="number"
                  value={productoActual.stock}
                  onChange={(e) =>
                    setProductoActual({ ...productoActual, stock: e.target.value })
                  }
                  required
                />
              </label>
            </div>

            <label>
              URL de Imagen
              <input
                type="url"
                value={productoActual.imagen}
                onChange={(e) =>
                  setProductoActual({ ...productoActual, imagen: e.target.value })
                }
                placeholder="https://..."
              />
            </label>

            <div className="form-actions">
              <button type="submit" className="btn-primary">
                {modoEdicion ? "Actualizar" : "Crear"}
              </button>
              <button
                type="button"
                className="btn-danger"
                onClick={() => setModalAbierto(false)}
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
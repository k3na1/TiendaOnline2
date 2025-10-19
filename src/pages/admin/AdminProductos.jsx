import { useState, useEffect } from "react";
import "../../assets/styles/dashboard.css";

export default function AdminProductos() {
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [modalAbierto, setModalAbierto] = useState(false);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [mostrarCriticos, setMostrarCriticos] = useState(false);
  const [productoActual, setProductoActual] = useState({
    id: "",
    nombre: "",
    descripcion: "",
    precio: "",
    stock: "",
    imagen: "",
    categoria: "",
  });

  useEffect(() => {
    const dataProductos = JSON.parse(localStorage.getItem("productos")) || [];
    const dataCategorias = JSON.parse(localStorage.getItem("categorias")) || [];
    setProductos(dataProductos);
    setCategorias(dataCategorias);
  }, []);

  const guardarProductos = (arr) => {
    localStorage.setItem("productos", JSON.stringify(arr));
    setProductos(arr);
  };

  const abrirModalNuevo = () => {
    setModoEdicion(false);
    setProductoActual({
      id: "",
      nombre: "",
      descripcion: "",
      precio: "",
      stock: "",
      imagen: "",
      categoria: "",
    });
    setModalAbierto(true);
  };

  const abrirModalEditar = (p) => {
    setModoEdicion(true);
    setProductoActual(p);
    setModalAbierto(true);
  };

  const eliminarProducto = (id) => {
    if (confirm("¿Eliminar este producto?")) {
      const nuevos = productos.filter((p) => p.id !== id);
      guardarProductos(nuevos);
    }
  };

  const guardarProducto = (e) => {
    e.preventDefault();
    const nuevos = [...productos];

    if (modoEdicion) {
      const idx = nuevos.findIndex((p) => p.id === productoActual.id);
      if (idx >= 0) nuevos[idx] = productoActual;
    } else {
      nuevos.push(productoActual);
    }

    guardarProductos(nuevos);
    setModalAbierto(false);
  };

  // 🔎 Filtro por búsqueda
  let filtrados = productos.filter((p) =>
    (p.nombre + p.id).toLowerCase().includes(busqueda.toLowerCase())
  );

  // 🧮 Productos con stock bajo
  const productosCriticos = productos.filter((p) => parseInt(p.stock) <= 10);

  // 🧠 Si el checkbox está activado, filtramos solo los críticos
  if (mostrarCriticos) {
    filtrados = filtrados.filter((p) => parseInt(p.stock) <= 10);
  }

  return (
    <div className="admin-dashboard">
      <h1 className="titulo">Productos</h1>

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

      {/* ⚠️ Estado de stock crítico */}
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
            : "Todos los productos están con stock adecuado"}
        </p>
      </section>

      {/* 📋 Tabla */}
      <section className="panel">
        <h2 className="panel-title">Listado</h2>
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
                <td colSpan="7">Sin resultados</td>
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
                  <td>{p.categoria || "—"}</td>
                  <td>${p.precio}</td>
                  <td style={{ color: parseInt(p.stock) <= 10 ? "#c0392b" : "inherit" }}>
                    {p.stock}
                  </td>
                  <td>
                    {p.imagen ? (
                      <img
                        src={p.imagen}
                        alt={p.nombre}
                        style={{ width: "50px", borderRadius: "4px" }}
                      />
                    ) : (
                      "—"
                    )}
                  </td>
                  <td>
                    <button className="btn-primary" onClick={() => abrirModalEditar(p)}>
                      Editar
                    </button>
                    <button className="btn-danger" onClick={() => eliminarProducto(p.id)}>
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </section>

      {/* 🟡 Modal */}
      {modalAbierto && (
        <div className="modal">
          <form className="forms-producto" onSubmit={guardarProducto}>
            <h3>{modoEdicion ? "Editar producto" : "Nuevo producto"}</h3>

            <label>
              ID (SKU)
              <input
                type="text"
                value={productoActual.id}
                onChange={(e) =>
                  setProductoActual({ ...productoActual, id: e.target.value })
                }
                required
                disabled={modoEdicion}
              />
            </label>

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
                placeholder="Descripción breve…"
                rows={3}
              />
            </label>

            <label>
              Categoría
              <select
                className="form-control"
                value={productoActual.categoria}
                onChange={(e) =>
                  setProductoActual({
                    ...productoActual,
                    categoria: e.target.value,
                  })
                }
                required
              >
                <option value="">Seleccionar categoría...</option>
                {categorias.length > 0 ? (
                  categorias.map((cat) => (
                    <option key={cat.id} value={cat.nombre}>
                      {cat.nombre}
                    </option>
                  ))
                ) : (
                  <option disabled>No hay categorías registradas</option>
                )}
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
                placeholder="https://...imagen.png"
              />
            </label>

            <div className="form-actions">
              <button type="submit" className="btn-primary">
                Guardar
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

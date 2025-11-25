import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios"; // <--- Importamos Axios
import "../assets/styles/catalogo.css";

export default function Productos() {
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState(null);
  const [loading, setLoading] = useState(true); // Estado para mostrar "Cargando..."

  const API_URL = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        setLoading(true);
        // Hacemos las dos peticiones al backend simultáneamente
        const [resProductos, resCategorias] = await Promise.all([
          axios.get(API_URL + "/api/products"),
          axios.get(API_URL + "/api/categories"),
        ]);

        setProductos(resProductos.data);
        setCategorias(resCategorias.data);
      } catch (error) {
        console.error("Error cargando datos del servidor:", error);
      } finally {
        setLoading(false);
      }
    };

    cargarDatos();
  }, []);

  // Filtrado actualizado: Accedemos a "categoria.nombre"
  const productosFiltrados = categoriaSeleccionada
    ? productos.filter((p) => p.categoria?.nombre === categoriaSeleccionada)
    : productos;

  // Imagen por defecto si la BD no tiene foto
  const imagenPorDefecto = "https://via.placeholder.com/300x200?text=Sin+Imagen";

  return (
    <main className="container-fluid my-5">
      <div className="row">
        {/* Barra lateral de categorías */}
        <aside className="col-12 col-md-3 col-lg-2 mb-4">
          <div className="list-group shadow-sm">
            <h5 className="fw-bold text-center py-2" style={{ color: "#3e2723" }}>
              Categorías
            </h5>

            <button
              className={`list-group-item list-group-item-action ${
                !categoriaSeleccionada ? "active" : ""
              }`}
              onClick={() => setCategoriaSeleccionada(null)}
            >
              Todas
            </button>

            {categorias.map((cat) => (
              <button
                key={cat.id}
                className={`list-group-item list-group-item-action ${
                  categoriaSeleccionada === cat.nombre ? "active" : ""
                }`}
                onClick={() => setCategoriaSeleccionada(cat.nombre)}
              >
                {cat.nombre}
              </button>
            ))}
          </div>
        </aside>

        {/* Sección de productos */}
        <section className="col-12 col-md-9 col-lg-10">
          <h1 className="mb-4 text-center">Nuestros Productos</h1>

          {loading ? (
            // Spinner de carga mientras Axios trabaja
            <div className="text-center py-5">
              <div className="spinner-border text-warning" role="status">
                <span className="visually-hidden">Cargando...</span>
              </div>
            </div>
          ) : (
            <div className="row g-4">
              {productosFiltrados.length === 0 ? (
                <p className="text-center text-muted">No hay productos disponibles.</p>
              ) : (
                productosFiltrados.map((p) => (
                  <div key={p.id} className="col-12 col-sm-6 col-md-4 col-lg-3">
                    <div className="card producto-card h-100 shadow-sm border-0">
                      <img
                        src={p.imagen || imagenPorDefecto} // Usamos la imagen de la BD
                        alt={p.nombre}
                        className="card-img-top"
                        style={{ height: "200px", objectFit: "cover" }}
                      />
                      <div className="card-body text-center">
                        <h5 className="card-title fw-bold">{p.nombre}</h5>
                        <p className="text-muted mb-2">
                          ${p.precio ? p.precio.toLocaleString("es-CL") : 0}
                        </p>
                        
                        {/* Etiqueta pequeña con la categoría */}
                        <span className="badge bg-secondary mb-2">
                            {p.categoria ? p.categoria.nombre : "Sin Categoría"}
                        </span>
                        
                        <br/>
                        
                        <Link
                          to={`/producto/${p.id}`}
                          className="btn btn-warning fw-bold text-dark mt-2"
                        >
                          Ver Detalle
                        </Link>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import "../assets/styles/catalogo.css";

export default function Productos() {
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState(null);

  useEffect(() => {
    // Cargar productos
    const data = JSON.parse(localStorage.getItem("productos"));
    if (data && data.length > 0) {
      setProductos(data);
    } else {
      setProductos([
        {
          id: "SKU001",
          nombre: "Café de Grano Clásico",
          descripcion:
            "Un café equilibrado y suave, perfecto para empezar el día. Notas de chocolate y nuez.",
          precio: 12000,
          stock: 50,
          imagen:
            "https://static.wixstatic.com/media/48f789_53c573c80f8c416586d3ee6aa1a75f69~mv2.jpg/v1/fill/w_980,h_653,al_c,q_85,usm_0.66_1.00_0.01,enc_auto/48f789_53c573c80f8c416586d3ee6aa1a75f69~mv2.jpg",
          categoria: "Clásico",
        },
      ]);
    }

    // Cargar categorías
    const categoriasGuardadas = JSON.parse(localStorage.getItem("categorias"));
    if (categoriasGuardadas && categoriasGuardadas.length > 0) {
      setCategorias(categoriasGuardadas);
    } else {
      // Fallback de ejemplo
      const base = [
        { id: 1, nombre: "Clásico" },
        { id: 2, nombre: "Premium" },
        { id: 3, nombre: "Descafeinado" },
      ];
      setCategorias(base);
      localStorage.setItem("categorias", JSON.stringify(base));
    }
  }, []);

  // Filtrar productos por categoría seleccionada
  const productosFiltrados = categoriaSeleccionada
    ? productos.filter((p) => p.categoria === categoriaSeleccionada)
    : productos;

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

          <div className="row g-4">
            {productosFiltrados.length === 0 ? (
              <p className="text-center text-muted">No hay productos disponibles.</p>
            ) : (
              productosFiltrados.map((p) => (
                <div key={p.id} className="col-12 col-sm-6 col-md-4 col-lg-3">
                  <div className="card producto-card h-100 shadow-sm border-0">
                    <img
                      src={p.imagen}
                      alt={p.nombre}
                      className="card-img-top"
                      style={{ height: "200px", objectFit: "cover" }}
                    />
                    <div className="card-body text-center">
                      <h5 className="card-title fw-bold">{p.nombre}</h5>
                      <p className="text-muted mb-2">
                        ${p.precio.toLocaleString("es-CL")}
                      </p>
                      <Link
                        to={`/producto/${p.id}`}
                        className="btn btn-warning fw-bold text-dark"
                      >
                        Ver Detalle
                      </Link>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      </div>
    </main>
  );
}

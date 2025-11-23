import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios"; // <--- Importamos Axios
import "../assets/styles/home.css";

export default function Home() {
  const [productosDestacados, setProductosDestacados] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cargarProductos = async () => {
      try {
        // 1. Pedimos los productos al Backend
        const respuesta = await axios.get("http://localhost:3001/api/products");
        const todosLosProductos = respuesta.data;

        if (todosLosProductos.length > 0) {
          // 2. Mezclar y tomar 3 aleatorios
          const aleatorios = [...todosLosProductos]
            .sort(() => 0.5 - Math.random()) // Mezclar array
            .slice(0, 3); // Tomar los primeros 3

          setProductosDestacados(aleatorios);
        }
      } catch (error) {
        console.error("Error cargando productos destacados:", error);
      } finally {
        setLoading(false);
      }
    };

    cargarProductos();
  }, []);

  // Imagen de respaldo por si la BD tiene un producto sin foto
  const imagenPorDefecto = "https://via.placeholder.com/300x200?text=Sin+Imagen";

  return (
    <div className="home-page">
      <main className="container my-5 text-center">
        {/* Carrusel (Se mantiene igual) */}
        <div className="carousel-wrapper mb-5">
          <div id="carruselCafe" className="carousel slide mb-5" data-bs-ride="carousel">
            <div className="carousel-inner rounded-4 shadow">
              <div className="carousel-item active">
                <img
                  src="https://tse1.mm.bing.net/th/id/OIP.kEdR1PWJNfsgqM4RIQ9ebgHaE7?rs=1&pid=ImgDetMain&o=7&rm=3"
                  className="d-block w-100"
                  alt="Promoción 1"
                />
              </div>
              <div className="carousel-item">
                <img
                  src="https://cdn.mos.cms.futurecdn.net/UoHp9eWdb7kAgcmYDHxDN3-1920-80.jpg"
                  className="d-block w-100"
                  alt="Promoción 2"
                />
              </div>
              <div className="carousel-item">
                <img
                  src="https://th.bing.com/th/id/R.f2acbd2f4f5650349cbb2dae08a2a1a4?rik=5h%2fd1emv%2btoaBw&pid=ImgRaw&r=0"
                  className="d-block w-100"
                  alt="Promoción 3"
                />
              </div>
            </div>
            <button
              className="carousel-control-prev"
              type="button"
              data-bs-target="#carruselCafe"
              data-bs-slide="prev"
            >
              <span className="carousel-control-prev-icon" aria-hidden="true"></span>
              <span className="visually-hidden">Anterior</span>
            </button>
            <button
              className="carousel-control-next"
              type="button"
              data-bs-target="#carruselCafe"
              data-bs-slide="next"
            >
              <span className="carousel-control-next-icon" aria-hidden="true"></span>
              <span className="visually-hidden">Siguiente</span>
            </button>
          </div>
        </div>

        {/* Bienvenida */}
        <h1 className="titulo-bienvenida">Bienvenido a CoffeeShop</h1>
        <p className="subtitulo-bienvenida">
          Descubre nuestros productos y ofertas exclusivas.
        </p>

        {/* Productos destacados */}
        <section className="destacados mt-5">
          <h2 className="mb-4">Productos destacados</h2>
          
          {loading ? (
             <div className="spinner-border text-warning" role="status">
               <span className="visually-hidden">Cargando...</span>
             </div>
          ) : (
            <div className="row g-4">
              {productosDestacados.length === 0 ? (
                <p className="text-muted">Aún no hay productos destacados.</p>
              ) : (
                productosDestacados.map((p) => (
                  <div key={p.id} className="col-12 col-md-6 col-lg-4">
                    <div className="card shadow-sm border-0 h-100">
                      <img
                        src={p.imagen || imagenPorDefecto}
                        className="card-img-top"
                        alt={p.nombre}
                        style={{ height: "200px", objectFit: "cover" }}
                      />
                      <div className="card-body">
                        <h5 className="card-title fw-bold">{p.nombre}</h5>
                        <p className="text-muted">
                          ${p.precio ? p.precio.toLocaleString("es-CL") : 0}
                        </p>
                        <Link
                          to={`/producto/${p.id}`}
                          className="btn btn-warning fw-bold text-dark"
                        >
                          Ver más
                        </Link>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../assets/styles/home.css";

export default function Home() {
  const [productosDestacados, setProductosDestacados] = useState([]);

  useEffect(() => {
    // Obtener productos desde localStorage
    const productosGuardados = JSON.parse(localStorage.getItem("productos")) || [];

    if (productosGuardados.length > 0) {
      // Mezclar y tomar 3 productos aleatorios
      const productosAleatorios = [...productosGuardados]
        .sort(() => 0.5 - Math.random())
        .slice(0, 3);

      setProductosDestacados(productosAleatorios);
    } else {
      // Productos de ejemplo por si no hay datos
      setProductosDestacados([
        {
          id: "SKU001",
          nombre: "Café de Grano Clásico",
          precio: 12000,
          imagen:
            "https://static.wixstatic.com/media/48f789_53c573c80f8c416586d3ee6aa1a75f69~mv2.jpg/v1/fill/w_980,h_653,al_c,q_85,usm_0.66_1.00_0.01,enc_auto/48f789_53c573c80f8c416586d3ee6aa1a75f69~mv2.jpg",
        },
        {
          id: "SKU002",
          nombre: "Café de Origen Colombia",
          precio: 14000,
          imagen:
            "https://cdn.shopify.com/s/files/1/0301/0190/4313/products/colombia_1024x1024.jpg?v=1596570843",
        },
        {
          id: "SKU003",
          nombre: "Café Descafeinado",
          precio: 11000,
          imagen:
            "https://cdn.shopify.com/s/files/1/0521/2899/1786/products/FrenchPress.png?v=1620157489",
        },
      ]);
    }
  }, []);

  return (
    <div className="home-page">
      <main className="container my-5 text-center">
        {/* Carrusel */}
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
          <div className="row g-4">
            {productosDestacados.map((p) => (
              <div key={p.id} className="col-12 col-md-6 col-lg-4">
                <div className="card shadow-sm border-0 h-100">
                  <img
                    src={p.imagen}
                    className="card-img-top"
                    alt={p.nombre}
                    style={{ height: "200px", objectFit: "cover" }}
                  />
                  <div className="card-body">
                    <h5 className="card-title fw-bold">{p.nombre}</h5>
                    <p className="text-muted">
                      ${p.precio.toLocaleString("es-CL")}
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
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

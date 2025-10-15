import { Link } from "react-router-dom";
import "../assets/styles/catalogo.css";

export default function Productos() {
  const productos = [
    {
      id: "SKU001",
      nombre: "Café de Grano Clásico",
      descripcion:
        "Un café equilibrado y suave, perfecto para empezar el día. Notas de chocolate y nuez.",
      precio: 12000,
      stock: 50,
      imagen:
        "https://static.wixstatic.com/media/48f789_53c573c80f8c416586d3ee6aa1a75f69~mv2.jpg/v1/fill/w_980,h_653,al_c,q_85,usm_0.66_1.00_0.01,enc_auto/48f789_53c573c80f8c416586d3ee6aa1a75f69~mv2.jpg",
    },
    {
      id: "SKU002",
      nombre: "Café de Origen Único Etiopía",
      descripcion:
        "Café de especialidad con notas florales y cítricas. Acidez brillante y cuerpo ligero.",
      precio: 18000,
      stock: 30,
      imagen:
        "https://cdn.shopify.com/s/files/1/0301/0190/4313/products/ethiopia_1024x1024.jpg?v=1596570843",
    },
  ];

  return (
    <main className="container my-5 text-center">
      <h1 className="mb-4">Nuestros Productos</h1>
      <div className="row g-4">
        {productos.map((p) => (
          <div key={p.id} className="col-12 col-sm-6 col-md-4 col-lg-3">
            <div className="card producto-card h-100 shadow-sm border-0">
              <img
                src={p.imagen}
                alt={p.nombre}
                className="card-img-top"
                style={{ height: "200px", objectFit: "cover" }}
              />
              <div className="card-body">
                <h5 className="card-title fw-bold">{p.nombre}</h5>
                <p className="text-muted mb-2">${p.precio.toLocaleString("es-CL")}</p>
                <Link
                  to={`/producto/${p.id}`}
                  className="btn btn-warning fw-bold text-dark"
                >
                  Ver Detalle
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}

import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import "../assets/styles/catalogo.css";

export default function ProductoDetalle() {
  const { id } = useParams();
  const navigate = useNavigate();

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

  const producto = productos.find((p) => p.id === id);
  const [cantidad, setCantidad] = useState(1);

  if (!producto)
    return (
      <main className="container text-center my-5">
        <h2>Producto no encontrado</h2>
        <p>Por favor, vuelve al catálogo.</p>
      </main>
    );

  const handleAgregarCarrito = () => {
    const cantidadNum = parseInt(cantidad);
    if (cantidadNum <= 0 || cantidadNum > producto.stock) {
      alert("Cantidad inválida o fuera de stock.");
      return;
    }

    const carritoGuardado = localStorage.getItem("carrito");
    const carrito = carritoGuardado ? JSON.parse(carritoGuardado) : [];

    const existente = carrito.find((item) => item.id === producto.id);

    if (existente) {
      existente.cantidad += cantidadNum;
    } else {
      carrito.push({
        id: producto.id,
        nombre: producto.nombre,
        precio: producto.precio,
        imagen: producto.imagen,
        cantidad: cantidadNum,
        stock: producto.stock,
      });
    }

    localStorage.setItem("carrito", JSON.stringify(carrito));

    alert(`Agregaste ${cantidadNum} unidad(es) de "${producto.nombre}" al carrito 🛒`);

    navigate("/carrito");
  };

  return (
    <main className="container my-5">
      <div className="row align-items-center justify-content-center g-4">
        <div className="col-12 col-md-5 text-center">
          <img
            src={producto.imagen}
            alt={producto.nombre}
            className="img-fluid rounded shadow-sm"
          />
        </div>
        <div className="col-12 col-md-6">
          <h2 className="fw-bold mb-3">{producto.nombre}</h2>
          <p className="text-muted fs-5 mb-1">
            ${producto.precio.toLocaleString("es-CL")}
          </p>
          <p className="mb-4">{producto.descripcion}</p>

          <div className="d-flex align-items-center gap-3 mb-4">
            <label htmlFor="cantidad" className="fw-bold">
              Cantidad:
            </label>
            <input
              type="number"
              id="cantidad"
              className="form-control w-auto"
              min="1"
              max={producto.stock}
              value={cantidad}
              onChange={(e) => setCantidad(e.target.value)}
            />
          </div>

          <button
            className="btn btn-warning fw-bold text-dark"
            onClick={handleAgregarCarrito}
          >
            Añadir al Carrito
          </button>
        </div>
      </div>
    </main>
  );
}

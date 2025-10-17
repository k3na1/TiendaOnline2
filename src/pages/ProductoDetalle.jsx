import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import "../assets/styles/catalogo.css";

export default function ProductoDetalle() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [producto, setProducto] = useState(null);
  const [cantidad, setCantidad] = useState(1);
  const [errorStock, setErrorStock] = useState("");

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("productos")) || [];
    const encontrado = data.find((p) => p.id === id);
    setProducto(encontrado || null);
  }, [id]);

  if (!producto) {
    return (
      <main className="container text-center my-5">
        <h2>Producto no encontrado</h2>
        <p>Por favor, vuelve al catálogo.</p>
        <button
          className="btn btn-warning fw-bold text-dark mt-3"
          onClick={() => navigate("/productos")}
        >
          Volver al catálogo
        </button>
      </main>
    );
  }

  const handleAgregarCarrito = () => {
    const cantidadNum = parseInt(cantidad);
    if (cantidadNum <= 0) {
      setErrorStock("Debe ingresar una cantidad válida.");
      return;
    }
    if (cantidadNum > producto.stock) {
      setErrorStock("No hay suficiente stock disponible.");
      return;
    }

    // Leer carrito actual
    const carritoGuardado = localStorage.getItem("carrito");
    const carrito = carritoGuardado ? JSON.parse(carritoGuardado) : [];

    const existente = carrito.find((item) => item.id === producto.id);

    if (existente) {
      // Verificar que no sobrepase stock total al sumar
      if (existente.cantidad + cantidadNum > producto.stock) {
        setErrorStock("No hay suficiente stock para agregar esa cantidad.");
        return;
      }
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

    // Guardar carrito actualizado
    localStorage.setItem("carrito", JSON.stringify(carrito));

    // Reducir stock en la “base de datos” productos
    const productosBase = JSON.parse(localStorage.getItem("productos")) || [];
    const idx = productosBase.findIndex((p) => p.id === producto.id);
    if (idx >= 0) {
      productosBase[idx].stock = productosBase[idx].stock - cantidadNum;
      localStorage.setItem("productos", JSON.stringify(productosBase));
    }

    alert(`Agregaste ${cantidadNum} unidad(es) de "${producto.nombre}" al carrito 🛒`);
    navigate("/carrito");
  };

  const handleCantidadChange = (e) => {
    const val = parseInt(e.target.value);
    if (isNaN(val)) {
      setCantidad("");
    } else {
      setCantidad(val);
    }
    setErrorStock("");
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
          <p className="mb-2">
            <strong>Stock disponible: </strong> {producto.stock}
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
              onChange={handleCantidadChange}
            />
          </div>

          {errorStock && (
            <div className="text-danger mb-3">{errorStock}</div>
          )}

          <button
            className="btn btn-warning fw-bold text-dark"
            onClick={handleAgregarCarrito}
            disabled={producto.stock === 0}
          >
            {producto.stock === 0 ? "Agotado" : "Añadir al Carrito"}
          </button>
        </div>
      </div>
    </main>
  );
}

import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios"; // <--- Importamos Axios
import "../assets/styles/catalogo.css";

export default function ProductoDetalle() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [producto, setProducto] = useState(null);
  const [cantidad, setCantidad] = useState(1);
  const [errorStock, setErrorStock] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducto = async () => {
      try {
        setLoading(true);
        // Pedimos SOLO el producto específico al backend por su ID
        const response = await axios.get(`http://localhost:3001/api/products/${id}`);
        setProducto(response.data);
      } catch (error) {
        console.error("Error buscando producto:", error);
        setProducto(null);
      } finally {
        setLoading(false);
      }
    };
    fetchProducto();
  }, [id]);

  if (loading) {
    return (
      <div className="text-center my-5">
        <div className="spinner-border text-warning" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
      </div>
    );
  }

  if (!producto) {
    return (
      <main className="container text-center my-5">
        <h2>Producto no encontrado</h2>
        <p>El producto que buscas no existe en nuestra base de datos.</p>
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
    
    // Validaciones básicas
    if (cantidadNum <= 0) {
      setErrorStock("Debe ingresar una cantidad válida.");
      return;
    }
    // Nota: Aquí "producto.stock" es un número real que viene de la BD
    // Asumiremos que el stock existe. (Si no manejas stock en BD aun, esto podría fallar si es null)
    const stockDisponible = producto.stock || 100; // Fallback si no hay dato de stock

    if (cantidadNum > stockDisponible) {
      setErrorStock("No hay suficiente stock disponible.");
      return;
    }

    // --- MANEJO DEL CARRITO (LOCALSTORAGE) ---
    // Mantenemos el carrito en el navegador por ahora
    const carritoGuardado = localStorage.getItem("carrito");
    const carrito = carritoGuardado ? JSON.parse(carritoGuardado) : [];

    const existente = carrito.find((item) => item.id === producto.id);

    if (existente) {
      if (existente.cantidad + cantidadNum > stockDisponible) {
        setErrorStock("No hay suficiente stock para agregar esa cantidad extra.");
        return;
      }
      existente.cantidad += cantidadNum;
    } else {
      carrito.push({
        id: producto.id,
        nombre: producto.nombre,
        precio: producto.precio,
        imagen: producto.imagen || "https://via.placeholder.com/150",
        cantidad: cantidadNum,
        stock: stockDisponible,
      });
    }

    localStorage.setItem("carrito", JSON.stringify(carrito));

    // IMPORTANTE: Ya NO restamos stock de "productos" en localStorage
    // El stock real solo debe bajar cuando se completa la compra en el Backend.

    alert(`Agregaste ${cantidadNum} unidad(es) de "${producto.nombre}" al carrito 🛒`);
    navigate("/carrito");
  };

  const handleCantidadChange = (e) => {
    const val = parseInt(e.target.value);
    if (isNaN(val)) setCantidad("");
    else setCantidad(val);
    setErrorStock("");
  };

  return (
    <main className="container my-5">
      <div className="row align-items-center justify-content-center g-4">
        <div className="col-12 col-md-5 text-center">
          <img
            src={producto.imagen || "https://via.placeholder.com/400x300?text=Sin+Imagen"}
            alt={producto.nombre}
            className="img-fluid rounded shadow-sm"
          />
        </div>

        <div className="col-12 col-md-6">
          <h2 className="fw-bold mb-3">{producto.nombre}</h2>
          <p className="text-muted fs-5 mb-1">
            ${producto.precio.toLocaleString("es-CL")}
          </p>
          
          <span className="badge bg-secondary mb-3">
            {producto.categoria ? producto.categoria.nombre : "General"}
          </span>

          <p className="mb-2 mt-3">
            <strong>Stock disponible: </strong> {producto.stock || "Consultar"}
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
            disabled={!producto.stock || producto.stock === 0}
          >
            {producto.stock === 0 ? "Agotado" : "Añadir al Carrito"}
          </button>
        </div>
      </div>
    </main>
  );
}
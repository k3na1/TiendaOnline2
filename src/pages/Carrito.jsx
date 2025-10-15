import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../assets/styles/carrito.css";

export default function Carrito() {
  const [carrito, setCarrito] = useState([]);
  const navigate = useNavigate();

  // Cargar carrito cada vez que la página cambie
  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("carrito")) || [];
    setCarrito(data);
  }, []);

  const subtotal = carrito.reduce(
    (acc, item) => acc + item.precio * item.cantidad,
    0
  );
  const envio = carrito.length > 0 ? 4000 : 0;
  const total = subtotal + envio;

  const eliminarProducto = (id) => {
    const nuevo = carrito.filter((item) => item.id !== id);
    setCarrito(nuevo);
    localStorage.setItem("carrito", JSON.stringify(nuevo));
  };

  const vaciarCarrito = () => {
    setCarrito([]);
    localStorage.removeItem("carrito");
  };

  const procederPago = () => {
    navigate("/pago");
  };

  return (
    <main className="container my-5">
      <h1 className="text-center mb-5 fw-bold text-coffee">Mi Carrito de Compras</h1>

      {carrito.length === 0 ? (
        <p className="text-center fs-5">Tu carrito está vacío ☕</p>
      ) : (
        <div className="row justify-content-center">
          {/* Columna izquierda */}
          <div className="col-12 col-lg-8">
            {carrito.map((item) => (
              <div
                key={item.id}
                className="d-flex align-items-center justify-content-between bg-light rounded-3 p-3 mb-3 shadow-sm"
              >
                <div className="d-flex align-items-center">
                  <img
                    src={item.imagen}
                    alt={item.nombre}
                    className="me-3 rounded"
                    style={{ width: "70px", height: "70px", objectFit: "cover" }}
                  />
                  <div>
                    <h5 className="mb-1 fw-bold">{item.nombre}</h5>
                    <p className="text-muted mb-0">
                      Precio: ${item.precio.toLocaleString("es-CL")}
                    </p>
                  </div>
                </div>

                <div className="text-end">
                  <p className="mb-1">
                    Subtotal:{" "}
                    <strong>
                      ${(item.precio * item.cantidad).toLocaleString("es-CL")}
                    </strong>
                  </p>
                  <button
                    className="btn btn-link text-danger p-0"
                    onClick={() => eliminarProducto(item.id)}
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Columna derecha */}
          <div className="col-12 col-md-6 col-lg-4">
            <div className="card shadow-sm border-0 rounded-3 p-4">
              <h4 className="text-center mb-3 fw-bold">Resumen</h4>
              <hr />
              <div className="d-flex justify-content-between mb-2">
                <span>Subtotal:</span>
                <strong>${subtotal.toLocaleString("es-CL")}</strong>
              </div>
              <div className="d-flex justify-content-between mb-2">
                <span>Envío:</span>
                <strong>${envio.toLocaleString("es-CL")}</strong>
              </div>
              <div className="d-flex justify-content-between mb-3 fs-5">
                <span>Total:</span>
                <strong>${total.toLocaleString("es-CL")}</strong>
              </div>

              <button
                className="btn btn-coffee fw-bold mb-2"
                onClick={procederPago}
              >
                Proceder al Pago
              </button>
              <button
                className="btn btn-outline-secondary"
                onClick={vaciarCarrito}
              >
                Vaciar Carrito
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

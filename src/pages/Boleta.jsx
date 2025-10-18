import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Boleta() {
  const navigate = useNavigate();
  const [boleta, setBoleta] = useState(null);

  useEffect(() => {
  const timer = setTimeout(() => {
    // Intenta cargar primero desde datosCompra (pago)
    let datos = JSON.parse(localStorage.getItem("datosCompra"));

    // Si no hay datosCompra, intenta cargar desde boletaSeleccionada (admin)
    if (!datos) {
      datos = JSON.parse(localStorage.getItem("boletaSeleccionada"));
    }

    if (!datos) {
      console.warn("⚠️ No se encontraron datos de boleta o compra, redirigiendo...");
      navigate("/productos");
      return;
    }

    const idBoleta =
      datos.id || `#${new Date().getFullYear()}${String(Math.floor(Math.random() * 10000)).padStart(4, "0")}`;

    const nuevaBoleta = { id: idBoleta, ...datos };

    setBoleta(nuevaBoleta);

    // Si viene de Pago, guardamos en historial (para no duplicar desde admin)
    if (localStorage.getItem("datosCompra")) {
      const historial = JSON.parse(localStorage.getItem("boletas")) || [];
      historial.push(nuevaBoleta);
      localStorage.setItem("boletas", JSON.stringify(historial));

      // limpiamos datosCompra después
      setTimeout(() => {
        localStorage.removeItem("datosCompra");
      }, 1500);
    }

    // Si vino desde admin, limpiamos boletaSeleccionada luego
    setTimeout(() => {
      localStorage.removeItem("boletaSeleccionada");
    }, 3000);
  }, 300);

  return () => clearTimeout(timer);
}, [navigate]);



  if (!boleta) {
    return (
      <main className="container text-center my-5">
        <h3>No hay datos de compra disponibles.</h3>
        <button
          className="btn btn-warning fw-bold mt-3"
          onClick={() => navigate("/productos")}
        >
          Volver a la tienda
        </button>
      </main>
    );
  }

  const { id, usuario, carrito, subtotal, envio, total, fecha } = boleta;

  const handleDescargarPDF = () => {
    alert("📄 Simulación: Se descargará la boleta en PDF (próximamente).");
  };

  const handleEnviarCorreo = () => {
    alert(`📧 Boleta enviada a ${usuario?.correo || "tu correo"}`);
  };

  return (
    <main className="container my-5 d-flex justify-content-center">
      <div
        className="shadow p-4 rounded bg-white"
        style={{ maxWidth: "900px", width: "100%" }}
      >
        {/* Encabezado */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h4 className="text-success fw-bold mb-0">
              ✅ Se ha realizado la compra. nro {id}
            </h4>
            <small className="text-muted">
              Completa la siguiente información
            </small>
          </div>
          <span className="text-muted">Código orden: ORDER{id.slice(1)}</span>
        </div>

        {/* Información del cliente */}
        <h5 className="fw-bold mt-3">Información del cliente</h5>
        <div className="row g-3 mb-4">
          <div className="col-md-4">
            <label className="form-label">Nombre</label>
            <input
              className="form-control"
              value={usuario?.nombre || ""}
              disabled
            />
          </div>
          <div className="col-md-4">
            <label className="form-label">Apellidos</label>
            <input
              className="form-control"
              value={usuario?.apellidos || ""}
              disabled
            />
          </div>
          <div className="col-md-4">
            <label className="form-label">Correo</label>
            <input
              className="form-control"
              value={usuario?.correo || ""}
              disabled
            />
          </div>
        </div>

        {/* Dirección de entrega */}
        <h5 className="fw-bold">Dirección de entrega de los productos</h5>
        <div className="row g-3 mb-4">
          <div className="col-md-6">
            <label className="form-label">Calle</label>
            <input
              className="form-control"
              value={envio?.direccion.calle || ""}
              disabled
            />
          </div>
          <div className="col-md-6">
            <label className="form-label">Departamento (opcional)</label>
            <input
              className="form-control"
              value={envio?.direccion.depto || ""}
              disabled
            />
          </div>
          <div className="col-md-6">
            <label className="form-label">Región</label>
            <input
              className="form-control"
              value={envio?.direccion.region || ""}
              disabled
            />
          </div>
          <div className="col-md-6">
            <label className="form-label">Comuna</label>
            <input
              className="form-control"
              value={envio?.direccion.comuna || ""}
              disabled
            />
          </div>
          <div className="col-12">
            <label className="form-label">Indicaciones para la entrega</label>
            <textarea
              className="form-control"
              rows="2"
              value={envio?.direccion.detalles || ""}
              disabled
            ></textarea>
          </div>
        </div>

        {/* Tabla de productos */}
        <div className="table-responsive mb-4">
          <table className="table table-bordered align-middle text-center">
            <thead className="table-light">
              <tr>
                <th>Imagen</th>
                <th>Nombre</th>
                <th>Precio</th>
                <th>Cantidad</th>
                <th>Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {carrito.map((item) => (
                <tr key={item.id}>
                  <td>
                    <img
                      src={item.imagen}
                      alt={item.nombre}
                      style={{ width: "60px", borderRadius: "8px" }}
                    />
                  </td>
                  <td>{item.nombre}</td>
                  <td>${item.precio.toLocaleString("es-CL")}</td>
                  <td>{item.cantidad}</td>
                  <td>
                    ${(item.precio * item.cantidad).toLocaleString("es-CL")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Total */}
        <div className="text-end fw-bold fs-5 mb-3">
          Total pagado:{" "}
          <span className="text-success">
            ${total.toLocaleString("es-CL")}
          </span>
        </div>

        {/* Botones */}
        <div className="d-flex justify-content-end gap-3">
          <button
            className="btn btn-danger fw-bold"
            onClick={handleDescargarPDF}
          >
            Imprimir boleta en PDF
          </button>
          <button
            className="btn btn-success fw-bold"
            onClick={handleEnviarCorreo}
          >
            Enviar boleta por email
          </button>
        </div>
      </div>
    </main>
  );
}

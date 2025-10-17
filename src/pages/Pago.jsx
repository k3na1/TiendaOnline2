import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../assets/styles/pago.css";

export default function Pago() {
  const navigate = useNavigate();
  const [carrito, setCarrito] = useState([]);
  const [subtotal, setSubtotal] = useState(0);
  const ENVIO_CLP = 4000; // 💰 costo fijo de envío
  const [usuario, setUsuario] = useState(null);
  const [form, setForm] = useState({
    calle: "",
    numero: "",
    depto: "",
    region: "",
    comuna: "",
    codigoPostal: "",
    detalles: "",
  });

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("usuarioLogueado"));
    const cartData = JSON.parse(localStorage.getItem("carrito")) || [];

    setUsuario(userData);
    setCarrito(cartData);
    setSubtotal(
      cartData.reduce((acc, item) => acc + item.precio * item.cantidad, 0)
    );
  }, []);

  const totalFinal = subtotal + (carrito.length > 0 ? ENVIO_CLP : 0);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handlePagar = (e) => {
    e.preventDefault();

    if (!usuario) {
      alert("Debes iniciar sesión antes de pagar.");
      navigate("/login");
      return;
    }

    if (!form.calle || !form.numero || !form.region || !form.comuna) {
      alert("Por favor completa todos los campos obligatorios.");
      return;
    }

    // 💾 Guardar datos de compra para la boleta
    localStorage.setItem(
      "datosCompra",
      JSON.stringify({
        usuario,
        carrito,
        subtotal,
        envio: {
          costo: ENVIO_CLP,
          direccion: form,
        },
        total: totalFinal,
        fecha: new Date().toLocaleString(),
      })
    );

    navigate("/boleta");
    
    // 🧹 Vaciar carrito
    localStorage.removeItem("carrito");


  };

  if (carrito.length === 0) {
    return (
      <main className="container text-center my-5">
        <h2>Tu carrito está vacío 🛒</h2>
        <button
          className="btn btn-warning fw-bold mt-3"
          onClick={() => navigate("/productos")}
        >
          Ir a la tienda
        </button>
      </main>
    );
  }

  return (
    <main className="container my-5">
      <h2 className="fw-bold mb-4 text-center">Carrito de compra</h2>

      {/* 🛍 Tabla del carrito */}
      <div className="table-responsive shadow-sm rounded mb-5">
        <table className="tabla-pago table align-middle mb-0">
          <thead className="table-dark">
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
                <td>${(item.precio * item.cantidad).toLocaleString("es-CL")}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 💰 Resumen de precios */}
      <div className="d-flex flex-column align-items-end mb-4">
        <div className="d-flex justify-content-end" style={{ minWidth: 300 }}>
          <div className="me-3 text-muted">Subtotal:</div>
          <div>${subtotal.toLocaleString("es-CL")}</div>
        </div>
        <div className="d-flex justify-content-end" style={{ minWidth: 300 }}>
          <div className="me-3 text-muted">Costo de envío:</div>
          <div>${ENVIO_CLP.toLocaleString("es-CL")}</div>
        </div>
        <div className="d-flex justify-content-end fw-bold fs-5" style={{ minWidth: 300 }}>
          <div className="me-3">Total final:</div>
          <div className="text-success">${totalFinal.toLocaleString("es-CL")}</div>
        </div>
      </div>

      {/* 💳 Formulario de envío */}
      <form
        onSubmit={handlePagar}
        className="form-pago shadow-sm p-4 bg-light rounded"
      >
        <h4 className="fw-bold mb-3">Dirección de entrega</h4>

        <div className="row g-3">
          <div className="col-md-8">
            <label className="form-label">Calle*</label>
            <input
              type="text"
              name="calle"
              className="form-control"
              value={form.calle}
              onChange={handleChange}
            />
          </div>
          <div className="col-md-4">
            <label className="form-label">Número*</label>
            <input
              type="text"
              name="numero"
              className="form-control"
              value={form.numero}
              onChange={handleChange}
            />
          </div>

          <div className="col-md-4">
            <label className="form-label">Depto / Casa</label>
            <input
              type="text"
              name="depto"
              className="form-control"
              value={form.depto}
              onChange={handleChange}
            />
          </div>
          <div className="col-md-4">
            <label className="form-label">Región*</label>
            <input
              type="text"
              name="region"
              className="form-control"
              value={form.region}
              onChange={handleChange}
            />
          </div>
          <div className="col-md-4">
            <label className="form-label">Comuna*</label>
            <input
              type="text"
              name="comuna"
              className="form-control"
              value={form.comuna}
              onChange={handleChange}
            />
          </div>

          <div className="col-md-4">
            <label className="form-label">Código Postal</label>
            <input
              type="text"
              name="codigoPostal"
              className="form-control"
              value={form.codigoPostal}
              onChange={handleChange}
            />
          </div>

          <div className="col-12">
            <label className="form-label">Detalles adicionales</label>
            <textarea
              name="detalles"
              rows="2"
              className="form-control"
              value={form.detalles}
              onChange={handleChange}
            ></textarea>
          </div>
        </div>

        <div className="d-flex justify-content-end mt-4">
          <button type="submit" className="btn btn-success fw-bold px-4 py-2">
            Pagar ahora ${totalFinal.toLocaleString("es-CL")}
          </button>
        </div>
      </form>
    </main>
  );
}

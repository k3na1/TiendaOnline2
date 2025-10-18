import { useEffect, useState } from "react";
import "../../assets/styles/dashboard.css";

export default function AdminBoletas() {
  const [boletas, setBoletas] = useState([]);
  const [busqueda, setBusqueda] = useState("");

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("boletas")) || [];
    setBoletas(data);
  }, []);

  const handleEliminar = (id) => {
    if (window.confirm("¿Seguro que deseas eliminar esta boleta?")) {
      const nuevasBoletas = boletas.filter((b) => b.id !== id);
      setBoletas(nuevasBoletas);
      localStorage.setItem("boletas", JSON.stringify(nuevasBoletas));
    }
  };

  const boletasFiltradas = boletas.filter((b) => {
    const texto = busqueda.toLowerCase();
    return (
      b.id?.toLowerCase().includes(texto) ||
      b.usuario?.nombre?.toLowerCase().includes(texto) ||
      b.usuario?.correo?.toLowerCase().includes(texto)
    );
  });

  return (
    <main className="admin-dashboard">
      <h1 className="mb-4 fw-bold text-light">Boletas</h1>

      {/* Barra superior */}
      <div className="d-flex flex-wrap gap-3 align-items-center mb-4">
        <button
          className="btn btn-danger fw-bold"
          onClick={() => {
            if (window.confirm("¿Seguro que deseas eliminar TODAS las boletas?")) {
              localStorage.removeItem("boletas");
              setBoletas([]);
            }
          }}
        >
          🗑️ Eliminar todo
        </button>

        <input
          type="search"
          className="form-control"
          placeholder="Buscar por ID, nombre o correo..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          style={{
            backgroundColor: "#1c1c1c",
            border: "1px solid #333",
            color: "#fff",
            width: "300px",
          }}
        />
      </div>

      {/* Tabla */}
      <div className="panel">
        <h2 className="panel-title">Listado</h2>
          <table className="tabla">
            <thead>
              <tr>
                <th>ID</th>
                <th>Cliente</th>
                <th>Correo</th>
                <th>Fecha</th>
                <th>Total</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {boletasFiltradas.length > 0 ? (
                boletasFiltradas.map((b) => (
                  <tr key={b.id}>
                    <td>{b.id}</td>
                    <td>{b.usuario?.nombre || "—"}</td>
                    <td>{b.usuario?.correo || "—"}</td>
                    <td>{b.fecha || "—"}</td>
                    <td>${b.total?.toLocaleString("es-CL") || 0}</td>
                    <td>
                      <button
                        className="btn btn-primary btn-sm me-2"
                        onClick={() => {
                          localStorage.setItem("boletaSeleccionada", JSON.stringify(b));
                          window.location.href = "/boleta";
                        }}
                      >
                        Ver boleta
                      </button>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleEliminar(b.id)}
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center text-muted py-4">
                    No hay boletas registradas
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
    </main>
  );
}

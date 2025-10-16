import { useEffect, useState } from "react";
import "../../assets/styles/dashboard.css";

export default function AdminDashboard() {
  const [usuarios, setUsuarios] = useState([]);
  const [productos, setProductos] = useState([]);

  // ======= Cargar datos desde localStorage =======
  useEffect(() => {
    const usuariosLocal = JSON.parse(localStorage.getItem("usuarios")) || [];
    const productosLocal = JSON.parse(localStorage.getItem("productos")) || [];
    setUsuarios(usuariosLocal);
    setProductos(productosLocal);
  }, []);

  // ======= Cálculo de métricas =======
  const totalUsuarios = usuarios.length;
  const totalVendedores = usuarios.filter((u) => u.tipo === "Vendedor").length;
  const totalClientes = usuarios.filter((u) => u.tipo === "Cliente").length;
  const totalProductos = productos.length;
  const totalStock = productos.reduce((acc, p) => acc + (p.stock || 0), 0);

  return (
    <div className="admin-dashboard">
      <h1 className="mb-4 fw-bold text-light">Panel de control</h1>

      {/* KPIs */}
      <section className="kpis d-flex flex-wrap gap-3 mb-5">
        <div className="kpi">
          <span>Usuarios</span>
          <strong>{totalUsuarios}</strong>
        </div>
        <div className="kpi">
          <span>Vendedores</span>
          <strong>{totalVendedores}</strong>
        </div>
        <div className="kpi">
          <span>Clientes</span>
          <strong>{totalClientes}</strong>
        </div>
        <div className="kpi">
          <span>Productos</span>
          <strong>{totalProductos}</strong>
        </div>
        <div className="kpi">
          <span>Stock total</span>
          <strong>{totalStock}</strong>
        </div>
      </section>

      {/* Usuarios recientes */}
      <section className="panel">
        <h2 className="panel-title">Usuarios recientes</h2>

        <div className="d-flex gap-2 mb-3">
          <input
            type="search"
            placeholder="Buscar por RUN, nombre o correo…"
            className="form-control bg-dark text-light border-secondary"
          />
          <button className="btn btn-primary fw-semibold">Ver todos</button>
        </div>

        <div className="table-responsive">
          <table className="table table-dark table-hover align-middle">
            <thead>
              <tr>
                <th>RUN</th>
                <th>Nombre</th>
                <th>Correo</th>
                <th>Tipo</th>
              </tr>
            </thead>
            <tbody>
              {usuarios.length > 0 ? (
                usuarios.slice(0, 5).map((u, i) => (
                  <tr key={i}>
                    <td>{u.run}</td>
                    <td>{u.nombre} {u.apellidos}</td>
                    <td>{u.correo}</td>
                    <td>{u.tipo}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="text-center text-muted">
                    Sin usuarios registrados
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <p className="text-muted mt-2" style={{ fontSize: "0.85rem" }}>
          Edición disponible en <strong>Usuarios</strong>.
        </p>
      </section>
    </div>
  );
}

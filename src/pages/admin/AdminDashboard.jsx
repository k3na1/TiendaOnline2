import { useEffect, useState } from "react";
import { Package, ShoppingBag, Users, DollarSign, FileText } from "lucide-react";
import "../../assets/styles/dashboard.css";

export default function AdminDashboard() {
  const [usuarios, setUsuarios] = useState([]);
  const [productos, setProductos] = useState([]);
  const [boletas, setBoletas] = useState([]);

  // ======= Cargar datos desde localStorage =======
  useEffect(() => {
    const usuariosLocal = JSON.parse(localStorage.getItem("usuarios")) || [];
    const productosLocal = JSON.parse(localStorage.getItem("productos")) || [];
    const boletasLocal = JSON.parse(localStorage.getItem("boletas")) || [];

    setUsuarios(usuariosLocal);
    setProductos(productosLocal);
    setBoletas(boletasLocal);
  }, []);

  // ======= Cálculo de métricas =======
  const totalUsuarios = usuarios.length;
  const totalProductos = productos.length;
  const totalBoletas = boletas.length;

  const totalVentas = boletas.reduce((acc, b) => acc + (b.total || 0), 0);
  const promedioCompra = totalBoletas > 0 ? (totalVentas / totalBoletas).toFixed(0) : 0;

  return (
    <div className="admin-dashboard text-light">
      <h1 className="fw-bold mb-5">Panel de Control</h1>

      {/* 🧮 Tarjetas de métricas */}
      <section
        className="metricas d-grid gap-4 mb-5"
        style={{
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
        }}
      >
        <div className="card-metrica bg-dark p-4 rounded-3 shadow-sm border border-secondary">
          <div className="d-flex justify-content-between align-items-center mb-2">
            <h5 className="m-0">Productos</h5>
            <Package size={28} color="#f1c40f" />
          </div>
          <h2 className="fw-bold text-warning">{totalProductos}</h2>
          <p className="text-muted mb-0">Total registrados</p>
        </div>

        <div className="card-metrica bg-dark p-4 rounded-3 shadow-sm border border-secondary">
          <div className="d-flex justify-content-between align-items-center mb-2">
            <h5 className="m-0">Boletas</h5>
            <FileText size={28} color="#e67e22" />
          </div>
          <h2 className="fw-bold text-warning">{totalBoletas}</h2>
          <p className="text-muted mb-0">Transacciones realizadas</p>
        </div>

        <div className="card-metrica bg-dark p-4 rounded-3 shadow-sm border border-secondary">
          <div className="d-flex justify-content-between align-items-center mb-2">
            <h5 className="m-0">Ventas Totales</h5>
            <DollarSign size={28} color="#2ecc71" />
          </div>
          <h2 className="fw-bold text-success">
            ${totalVentas.toLocaleString("es-CL")}
          </h2>
          <p className="text-muted mb-0">Monto total vendido</p>
        </div>

        <div className="card-metrica bg-dark p-4 rounded-3 shadow-sm border border-secondary">
          <div className="d-flex justify-content-between align-items-center mb-2">
            <h5 className="m-0">Promedio por compra</h5>
            <ShoppingBag size={28} color="#3498db" />
          </div>
          <h2 className="fw-bold text-info">
            ${parseInt(promedioCompra).toLocaleString("es-CL")}
          </h2>
          <p className="text-muted mb-0">Promedio general</p>
        </div>

        <div className="card-metrica bg-dark p-4 rounded-3 shadow-sm border border-secondary">
          <div className="d-flex justify-content-between align-items-center mb-2">
            <h5 className="m-0">Usuarios</h5>
            <Users size={28} color="#9b59b6" />
          </div>
          <h2 className="fw-bold text-info">{totalUsuarios}</h2>
          <p className="text-muted mb-0">Usuarios registrados</p>
        </div>
      </section>

      {/* 🧾 Nota informativa */}
      <p className="text-muted text-center">
        Datos generados a partir de los registros guardados en el sistema.
      </p>
    </div>
  );
}

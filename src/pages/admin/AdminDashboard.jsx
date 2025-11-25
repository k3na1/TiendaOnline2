import { useEffect, useState } from "react";
import axios from "axios"; // <--- 1. Importamos Axios
import { Package, ShoppingBag, Users, DollarSign, FileText } from "lucide-react";
import "../../assets/styles/dashboard.css";

export default function AdminDashboard() {
  const [usuariosCount, setUsuariosCount] = useState(0);
  const [productosCount, setProductosCount] = useState(0);
  const [boletas, setBoletas] = useState([]);
  const [loading, setLoading] = useState(true);

  const API_URL = import.meta.env.VITE_BACKEND_URL;

  // ======= Cargar datos =======
  useEffect(() => {
    const cargarDatos = async () => {
      try {
        setLoading(true);
        // 1. Pedimos Productos y Usuarios a la Base de Datos (Nube)
        const [resUsers, resProducts] = await Promise.all([
          axios.get(`${API_URL}/api/users`),
          axios.get(`${API_URL}/api/products`)
        ]);

        // Guardamos solo la cantidad (length)
        setUsuariosCount(resUsers.data.length);
        setProductosCount(resProducts.data.length);

      } catch (error) {
        console.error("Error cargando métricas del servidor:", error);
      } finally {
        setLoading(false);
      }
    };

    cargarDatos();

    // 2. Boletas siguen desde LocalStorage (Como solicitaste)
    // Nota: Asegúrate de estar guardando un array de "boletas" en algún lado
    // si quieres que esto muestre números distintos de 0.
    const boletasLocal = JSON.parse(localStorage.getItem("boletas")) || [];
    setBoletas(boletasLocal);
  }, []);

  // ======= Cálculo de métricas =======
  // Usamos los estados que vienen de la BD
  const totalUsuarios = usuariosCount; 
  const totalProductos = productosCount;
  
  // Las ventas siguen viniendo del local storage
  const totalBoletas = boletas.length;
  const totalVentas = boletas.reduce((acc, b) => acc + (b.total || 0), 0);
  const promedioCompra = totalBoletas > 0 ? (totalVentas / totalBoletas).toFixed(0) : 0;

  return (
    <div className="admin-dashboard text-light">
      <h1 className="fw-bold mb-5">Panel de Control</h1>

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-warning" role="status">
            <span className="visually-hidden">Cargando métricas...</span>
          </div>
        </div>
      ) : (
        /* 🧮 Tarjetas de métricas */
        <section
          className="metricas d-grid gap-4 mb-5"
          style={{
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          }}
        >
          {/* PRODUCTOS (Base de Datos) */}
          <div className="card-metrica bg-dark p-4 rounded-3 shadow-sm border border-secondary">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <h5 className="m-0">Productos</h5>
              <Package size={28} color="#f1c40f" />
            </div>
            <h2 className="fw-bold text-warning">{totalProductos}</h2>
            <p className="text-muted mb-0">En inventario (Nube)</p>
          </div>

          {/* BOLETAS (Local Storage) */}
          <div className="card-metrica bg-dark p-4 rounded-3 shadow-sm border border-secondary">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <h5 className="m-0">Boletas</h5>
              <FileText size={28} color="#e67e22" />
            </div>
            <h2 className="fw-bold text-warning">{totalBoletas}</h2>
            <p className="text-muted mb-0">Transacciones locales</p>
          </div>

          {/* VENTAS TOTALES (Local Storage) */}
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

          {/* PROMEDIO (Local Storage) */}
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

          {/* USUARIOS (Base de Datos) */}
          <div className="card-metrica bg-dark p-4 rounded-3 shadow-sm border border-secondary">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <h5 className="m-0">Usuarios</h5>
              <Users size={28} color="#9b59b6" />
            </div>
            <h2 className="fw-bold text-info">{totalUsuarios}</h2>
            <p className="text-muted mb-0">Registrados en BD</p>
          </div>
        </section>
      )}

      {/* 🧾 Nota informativa */}
      <p className="text-muted text-center">
        Métricas combinadas: Inventario y Usuarios desde la Nube ☁️ | Ventas desde Almacenamiento Local 💾
      </p>
    </div>
  );
}
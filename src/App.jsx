import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route} from "react-router-dom";

import TiendaLayout from './layouts/TiendaLayout.jsx'
import AdminLayout from './layouts/AdminLayout.jsx'

/*Imports de tienda */
import Home from './pages/Home.jsx'
import Productos from './pages/Productos.jsx'
import ProductoDetalle from './pages/ProductoDetalle.jsx'
import Carrito from './pages/Carrito.jsx'
import Registro from './pages/Registro.jsx'
import Login from './pages/Login.jsx'

/*Imports de admin */
import AdminDashboard from './pages/admin/AdminDashboard.jsx'
import AdminUsuarios from './pages/admin/AdminUsuarios.jsx'

import "./assets/styles/global.css"

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    <Router>
      <Routes>
      {/* Rutas de la aplicación */}
      {/*Home*/}
      <Route path="/" element={<TiendaLayout><Home /></TiendaLayout>} />
      {/*Productos*/}
      <Route path="/productos" element={<TiendaLayout><Productos /></TiendaLayout>} />
      <Route path="/producto/:id" element={<TiendaLayout><ProductoDetalle /></TiendaLayout>} />
      <Route path="/carrito" element={<TiendaLayout><Carrito /></TiendaLayout>} />
      {/*Registro y Login*/}
      <Route path="/registro" element={<TiendaLayout><Registro /></TiendaLayout>} />
      <Route path="/login" element={<TiendaLayout><Login /></TiendaLayout>} />
      {/*Rutas de admin*/}
      <Route path="/admin" element={<AdminLayout><AdminDashboard /></AdminLayout>} />
      <Route path="/admin/usuarios" element={<AdminLayout><AdminUsuarios /></AdminLayout>} />
    </Routes>
    </Router>
    </>
  )
}

export default App

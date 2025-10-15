import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import TiendaLayout from './layouts/TiendaLayout.jsx';

/* Imports de tienda */
import Home from './pages/Home.jsx';
import Productos from './pages/Productos.jsx';
import ProductoDetalle from './pages/ProductoDetalle.jsx';
import Carrito from './pages/Carrito.jsx';
import Registro from './pages/Registro.jsx';
import Login from './pages/Login.jsx';
// --- Nuevos imports ---
import Contacto from './pages/Contacto.jsx';
import Nosotros from './pages/Nosotros.jsx';
import Blogs from './pages/Blogs.jsx';
import BlogDetalle from './pages/BlogDetalle.jsx';


import "./assets/styles/global.css";

function App() {
  return (
    <>
      <Router>
        <Routes>
          {/* Rutas existentes */}
          <Route path="/" element={<TiendaLayout><Home /></TiendaLayout>} />
          <Route path="/productos" element={<TiendaLayout><Productos /></TiendaLayout>} />
          <Route path="/producto/:id" element={<TiendaLayout><ProductoDetalle /></TiendaLayout>} />
          <Route path="/carrito" element={<TiendaLayout><Carrito /></TiendaLayout>} />
          <Route path="/registro" element={<TiendaLayout><Registro /></TiendaLayout>} />
          <Route path="/login" element={<TiendaLayout><Login /></TiendaLayout>} />
          
          {/* --- Nuevas Rutas --- */}
          <Route path="/contacto" element={<TiendaLayout><Contacto /></TiendaLayout>} />
          <Route path="/nosotros" element={<TiendaLayout><Nosotros /></TiendaLayout>} />
          <Route path="/blogs" element={<TiendaLayout><Blogs /></TiendaLayout>} />
          <Route path="/blog/:id" element={<TiendaLayout><BlogDetalle /></TiendaLayout>} />

        </Routes>
      </Router>
    </>
  );
}

export default App;
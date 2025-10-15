import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route} from "react-router-dom";

import Navbar from './components/Navbar.jsx'
import Footer from './components/Footer.jsx'
import Home from './pages/Home.jsx'
import Productos from './pages/Productos.jsx'
import ProductoDetalle from './pages/ProductoDetalle.jsx'
import Carrito from './pages/Carrito.jsx'


import "./assets/styles/global.css"

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    <Router>
    <Navbar />
    <Routes>
      {/* Rutas de la aplicación */}
      {/*Home*/}
      <Route path="/" element={<Home />} />
      {/*Productos*/}
      <Route path="/productos" element={<Productos />} />
      <Route path="/producto/:id" element={<ProductoDetalle />} />
      <Route path="/carrito" element={<Carrito />} />
    </Routes>
    <Footer />
    </Router>
    </>
  )
}

export default App

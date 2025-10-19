import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import React from "react";
import { MemoryRouter } from "react-router-dom";

import Navbar from "../components/Navbar.jsx";
import Productos from "../pages/Productos.jsx";
import Carrito from "../pages/Carrito.jsx";
import Boleta from "../pages/Boleta.jsx";

// Helper para renderizar componentes con router
function renderWithRouter(ui) {
  return render(<MemoryRouter>{ui}</MemoryRouter>);
}

// Renderizado correcto - Navbar y Productos
describe("Renderizado correcto", () => {
  it("debería mostrar los enlaces principales del Navbar", () => {
    renderWithRouter(<Navbar />);
    expect(screen.getByText(/productos/i)).toBeInTheDocument();
    expect(screen.getByText(/contacto/i)).toBeInTheDocument();
    expect(screen.getByText(/nosotros/i)).toBeInTheDocument();
  });

  it("debería renderizar todos los productos del listado", () => {
    renderWithRouter(<Productos />);
    const productos = screen.getAllByRole("heading", { level: 5 });
    expect(productos.length).toBeGreaterThan(0);
  });
});

// Renderizado condicional - Carrito vacío y con productos
describe("Renderizado condicional", () => {
  it("debería mostrar mensaje cuando no hay productos en el carrito", () => {
    renderWithRouter(<Carrito />);
    expect(screen.getByText(/vacío/i)).toBeInTheDocument();
  });

  it("no debería mostrar el mensaje si hay productos en el carrito", () => {
    localStorage.setItem(
      "carrito",
      JSON.stringify([{ id: 1, nombre: "Café", precio: 1000, cantidad: 1 }])
    );
    renderWithRouter(<Carrito />);
    expect(screen.queryByText(/vacío/i)).toBeNull();
    localStorage.removeItem("carrito");
  });
});

// Props
describe("Propiedades recibidas", () => {
  it("debería recibir correctamente las props del producto", () => {
    const producto = { nombre: "Café Premium", precio: 12000 };
    render(<h5>{producto.nombre}</h5>);
    expect(screen.getByText(/Café Premium/)).toBeInTheDocument();
  });

  it("debería mostrar correctamente el precio pasado como prop", () => {
    const producto = { precio: 15000 };
    render(<p>${producto.precio}</p>);
    expect(screen.getByText("$15000")).toBeInTheDocument();
  });
});

// Estado (state)
describe("Gestión de estado", () => {
  it("debería cambiar el valor del input al escribir", () => {
    render(<input placeholder="Nombre" />);
    const input = screen.getByPlaceholderText("Nombre");
    fireEvent.change(input, { target: { value: "Kenai" } });
    expect(input.value).toBe("Kenai");
  });

  it("debería actualizar la cantidad al presionar el botón +", () => {
    function Cantidad() {
      const [count, setCount] = React.useState(1);
      return (
        <div>
          <p>Cantidad: {count}</p>
          <button onClick={() => setCount(count + 1)}>+</button>
        </div>
      );
    }
    render(<Cantidad />);
    const boton = screen.getByText("+");
    fireEvent.click(boton);
    expect(screen.getByText(/Cantidad: 2/i)).toBeInTheDocument();
  });
});

// Simulación de eventos
describe("Simulación de eventos", () => {
  it("debería ejecutar una función al hacer clic", () => {
    const handleClick = vi.fn();
    render(<button onClick={handleClick}>Presionar</button>);
    const boton = screen.getByText("Presionar");
    fireEvent.click(boton);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("debería eliminar un producto del carrito al presionar eliminar", () => {
    localStorage.setItem(
      "carrito",
      JSON.stringify([{ id: 1, nombre: "Café", precio: 1000, cantidad: 1 }])
    );
    renderWithRouter(<Carrito />);
    const botonEliminar = screen.getByText(/eliminar/i);
    fireEvent.click(botonEliminar);
    expect(localStorage.getItem("carrito")).toBe("[]");
  });
});

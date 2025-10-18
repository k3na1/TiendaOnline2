import { useState } from "react";
import "../assets/styles/contacto.css";

export default function Contacto() {
  const [enviado, setEnviado] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setEnviado(true);
    setTimeout(() => {
      setEnviado(false);
      e.target.reset();
    }, 3000);
  };

  return (
    <main className="main-contacto container my-5">
      <h1 className="text-center mb-4 fw-bold text-coffee">Contáctanos</h1>
      <p className="text-center text-muted mb-5">
        Si tienes alguna duda o consulta, completa este formulario y te responderemos pronto.
      </p>

      <form
        onSubmit={handleSubmit}
        className="mx-auto bg-light p-4 rounded-3 shadow-sm contact-form"
        style={{ maxWidth: "600px" }}
      >
        <div className="mb-3">
          <label htmlFor="nombre" className="form-label fw-bold">Nombre</label>
          <input type="text" id="nombre" name="nombre" className="form-control" required />
        </div>

        <div className="mb-3">
          <label htmlFor="correo" className="form-label fw-bold">Correo</label>
          <input type="email" id="correo" name="correo" className="form-control" required />
        </div>

        <div className="mb-3">
          <label htmlFor="mensaje" className="form-label fw-bold">Mensaje</label>
          <textarea id="mensaje" name="mensaje" rows="5" className="form-control" required></textarea>
        </div>

        <div className="text-center">
            <button type="submit" className="btn btn-warning fw-bold text-dark px-4">
                Enviar
            </button>
        </div>
      </form>

      {enviado && (
        <p className="text-center text-success mt-4">
          ✅ Tu mensaje fue enviado correctamente (simulación).
        </p>
      )}
    </main>
  );
}
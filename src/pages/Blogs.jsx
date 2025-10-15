import { Link } from "react-router-dom";
import "../assets/styles/blogs.css";

export default function Blogs() {
  const entradas = [
    {
      id: 1,
      titulo: "Guía para Principiantes: Cómo Elegir tu Café Ideal",
      resumen: "¿Te sientes perdido entre tantos orígenes, tuestes y perfiles de sabor? Te ayudamos a encontrar el grano perfecto para ti.",
      imagen: "https://via.placeholder.com/400x250.png?text=Granos+de+Cafe"
    },
    {
      id: 2,
      titulo: "El Arte del Latte: Secretos para una Espuma Perfecta",
      resumen: "Conviértete en un barista en casa. Te enseñamos las técnicas y secretos para lograr una espuma de leche cremosa y sedosa.",
      imagen: "https://via.placeholder.com/400x250.png?text=Arte+Latte"
    }
  ];

  return (
    <main className="container my-5">
      <div className="blog-container">
        <h1 className="text-center fw-bold text-coffee">Nuestro Blog del Café</h1>
        <p className="text-center text-muted mb-5">
          Descubre secretos, guías y noticias del fascinante mundo del café de especialidad.
        </p>

        <div className="blog-grid">
          {entradas.map(entrada => (
            <div key={entrada.id} className="blog-card">
              <img src={entrada.imagen} alt={entrada.titulo} className="blog-card-img" />
              <div className="blog-card-content">
                <h3>{entrada.titulo}</h3>
                <p>{entrada.resumen}</p>
                <Link to={`/blog/${entrada.id}`} className="btn btn-dark fw-bold mt-auto">
                  Leer más
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
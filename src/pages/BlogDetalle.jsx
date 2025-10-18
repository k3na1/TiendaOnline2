import { useParams, Link } from "react-router-dom";
import "../assets/styles/blogs.css";

export default function BlogDetalle() {
  const { id } = useParams();

  // Aquí tendrías la lógica para cargar los datos del blog por su ID
  const contenidoBlogs = {
    "1": {
      titulo: "Guía para Principiantes: Cómo Elegir tu Café Ideal",
      fecha: "10 de Septiembre, 2025",
      imagen: "https://www.diegocoquillat.com/wp-content/uploads/2016/01/Propper-Coffe.jpg",
      contenido: (
        <>
          <p>
            Entrar en el mundo del café de especialidad puede ser abrumador. Con términos como "origen único", "tueste claro" o "notas afrutadas", es fácil perderse. Pero no te preocupes, estamos aquí para guiarte. La clave para encontrar tu café ideal es entender tres conceptos básicos: origen, tueste y método de preparación.
          </p>
          <p>
            <strong>El Origen:</strong> ¿De dónde viene tu café? Los granos de Etiopía suelen ser florales y cítricos, mientras que los de Brasil son más achocolatados y con cuerpo. Experimentar con cafés de diferentes países es el primer paso para descubrir tus preferencias.
          </p>
          <p>
            <strong>El Tueste:</strong> Un tueste claro preserva los sabores originales del grano, resultando en mayor acidez y notas más complejas. Un tueste oscuro, en cambio, desarrolla sabores más amargos y achocolatados, reduciendo la acidez. Si te gustan los sabores intensos, prueba un tueste oscuro. Si prefieres algo más delicado y aromático, un tueste claro es para ti.
          </p>
        </>
      )
    },
     "2": {
      titulo: "El Arte del Latte: Secretos para una Espuma Perfecta",
      fecha: "05 de Septiembre, 2025",
      imagen: "https://www.cafesaula.com/blog/wp-content/uploads/2019/07/Cups-of-coffee-with-beautiful-latte-art.jpg",
      contenido: (
         <>
          <p>
              Un buen latte es una obra de arte, y el lienzo es una espuma de leche perfectamente texturizada. Lograr esa microespuma sedosa en casa puede parecer un desafío, pero con la técnica correcta, es más fácil de lo que crees. El secreto no está solo en el vapor, sino en la leche y la temperatura.
          </p>
          <p>
              <strong>La Leche es Clave:</strong> Utiliza siempre leche entera y muy fría. El contenido de grasa y proteína es fundamental para crear una espuma estable y con brillo. La baja temperatura inicial te da más tiempo para texturizarla antes de que se caliente demasiado.
          </p>
          <p>
              <strong>La Técnica:</strong> Hay dos fases. Primero, la "aireación", donde introduces la punta de la lanceta de vapor justo debajo de la superficie de la leche para inyectar aire y crear volumen. Escucharás un siseo suave. Una vez que la jarra se sienta tibia al tacto, sumerge la lanceta más profundamente para la segunda fase: la "emulsión". Aquí, creas un remolino que integra el aire y rompe las burbujas grandes, dejando una textura de "pintura fresca". ¡Nunca dejes que la leche hierva! El punto ideal es alrededor de 65°C.
          </p>
        </>
      )
    }
  };

  const blog = contenidoBlogs[id];

  if (!blog) return <main className="container my-5 text-center"><h2>Entrada de blog no encontrada.</h2></main>

  return (
    <main className="container my-5">
      <article className="blog-post">
        <img src={blog.imagen} alt={blog.titulo} className="blog-post-img" />
        <h1>{blog.titulo}</h1>
        <div className="blog-post-meta">
          Publicado el {blog.fecha} por el Equipo CoffeeShop
        </div>
        <div className="blog-post-content">
          {blog.contenido}
          <Link to="/blogs" className="back-link">&larr; Volver al blog</Link>
        </div>
      </article>
    </main>
  );
}
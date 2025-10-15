import "../assets/styles/nosotros.css";

export default function Nosotros() {
  const equipo = [
    {
      nombre: "Benjamin Martinez",
      puesto: "Maestro Tostador y Fundador",
      img: "https://via.placeholder.com/150",
    },
    {
      nombre: "Francisco Aranguiz",
      puesto: "Barista Principal y Co-Fundador",
      img: "https://via.placeholder.com/150",
    },
    {
      nombre: "Diego Benitez",
      puesto: "Encargado de Experiencia",
      img: "https://via.placeholder.com/150",
    },
  ];

  return (
    <main className="container my-5">
      <section className="about-section">
        <h1 className="text-center fw-bold text-coffee">Nuestra Historia</h1>
        <p>
          CoffeeShop nació en 2024 de un sueño compartido entre un grupo de amigos apasionados por el café de especialidad. Lo que comenzó como un pequeño puesto en un mercado local, con granos tostados artesanalmente cada mañana, rápidamente se convirtió en un refugio para los amantes del buen café en la ciudad.
        </p>
        <p>
          Creemos que cada taza de café cuenta una historia: la del agricultor que cultivó el grano, la del tostador que reveló su potencial y la tuya, al disfrutarlo. Por eso, nos dedicamos a ofrecer una experiencia única, desde la selección de los mejores granos de origen hasta el último sorbo.
        </p>

        <h2 className="mt-5 text-coffee fw-bold">Misión y Visión</h2>
        <p>
          <strong>Nuestra Misión:</strong> Servir café excepcional de manera sostenible y crear un espacio acogedor donde nuestra comunidad pueda conectar y compartir.
        </p>
        <p>
          <strong>Nuestra Visión:</strong> Ser reconocidos como el corazón de la cultura del café en la región, inspirando momentos memorables una taza a la vez.
        </p>

        <h2 className="mt-5 text-center text-coffee fw-bold">Nuestro Equipo</h2>
        <div className="team-grid">
          {equipo.map((miembro, index) => (
            <div key={index} className="team-member">
              <img src={miembro.img} alt={`Foto de ${miembro.nombre}`} />
              <h3>{miembro.nombre}</h3>
              <span>{miembro.puesto}</span>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
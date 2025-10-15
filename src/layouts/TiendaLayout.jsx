import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function TiendaLayout({ children }) {
  return (
    <>
      <Navbar />
      <main>{children}</main>
      <Footer />
    </>
  );
}

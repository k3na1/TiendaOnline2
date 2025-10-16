import NavbarAdmin from "../components/NavbarAdmin";
import "../assets/styles/admin.css";

export default function AdminLayout({ children }) {
  return (
    <div className="admin-layout">
      <NavbarAdmin />
      <div className="admin-content">{children}</div>
    </div>
  );
}

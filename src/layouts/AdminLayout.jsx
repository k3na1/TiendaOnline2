import NavbarAdmin from "../components/NavbarAdmin";

export default function AdminLayout({ children }) {
  return (
    <div className="admin-layout">
      <NavbarAdmin />
      <div className="admin-content">{children}</div>
    </div>
  );
}
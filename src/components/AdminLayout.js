import React from "react";
import AdminSideNav from "./AdminSideNav";
import "./AdminLayout.css";

function AdminLayout({ children }) {
  return (
    <div className="admin_layout">
      <AdminSideNav />
      <main className="admin_layout_content">{children}</main>
    </div>
  );
}

export default AdminLayout;

import { useAuth } from "../context/AuthContext";
import { NavLink } from "react-router-dom";
import {
  CSidebar,
  CSidebarBrand,
  CSidebarNav,
  CNavItem,
  CNavTitle,
} from "@coreui/react";
import { useState } from "react";
import {
  MdDashboard,
  MdBed,
  MdShoppingCart,
  MdInventory,
  MdPeople,
  MdChevronLeft,
  MdChevronRight,
} from "react-icons/md";

const AppSidebar = () => {
  const { user } = useAuth();
  const [collapsed, setCollapsed] = useState(false);

  const navItems = [
    { to: "/dashboard", icon: <MdDashboard size={20} />, label: "Dashboard" },
    { to: "/blankets", icon: <MdBed size={20} />, label: "Blankets" },
    { to: "/orders", icon: <MdShoppingCart size={20} />, label: "Orders" },
    { to: "/inventory", icon: <MdInventory size={20} />, label: "Inventory" },
    ...(user?.role === "Manufacturer"
      ? [{ to: "/users", icon: <MdPeople size={20} />, label: "Users" }]
      : []),
  ];

  return (
    <CSidebar
      colorScheme="dark"
      position="fixed"
      style={{
        width: collapsed ? "64px" : "240px",
        transition: "width 0.3s ease",
        overflow: "hidden",
      }}
    >
      {/* Brand */}
      <CSidebarBrand
        className="d-flex align-items-center justify-content-center py-3"
        style={{ minHeight: "60px" }}
      >
        <span style={{ fontSize: "1.5rem" }}>🛏️</span>
        {!collapsed && (
          <span
            className="ms-2 fw-bold"
            style={{ whiteSpace: "nowrap", fontSize: "1rem" }}
          >
            Cozy Comfort
          </span>
        )}
      </CSidebarBrand>

      <hr className="text-white-50 my-0" />

      {/* Nav Items */}
      <CSidebarNav className="py-2">
        {!collapsed && (
          <CNavTitle style={{ fontSize: "0.7rem", letterSpacing: "0.1em" }}>
            MAIN MENU
          </CNavTitle>
        )}

        {navItems.map(({ to, icon, label }) => (
          <CNavItem key={to}>
            <NavLink
              to={to}
              className={({ isActive }) =>
                `nav-link d-flex align-items-center gap-3 px-3 py-2 rounded mx-2 my-1 ${
                  isActive ? "bg-primary text-white" : "text-white-50"
                }`
              }
              style={{ transition: "background 0.2s", whiteSpace: "nowrap" }}
            >
              <span style={{ flexShrink: 0 }}>{icon}</span>
              {!collapsed && <span>{label}</span>}
            </NavLink>
          </CNavItem>
        ))}
      </CSidebarNav>

      {/* Toggle Button */}
      <div className="mt-auto">
        <hr className="text-white-50 my-0" />
        <button
          onClick={() => setCollapsed((prev) => !prev)}
          className="btn w-100 d-flex align-items-center justify-content-center py-3"
          style={{
            background: "transparent",
            border: "none",
            color: "#adb5bd",
            cursor: "pointer",
            transition: "color 0.2s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "#fff")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "#adb5bd")}
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? (
            <MdChevronRight size={22} />
          ) : (
            <MdChevronLeft size={22} />
          )}
          {!collapsed && <span className="ms-2 small">Collapse</span>}
        </button>
      </div>
    </CSidebar>
  );
};

export default AppSidebar;

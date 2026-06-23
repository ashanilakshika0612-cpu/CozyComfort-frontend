import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { CHeader, CHeaderNav, CNavItem, CButton, CBadge } from "@coreui/react";

const AppHeader = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // Role badge color
  const roleColor = {
    Manufacturer: "danger",
    Distributor: "warning",
    Seller: "success",
  };

  return (
    <CHeader position="sticky" className="mb-4">
      <CHeaderNav className="ms-auto me-3 d-flex align-items-center gap-3">
        {/* User name and role */}
        <CNavItem>
          <span className="fw-semibold me-2">Hi! {user?.name}</span>
          <CBadge color={roleColor[user?.role] || "secondary"}>
            {user?.role}
          </CBadge>
        </CNavItem>

        {/* Logout button */}
        <CNavItem>
          <CButton color="danger" size="sm" onClick={handleLogout}>
            Logout
          </CButton>
        </CNavItem>
      </CHeaderNav>
    </CHeader>
  );
};

export default AppHeader;

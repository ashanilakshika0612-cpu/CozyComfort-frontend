import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { getAllBlankets } from "../../api/blanketApi";
import { getAllOrders } from "../../api/orderApi";
import { getInventory } from "../../api/inventoryApi";
import { getAllUsers } from "../../api/userApi";
import {
  CCard,
  CCardBody,
  CRow,
  CCol,
  CWidgetStatsA,
  CSpinner,
} from "@coreui/react";

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    blankets: 0,
    orders: 0,
    inventory: 0,
    users: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [blankets, orders, inventory] = await Promise.all([
          getAllBlankets(),
          getAllOrders(),
          getInventory(),
        ]);

        let userCount = 0;
        if (user?.role === "Manufacturer") {
          const users = await getAllUsers();
          userCount = users.data.length;
        }

        setStats({
          blankets: blankets.data.length,
          orders: orders.data.length,
          inventory: inventory.data.length,
          users: userCount,
        });
      } catch (error) {
        console.error("Dashboard load error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading)
    return (
      <div className="text-center py-5">
        <CSpinner color="primary" />
        <p className="mt-2">Loading dashboard...</p>
      </div>
    );

  return (
    <div>
      {/* Welcome message */}
      <div className="mb-4">
        <h3>Welcome, {user?.name}!</h3>
        <p className="text-muted">
          You are logged in as <strong>{user?.role}</strong>
        </p>
      </div>

      {/* Stats cards */}
      <CRow className="g-4">
        <CCol sm={6} xl={3}>
          <CWidgetStatsA
            color="primary"
            value={stats.blankets.toString()}
            title="Total Blankets"
            className="shadow-sm"
          />
        </CCol>

        <CCol sm={6} xl={3}>
          <CWidgetStatsA
            color="warning"
            value={stats.orders.toString()}
            title="Total Orders"
            className="shadow-sm"
          />
        </CCol>

        <CCol sm={6} xl={3}>
          <CWidgetStatsA
            color="success"
            value={stats.inventory.toString()}
            title="Inventory Items"
            className="shadow-sm"
          />
        </CCol>

        {user?.role === "Manufacturer" && (
          <CCol sm={6} xl={3}>
            <CWidgetStatsA
              color="danger"
              value={stats.users.toString()}
              title="Total Users"
              className="shadow-sm"
            />
          </CCol>
        )}
      </CRow>

      {/* Role info card */}
      <CRow className="mt-4">
        <CCol md={12}>
          <CCard className="border-0 shadow-sm">
            <CCardBody>
              <h5>Your Permissions</h5>
              <hr />
              {user?.role === "Manufacturer" && (
                <ul>
                  <li>Blankets Add and Manage </li>
                  <li>All order can show</li>
                  <li>Inventory manage </li>
                  <li>Users manage</li>
                </ul>
              )}
              {user?.role === "Distributor" && (
                <ul>
                  <li>Blanket list can be shown</li>
                  <li>Orders can be viewed and managed</li>
                  <li>Inventory can be managed</li>
                  <li>Users cannot be managed</li>
                </ul>
              )}
              {user?.role === "Seller" && (
                <ul>
                  <li>Blankets can be viewed</li>
                  <li>Orders can be placed</li>
                  <li>Stock availability can be checked</li>
                  <li>Inventory / Users cannot be managed</li>
                </ul>
              )}
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </div>
  );
};

export default Dashboard;

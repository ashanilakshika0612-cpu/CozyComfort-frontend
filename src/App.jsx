import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import MainLayout from "./layouts/MainLayout";

import Login from "./pages/auth/Login";
import Dashboard from "./pages/dashboard/Dashboard";
import BlanketList from "./pages/blankets/BlanketList";
import BlanketForm from "./pages/blankets/BlanketForm";
import OrderList from "./pages/orders/OrderList";
import OrderForm from "./pages/orders/OrderForm";
import InventoryList from "./pages/inventory/InventoryList";
import UserList from "./pages/users/UserList";
import UserForm from "./pages/users/UserForm";

import "bootstrap/dist/css/bootstrap.min.css";
import "@coreui/coreui/dist/css/coreui.min.css";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <ToastContainer position="top-right" autoClose={3000} />
        <Routes>
          {/* Public route - login කරන්නේ නැති කෙනෙකුට */}
          <Route path="/login" element={<Login />} />

          {/* Protected routes - login කළ කෙනෙකුට පමණයි */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <MainLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="/dashboard" />} />
            <Route path="dashboard" element={<Dashboard />} />

            {/* Blankets */}
            <Route path="blankets" element={<BlanketList />} />
            <Route
              path="blankets/add"
              element={
                <ProtectedRoute roles={["Manufacturer"]}>
                  <BlanketForm />
                </ProtectedRoute>
              }
            />

            {/* Orders */}
            <Route path="orders" element={<OrderList />} />
            <Route path="orders/new" element={<OrderForm />} />

            {/* Inventory */}
            <Route path="inventory" element={<InventoryList />} />

            {/* Users - Manufacturer only */}
            <Route
              path="users"
              element={
                <ProtectedRoute roles={["Manufacturer"]}>
                  <UserList />
                </ProtectedRoute>
              }
            />
            <Route
              path="users/add"
              element={
                <ProtectedRoute roles={["Manufacturer"]}>
                  <UserForm />
                </ProtectedRoute>
              }
            />
          </Route>

          {/* Unknown URL → dashboard */}
          <Route path="*" element={<Navigate to="/dashboard" />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;

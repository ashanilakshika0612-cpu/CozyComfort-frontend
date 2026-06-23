import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { getAllOrders, updateOrderStatus } from "../../api/orderApi";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  CCard,
  CCardBody,
  CCardHeader,
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
  CButton,
  CSpinner,
  CBadge,
  CFormSelect,
} from "@coreui/react";

const statusColor = {
  Pending: "warning",
  Confirmed: "info",
  Processing: "primary",
  Shipped: "secondary",
  Delivered: "success",
  Cancelled: "danger",
};

const OrderList = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      const res = await getAllOrders();
      setOrders(res.data);
    } catch {
      toast.error("Orders load කරන්න බැරි වුණා!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusChange = async (orderId, statusId) => {
    try {
      await updateOrderStatus(orderId, parseInt(statusId));
      toast.success("Order status update කෙරුණා!");
      fetchOrders();
    } catch {
      toast.error("Status update කරන්න බැරි වුණා!");
    }
  };

  if (loading)
    return (
      <div className="text-center py-5">
        <CSpinner color="primary" />
      </div>
    );

  return (
    <CCard className="shadow-sm border-0">
      <CCardHeader className="d-flex justify-content-between align-items-center">
        <h5 className="mb-0">🛒 Orders</h5>
        {(user?.role === "Seller" || user?.role === "Distributor") && (
          <CButton
            color="primary"
            size="sm"
            onClick={() => navigate("/orders/new")}
          >
            + New Order
          </CButton>
        )}
      </CCardHeader>

      <CCardBody>
        <CTable hover responsive striped>
          <CTableHead color="dark">
            <CTableRow>
              <CTableHeaderCell>Order #</CTableHeaderCell>
              <CTableHeaderCell>Placed By</CTableHeaderCell>
              <CTableHeaderCell>Distributor</CTableHeaderCell>
              <CTableHeaderCell>Total (Rs.)</CTableHeaderCell>
              <CTableHeaderCell>Date</CTableHeaderCell>
              <CTableHeaderCell>Status</CTableHeaderCell>
              {(user?.role === "Manufacturer" ||
                user?.role === "Distributor") && (
                <CTableHeaderCell>Update Status</CTableHeaderCell>
              )}
            </CTableRow>
          </CTableHead>

          <CTableBody>
            {orders.length === 0 ? (
              <CTableRow>
                <CTableDataCell
                  colSpan={7}
                  className="text-center text-muted py-4"
                >
                  No orders found!
                </CTableDataCell>
              </CTableRow>
            ) : (
              orders.map((o) => (
                <CTableRow key={o.id}>
                  <CTableDataCell className="fw-bold">
                    {o.orderNumber}
                  </CTableDataCell>
                  <CTableDataCell>{o.placedBy}</CTableDataCell>
                  <CTableDataCell>{o.distributorName}</CTableDataCell>
                  <CTableDataCell>
                    Rs. {o.totalAmount.toLocaleString()}
                  </CTableDataCell>
                  <CTableDataCell>
                    {new Date(o.orderDate).toLocaleDateString()}
                  </CTableDataCell>
                  <CTableDataCell>
                    <CBadge color={statusColor[o.status] || "secondary"}>
                      {o.status}
                    </CBadge>
                  </CTableDataCell>
                  {(user?.role === "Manufacturer" ||
                    user?.role === "Distributor") && (
                    <CTableDataCell>
                      <CFormSelect
                        size="sm"
                        style={{ width: "140px" }}
                        value=""
                        onChange={(e) =>
                          handleStatusChange(o.id, e.target.value)
                        }
                      >
                        <option value="" disabled>
                          Change...
                        </option>
                        <option value="2">Confirmed</option>
                        <option value="3">Processing</option>
                        <option value="4">Shipped</option>
                        <option value="5">Delivered</option>
                        <option value="6">Cancelled</option>
                      </CFormSelect>
                    </CTableDataCell>
                  )}
                </CTableRow>
              ))
            )}
          </CTableBody>
        </CTable>
      </CCardBody>
    </CCard>
  );
};

export default OrderList;

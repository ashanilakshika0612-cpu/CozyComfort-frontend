import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createOrder } from "../../api/orderApi";
import { getAllBlankets } from "../../api/blanketApi";
import { toast } from "react-toastify";
import axiosInstance from "../../api/axiosInstance";
import {
  CCard,
  CCardBody,
  CCardHeader,
  CForm,
  CFormLabel,
  CFormSelect,
  CFormInput,
  CFormTextarea,
  CButton,
  CSpinner,
  CRow,
  CCol,
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
  CAlert,
} from "@coreui/react";

const OrderForm = () => {
  const navigate = useNavigate();
  const [blankets, setBlankets] = useState([]);
  const [distributors, setDistributors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [orderItems, setOrderItems] = useState([
    { blanketId: "", quantity: 1 },
  ]);
  const [notes, setNotes] = useState("");
  const [distributorId, setDistributorId] = useState("");

  useEffect(() => {
    // Blankets load කරනවා
    getAllBlankets()
      .then((res) => setBlankets(res.data))
      .catch(() => toast.error("Blankets load වුණේ නෑ"));

    // Distributors load කරනවා
    axiosInstance
      .get("/distributor")
      .then((res) => setDistributors(res.data))
      .catch(() => {}); // Optional - error නොදක්වනවා
  }, []);

  const addItem = () => {
    setOrderItems([...orderItems, { blanketId: "", quantity: 1 }]);
  };

  const removeItem = (index) => {
    setOrderItems(orderItems.filter((_, i) => i !== index));
  };

  const updateItem = (index, field, value) => {
    const updated = [...orderItems];
    updated[index][field] = value;
    setOrderItems(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const validItems = orderItems.filter((i) => i.blanketId && i.quantity > 0);

    if (validItems.length === 0) {
      toast.warning("At least select one blanket!");
      setLoading(false);
      return;
    }

    try {
      await createOrder({
        distributorId: distributorId ? parseInt(distributorId) : null,
        notes,
        items: validItems.map((i) => ({
          blanketId: parseInt(i.blanketId),
          quantity: parseInt(i.quantity),
        })),
      });
      toast.success("Order successfully placed!");
      navigate("/orders");
    } catch (error) {
      const msg = error.response?.data?.message || "Order place failed!";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <CCard className="shadow-sm border-0">
      <CCardHeader className="d-flex justify-content-between align-items-center">
        <h5 className="mb-0">Place New Order</h5>
        <CButton
          color="secondary"
          size="sm"
          onClick={() => navigate("/orders")}
        >
          ← Back
        </CButton>
      </CCardHeader>

      <CCardBody className="p-4">
        <CForm onSubmit={handleSubmit}>
          <CRow className="g-3 mb-4">
            {/* Distributor Dropdown */}
            <CCol md={6}>
              <CFormLabel>Distributor (Optional)</CFormLabel>
              <CFormSelect
                value={distributorId}
                onChange={(e) => setDistributorId(e.target.value)}
              >
                <option value="">-- No Distributor (Direct Order) --</option>
                {distributors.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.companyName}
                  </option>
                ))}
              </CFormSelect>
            </CCol>

            {/* Notes */}
            <CCol md={6}>
              <CFormLabel>Notes</CFormLabel>
              <CFormTextarea
                rows={1}
                placeholder="Special instructions..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </CCol>
          </CRow>

          {/* Order Items */}
          <h6 className="mb-3">📦 Order Items</h6>
          <CTable responsive bordered>
            <CTableHead color="light">
              <CTableRow>
                <CTableHeaderCell>Blanket</CTableHeaderCell>
                <CTableHeaderCell style={{ width: "130px" }}>
                  Quantity
                </CTableHeaderCell>
                <CTableHeaderCell style={{ width: "80px" }}>
                  Remove
                </CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              {orderItems.map((item, index) => (
                <CTableRow key={index}>
                  <CTableDataCell>
                    <CFormSelect
                      value={item.blanketId}
                      onChange={(e) =>
                        updateItem(index, "blanketId", e.target.value)
                      }
                    >
                      <option value="">-- Select Blanket --</option>
                      {blankets.map((b) => (
                        <option key={b.id} value={b.id}>
                          {b.modelName} | {b.size} | Rs.
                          {b.price.toLocaleString()}
                        </option>
                      ))}
                    </CFormSelect>
                  </CTableDataCell>
                  <CTableDataCell>
                    <CFormInput
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) =>
                        updateItem(index, "quantity", e.target.value)
                      }
                    />
                  </CTableDataCell>
                  <CTableDataCell className="text-center">
                    {orderItems.length > 1 && (
                      <CButton
                        color="danger"
                        size="sm"
                        onClick={() => removeItem(index)}
                      >
                        ✕
                      </CButton>
                    )}
                  </CTableDataCell>
                </CTableRow>
              ))}
            </CTableBody>
          </CTable>

          <CButton
            color="outline-secondary"
            size="sm"
            className="mb-4"
            onClick={addItem}
          >
            + Add Another Item
          </CButton>

          <CAlert color="info" className="py-2">
            <small>
              If you don't select a distributor, the order will be placed
              directly with the manufacturer. After placing the order, you can
              track its status in the Orders <section className=""></section>
            </small>
          </CAlert>

          <div className="mt-2">
            <CButton
              type="submit"
              color="primary"
              className="px-4 me-2"
              disabled={loading}
            >
              {loading ? (
                <>
                  <CSpinner size="sm" className="me-2" />
                  Placing...
                </>
              ) : (
                "Place Order"
              )}
            </CButton>
            <CButton
              color="secondary"
              onClick={() => navigate("/orders")}
              disabled={loading}
            >
              Cancel
            </CButton>
          </div>
        </CForm>
      </CCardBody>
    </CCard>
  );
};

export default OrderForm;

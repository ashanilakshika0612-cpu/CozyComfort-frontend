import { useEffect, useState } from "react";
import { getInventory, checkStock } from "../../api/inventoryApi";
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
  CSpinner,
  CBadge,
  CButton,
  CFormInput,
  CFormLabel,
  CRow,
  CCol,
  CAlert,
} from "@coreui/react";

const InventoryList = () => {
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);

  // Stock check form
  const [checkForm, setCheckForm] = useState({
    distributorId: "",
    blanketId: "",
    quantity: "",
  });
  const [checkResult, setCheckResult] = useState(null);
  const [checking, setChecking] = useState(false);

  useEffect(() => {
    getInventory()
      .then((res) => setInventory(res.data))
      .catch(() => toast.error("Failed to load inventory!"))
      .finally(() => setLoading(false));
  }, []);

  const handleCheck = async (e) => {
    e.preventDefault();
    setChecking(true);
    setCheckResult(null);
    try {
      const res = await checkStock(
        checkForm.distributorId,
        checkForm.blanketId,
        checkForm.quantity,
      );
      setCheckResult(res.data);
    } catch {
      toast.error("Failed to check stock!");
    } finally {
      setChecking(false);
    }
  };

  if (loading)
    return (
      <div className="text-center py-5">
        <CSpinner color="primary" />
      </div>
    );

  return (
    <div>
      {/* Stock Availability Checker */}
      <CCard className="shadow-sm border-0 mb-4">
        <CCardHeader>
          <h5 className="mb-0">Stock Availability Check</h5>
        </CCardHeader>
        <CCardBody>
          <CRow className="g-3 align-items-end">
            <CCol md={3}>
              <CFormLabel>Distributor ID</CFormLabel>
              <CFormInput
                type="number"
                placeholder="1"
                value={checkForm.distributorId}
                onChange={(e) =>
                  setCheckForm({
                    ...checkForm,
                    distributorId: e.target.value,
                  })
                }
              />
            </CCol>
            <CCol md={3}>
              <CFormLabel>Blanket ID</CFormLabel>
              <CFormInput
                type="number"
                placeholder="1"
                value={checkForm.blanketId}
                onChange={(e) =>
                  setCheckForm({
                    ...checkForm,
                    blanketId: e.target.value,
                  })
                }
              />
            </CCol>
            <CCol md={3}>
              <CFormLabel>Quantity</CFormLabel>
              <CFormInput
                type="number"
                placeholder="10"
                value={checkForm.quantity}
                onChange={(e) =>
                  setCheckForm({
                    ...checkForm,
                    quantity: e.target.value,
                  })
                }
              />
            </CCol>
            <CCol md={3}>
              <CButton
                color="primary"
                onClick={handleCheck}
                disabled={checking}
                className="w-100"
              >
                {checking ? <CSpinner size="sm" /> : "Check Stock"}
              </CButton>
            </CCol>
          </CRow>

          {/* Check Result */}
          {checkResult && (
            <CAlert
              color={checkResult.distributorCanFulfill ? "success" : "warning"}
              className="mt-3"
            >
              <strong>{checkResult.blanketName}</strong>
              <br />
              📦 Distributor Stock: {checkResult.distributorStock} units
              <br />
              🏭 Manufacturer Stock: {checkResult.manufacturerStock} units
              <br />
              {checkResult.estimatedLeadDays > 0 && (
                <>
                  ⏱️ Lead Time: {checkResult.estimatedLeadDays} days
                  <br />
                </>
              )}
              💬 {checkResult.message}
            </CAlert>
          )}
        </CCardBody>
      </CCard>

      {/* Inventory Table */}
      <CCard className="shadow-sm border-0">
        <CCardHeader>
          <h5 className="mb-0">📦 Inventory</h5>
        </CCardHeader>
        <CCardBody>
          <CTable hover responsive striped>
            <CTableHead color="dark">
              <CTableRow>
                <CTableHeaderCell>ID</CTableHeaderCell>
                <CTableHeaderCell>Distributor</CTableHeaderCell>
                <CTableHeaderCell>Blanket</CTableHeaderCell>
                <CTableHeaderCell>Size</CTableHeaderCell>
                <CTableHeaderCell>Color</CTableHeaderCell>
                <CTableHeaderCell>Price (Rs.)</CTableHeaderCell>
                <CTableHeaderCell>Quantity</CTableHeaderCell>
                <CTableHeaderCell>Last Updated</CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              {inventory.length === 0 ? (
                <CTableRow>
                  <CTableDataCell
                    colSpan={8}
                    className="text-center text-muted py-4"
                  >
                    No inventory records found!
                  </CTableDataCell>
                </CTableRow>
              ) : (
                inventory.map((item, i) => (
                  <CTableRow key={item.id}>
                    <CTableDataCell>{i + 1}</CTableDataCell>
                    <CTableDataCell>{item.distributorName}</CTableDataCell>
                    <CTableDataCell className="fw-semibold">
                      {item.blanketName}
                    </CTableDataCell>
                    <CTableDataCell>{item.size}</CTableDataCell>
                    <CTableDataCell>{item.color}</CTableDataCell>
                    <CTableDataCell>
                      Rs. {item.unitPrice.toLocaleString()}
                    </CTableDataCell>
                    <CTableDataCell>
                      <CBadge
                        color={
                          item.quantity < 10
                            ? "danger"
                            : item.quantity < 30
                              ? "warning"
                              : "success"
                        }
                      >
                        {item.quantity} units
                      </CBadge>
                    </CTableDataCell>
                    <CTableDataCell>
                      {new Date(item.lastUpdated).toLocaleDateString()}
                    </CTableDataCell>
                  </CTableRow>
                ))
              )}
            </CTableBody>
          </CTable>
        </CCardBody>
      </CCard>
    </div>
  );
};

export default InventoryList;

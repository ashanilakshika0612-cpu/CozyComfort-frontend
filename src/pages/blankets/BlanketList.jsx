import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { getAllBlankets } from "../../api/blanketApi";
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
} from "@coreui/react";

const BlanketList = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [blankets, setBlankets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await getAllBlankets();
        setBlankets(res.data);
      } catch {
        toast.error("Blankets load කරන්න බැරි වුණා!");
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  const stockColor = (qty) => {
    if (qty === 0) return "danger";
    if (qty < 20) return "warning";
    return "success";
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
        <h5 className="mb-0">🛏️ Blanket Catalogue</h5>
        {user?.role === "Manufacturer" && (
          <CButton
            color="primary"
            size="sm"
            onClick={() => navigate("/blankets/add")}
          >
            + Add Blanket
          </CButton>
        )}
      </CCardHeader>

      <CCardBody>
        <CTable hover responsive striped>
          <CTableHead color="dark">
            <CTableRow>
              <CTableHeaderCell>Count</CTableHeaderCell>
              <CTableHeaderCell>Model</CTableHeaderCell>
              <CTableHeaderCell>Material</CTableHeaderCell>
              <CTableHeaderCell>Size</CTableHeaderCell>
              <CTableHeaderCell>Color</CTableHeaderCell>
              <CTableHeaderCell>Price (Rs.)</CTableHeaderCell>
              <CTableHeaderCell>Stock</CTableHeaderCell>
            </CTableRow>
          </CTableHead>
          <CTableBody>
            {blankets.length === 0 ? (
              <CTableRow>
                <CTableDataCell
                  colSpan={7}
                  className="text-center text-muted py-4"
                >
                  Blanket Not Found!{" "}
                  {user?.role === "Manufacturer" && "Please add new blankets."}
                </CTableDataCell>
              </CTableRow>
            ) : (
              blankets.map((b, i) => (
                <CTableRow key={b.id}>
                  <CTableDataCell>{i + 1}</CTableDataCell>
                  <CTableDataCell className="fw-semibold">
                    {b.modelName}
                  </CTableDataCell>
                  <CTableDataCell>{b.material}</CTableDataCell>
                  <CTableDataCell>{b.size}</CTableDataCell>
                  <CTableDataCell>{b.color}</CTableDataCell>
                  <CTableDataCell>
                    Rs. {b.price.toLocaleString()}
                  </CTableDataCell>
                  <CTableDataCell>
                    <CBadge color={stockColor(b.manufacturerStock)}>
                      {b.manufacturerStock} units
                    </CBadge>
                  </CTableDataCell>
                </CTableRow>
              ))
            )}
          </CTableBody>
        </CTable>
      </CCardBody>
    </CCard>
  );
};

export default BlanketList;

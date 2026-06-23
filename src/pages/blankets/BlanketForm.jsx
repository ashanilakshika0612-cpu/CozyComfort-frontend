import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createBlanket } from "../../api/blanketApi";
import { toast } from "react-toastify";
import {
  CCard,
  CCardBody,
  CCardHeader,
  CForm,
  CFormInput,
  CFormLabel,
  CFormTextarea,
  CFormSelect,
  CButton,
  CSpinner,
  CRow,
  CCol,
} from "@coreui/react";

const BlanketForm = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    modelName: "",
    material: "",
    size: "Single",
    color: "",
    price: "",
    description: "",
    manufacturerStock: "",
    productionCapacityPerDay: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await createBlanket({
        ...formData,
        price: parseFloat(formData.price),
        manufacturerStock: parseInt(formData.manufacturerStock),
        productionCapacityPerDay: parseInt(formData.productionCapacityPerDay),
      });
      toast.success("Blanket successfully added!");
      navigate("/blankets");
    } catch {
      toast.error("Blanket can not be added!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <CCard className="shadow-sm border-0">
      <CCardHeader className="d-flex justify-content-between align-items-center">
        <h5 className="mb-0">🛏️ Add New Blanket</h5>
        <CButton
          color="secondary"
          size="sm"
          onClick={() => navigate("/blankets")}
        >
          ← Back
        </CButton>
      </CCardHeader>

      <CCardBody className="p-4">
        <CForm onSubmit={handleSubmit}>
          <CRow className="g-3">
            <CCol md={6}>
              <CFormLabel>Model Name</CFormLabel>
              <CFormInput
                name="modelName"
                placeholder="Winter Comfort Pro"
                value={formData.modelName}
                onChange={handleChange}
                required
              />
            </CCol>

            <CCol md={6}>
              <CFormLabel>Material</CFormLabel>
              <CFormInput
                name="material"
                placeholder="Fleece, Cotton, Wool"
                value={formData.material}
                onChange={handleChange}
                required
              />
            </CCol>

            <CCol md={4}>
              <CFormLabel>Size</CFormLabel>
              <CFormSelect
                name="size"
                value={formData.size}
                onChange={handleChange}
              >
                <option>Single</option>
                <option>Double</option>
                <option>King</option>
                <option>Queen</option>
              </CFormSelect>
            </CCol>

            <CCol md={4}>
              <CFormLabel>Color</CFormLabel>
              <CFormInput
                name="color"
                placeholder="Blue, Red, White"
                value={formData.color}
                onChange={handleChange}
                required
              />
            </CCol>

            <CCol md={4}>
              <CFormLabel>Price (Rs.)</CFormLabel>
              <CFormInput
                type="number"
                name="price"
                placeholder="2500"
                value={formData.price}
                onChange={handleChange}
                required
              />
            </CCol>

            <CCol md={6}>
              <CFormLabel>Current Stock (Units)</CFormLabel>
              <CFormInput
                type="number"
                name="manufacturerStock"
                placeholder="100"
                value={formData.manufacturerStock}
                onChange={handleChange}
                required
              />
            </CCol>

            <CCol md={6}>
              <CFormLabel>Production Capacity (Per Day)</CFormLabel>
              <CFormInput
                type="number"
                name="productionCapacityPerDay"
                placeholder="50"
                value={formData.productionCapacityPerDay}
                onChange={handleChange}
                required
              />
            </CCol>

            <CCol md={12}>
              <CFormLabel>Description</CFormLabel>
              <CFormTextarea
                name="description"
                rows={3}
                placeholder="Blanket description..."
                value={formData.description}
                onChange={handleChange}
              />
            </CCol>

            <CCol md={12}>
              <CButton
                type="submit"
                color="primary"
                className="px-4"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <CSpinner size="sm" className="me-2" />
                    Saving...
                  </>
                ) : (
                  "Save Blanket"
                )}
              </CButton>
            </CCol>
          </CRow>
        </CForm>
      </CCardBody>
    </CCard>
  );
};

export default BlanketForm;

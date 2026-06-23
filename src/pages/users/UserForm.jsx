import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { registerApi } from "../../api/authApi";
import { getAllUsers } from "../../api/userApi";
import { toast } from "react-toastify";
import {
  CCard,
  CCardBody,
  CCardHeader,
  CForm,
  CFormInput,
  CFormLabel,
  CFormSelect,
  CButton,
  CSpinner,
  CRow,
  CCol,
  CAlert,
} from "@coreui/react";

const UserForm = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [distributors, setDistributors] = useState([]);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "3",
    distributorId: "",
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    getAllUsers()
      .then((res) => {
        const dists = res.data.filter((u) => u.role === "Distributor");
        setDistributors(dists);
      })
      .catch(() => {});
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: "" });
    }
  };

  // Validation
  const validate = () => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = "Name required";

    if (!formData.email.trim()) newErrors.email = "Email required";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "Valid email required";

    if (!formData.password) newErrors.password = "Password required";
    else if (formData.password.length < 6)
      newErrors.password = "Password must be at least 6 characters";

    if (formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = "Passwords do not match";

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    try {
      await registerApi({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: parseInt(formData.role),
        distributorId: formData.distributorId
          ? parseInt(formData.distributorId)
          : null,
      });

      toast.success(`User "${formData.name}" successfully created!`);
      navigate("/users");
    } catch (error) {
      const msg =
        error.response?.data?.message || "User creation <failed></failed>!";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <CCard className="shadow-sm border-0">
      <CCardHeader className="d-flex justify-content-between align-items-center">
        <h5 className="mb-0">Add New User</h5>
        <CButton color="secondary" size="sm" onClick={() => navigate("/users")}>
          ← Back
        </CButton>
      </CCardHeader>

      <CCardBody className="p-4">
        <CForm onSubmit={handleSubmit}>
          <CRow className="g-3">
            {/* Name */}
            <CCol md={6}>
              <CFormLabel>
                Full Name <span className="text-danger">*</span>
              </CFormLabel>
              <CFormInput
                name="name"
                placeholder="John Silva"
                value={formData.name}
                onChange={handleChange}
              />
              {errors.name && (
                <small className="text-danger">{errors.name}</small>
              )}
            </CCol>

            {/* Email */}
            <CCol md={6}>
              <CFormLabel>
                Email Address <span className="text-danger">*</span>
              </CFormLabel>
              <CFormInput
                type="email"
                name="email"
                placeholder="john@example.com"
                value={formData.email}
                onChange={handleChange}
              />
              {errors.email && (
                <small className="text-danger">{errors.email}</small>
              )}
            </CCol>

            {/* Password */}
            <CCol md={6}>
              <CFormLabel>
                Password <span className="text-danger">*</span>
              </CFormLabel>
              <CFormInput
                type="password"
                name="password"
                placeholder="Min 6 characters"
                value={formData.password}
                onChange={handleChange}
              />
              {errors.password && (
                <small className="text-danger">{errors.password}</small>
              )}
            </CCol>

            {/* Confirm Password */}
            <CCol md={6}>
              <CFormLabel>
                Confirm Password <span className="text-danger">*</span>
              </CFormLabel>
              <CFormInput
                type="password"
                name="confirmPassword"
                placeholder="Repeat password"
                value={formData.confirmPassword}
                onChange={handleChange}
              />
              {errors.confirmPassword && (
                <small className="text-danger">{errors.confirmPassword}</small>
              )}
            </CCol>

            {/* Role */}
            <CCol md={6}>
              <CFormLabel>
                Role <span className="text-danger">*</span>
              </CFormLabel>
              <CFormSelect
                name="role"
                value={formData.role}
                onChange={handleChange}
              >
                <option value="1">Manufacturer</option>
                <option value="2">Distributor</option>
                <option value="3">Seller</option>
              </CFormSelect>
            </CCol>

            {formData.role === "3" && (
              <CCol md={6}>
                <CFormLabel>Assign to Distributor</CFormLabel>
                <CFormSelect
                  name="distributorId"
                  value={formData.distributorId}
                  onChange={handleChange}
                >
                  <option value="">-- Select Distributor (Optional) --</option>
                  {distributors.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.name} ({d.email})
                    </option>
                  ))}
                </CFormSelect>
              </CCol>
            )}

            {/* Info box */}
            <CCol md={12}>
              <CAlert color="info" className="py-2">
                <small>
                  After creating the user, they will receive an email with login
                  details.
                </small>
              </CAlert>
            </CCol>

            {/* Submit */}
            <CCol md={12}>
              <CButton
                type="submit"
                color="primary"
                className="px-4 me-2"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <CSpinner size="sm" className="me-2" />
                    Creating...
                  </>
                ) : (
                  "Create User"
                )}
              </CButton>
              <CButton
                color="secondary"
                onClick={() => navigate("/users")}
                disabled={loading}
              >
                Cancel
              </CButton>
            </CCol>
          </CRow>
        </CForm>
      </CCardBody>
    </CCard>
  );
};

export default UserForm;

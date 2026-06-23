import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { loginApi } from "../../api/authApi";
import { toast } from "react-toastify";
import {
  CCard,
  CCardBody,
  CCardHeader,
  CForm,
  CFormInput,
  CFormLabel,
  CButton,
  CSpinner,
  CContainer,
  CRow,
  CCol,
} from "@coreui/react";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await loginApi(formData);
      const { token, name, email, role } = response.data;

      // AuthContext එකේ save කරනවා
      login({ name, email, role }, token);

      toast.success(`Welcome back, ${name}!`);
      navigate("/dashboard");
    } catch (error) {
      toast.error("Invalid email or password!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-vh-100 d-flex align-items-center justify-content-center"
      style={{ background: "linear-gradient(135deg, #1a1a2e, #16213e)" }}
    >
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={5}>
            {/* Logo */}
            <div className="text-center mb-4">
              <h1 className="text-white display-4">🛏️</h1>
              <h2 className="text-white fw-bold">Cozy Comfort</h2>
              <p className="text-white-50">Blanket Order Management System</p>
            </div>

            <CCard className="shadow-lg border-0">
              <CCardHeader className="bg-primary text-white text-center py-3">
                <h4 className="mb-0">Login</h4>
              </CCardHeader>
              <CCardBody className="p-4">
                <CForm onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <CFormLabel>Email Address</CFormLabel>
                    <CFormInput
                      type="email"
                      name="email"
                      placeholder="admin@cozycomfort.com"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="mb-4">
                    <CFormLabel>Password</CFormLabel>
                    <CFormInput
                      type="password"
                      name="password"
                      placeholder="Enter your password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <CButton
                    type="submit"
                    color="primary"
                    className="w-100 py-2"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <CSpinner size="sm" className="me-2" />
                        Logging in...
                      </>
                    ) : (
                      "Login"
                    )}
                  </CButton>
                </CForm>
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  );
};

export default Login;

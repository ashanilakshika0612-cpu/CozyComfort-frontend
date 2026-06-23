import { useEffect, useState } from "react";
import { getAllUsers, deactivateUser, reactivateUser } from "../../api/userApi";
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

const roleColor = {
  Manufacturer: "danger",
  Distributor: "warning",
  Seller: "success",
};
import { useNavigate } from "react-router-dom";

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchUsers = async () => {
    try {
      const res = await getAllUsers();
      setUsers(res.data);
    } catch {
      toast.error("Users load failed!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDeactivate = async (id, name) => {
    if (!window.confirm(`"${name}" deactivate කරන්නද?`)) return;
    try {
      await deactivateUser(id);
      toast.success(`${name} deactivated!`);
      fetchUsers();
    } catch {
      toast.error("Deactivate failed!");
    }
  };

  const handleReactivate = async (id, name) => {
    try {
      await reactivateUser(id);
      toast.success(`${name} reactivated!`);
      fetchUsers();
    } catch {
      toast.error("Reactivate failed!");
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
        <h5 className="mb-0">System Users</h5>
        <CButton
          color="primary"
          size="sm"
          onClick={() => navigate("/users/add")}
        >
          + Add User
        </CButton>
      </CCardHeader>
      <CCardBody>
        <CTable hover responsive striped>
          <CTableHead color="dark">
            <CTableRow>
              <CTableHeaderCell>#</CTableHeaderCell>
              <CTableHeaderCell>Name</CTableHeaderCell>
              <CTableHeaderCell>Email</CTableHeaderCell>
              <CTableHeaderCell>Role</CTableHeaderCell>
              <CTableHeaderCell>Distributor</CTableHeaderCell>
              <CTableHeaderCell>Status</CTableHeaderCell>
              <CTableHeaderCell>Actions</CTableHeaderCell>
            </CTableRow>
          </CTableHead>
          <CTableBody>
            {users.map((u, i) => (
              <CTableRow key={u.id}>
                <CTableDataCell>{i + 1}</CTableDataCell>
                <CTableDataCell className="fw-semibold">
                  {u.name}
                </CTableDataCell>
                <CTableDataCell>{u.email}</CTableDataCell>
                <CTableDataCell>
                  <CBadge color={roleColor[u.role] || "secondary"}>
                    {u.role}
                  </CBadge>
                </CTableDataCell>
                <CTableDataCell>{u.distributorName || "—"}</CTableDataCell>
                <CTableDataCell>
                  <CBadge color={u.isActive ? "success" : "danger"}>
                    {u.isActive ? "Active" : "Inactive"}
                  </CBadge>
                </CTableDataCell>
                <CTableDataCell>
                  {u.isActive ? (
                    <CButton
                      color="danger"
                      size="sm"
                      onClick={() => handleDeactivate(u.id, u.name)}
                    >
                      Deactivate
                    </CButton>
                  ) : (
                    <CButton
                      color="success"
                      size="sm"
                      onClick={() => handleReactivate(u.id, u.name)}
                    >
                      Reactivate
                    </CButton>
                  )}
                </CTableDataCell>
              </CTableRow>
            ))}
          </CTableBody>
        </CTable>
      </CCardBody>
    </CCard>
  );
};

export default UserList;

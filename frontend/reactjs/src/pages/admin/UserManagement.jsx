import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import {
  Container,
  Form,
  Button,
  Alert,
  Table,
  Modal,
  Row,
  Col,
} from "react-bootstrap";
import NavBar from "../../components/NavBar";
import { useNavigate } from "react-router-dom";
import { getUser, getToken, isAdmin } from "../../utils/auth";

function UserManagement() {
  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState({
    username: "",
    email: "",
    password: "",
    roles: ["ROLE_USER"],
  });
  const [editUser, setEditUser] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [message, setMessage] = useState("");
  const [variant, setVariant] = useState("success");
  const navigate = useNavigate();

  // Kiểm tra quyền truy cập
  const checkAccess = useCallback(() => {
    const user = getUser();
    const token = getToken();

    if (!user || !token || !isAdmin()) {
      navigate("/login");
    }
  }, [navigate]);

  useEffect(() => {
    // Kiểm tra quyền truy cập khi component được tải
    checkAccess();

    // Thiết lập token cho axios
    const token = getToken();
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    }

    // Tải danh sách người dùng
    loadUsers();
  }, [checkAccess]);

  const loadUsers = () => {
    // Thêm header Authorization vào request
    const token = getToken();
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    axios
      .get("http://localhost:8080/api/admin/users", config)
      .then((response) => {
        const usersData = Array.isArray(response.data) ? response.data : [];
        setUsers(usersData);
      })
      .catch((error) => {
        console.error("Lỗi khi lấy danh sách người dùng:", error);

        // Kiểm tra lỗi 401 (Unauthorized)
        if (error.response && error.response.status === 401) {
          navigate("/login");
          return;
        }

        setMessage("Không thể tải danh sách người dùng");
        setVariant("danger");
        setUsers([]);
      });
  };

  const handleInputChange = (e) => {
    if (e.target.name === "roleSelect") {
      // Cập nhật roles dựa trên lựa chọn dropdown
      const selectedRole = e.target.value;
      const roles = ["ROLE_USER"]; // Luôn bao gồm ROLE_USER

      if (selectedRole === "admin") {
        roles.push("ROLE_ADMIN"); // Thêm ROLE_ADMIN nếu được chọn
      }

      setNewUser({ ...newUser, roles });
    } else {
      setNewUser({ ...newUser, [e.target.name]: e.target.value });
    }
  };

  const handleEditInputChange = (e) => {
    if (e.target.name === "roleSelect") {
      // Cập nhật roles dựa trên lựa chọn dropdown
      const selectedRole = e.target.value;
      const roles = ["ROLE_USER"]; // Luôn bao gồm ROLE_USER

      if (selectedRole === "admin") {
        roles.push("ROLE_ADMIN"); // Thêm ROLE_ADMIN nếu được chọn
      }

      setEditUser({ ...editUser, roles });
    } else {
      setEditUser({ ...editUser, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (
      !newUser.username.trim() ||
      !newUser.email.trim() ||
      !newUser.password.trim()
    ) {
      setMessage("Vui lòng điền đầy đủ thông tin người dùng");
      setVariant("danger");
      return;
    }

    // Lấy token từ getToken
    const token = getToken();
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    axios
      .post("http://localhost:8080/users", newUser, config)
      .then((response) => {
        setMessage("Thêm người dùng thành công!");
        setVariant("success");
        setNewUser({
          username: "",
          email: "",
          password: "",
          roles: ["ROLE_USER"],
        });
        loadUsers();
      })
      .catch((error) => {
        console.error("Lỗi khi thêm người dùng:", error);
        // Kiểm tra lỗi 401 (Unauthorized)
        if (error.response && error.response.status === 401) {
          navigate("/login");
          return;
        }
        setMessage("Không thể thêm người dùng. Vui lòng thử lại.");
        setVariant("danger");
      });
  };

  const handleEdit = (user) => {
    // Tạo bản sao của user nhưng không bao gồm password
    const userToEdit = { ...user };
    delete userToEdit.password;
    userToEdit.password = "";

    setEditUser(userToEdit);
    setShowEditModal(true);
  };

  const handleUpdate = () => {
    if (!editUser.username.trim() || !editUser.email.trim()) {
      setMessage("Vui lòng điền đầy đủ thông tin người dùng");
      setVariant("danger");
      return;
    }

    // Chuẩn bị dữ liệu để gửi lên server
    const userToUpdate = { ...editUser };

    // Nếu mật khẩu trống, loại bỏ trường password
    if (!userToUpdate.password.trim()) {
      delete userToUpdate.password;
    }

    // Lấy token từ getToken
    const token = getToken();
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    axios
      .put(`http://localhost:8080/users/${editUser.id}`, userToUpdate, config)
      .then((response) => {
        setMessage("Cập nhật người dùng thành công!");
        setVariant("success");
        setShowEditModal(false);
        loadUsers();
      })
      .catch((error) => {
        console.error("Lỗi khi cập nhật người dùng:", error);
        // Kiểm tra lỗi 401 (Unauthorized)
        if (error.response && error.response.status === 401) {
          navigate("/login");
          return;
        }
        setMessage("Không thể cập nhật người dùng. Vui lòng thử lại.");
        setVariant("danger");
      });
  };

  const handleDelete = (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa người dùng này?")) {
      // Lấy token từ getToken
      const token = getToken();
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      axios
        .delete(`http://localhost:8080/users/${id}`, config)
        .then(() => {
          setMessage("Xóa người dùng thành công!");
          setVariant("success");
          loadUsers();
        })
        .catch((error) => {
          console.error("Lỗi khi xóa người dùng:", error);
          // Kiểm tra lỗi 401 (Unauthorized)
          if (error.response && error.response.status === 401) {
            navigate("/login");
            return;
          }
          setMessage("Không thể xóa người dùng. Vui lòng thử lại.");
          setVariant("danger");
        });
    }
  };

  // Kiểm tra xem user có quyền admin không
  const hasAdminRole = (user) => {
    if (!user || !user.roles) return false;
    return user.roles.includes("ROLE_ADMIN");
  };

  return (
    <>
      <NavBar />
      <Container className="mt-4">
        <h2 className="mb-4">Quản Lý Người Dùng</h2>
        {message && <Alert variant={variant}>{message}</Alert>}

        <Row className="mb-4">
          <Col md={6}>
            <h4>Thêm Người Dùng Mới</h4>
            <Form onSubmit={handleSubmit}>
              <Form.Group controlId="username" className="mb-3">
                <Form.Label>Tên đăng nhập</Form.Label>
                <Form.Control
                  type="text"
                  name="username"
                  value={newUser.username}
                  onChange={handleInputChange}
                  placeholder="Nhập tên đăng nhập"
                  required
                />
              </Form.Group>

              <Form.Group controlId="email" className="mb-3">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  value={newUser.email}
                  onChange={handleInputChange}
                  placeholder="Nhập email"
                  required
                />
              </Form.Group>

              <Form.Group controlId="password" className="mb-3">
                <Form.Label>Mật khẩu</Form.Label>
                <Form.Control
                  type="password"
                  name="password"
                  value={newUser.password}
                  onChange={handleInputChange}
                  placeholder="Nhập mật khẩu"
                  required
                />
              </Form.Group>

              <Form.Group controlId="role" className="mb-3">
                <Form.Label>Vai trò</Form.Label>
                <Form.Select
                  name="roleSelect"
                  value={
                    newUser.roles.includes("ROLE_ADMIN") ? "admin" : "user"
                  }
                  onChange={handleInputChange}
                  required
                >
                  <option value="user">Người dùng</option>
                  <option value="admin">Quản trị viên</option>
                </Form.Select>
              </Form.Group>

              <Button variant="primary" type="submit">
                Thêm Người Dùng
              </Button>
            </Form>
          </Col>
        </Row>

        <h4 className="mt-4">Danh Sách Người Dùng</h4>
        {users.length === 0 ? (
          <Alert variant="info">Chưa có người dùng nào</Alert>
        ) : (
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>ID</th>
                <th>Tên đăng nhập</th>
                <th>Email</th>
                <th>Vai trò</th>
                <th>Thao Tác</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td>{user.username}</td>
                  <td>{user.email}</td>
                  <td>{hasAdminRole(user) ? "Quản trị viên" : "Người dùng"}</td>
                  <td>
                    <Button
                      variant="primary"
                      size="sm"
                      className="me-2"
                      onClick={() => handleEdit(user)}
                    >
                      Sửa
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleDelete(user.id)}
                    >
                      Xóa
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}

        {/* Modal Chỉnh Sửa */}
        <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Chỉnh Sửa Người Dùng</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {editUser && (
              <Form>
                <Form.Group controlId="editUsername" className="mb-3">
                  <Form.Label>Tên đăng nhập</Form.Label>
                  <Form.Control
                    type="text"
                    name="username"
                    value={editUser.username}
                    onChange={handleEditInputChange}
                    required
                  />
                </Form.Group>

                <Form.Group controlId="editEmail" className="mb-3">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    value={editUser.email}
                    onChange={handleEditInputChange}
                    required
                  />
                </Form.Group>

                <Form.Group controlId="editPassword" className="mb-3">
                  <Form.Label>
                    Mật khẩu (để trống nếu không thay đổi)
                  </Form.Label>
                  <Form.Control
                    type="password"
                    name="password"
                    value={editUser.password}
                    onChange={handleEditInputChange}
                    placeholder="Nhập mật khẩu mới nếu muốn thay đổi"
                  />
                </Form.Group>

                <Form.Group controlId="editRole" className="mb-3">
                  <Form.Label>Vai trò</Form.Label>
                  <Form.Select
                    name="roleSelect"
                    value={
                      editUser.roles && editUser.roles.includes("ROLE_ADMIN")
                        ? "admin"
                        : "user"
                    }
                    onChange={handleEditInputChange}
                    required
                  >
                    <option value="user">Người dùng</option>
                    <option value="admin">Quản trị viên</option>
                  </Form.Select>
                </Form.Group>
              </Form>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowEditModal(false)}>
              Hủy
            </Button>
            <Button variant="primary" onClick={handleUpdate}>
              Lưu Thay Đổi
            </Button>
          </Modal.Footer>
        </Modal>
      </Container>
    </>
  );
}

export default UserManagement;

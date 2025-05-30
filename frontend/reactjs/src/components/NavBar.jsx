import { useState, useEffect } from "react";
import { Nav, Navbar, Container, NavDropdown, Button } from "react-bootstrap";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { logout, getUser } from "../utils/auth";

function NavBar() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Kiểm tra và cập nhật thông tin người dùng mỗi khi URL thay đổi
    const userData = getUser();
    setUser(userData);
  }, [location.pathname]); // Cập nhật khi URL thay đổi

  const handleLogout = () => {
    // Sử dụng hàm logout từ auth.js
    logout(navigate);
  };

  // Chỉ kiểm tra user.roles có chứa ROLE_ADMIN
  const isAdmin = user && user.roles && user.roles.includes("ROLE_ADMIN");

  return (
    <Navbar bg="primary" data-bs-theme="dark" sticky="top" expand="lg">
      <Container>
        <Navbar.Brand as={Link} to="/">
          CINEMA
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/">
              Đang chiếu
            </Nav.Link>

            {isAdmin && (
              <NavDropdown title="Quản lý" id="admin-dropdown">
                <NavDropdown.Item as={Link} to="/add-movie">
                  Cập nhật phim
                </NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/admin/showtimes">
                  Quản lý lịch chiếu
                </NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/admin/rooms">
                  Quản lý phòng chiếu
                </NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/admin/users">
                  Quản lý người dùng
                </NavDropdown.Item>
              </NavDropdown>
            )}
          </Nav>

          <Nav>
            {user ? (
              <NavDropdown
                title={
                  <span>
                    <img
                      src={`https://ui-avatars.com/api/?name=${user.username}&size=24&background=random`}
                      alt={user.username}
                      className="rounded-circle me-1"
                      width="24"
                      height="24"
                    />
                    {user.username}
                  </span>
                }
                id="user-dropdown"
                align="end"
              >
                <NavDropdown.Item as={Link} to="/profile">
                  Thông tin cá nhân
                </NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/profile">
                  Lịch sử đặt vé
                </NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item onClick={handleLogout}>
                  Đăng xuất
                </NavDropdown.Item>
              </NavDropdown>
            ) : (
              <>
                <Nav.Link as={Link} to="/login">
                  Đăng nhập
                </Nav.Link>
                <Nav.Link as={Link} to="/signup">
                  Đăng ký
                </Nav.Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavBar;

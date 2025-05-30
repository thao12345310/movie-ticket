import { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  ListGroup,
  Badge,
  Button,
  Alert,
} from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import NavBar from "../../components/NavBar";

function Profile() {
  const [user, setUser] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    // Kiểm tra nếu người dùng đã đăng nhập
    const userData = JSON.parse(localStorage.getItem("user"));
    if (!userData || !userData.token) {
      navigate("/login");
      return;
    }

    // Thiết lập token cho axios
    axios.defaults.headers.common["Authorization"] = `Bearer ${userData.token}`;

    // Lấy thông tin người dùng
    axios
      .get("http://localhost:8080/api/auth/me")
      .then((response) => {
        setUser(response.data);
        // Lấy lịch sử đặt vé của người dùng
        return axios.get("http://localhost:8080/api/bookings/my-bookings");
      })
      .then((response) => {
        setBookings(response.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Lỗi khi lấy thông tin:", err);
        setError("Không thể tải thông tin người dùng. Vui lòng đăng nhập lại!");
        setLoading(false);
      });
  }, [navigate]);

  const handleLogout = () => {
    // Xóa thông tin người dùng và token từ localStorage
    localStorage.removeItem("user");
    localStorage.removeItem("token");

    // Xóa header Authorization
    delete axios.defaults.headers.common["Authorization"];

    // Chuyển hướng về trang đăng nhập
    navigate("/login");
  };

  const formatDateTime = (dateTimeStr) => {
    if (!dateTimeStr) return "";
    const date = new Date(dateTimeStr);
    return new Intl.DateTimeFormat("vi-VN", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  if (loading) {
    return (
      <>
        <NavBar />
        <Container className="mt-4">
          <div className="text-center">
            <h3>Đang tải dữ liệu...</h3>
          </div>
        </Container>
      </>
    );
  }

  if (error) {
    return (
      <>
        <NavBar />
        <Container className="mt-4">
          <Alert variant="danger">{error}</Alert>
          <Button variant="primary" onClick={() => navigate("/login")}>
            Đăng nhập lại
          </Button>
        </Container>
      </>
    );
  }

  return (
    <>
      <NavBar />
      <Container className="mt-4 mb-5">
        <Row>
          <Col md={4}>
            <Card className="shadow mb-4">
              <Card.Header className="bg-primary text-white">
                <h4 className="mb-0">Thông tin cá nhân</h4>
              </Card.Header>
              <Card.Body>
                <div className="text-center mb-3">
                  <img
                    src={`https://ui-avatars.com/api/?name=${user?.fullName}&background=random&size=128`}
                    alt={user?.fullName}
                    className="rounded-circle img-thumbnail"
                    style={{ width: "128px", height: "128px" }}
                  />
                </div>

                <ListGroup variant="flush">
                  <ListGroup.Item>
                    <strong>Họ tên:</strong> {user?.fullName}
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <strong>Tên đăng nhập:</strong> {user?.username}
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <strong>Email:</strong> {user?.email}
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <strong>Số điện thoại:</strong>{" "}
                    {user?.phoneNumber || "Chưa cung cấp"}
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <strong>Vai trò:</strong>{" "}
                    {user?.roles?.includes("ROLE_ADMIN") ? (
                      <Badge bg="danger">Quản trị viên</Badge>
                    ) : (
                      <Badge bg="primary">Người dùng</Badge>
                    )}
                  </ListGroup.Item>
                </ListGroup>
              </Card.Body>
              <Card.Footer>
                <Button variant="primary" className="w-100 mb-2">
                  Cập nhật thông tin
                </Button>
                <Button
                  variant="outline-danger"
                  className="w-100"
                  onClick={handleLogout}
                >
                  Đăng xuất
                </Button>
              </Card.Footer>
            </Card>
          </Col>

          <Col md={8}>
            <Card className="shadow">
              <Card.Header className="bg-primary text-white">
                <h4 className="mb-0">Lịch sử đặt vé</h4>
              </Card.Header>
              <Card.Body>
                {bookings.length === 0 ? (
                  <Alert variant="info">
                    Bạn chưa đặt vé nào. <Link to="/">Đặt vé ngay</Link>
                  </Alert>
                ) : (
                  <div>
                    {bookings.map((booking, index) => (
                      <Card key={booking.id} className="mb-3">
                        <Card.Header className="d-flex justify-content-between align-items-center">
                          <span>Vé #{index + 1}</span>
                          <Badge
                            bg={
                              booking.status === "CONFIRMED"
                                ? "success"
                                : booking.status === "CANCELLED"
                                ? "danger"
                                : "warning"
                            }
                          >
                            {booking.status === "CONFIRMED"
                              ? "Đã xác nhận"
                              : booking.status === "CANCELLED"
                              ? "Đã hủy"
                              : "Chờ xác nhận"}
                          </Badge>
                        </Card.Header>
                        <Card.Body>
                          <Row>
                            <Col md={8}>
                              <p>
                                <strong>Phim:</strong>{" "}
                                {booking.showtime?.movie?.title ||
                                  "Không có thông tin"}
                              </p>
                              <p>
                                <strong>Suất chiếu:</strong>{" "}
                                {formatDateTime(booking.showtime?.startTime)}
                              </p>
                              <p>
                                <strong>Ghế:</strong> {booking.seatNumber}
                              </p>
                              <p>
                                <strong>Thời gian đặt:</strong>{" "}
                                {formatDateTime(booking.bookingTime)}
                              </p>
                            </Col>
                            <Col md={4} className="text-end">
                              {booking.status === "RESERVED" && (
                                <Button
                                  variant="outline-danger"
                                  size="sm"
                                  onClick={() => {
                                    // Xử lý hủy vé
                                    if (
                                      window.confirm(
                                        "Bạn có chắc chắn muốn hủy vé này?"
                                      )
                                    ) {
                                      axios
                                        .delete(
                                          `http://localhost:8080/api/bookings/${booking.id}/cancel`
                                        )
                                        .then(() => {
                                          // Cập nhật lại danh sách đặt vé
                                          setBookings(
                                            bookings.map((b) =>
                                              b.id === booking.id
                                                ? { ...b, status: "CANCELLED" }
                                                : b
                                            )
                                          );
                                        })
                                        .catch((err) => {
                                          console.error("Lỗi khi hủy vé:", err);
                                          alert(
                                            "Không thể hủy vé. Vui lòng thử lại!"
                                          );
                                        });
                                    }
                                  }}
                                >
                                  Hủy vé
                                </Button>
                              )}
                            </Col>
                          </Row>
                        </Card.Body>
                      </Card>
                    ))}
                  </div>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default Profile;

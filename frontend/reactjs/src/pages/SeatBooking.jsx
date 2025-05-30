import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import NavBar from "../components/NavBar";
import {
  Container,
  Row,
  Col,
  Button,
  Alert,
  Card,
  Badge,
  ProgressBar,
} from "react-bootstrap";
import { FaCouch, FaCheck, FaLock, FaCrown, FaHeart } from "react-icons/fa";
import { isAuthenticated, getToken } from "../utils/auth";

const rows = "ABCDEFGHIJK".split("");
const cols = Array.from({ length: 12 }, (_, i) => i + 1);

// Khởi tạo tất cả ghế là loại standard
const initialSeats = {};
rows.forEach((row) => {
  cols.forEach((col) => {
    initialSeats[`${row}${col}`] = "standard";
  });
});

[
  "D3",
  "D4",
  "D5",
  "D6",
  "D7",
  "D8",
  "D9",
  "D10",
  "E3",
  "E4",
  "E5",
  "E6",
  "E7",
  "E8",
  "E9",
  "E10",
  "F3",
  "F4",
  "F5",
  "F6",
  "F7",
  "F8",
  "F9",
  "F10",
  "G3",
  "G4",
  "G5",
  "G6",
  "G7",
  "G8",
  "G9",
  "G10",
  "H3",
  "H4",
  "H5",
  "H6",
  "H7",
  "H8",
  "H9",
  "H10",
  "I3",
  "I4",
  "I5",
  "I6",
  "I7",
  "I8",
  "I9",
  "I10",
].forEach((seat) => (initialSeats[seat] = "vip"));
["K4", "K5", "K6", "K7", "K8", "K9"].forEach(
  (seat) => (initialSeats[seat] = "couple")
);

// Định nghĩa giá vé dựa trên loại ghế
const seatPrices = {
  standard: 80000,
  vip: 120000,
  couple: 200000,
};

const SeatBooking = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const showtimeId = queryParams.get("showtimeId");

  const [seats, setSeats] = useState(initialSeats);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [showtime, setShowtime] = useState(null);
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [timeLeft, setTimeLeft] = useState(360); // 6 phút đếm ngược

  useEffect(() => {
    // Kiểm tra xác thực
    if (!isAuthenticated()) {
      // Lưu URL hiện tại để sau khi đăng nhập có thể quay lại
      const currentUrl = `/seat-booking?showtimeId=${showtimeId}`;
      sessionStorage.setItem("redirectAfterLogin", currentUrl);
      navigate("/login");
      return;
    }

    if (!showtimeId) {
      setError("Không tìm thấy thông tin suất chiếu");
      setLoading(false);
      return;
    }

    // Lấy token từ localStorage
    const token = getToken();

    // Thiết lập header Authorization
    const headers = token ? { Authorization: `Bearer ${token}` } : {};

    // Lấy thông tin suất chiếu
    axios
      .get(`http://localhost:8080/api/showtimes/${showtimeId}`, { headers })
      .then((response) => {
        setShowtime(response.data);

        // Lấy thông tin phim từ suất chiếu
        return axios.get(
          `http://localhost:8080/api/movies/${response.data.movieId}`,
          { headers }
        );
      })
      .then((response) => {
        setMovie(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Lỗi khi lấy thông tin:", error);

        // Nếu lỗi 401 (Unauthorized), chuyển đến trang đăng nhập
        if (error.response && error.response.status === 401) {
          const currentUrl = `/seat-booking?showtimeId=${showtimeId}`;
          sessionStorage.setItem("redirectAfterLogin", currentUrl);
          navigate("/login");
          return;
        }

        setError("Không thể tải thông tin suất chiếu");
        setLoading(false);
      });

    // Trong thực tế, bạn sẽ cần lấy thông tin ghế đã đặt từ API
    // axios.get(`http://localhost:8080/api/showtimes/${showtimeId}/seats`)
    //   .then(response => {
    //     // Cập nhật trạng thái ghế đã bán
    //     const bookedSeats = response.data;
    //     const updatedSeats = {...initialSeats};
    //     bookedSeats.forEach(seat => {
    //       updatedSeats[seat] = "sold";
    //     });
    //     setSeats(updatedSeats);
    //   });
  }, [showtimeId, navigate]);

  // Đếm ngược thời gian
  useEffect(() => {
    if (loading) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          alert("Hết thời gian chọn ghế! Vui lòng thử lại.");
          navigate(-1);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [loading, navigate]);

  const handleSelectSeat = (seat) => {
    if (seats[seat] === "sold") return;
    setSelectedSeats((prev) =>
      prev.includes(seat) ? prev.filter((s) => s !== seat) : [...prev, seat]
    );
  };

  const handleBookTickets = () => {
    if (selectedSeats.length === 0) {
      alert("Vui lòng chọn ít nhất một ghế");
      return;
    }

    // Kiểm tra xác thực
    if (!isAuthenticated()) {
      const currentUrl = `/seat-booking?showtimeId=${showtimeId}`;
      sessionStorage.setItem("redirectAfterLogin", currentUrl);
      navigate("/login");
      return;
    }

    // Lấy token từ localStorage
    const token = getToken();

    // Thiết lập header Authorization
    const headers = token ? { Authorization: `Bearer ${token}` } : {};

    // Gửi yêu cầu đặt vé đến API server
    Promise.all(
      selectedSeats.map((seatNumber) =>
        axios.post(
          "http://localhost:8080/api/bookings",
          {
            showtimeId,
            seatNumber,
          },
          { headers }
        )
      )
    )
      .then((responses) => {
        alert(
          `Đặt vé thành công! Đã đặt ${
            selectedSeats.length
          } ghế: ${selectedSeats.join(", ")}`
        );
        navigate("/profile"); // Chuyển đến trang thông tin cá nhân
      })
      .catch((error) => {
        console.error("Lỗi khi đặt vé:", error);
        if (error.response && error.response.status === 401) {
          alert("Phiên đăng nhập hết hạn, vui lòng đăng nhập lại!");
          navigate("/login");
        } else {
          alert("Có lỗi xảy ra khi đặt vé, vui lòng thử lại!");
        }
      });
  };

  // Tính tổng tiền
  const calculateTotal = () => {
    return selectedSeats.reduce((acc, seat) => {
      const seatType = seats[seat];
      return acc + seatPrices[seatType];
    }, 0);
  };

  // Format số tiền
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  // Format thời gian còn lại
  const formatTimeLeft = () => {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    return `${minutes} phút, ${seconds < 10 ? "0" : ""}${seconds} giây`;
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
          <Button variant="primary" onClick={() => navigate(-1)}>
            Quay lại
          </Button>
        </Container>
      </>
    );
  }

  return (
    <>
      <NavBar />
      <Container fluid className="p-0">
        {/* Thanh tiến trình thời gian */}
        <div className="bg-dark text-white py-2 px-3 d-flex justify-content-between align-items-center">
          <span>
            Thời gian còn lại: <strong>{formatTimeLeft()}</strong>
          </span>
          <ProgressBar
            variant="warning"
            now={(timeLeft / 360) * 100}
            className="flex-grow-1 mx-3"
            style={{ height: "10px" }}
          />
          <Button
            variant="outline-light"
            size="sm"
            onClick={() => navigate(-1)}
          >
            Hủy
          </Button>
        </div>

        <Container className="py-4">
          {movie && showtime && (
            <Row className="mb-4">
              <Col md={3}>
                <Card className="border-0 shadow">
                  <Card.Img
                    variant="top"
                    src={movie.posterUrl}
                    alt={movie.title}
                    className="img-fluid"
                  />
                </Card>
              </Col>
              <Col md={9}>
                <Card className="h-100 shadow">
                  <Card.Body>
                    <h2 className="fw-bold">{movie.title}</h2>
                    <div className="mb-3">
                      <Badge bg="primary" className="me-2">
                        {movie.genre}
                      </Badge>
                      <Badge bg="secondary">{movie.duration} phút</Badge>
                    </div>
                    <Row className="mt-4">
                      <Col md={6}>
                        <h5 className="fw-semibold">Thông tin suất chiếu</h5>
                        <p>
                          <strong>Rạp:</strong>{" "}
                          {showtime.cinemaName || "BHD Star The Garden"}
                        </p>
                        <p>
                          <strong>Phòng chiếu:</strong> Screen {showtime.roomId}
                        </p>
                        <p>
                          <strong>Suất chiếu:</strong>{" "}
                          {new Date(showtime.startTime).toLocaleString("vi-VN")}
                        </p>
                      </Col>
                      <Col md={6}>
                        <h5 className="fw-semibold">Bảng giá</h5>
                        <p>
                          <strong>Ghế thường:</strong>{" "}
                          {formatCurrency(seatPrices.standard)}
                        </p>
                        <p>
                          <strong>Ghế VIP:</strong>{" "}
                          {formatCurrency(seatPrices.vip)}
                        </p>
                        <p>
                          <strong>Ghế đôi:</strong>{" "}
                          {formatCurrency(seatPrices.couple)}
                        </p>
                      </Col>
                    </Row>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          )}

          <Card className="shadow mb-4">
            <Card.Body>
              <div className="text-center mb-4">
                <h3 className="fw-bold mb-2">MÀN HÌNH</h3>
                <div
                  className="screen-representation bg-gradient mb-5 mx-auto"
                  style={{
                    width: "80%",
                    height: "30px",
                    background: "linear-gradient(to bottom, #555, #333)",
                    borderTopLeftRadius: "50%",
                    borderTopRightRadius: "50%",
                    boxShadow: "0 10px 20px rgba(0,0,0,0.2)",
                  }}
                ></div>

                <div
                  className="seat-container"
                  style={{ maxWidth: "800px", margin: "0 auto" }}
                >
                  {rows.map((row) => (
                    <div
                      key={row}
                      className="d-flex align-items-center justify-content-center my-1"
                      style={{ height: "48px" }}
                    >
                      <strong
                        className="me-3 seat-row-label"
                        style={{ width: "20px", textAlign: "center" }}
                      >
                        {row}
                      </strong>
                      <div className="d-flex" style={{ gap: "8px" }}>
                        {cols.map((col) => {
                          const seatKey = `${row}${col}`;
                          const isSelected = selectedSeats.includes(seatKey);
                          const seatType = seats[seatKey];

                          return (
                            <div
                              key={seatKey}
                              className={`seat seat-${seatType} ${
                                isSelected ? "selected" : ""
                              }`}
                              onClick={() => handleSelectSeat(seatKey)}
                              style={{
                                cursor:
                                  seatType === "sold"
                                    ? "not-allowed"
                                    : "pointer",
                                width: "40px",
                                height: "40px",
                                display: "inline-flex",
                                justifyContent: "center",
                                alignItems: "center",
                                borderRadius: "6px",
                                transition: "all 0.2s ease",
                                background:
                                  seatType === "sold"
                                    ? "#f44336"
                                    : isSelected
                                    ? "#4caf50"
                                    : seatType === "vip"
                                    ? "#ff9800"
                                    : seatType === "couple"
                                    ? "#2196f3"
                                    : "#9e9e9e",
                                position: "relative",
                              }}
                            >
                              {seatType === "sold" && (
                                <FaLock
                                  style={{ fontSize: "14px", color: "white" }}
                                />
                              )}
                              {isSelected && (
                                <FaCheck
                                  style={{ fontSize: "14px", color: "white" }}
                                />
                              )}
                              {!isSelected &&
                                seatType === "vip" &&
                                seatType !== "sold" && (
                                  <FaCrown
                                    style={{ fontSize: "14px", color: "white" }}
                                  />
                                )}
                              {!isSelected &&
                                seatType === "couple" &&
                                seatType !== "sold" && (
                                  <FaHeart
                                    style={{ fontSize: "14px", color: "white" }}
                                  />
                                )}
                              {!isSelected &&
                                seatType === "standard" &&
                                seatType !== "sold" &&
                                col}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="seat-legend d-flex justify-content-center flex-wrap gap-4 mb-4 mt-5">
                <div className="d-flex align-items-center">
                  <div
                    className="seat-sample"
                    style={{
                      background: "#9e9e9e",
                      width: "30px",
                      height: "30px",
                      borderRadius: "6px",
                    }}
                  ></div>
                  <span className="ms-2">Ghế thường</span>
                </div>
                <div className="d-flex align-items-center">
                  <div
                    className="seat-sample"
                    style={{
                      background: "#ff9800",
                      width: "30px",
                      height: "30px",
                      borderRadius: "6px",
                    }}
                  ></div>
                  <span className="ms-2">Ghế VIP</span>
                </div>
                <div className="d-flex align-items-center">
                  <div
                    className="seat-sample"
                    style={{
                      background: "#2196f3",
                      width: "30px",
                      height: "30px",
                      borderRadius: "6px",
                    }}
                  ></div>
                  <span className="ms-2">Ghế đôi</span>
                </div>
                <div className="d-flex align-items-center">
                  <div
                    className="seat-sample"
                    style={{
                      background: "#f44336",
                      width: "30px",
                      height: "30px",
                      borderRadius: "6px",
                    }}
                  ></div>
                  <span className="ms-2">Đã đặt</span>
                </div>
                <div className="d-flex align-items-center">
                  <div
                    className="seat-sample"
                    style={{
                      background: "#4caf50",
                      width: "30px",
                      height: "30px",
                      borderRadius: "6px",
                    }}
                  ></div>
                  <span className="ms-2">Đang chọn</span>
                </div>
              </div>
            </Card.Body>
          </Card>

          <Card className="shadow mb-4">
            <Card.Body>
              <Row>
                <Col md={8}>
                  <h4 className="fw-bold mb-3">Ghế đã chọn:</h4>
                  <div className="d-flex flex-wrap gap-2 mb-3">
                    {selectedSeats.length > 0 ? (
                      selectedSeats.map((seat) => (
                        <Badge
                          key={seat}
                          bg={
                            seats[seat] === "vip"
                              ? "warning"
                              : seats[seat] === "couple"
                              ? "info"
                              : "secondary"
                          }
                          className="p-2 fs-6"
                        >
                          {seat} - {formatCurrency(seatPrices[seats[seat]])}
                        </Badge>
                      ))
                    ) : (
                      <p className="text-muted">Bạn chưa chọn ghế nào</p>
                    )}
                  </div>
                </Col>
                <Col md={4} className="border-start ps-4">
                  <h4 className="fw-bold mb-3">Tổng tiền:</h4>
                  <h3 className="text-primary fw-bold mb-4">
                    {formatCurrency(calculateTotal())}
                  </h3>
                  <Button
                    variant="primary"
                    size="lg"
                    className="w-100 mb-2"
                    onClick={handleBookTickets}
                    disabled={selectedSeats.length === 0}
                  >
                    Đặt vé ngay
                  </Button>
                  <Button
                    variant="outline-secondary"
                    className="w-100"
                    onClick={() => navigate(-1)}
                  >
                    Quay lại
                  </Button>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Container>
      </Container>
    </>
  );
};

export default SeatBooking;

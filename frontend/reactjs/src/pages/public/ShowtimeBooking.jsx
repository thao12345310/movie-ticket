import { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { Container, Card, Button, Row, Col, Alert } from "react-bootstrap";
import NavBar from "../../components/NavBar";

function ShowtimeBooking() {
  const { movieId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const movieIdFromQuery = queryParams.get("movieId") || movieId;

  const [movie, setMovie] = useState(null);
  const [showtimes, setShowtimes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [rooms, setRooms] = useState({});

  useEffect(() => {
    if (!movieIdFromQuery) {
      setError("Không tìm thấy thông tin phim");
      setLoading(false);
      return;
    }

    // Lấy thông tin phòng chiếu
    axios
      .get(`http://localhost:8080/api/rooms`)
      .then((response) => {
        const roomsData = {};
        response.data.forEach((room) => {
          roomsData[room.id] = room.name;
        });
        console.log("Danh sách phòng:", roomsData);
        setRooms(roomsData);
      })
      .catch((error) => {
        console.error("Lỗi khi lấy thông tin phòng chiếu:", error);
      });

    // Lấy thông tin phim
    axios
      .get(`http://localhost:8080/api/movies/${movieIdFromQuery}`)
      .then((response) => {
        setMovie(response.data);
      })
      .catch((error) => {
        console.error("Lỗi khi lấy thông tin phim:", error);
        setError("Không thể tải thông tin phim");
      });

    // Lấy danh sách suất chiếu của phim
    axios
      .get(`http://localhost:8080/api/showtimes/movie/${movieIdFromQuery}`)
      .then((response) => {
        setShowtimes(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Lỗi khi lấy danh sách suất chiếu:", error);
        setError("Không thể tải danh sách suất chiếu");
        setLoading(false);
      });
  }, [movieIdFromQuery]);

  const handleSelectShowtime = (showtimeId) => {
    navigate(`/seat-booking?showtimeId=${showtimeId}`);
  };

  // Hàm định dạng ngày giờ
  const formatDateTime = (dateTimeStr) => {
    const date = new Date(dateTimeStr);
    return new Intl.DateTimeFormat("vi-VN", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  // Nhóm các suất chiếu theo ngày
  const groupShowtimesByDate = () => {
    const grouped = {};

    showtimes.forEach((showtime) => {
      // Lấy ngày từ startTime
      const date = new Date(showtime.startTime).toLocaleDateString("vi-VN");

      if (!grouped[date]) {
        grouped[date] = [];
      }

      grouped[date].push(showtime);
    });

    return grouped;
  };

  const groupedShowtimes = groupShowtimesByDate();

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
      <Container className="mt-4">
        {movie && (
          <div className="mb-4">
            <Row>
              <Col md={4}>
                <img
                  src={movie.posterUrl}
                  alt={movie.title}
                  className="img-fluid rounded"
                />
              </Col>
              <Col md={8}>
                <h2>{movie.title}</h2>
                <p>
                  <strong>Thể loại:</strong> {movie.genre}
                </p>
                <p>
                  <strong>Thời lượng:</strong> {movie.duration} phút
                </p>
                <p>
                  <strong>Mô tả:</strong> {movie.description}
                </p>
              </Col>
            </Row>
          </div>
        )}

        <h3 className="mb-4">Lịch Chiếu Phim</h3>

        {Object.keys(groupedShowtimes).length === 0 ? (
          <Alert variant="info">
            Hiện tại chưa có suất chiếu nào cho phim này
          </Alert>
        ) : (
          Object.entries(groupedShowtimes).map(([date, dateShowtimes]) => (
            <Card key={date} className="mb-4">
              <Card.Header>
                <h5>{date}</h5>
              </Card.Header>
              <Card.Body>
                <Row>
                  {dateShowtimes.map((showtime) => (
                    <Col key={showtime.id} md={4} className="mb-3">
                      <Card>
                        <Card.Body>
                          <Card.Title>
                            {new Date(showtime.startTime).toLocaleTimeString(
                              "vi-VN",
                              {
                                hour: "2-digit",
                                minute: "2-digit",
                              }
                            )}
                            {" - "}
                            {new Date(showtime.endTime).toLocaleTimeString(
                              "vi-VN",
                              {
                                hour: "2-digit",
                                minute: "2-digit",
                              }
                            )}
                          </Card.Title>
                          <Card.Text>
                            <strong>Phòng:</strong>{" "}
                            {(() => {
                              console.log("Room ID:", showtime.roomId);
                              console.log("Room name:", rooms[showtime.roomId]);
                              return (
                                rooms[showtime.roomId] ||
                                `Phòng ${showtime.roomId}`
                              );
                            })()}
                          </Card.Text>
                          <Button
                            variant="primary"
                            onClick={() => handleSelectShowtime(showtime.id)}
                          >
                            Chọn Suất Chiếu
                          </Button>
                        </Card.Body>
                      </Card>
                    </Col>
                  ))}
                </Row>
              </Card.Body>
            </Card>
          ))
        )}

        <Button
          variant="secondary"
          onClick={() => navigate(-1)}
          className="mb-4"
        >
          Quay lại
        </Button>
      </Container>
    </>
  );
}

export default ShowtimeBooking;

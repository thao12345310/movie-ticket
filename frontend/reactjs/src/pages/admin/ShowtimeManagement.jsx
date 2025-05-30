import { useState, useEffect } from "react";
import axios from "axios";
import {
  Container,
  Table,
  Button,
  Alert,
  Modal,
  Form,
  Row,
  Col,
} from "react-bootstrap";
import NavBar from "../../components/NavBar";

function ShowtimeManagement() {
  const [showtimes, setShowtimes] = useState([]);
  const [movies, setMovies] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [message, setMessage] = useState("");
  const [variant, setVariant] = useState("success");
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editShowtime, setEditShowtime] = useState(null);
  const [newShowtime, setNewShowtime] = useState({
    movieId: "",
    roomId: "",
    date: "",
    startTime: "",
    endTime: "",
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    // Lấy danh sách lịch chiếu
    axios
      .get("http://localhost:8080/api/showtimes")
      .then((response) => {
        setShowtimes(response.data);
      })
      .catch((error) => {
        console.error("Lỗi khi lấy danh sách lịch chiếu:", error);
        setMessage("Không thể tải danh sách lịch chiếu");
        setVariant("danger");
      });

    // Lấy danh sách phim
    axios
      .get("http://localhost:8080/api/movies")
      .then((response) => {
        setMovies(response.data);
      })
      .catch((error) => {
        console.error("Lỗi khi lấy danh sách phim:", error);
      });

    // Lấy danh sách phòng
    axios
      .get("http://localhost:8080/api/rooms")
      .then((response) => {
        setRooms(response.data);
      })
      .catch((error) => {
        console.error("Lỗi khi lấy danh sách phòng:", error);
      });
  };

  const handleEdit = (showtime) => {
    const startDateTime = new Date(showtime.startTime);
    const endDateTime = new Date(showtime.endTime);

    setEditShowtime({
      ...showtime,
      date: startDateTime.toISOString().split("T")[0],
      startTime: startDateTime.toTimeString().slice(0, 5),
      endTime: endDateTime.toTimeString().slice(0, 5),
    });
    setShowEditModal(true);
  };

  const handleUpdate = () => {
    if (!editShowtime) return;

    // Tạo đối tượng Date với múi giờ Việt Nam
    const startDate = new Date(
      `${editShowtime.date}T${editShowtime.startTime}:00+07:00`
    );
    const endDate = new Date(
      `${editShowtime.date}T${editShowtime.endTime}:00+07:00`
    );

    if (startDate >= endDate) {
      setMessage("Thời gian kết thúc phải sau thời gian bắt đầu");
      setVariant("danger");
      return;
    }

    // Kiểm tra trùng lịch (bỏ qua chính lịch hiện tại đang sửa)
    if (
      checkTimeConflict(
        editShowtime.roomId,
        editShowtime.id,
        startDate,
        endDate
      )
    ) {
      setMessage(
        "Phòng đã được đặt trong khung giờ này. Vui lòng chọn khung giờ khác."
      );
      setVariant("danger");
      return;
    }

    axios
      .put(`http://localhost:8080/api/showtimes/${editShowtime.id}`, {
        movieId: editShowtime.movieId,
        roomId: editShowtime.roomId,
        startTime: startDate.toISOString(),
        endTime: endDate.toISOString(),
        date: editShowtime.date,
      })
      .then(() => {
        setMessage("Cập nhật lịch chiếu thành công!");
        setVariant("success");
        setShowEditModal(false);
        loadData();
      })
      .catch((error) => {
        console.error("Lỗi khi cập nhật lịch chiếu:", error);
        setMessage("Không thể cập nhật lịch chiếu. Vui lòng thử lại.");
        setVariant("danger");
      });
  };

  const handleDelete = (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa lịch chiếu này?")) {
      axios
        .delete(`http://localhost:8080/api/showtimes/${id}`)
        .then(() => {
          setMessage("Xóa lịch chiếu thành công!");
          setVariant("success");
          loadData();
        })
        .catch((error) => {
          console.error("Lỗi khi xóa lịch chiếu:", error);
          setMessage("Không thể xóa lịch chiếu. Vui lòng thử lại.");
          setVariant("danger");
        });
    }
  };

  const handleAdd = () => {
    if (
      !newShowtime.movieId ||
      !newShowtime.roomId ||
      !newShowtime.date ||
      !newShowtime.startTime ||
      !newShowtime.endTime
    ) {
      setMessage("Vui lòng điền đầy đủ thông tin lịch chiếu.");
      setVariant("danger");
      return;
    }

    // Tạo đối tượng Date với múi giờ Việt Nam
    const startDate = new Date(
      `${newShowtime.date}T${newShowtime.startTime}:00+07:00`
    );
    const endDate = new Date(
      `${newShowtime.date}T${newShowtime.endTime}:00+07:00`
    );

    if (startDate >= endDate) {
      setMessage("Thời gian kết thúc phải sau thời gian bắt đầu");
      setVariant("danger");
      return;
    }

    // Kiểm tra trùng lịch
    if (checkTimeConflict(newShowtime.roomId, null, startDate, endDate)) {
      setMessage(
        "Phòng đã được đặt trong khung giờ này. Vui lòng chọn khung giờ khác."
      );
      setVariant("danger");
      return;
    }

    axios
      .post("http://localhost:8080/api/showtimes", {
        movieId: newShowtime.movieId,
        roomId: newShowtime.roomId,
        startTime: startDate.toISOString(),
        endTime: endDate.toISOString(),
        date: newShowtime.date,
      })
      .then(() => {
        setMessage("Thêm lịch chiếu thành công!");
        setVariant("success");
        setShowAddModal(false);
        setNewShowtime({
          movieId: "",
          roomId: "",
          date: "",
          startTime: "",
          endTime: "",
        });
        loadData();
      })
      .catch((error) => {
        console.error("Lỗi khi thêm lịch chiếu:", error);
        setMessage("Không thể thêm lịch chiếu. Vui lòng thử lại.");
        setVariant("danger");
      });
  };

  // Hàm kiểm tra trùng lịch
  const checkTimeConflict = (roomId, currentShowtimeId, startTime, endTime) => {
    // Lọc ra các lịch chiếu khác trong cùng phòng, không tính lịch đang sửa (nếu có)
    const roomShowtimes = showtimes.filter(
      (showtime) =>
        showtime.roomId === roomId && showtime.id !== currentShowtimeId
    );

    // Kiểm tra xem có lịch nào bị trùng thời gian không
    return roomShowtimes.some((showtime) => {
      const existingStart = new Date(showtime.startTime);
      const existingEnd = new Date(showtime.endTime);

      // Kiểm tra các trường hợp giao nhau:
      // 1. Thời gian bắt đầu mới nằm trong khoảng thời gian hiện có
      // 2. Thời gian kết thúc mới nằm trong khoảng thời gian hiện có
      // 3. Thời gian mới bao trùm khoảng thời gian hiện có
      return (
        (startTime >= existingStart && startTime < existingEnd) ||
        (endTime > existingStart && endTime <= existingEnd) ||
        (startTime <= existingStart && endTime >= existingEnd)
      );
    });
  };

  const formatDateTime = (dateTimeStr) => {
    // Tạo đối tượng Date từ chuỗi ISO
    const date = new Date(dateTimeStr);

    // Đặt múi giờ Việt Nam (UTC+7)
    const options = {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      timeZone: "Asia/Ho_Chi_Minh",
    };

    return new Intl.DateTimeFormat("vi-VN", options).format(date);
  };

  return (
    <>
      <NavBar />
      <Container className="mt-4">
        <h2 className="mb-4">Quản Lý Lịch Chiếu</h2>
        {message && <Alert variant={variant}>{message}</Alert>}

        <Button
          variant="primary"
          className="mb-4"
          onClick={() => setShowAddModal(true)}
        >
          Thêm Lịch Chiếu Mới
        </Button>

        {showtimes.length === 0 ? (
          <Alert variant="info">Chưa có lịch chiếu nào</Alert>
        ) : (
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>ID</th>
                <th>Phim</th>
                <th>Phòng</th>
                <th>Thời gian bắt đầu</th>
                <th>Thời gian kết thúc</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {showtimes.map((showtime) => (
                <tr key={showtime.id}>
                  <td>{showtime.id}</td>
                  <td>
                    {movies.find((m) => m.id === showtime.movieId)?.title ||
                      `${showtime.movieId}`}
                  </td>
                  <td>
                    {rooms.find((r) => r.id === showtime.roomId)?.name ||
                      `Phòng ${showtime.roomId}`}
                  </td>
                  <td>{formatDateTime(showtime.startTime)}</td>
                  <td>{formatDateTime(showtime.endTime)}</td>
                  <td>
                    <Button
                      variant="primary"
                      size="sm"
                      className="me-2"
                      onClick={() => handleEdit(showtime)}
                    >
                      Sửa
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleDelete(showtime.id)}
                    >
                      Xóa
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}

        {/* Modal Thêm Lịch Chiếu */}
        <Modal show={showAddModal} onHide={() => setShowAddModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Thêm Lịch Chiếu Mới</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>Phim</Form.Label>
                <Form.Select
                  value={newShowtime.movieId}
                  onChange={(e) =>
                    setNewShowtime({
                      ...newShowtime,
                      movieId: e.target.value,
                    })
                  }
                  required
                >
                  <option value="">--Chọn phim--</option>
                  {movies.map((movie) => (
                    <option key={movie.id} value={movie.id}>
                      {movie.title}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Phòng chiếu</Form.Label>
                <Form.Select
                  value={newShowtime.roomId}
                  onChange={(e) =>
                    setNewShowtime({
                      ...newShowtime,
                      roomId: e.target.value,
                    })
                  }
                  required
                >
                  <option value="">--Chọn phòng--</option>
                  {rooms.map((room) => (
                    <option key={room.id} value={room.id}>
                      {room.name || `Phòng ${room.id}`}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Ngày chiếu</Form.Label>
                <Form.Control
                  type="date"
                  value={newShowtime.date}
                  onChange={(e) =>
                    setNewShowtime({
                      ...newShowtime,
                      date: e.target.value,
                    })
                  }
                  min={new Date().toISOString().split("T")[0]}
                  required
                />
              </Form.Group>

              <Row>
                <Col>
                  <Form.Group className="mb-3">
                    <Form.Label>Thời gian bắt đầu</Form.Label>
                    <Form.Control
                      type="time"
                      value={newShowtime.startTime}
                      onChange={(e) =>
                        setNewShowtime({
                          ...newShowtime,
                          startTime: e.target.value,
                        })
                      }
                      required
                    />
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group className="mb-3">
                    <Form.Label>Thời gian kết thúc</Form.Label>
                    <Form.Control
                      type="time"
                      value={newShowtime.endTime}
                      onChange={(e) =>
                        setNewShowtime({
                          ...newShowtime,
                          endTime: e.target.value,
                        })
                      }
                      required
                    />
                  </Form.Group>
                </Col>
              </Row>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowAddModal(false)}>
              Hủy
            </Button>
            <Button variant="primary" onClick={handleAdd}>
              Thêm mới
            </Button>
          </Modal.Footer>
        </Modal>

        {/* Modal Chỉnh Sửa */}
        <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Chỉnh Sửa Lịch Chiếu</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {editShowtime && (
              <Form>
                <Form.Group className="mb-3">
                  <Form.Label>Phim</Form.Label>
                  <Form.Select
                    value={editShowtime.movieId}
                    onChange={(e) =>
                      setEditShowtime({
                        ...editShowtime,
                        movieId: e.target.value,
                      })
                    }
                  >
                    {movies.map((movie) => (
                      <option key={movie.id} value={movie.id}>
                        {movie.title}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Phòng chiếu</Form.Label>
                  <Form.Select
                    value={editShowtime.roomId}
                    onChange={(e) =>
                      setEditShowtime({
                        ...editShowtime,
                        roomId: e.target.value,
                      })
                    }
                  >
                    {rooms.map((room) => (
                      <option key={room.id} value={room.id}>
                        {room.name || `Phòng ${room.id}`}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Ngày chiếu</Form.Label>
                  <Form.Control
                    type="date"
                    value={editShowtime.date}
                    onChange={(e) =>
                      setEditShowtime({
                        ...editShowtime,
                        date: e.target.value,
                      })
                    }
                    min={new Date().toISOString().split("T")[0]}
                  />
                </Form.Group>

                <Row>
                  <Col>
                    <Form.Group className="mb-3">
                      <Form.Label>Thời gian bắt đầu</Form.Label>
                      <Form.Control
                        type="time"
                        value={editShowtime.startTime}
                        onChange={(e) =>
                          setEditShowtime({
                            ...editShowtime,
                            startTime: e.target.value,
                          })
                        }
                      />
                    </Form.Group>
                  </Col>
                  <Col>
                    <Form.Group className="mb-3">
                      <Form.Label>Thời gian kết thúc</Form.Label>
                      <Form.Control
                        type="time"
                        value={editShowtime.endTime}
                        onChange={(e) =>
                          setEditShowtime({
                            ...editShowtime,
                            endTime: e.target.value,
                          })
                        }
                      />
                    </Form.Group>
                  </Col>
                </Row>
              </Form>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowEditModal(false)}>
              Hủy
            </Button>
            <Button variant="primary" onClick={handleUpdate}>
              Lưu thay đổi
            </Button>
          </Modal.Footer>
        </Modal>
      </Container>
    </>
  );
}

export default ShowtimeManagement;

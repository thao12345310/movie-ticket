import { useState, useEffect } from "react";
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

function RoomManagement() {
  const [rooms, setRooms] = useState([]);
  const [newRoom, setNewRoom] = useState({ name: "" });
  const [editRoom, setEditRoom] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [message, setMessage] = useState("");
  const [variant, setVariant] = useState("success");

  // Hằng số từ Room entity
  const ROW_COUNT = 11;
  const COLUMN_COUNT = 12;
  const ROOM_TYPE = "2D";

  useEffect(() => {
    loadRooms();
  }, []);

  const loadRooms = () => {
    axios
      .get("http://localhost:8080/api/rooms")
      .then((response) => {
        // Đảm bảo response.data là một mảng
        const roomsData = Array.isArray(response.data) ? response.data : [];
        setRooms(roomsData);
      })
      .catch((error) => {
        console.error("Lỗi khi lấy danh sách phòng:", error);
        setMessage("Không thể tải danh sách phòng chiếu");
        setVariant("danger");
        setRooms([]); // Đặt rooms là mảng rỗng khi có lỗi
      });
  };

  const handleInputChange = (e) => {
    setNewRoom({ ...newRoom, [e.target.name]: e.target.value });
  };

  const handleEditInputChange = (e) => {
    setEditRoom({ ...editRoom, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newRoom.name.trim()) {
      setMessage("Vui lòng nhập tên phòng");
      setVariant("danger");
      return;
    }

    axios
      .post("http://localhost:8080/api/rooms", newRoom)
      .then((response) => {
        setMessage("Thêm phòng chiếu thành công!");
        setVariant("success");
        setNewRoom({ name: "" });
        loadRooms();
      })
      .catch((error) => {
        console.error("Lỗi khi thêm phòng chiếu:", error);
        setMessage("Không thể thêm phòng chiếu. Vui lòng thử lại.");
        setVariant("danger");
      });
  };

  const handleEdit = (room) => {
    setEditRoom(room);
    setShowEditModal(true);
  };

  const handleUpdate = () => {
    if (!editRoom.name.trim()) {
      setMessage("Vui lòng nhập tên phòng");
      setVariant("danger");
      return;
    }

    axios
      .put(`http://localhost:8080/api/rooms/${editRoom.id}`, editRoom)
      .then((response) => {
        setMessage("Cập nhật phòng chiếu thành công!");
        setVariant("success");
        setShowEditModal(false);
        loadRooms();
      })
      .catch((error) => {
        console.error("Lỗi khi cập nhật phòng chiếu:", error);
        setMessage("Không thể cập nhật phòng chiếu. Vui lòng thử lại.");
        setVariant("danger");
      });
  };

  const handleDelete = (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa phòng chiếu này?")) {
      axios
        .delete(`http://localhost:8080/api/rooms/${id}`)
        .then(() => {
          setMessage("Xóa phòng chiếu thành công!");
          setVariant("success");
          loadRooms();
        })
        .catch((error) => {
          console.error("Lỗi khi xóa phòng chiếu:", error);
          setMessage("Không thể xóa phòng chiếu. Vui lòng thử lại.");
          setVariant("danger");
        });
    }
  };

  return (
    <>
      <NavBar />
      <Container className="mt-4">
        <h2 className="mb-4">Quản Lý Phòng Chiếu</h2>
        {message && <Alert variant={variant}>{message}</Alert>}

        <Row className="mb-4">
          <Col md={6}>
            <h4>Thêm Phòng Chiếu Mới</h4>
            <Form onSubmit={handleSubmit}>
              <Form.Group controlId="roomName" className="mb-3">
                <Form.Label>Tên Phòng</Form.Label>
                <Form.Control
                  type="text"
                  name="name"
                  value={newRoom.name}
                  onChange={handleInputChange}
                  placeholder="Nhập tên phòng (VD: Phòng 1)"
                  required
                />
              </Form.Group>
              <Button variant="primary" type="submit">
                Thêm Phòng
              </Button>
            </Form>
          </Col>
          <Col md={6}>
            <h4>Thông Tin Cấu Hình</h4>
            <p>
              <strong>Loại phòng:</strong> {ROOM_TYPE}
            </p>
            <p>
              <strong>Số hàng ghế:</strong> {ROW_COUNT} (A-K)
            </p>
            <p>
              <strong>Số ghế mỗi hàng:</strong> {COLUMN_COUNT}
            </p>
            <p>
              <strong>Tổng số ghế:</strong> {ROW_COUNT * COLUMN_COUNT}
            </p>
          </Col>
        </Row>

        <h4 className="mt-4">Danh Sách Phòng Chiếu</h4>
        {rooms.length === 0 ? (
          <Alert variant="info">Chưa có phòng chiếu nào</Alert>
        ) : (
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>ID</th>
                <th>Tên Phòng</th>
                <th>Loại Phòng</th>
                <th>Số Ghế</th>
                <th>Thao Tác</th>
              </tr>
            </thead>
            <tbody>
              {rooms.map((room) => (
                <tr key={room.id}>
                  <td>{room.id}</td>
                  <td>{room.name}</td>
                  <td>{ROOM_TYPE}</td>
                  <td>{ROW_COUNT * COLUMN_COUNT}</td>
                  <td>
                    <Button
                      variant="primary"
                      size="sm"
                      className="me-2"
                      onClick={() => handleEdit(room)}
                    >
                      Sửa
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleDelete(room.id)}
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
            <Modal.Title>Chỉnh Sửa Phòng Chiếu</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {editRoom && (
              <Form>
                <Form.Group controlId="editRoomName" className="mb-3">
                  <Form.Label>Tên Phòng</Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    value={editRoom.name}
                    onChange={handleEditInputChange}
                    required
                  />
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

export default RoomManagement;

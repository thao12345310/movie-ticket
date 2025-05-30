import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Button, Card, Row, Col, Modal } from "react-bootstrap";

function MovieList() {
  const [movies, setMovies] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [show, setShow] = useState(false);
  const navigate = useNavigate();

  const handleClose = () => setShow(false);

  const handleShowDetails = (movie) => {
    setSelectedMovie(movie); // Lưu phim được chọn
    setShow(true);
  };

  useEffect(() => {
    axios
      .get("http://localhost:8080/api/movies")
      .then((response) => {
        setMovies(response.data);
      })
      .catch((error) => console.error("Lỗi khi gọi API:", error));
  }, []);

  const handleDeleteMovie = (movieId) => {
    axios
      .delete(`http://localhost:8080/api/movies/${movieId}`)
      .then(() => {
        setMovies((prevMovies) =>
          prevMovies.filter((movie) => movie.id !== movieId)
        );
      })
      .catch((error) => {
        console.error("Lỗi xóa phim:", error);
      });
  };

  const handleBookTicket = (movieId) => {
    navigate(`/showtime-booking?movieId=${movieId}`);
    handleClose();
  };

  return (
    <div className="container">
      <Row xs={1} sm={2} md={3} lg={4} className="g-4">
        {movies.map((movie) => (
          <Col key={movie.id}>
            <Card
              style={{ width: "18rem", cursor: "pointer" }}
              onClick={() => handleShowDetails(movie)}
            >
              <Card.Img variant="top" src={movie.posterUrl} />
              <Card.Body>
                <Card.Title>{movie.title}</Card.Title>
                <Card.Text>Thể loại: {movie.genre}</Card.Text>
                <div className="d-flex gap-2 mb-2">
                  <Button onClick={() => handleShowDetails(movie)}>
                    Xem chi tiết
                  </Button>
                  <Button
                    variant="danger"
                    onClick={() => handleDeleteMovie(movie.id)}
                  >
                    Xóa phim
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Modal chi tiết phim */}
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>{selectedMovie?.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedMovie && (
            <>
              <img
                src={selectedMovie.posterUrl}
                alt={selectedMovie.title}
                className="img-fluid mb-3"
              />
              <p>
                <strong>Thể loại:</strong> {selectedMovie.genre}
              </p>
              <p>
                <strong>Mô tả:</strong> {selectedMovie.description}
              </p>
              <p>
                <strong>Thời lượng:</strong> {selectedMovie.duration} phút
              </p>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button
            onClick={() => selectedMovie && handleBookTicket(selectedMovie.id)}
            className="me-auto"
          >
            Đặt vé
          </Button>
          <Button variant="secondary" onClick={handleClose}>
            Đóng
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default MovieList;

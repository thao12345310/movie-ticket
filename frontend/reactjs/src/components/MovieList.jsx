import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { Button, Card, Row, Col } from "react-bootstrap";
function MovieList() {
  const [movies, setMovies] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null); // Lưu trữ phim được chọn

  useEffect(() => {
    axios
      .get("http://localhost:8080/movies")
      .then((response) => {
        setMovies(response.data);
      })
      .catch((error) => console.error("Lỗi khi gọi API:", error));
  }, []);

  const handleShowDetails = (movie) => {
    setSelectedMovie(movie);
  };

  const handleDeleteMovie = (movieId) => {
    axios
      .delete(`http://localhost:8080/movies/${movieId}`)
      .then((response) => {
        console.log("Xóa phim thành công:", response.data);
        // Cập nhật danh sách movies sau khi xóa
        setMovies((prevMovies) =>
          prevMovies.filter((movie) => movie.id !== movieId)
        );
      })
      .catch((error) => {
        console.error("Lỗi xóa phim:", error);
      });
  };
  return (
    <div className="container">
      <div>
        <Row xs={1} sm={2} md={3} lg={4} className="g-4">
          {movies.map((movie) => (
            <Col key={movie.id}>
              <Card style={{ width: "18rem" }}>
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
      </div>

      {/* Hiển thị chi tiết phim */}
      {selectedMovie && (
        <div
          style={{
            marginTop: "20px",
            padding: "10px",
            border: "1px solid #ccc",
            borderRadius: "5px",
            width: "300px",
            backgroundColor: "#f9f9f9",
          }}
        >
          <h3>{selectedMovie.title}</h3>
          <p>
            <strong>Mô tả:</strong> {selectedMovie.description}
          </p>
          <p>
            <strong>Thời lượng:</strong> {selectedMovie.duration} phút
          </p>
          <Button onClick={() => setSelectedMovie(null)}>Đóng</Button>
        </div>
      )}
    </div>
  );
}

export default MovieList;

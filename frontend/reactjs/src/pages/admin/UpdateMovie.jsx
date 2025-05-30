import { useState } from "react";
import { Button, Form } from "react-bootstrap";
import axios from "axios";
import NavBar from "../../components/NavBar";
import MovieList from "../../components/MovieList";
function UpdateMovie() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [duration, setDuration] = useState("");
  const [genre, setGenre] = useState("");
  const [poster, setPoster] = useState(null);
  const [posterUrl, setPosterUrl] = useState("");

  const handleFileChange = (e) => {
    setPoster(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!poster) return alert("Vui lòng chọn ảnh!");

    const formData = new FormData();
    formData.append("file", poster);

    try {
      const response = await axios.post(
        "http://localhost:8080/movies/upload",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      setPosterUrl(response.data.posterUrl);
    } catch (error) {
      alert("Lỗi khi upload ảnh!");
      console.error(error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!posterUrl) return alert("Vui lòng upload ảnh trước!");

    const movieData = { title, description, duration, genre, posterUrl };

    try {
      await axios.post("http://localhost:8080/movies/add", movieData, {
        headers: { "Content-Type": "application/json" },
      });

      alert("Thêm phim thành công!");
    } catch (error) {
      alert("Lỗi khi thêm phim!");
      console.error(error);
    }
  };

  return (
    <>
      <NavBar />
      <div className="container m-4">
        <div className="mb-5">
          <Form>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>Tiêu đề</Form.Label>
              <Form.Control
                type="text"
                placeholder="Tiêu đề"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group
              className="mb-3"
              controlId="exampleForm.ControlTextarea1"
            >
              <Form.Label>Mô tả</Form.Label>
              <Form.Control
                placeholder="Mô tả"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Thời lượng (phút)</Form.Label>
              <Form.Control
                type="number"
                placeholder="Thời lượng (phút)"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group
              className="mb-3"
              controlId="exampleForm.ControlTextarea1"
            >
              <Form.Label>Thể loại</Form.Label>
              <Form.Control
                placeholder="Thể loại"
                value={genre}
                onChange={(e) => setGenre(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group controlId="formFile" className="mb-3">
              <Form.Label>Tải Poster</Form.Label>
              <Form.Control type="file" onChange={handleFileChange} />
            </Form.Group>
          </Form>
          <Button type="button" onClick={handleUpload}>
            Upload Ảnh
          </Button>
          <Button type="submit" onClick={handleSubmit}>
            Thêm Phim
          </Button>
        </div>
        <MovieList />
      </div>
    </>
  );
}

export default UpdateMovie;

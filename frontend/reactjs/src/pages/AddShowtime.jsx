import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";

function AddShowtime() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const movieIdFromQuery = queryParams.get("movieId");

  const [movies, setMovies] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(movieIdFromQuery || "");
  const [showtime, setShowtime] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    axios
      .get("http://localhost:8080/movies")
      .then((response) => setMovies(response.data))
      .catch((error) => console.error("Error fetching movies:", error));
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedMovie || !showtime) {
      setMessage("Please select a movie and enter a showtime.");
      return;
    }

    axios
      .post("http://localhost:8080/showtimes", {
        movieId: selectedMovie,
        showtime: showtime,
      })
      .then((response) => setMessage("Showtime added successfully!"))
      .catch((error) => setMessage("Failed to add showtime."));
  };

  return (
    <div>
      <h2>Add Showtime</h2>
      {message && <p>{message}</p>}
      <form onSubmit={handleSubmit}>
        <label>
          Select Movie:
          <select
            value={selectedMovie}
            onChange={(e) => setSelectedMovie(e.target.value)}
          >
            <option value="">--Choose a movie--</option>
            {movies.map((movie) => (
              <option key={movie.id} value={movie.id}>
                {movie.title}
              </option>
            ))}
          </select>
        </label>
        <br />
        <label>
          Showtime:
          <input
            type="datetime-local"
            value={showtime}
            onChange={(e) => setShowtime(e.target.value)}
          />
        </label>
        <br />
        <button type="submit">Add Showtime</button>
      </form>
    </div>
  );
}

export default AddShowtime;

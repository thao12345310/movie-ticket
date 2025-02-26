import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getMovieById } from "../api/movieApi";

const MovieDetail = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);

  useEffect(() => {
    getMovieById(id).then((data) => setMovie(data));
  }, [id]);

  if (!movie) return <p className="text-center text-gray-600">Loading...</p>;

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-2xl mx-auto bg-white p-6 rounded-xl shadow-md">
        <h1 className="text-3xl font-bold">{movie.title}</h1>
        <p className="text-gray-600">{movie.description}</p>
        <Link
          to={`/booking/${movie.id}`}
          className="mt-4 inline-block px-4 py-2 bg-blue-500 text-white rounded-lg"
        >
          Đặt Vé
        </Link>
      </div>
    </div>
  );
};

export default MovieDetail;

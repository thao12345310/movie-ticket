import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Home = () => {
  const [movies, setMovies] = useState([
    {
      id: 1,
      title: "Avengers: Endgame",
      description: "Các siêu anh hùng đối đầu với Thanos để cứu vũ trụ.",
    },
    {
      id: 2,
      title: "Inception",
      description: "Một nhóm chuyên gia xâm nhập vào giấc mơ để cấy ý tưởng.",
    },
    {
      id: 3,
      title: "Interstellar",
      description: "Hành trình tìm kiếm hành tinh mới cho loài người.",
    },
  ]);

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold text-center mb-6">Danh Sách Phim</h1>
      {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {movies.map((movie) => (
          <div key={movie.id} className="bg-white p-4 rounded-xl shadow-md">
            <h2 className="text-xl font-semibold">{movie.title}</h2>
            <p className="text-gray-600">{movie.description}</p>
            <Link
              to={`/movies/${movie.id}`}
              className="block mt-3 text-blue-500 hover:underline"
            >
              Xem chi tiết
            </Link>
          </div>
        ))}
      </div> */}
    </div>
  );
};

export default Home;

import React from "react";
import MovieList from "../../components/MovieList";
import NavBar from "../../components/NavBar";
function Home() {
  return (
    <div>
      <NavBar />
      <div className="container">
        <h1 className="text-center m-4">🎬 Phim Đang Chiếu</h1>
        <MovieList />
      </div>
    </div>
  );
}

export default Home;

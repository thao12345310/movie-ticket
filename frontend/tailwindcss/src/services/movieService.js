import axiosClient from "../api/axiosClient";

const movieService = {
  getAllMovies: async () => {
    try {
      const response = await axiosClient.get("/movies");
      return response.data;
    } catch (error) {
      console.error("Error fetching movies:", error);
      return [];
    }
  },

  getMovieById: async (id) => {
    try {
      const response = await axiosClient.get(`/movies/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching movie:", error);
      return null;
    }
  },
};

export default movieService;

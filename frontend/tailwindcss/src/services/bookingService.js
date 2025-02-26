import axiosClient from "../api/axiosClient";

const bookingService = {
  bookTicket: async (movieId, seats, name) => {
    try {
      const response = await axiosClient.post("/bookings", {
        movieId,
        seats,
        name,
      });
      return response.data;
    } catch (error) {
      console.error("Error booking ticket:", error);
      return null;
    }
  },
};

export default bookingService;

import { useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const Booking = () => {
  const { id } = useParams();
  const [seats, setSeats] = useState([]);
  const [name, setName] = useState("");

  const handleBooking = async () => {
    const response = await axios.post("http://localhost:8080/bookings", {
      movieId: id,
      seats,
      name,
    });
    alert("Đặt vé thành công!");
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-6 rounded-xl shadow-md w-96">
        <h1 className="text-2xl font-bold mb-4">Đặt Vé</h1>
        <input
          type="text"
          placeholder="Nhập tên"
          className="w-full px-4 py-2 border rounded-lg mb-3"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <button
          onClick={handleBooking}
          className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          Xác nhận đặt vé
        </button>
      </div>
    </div>
  );
};

export default Booking;

import "bootstrap/dist/css/bootstrap.min.css";
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/public/Home";
import UpdateMovie from "./pages/admin/UpdateMovie";
import SeatBooking from "./pages/public/SeatBooking";
import ShowtimeManagement from "./pages/admin/ShowtimeManagement";
import ShowtimeBooking from "./pages/public/ShowtimeBooking";
import RoomManagement from "./pages/admin/RoomManagement";
import Login from "./pages/public/Login";
import Signup from "./pages/public/Signup";
import Profile from "./pages/public/Profile";
import UserManagement from "./pages/admin/UserManagement";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/add-movie" element={<UpdateMovie />} />
        <Route path="/seat-booking" element={<SeatBooking />} />
        <Route path="/admin/showtimes" element={<ShowtimeManagement />} />
        <Route path="/showtime-booking" element={<ShowtimeBooking />} />
        <Route path="/admin/rooms" element={<RoomManagement />} />
        <Route path="/admin/users" element={<UserManagement />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </Router>
  );
}

export default App;

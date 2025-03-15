import "bootstrap/dist/css/bootstrap.min.css";
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import UpdateMovie from "./pages/UpdateMovie";
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/add-movie" element={<UpdateMovie />} />
      </Routes>
    </Router>
  );
}

export default App;

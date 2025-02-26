import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import MovieDetail from "./pages/MovieDetail";
import Booking from "./pages/Booking";

const App = () => {
  return (
    // <Router>
    //   <div className="min-h-screen bg-gray-100">
    //     <Routes>
    //       <Route path="/" element={<Home />} />
    //       {/* <Route path="/movies/:id" element={<MovieDetail />} />
    //       <Route path="/booking/:id" element={<Booking />} /> */}
    //     </Routes>
    //   </div>
    // </Router>
    <div>
      <h1>Hello World</h1>
    </div>
  );
};

export default App;

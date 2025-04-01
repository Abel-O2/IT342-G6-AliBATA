import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./Login";
import HomePage from "./HomePage";
import Signup from "./Signup"; 
import Payment from "./Payment";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/payment" element={<Payment/>}/>
      </Routes>
    </Router>
  );
}

export default App;

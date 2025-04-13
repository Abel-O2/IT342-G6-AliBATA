import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./Login";
import HomePage from "./HomePage";
import Signup from "./Signup"; 
import Payment from "./Payment";
import Contact from  "./ContactUs";
import Admin from "./AdminDashboard"

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} /> 
        <Route path="/home" element={<HomePage />} />
        <Route path="/payment" element={<Payment/>}/>
        <Route path="/contact" element={<Contact/>}/>
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </Router>
  );
}

export default App;

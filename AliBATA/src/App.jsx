import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./Login";
import HomePage from "./HomePage";
import Signup from "./Signup"; 
import Payment from "./Payment";
import Contact from  "./ContactUs";
import Admin from "./AdminDashboard"
import OnePicFourWords from "./Activities/OnePicFourWords";
import PhraseTranslation from "./Activities/PhraseTranslation";
import WordTranslation from "./Activities/WordTranslation";
import Activity from "./Activities";

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
        <Route path="/activity" element={<Activity/>}/>
        <Route path="/create-activity/OnePicFourWords/:activityId" element={<OnePicFourWords />} /> 
        <Route path="/create-activity/PhraseTranslation/:activityId" element={<PhraseTranslation />} />
        <Route path="/create-activity/WordTranslation/:activityId" element={<WordTranslation />} />
      </Routes>
    </Router>
  );
}

export default App;

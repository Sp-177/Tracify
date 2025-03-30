import React from "react";
import { BrowserRouter as Router, Routes, Route, Link, useNavigate, BrowserRouter } from "react-router-dom";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import MyFam from "./pages/MyFam";
import Mapfile from "./Map/Mapfile";
const App = () => {
  return (
    
    <Router>
      <Routes>
        <Route path="/" element={<MyFam/>} />
        <Route path="/signin" element={<SignIn/>} />
        <Route path="/signup" element={<SignUp/>} />
        <Route path="/maparea" element={<Mapfile/>} />
      </Routes>
    </Router>
  );
};

export default App;
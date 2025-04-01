import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Mapfile from "./Map/Mapfile";
import { useAuth } from "./context/AuthContext";

import Home from "./pages/Home";
import ContactPage from "./pages/ContactPage";
import Profile from "./pages/Profile";
const App = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>; // Show a loading message while user data is being fetched
  }

  return (
    <Router>
      <Routes>
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        {user ? (
          <Route path="/maparea" element={<Mapfile userId={user._id} familyId={user.familyId} />} />
        ) : (
          <Route path="/maparea" element={<SignIn />} />
        )}
        <Route path="/signin" element={<SignIn/>} />
        <Route path="/signup" element={<SignUp/>} />
        <Route path="/" element={<Home />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/map" element={<Mapfile />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </Router>
  );
};

export default App;

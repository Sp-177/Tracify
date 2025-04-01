import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Mapfile from "./Map/Mapfile";
import AboutUs from "./ABOUTUS/AboutUs";
import { useAuth } from "./context/AuthContext";
import Mainsection from "./Components/Mainsection";

// Private Route Component
const PrivateRoute = ({ element }) => {
  const { user } = useAuth();
  return user ? element : <Navigate to="/signin" />;
};

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

        <Route path="/" element={<Mainsection/>} />
        <Route path="/aboutus" element={<AboutUs />} />
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

        {/* Protected Routes - Only accessible if user is logged in */}
        <Route path="/myfam" element={<PrivateRoute element={<MyFam />} />} />
        <Route path="/maparea" element={<PrivateRoute element={<Mapfile userId={user?._id} familyId={user?.familyId} />} />} />
      </Routes>
    </Router>
  );
};

export default App;

import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import AboutUs from "./ABOUTUS/AboutUs";
import { useAuth } from "./context/AuthContext";

// Private Route Component
const PrivateRoute = ({ element }) => {
  const { user , isLoggedIn} = useAuth();
  return user && isLoggedIn ? element : <Navigate to="/signin" />;
};

import Home from "./pages/Home";
import ContactPage from "./pages/ContactPage";
import Profile from "./pages/Profile";
import MyFam from "./pages/MyFam";
const App = () => {
  const { user, loading } = useAuth();
  if (loading) {
    return <div>Loading...</div>; // Show a loading message while user data is being fetched
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/aboutus" element={<AboutUs />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/profile" element={<Profile />} />
        {/* Protected Routes - Only accessible if user is logged in */}
        <Route path="/myfam" element={<PrivateRoute element={<MyFam />} />} />
        {/* <Route path="/maparea" element={<PrivateRoute element={<Mapfile userId={user._id} familyId={user.familyId} />} />} /> */}
      </Routes>
    </Router>
  );
};

export default App;

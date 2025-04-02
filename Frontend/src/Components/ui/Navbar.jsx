import React, { useState } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "../../context/AuthContext";
import { Backendurl } from "../../../Private/backend";
import axios from "axios";
import { Menu, X, Bell } from "lucide-react";

export default function Navbar() {
  const [location] = useLocation();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { logout, user, isLoggedIn } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
      await axios.get(`${Backendurl}/api/v1/users/logout`, {
        withCredentials: true,
      });
      console.log("User logged out successfully");
    } catch (error) {
      console.error("Error during logout:", error.response ? error.response.data : error.message);
    }
  };

  return (
    <nav className="bg-white shadow-md relative z-50">
      <div className="container mx-auto px-4 py-3 max-w-6xl flex items-center justify-between lg:justify-start">
        {/* Mobile Menu Button */}
        <button
          className="lg:hidden block p-2 text-gray-700 hover:text-black"
          onClick={() => setIsSidebarOpen(true)}
        >
          <Menu size={28} />
        </button>

        {/* Logo */}
        <a href="/" className="font-bold text-xl text-[#1A1A1A] lg:mr-auto lg:flex-none lg:text-left flex-1 text-center">
          Tracify
        </a>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex flex-1 justify-center space-x-4">
          {isLoggedIn &&
            ["features", "missing", "family", "contact"].map((item) => (
              <Link key={item} href={`/${item}`}>
                <a
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    location === `/${item}`
                      ? "bg-[#B4FF4A] text-[#1A1A1A]"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  {item.charAt(0).toUpperCase() + item.slice(1)}
                </a>
              </Link>
            ))}
        </div>

        {/* Bell Icon & Profile */}
        <div className="flex items-center">
          {isLoggedIn && (
            <button className="p-2 text-gray-700 hover:text-[#B4FF4A]">
              <Bell size={24} />
            </button>
          )}

          {isLoggedIn ? (
            <div className="relative flex items-center ml-4">
              <button
                type="button"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="relative flex rounded-full bg-gray-800 text-sm focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800 focus:outline-none"
              >
                <img className="size-9 rounded-full" src={user.avatar} alt="Profile" />
              </button>
              {isDropdownOpen && (
                <div className="absolute right-0 z-10 mt-46 ml-12 w-48 bg-white shadow-lg rounded-md py-1 ring-1 ring-black/5">
                  <a href="/profile" className="block px-4 py-2 text-sm text-gray-700">
                    Your Profile
                  </a>
                  <a href="#" className="block px-4 py-2 text-sm text-gray-700">
                    Settings
                  </a>
                  <button onClick={handleLogout} className="block px-4 py-2 text-sm text-gray-700 w-full text-left">
                    Sign out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <a className="text-blue-400 text-sm px-4 py-2" href="/signin">
              SignUp / SignIn
            </a>
          )}
        </div>
      </div>

      {/* Mobile Sidebar */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300 ${
          isSidebarOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        onClick={() => setIsSidebarOpen(false)}
      ></div>

      <div
        className={`fixed top-0 left-0 w-64 h-full bg-white shadow-lg transform z-50 transition-transform duration-300 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-5 flex justify-between items-center border-b">
          <span className="text-xl font-bold">Menu</span>
          <button onClick={() => setIsSidebarOpen(false)} className="text-gray-700">
            <X size={24} />
          </button>
        </div>
        <div className="flex flex-col space-y-4 p-5">
          {isLoggedIn &&
            ["features", "missing", "family", "contact"].map((item) => (
              <Link key={item} href={`/${item}`}>
                <a
                  className="px-4 py-2 text-gray-700 text-lg hover:bg-gray-100 rounded-md"
                  onClick={() => setIsSidebarOpen(false)}
                >
                  {item.charAt(0).toUpperCase() + item.slice(1)}
                </a>
              </Link>
            ))}
        </div>
      </div>
    </nav>
  );
}

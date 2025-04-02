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
    <nav className="bg-white">
      <div className="container mx-auto px-4 py-3 max-w-6xl">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <a href="/" className="font-bold text-xl text-[#1A1A1A]">Tracify</a>
          </div>
          <div className="space-x-4 flex">
            <Link href="/features">
              <a className={`px-3 py-2 rounded-md text-sm font-medium ${
                location === "/" 
                  ? "bg-[#B4FF4A] text-[#1A1A1A]" 
                  : "text-gray-700 hover:bg-gray-100"
              }`}>
                Features
              </a>
            </Link>
            <Link href="/missing">
              <a className={`px-3 py-2 rounded-md text-sm font-medium ${
                location === "/missing" 
                  ? "bg-[#B4FF4A] text-[#1A1A1A]" 
                  : "text-gray-700 hover:bg-gray-100"
              }`}>
                Missing
              </a>
            </Link>
            <Link href="/myfam">
              <a className={`px-3 py-2 rounded-md text-sm font-medium ${
                location === "/family" 
                  ? "bg-[#B4FF4A] text-[#1A1A1A]" 
                  : "text-gray-700 hover:bg-gray-100"
              }`}>
                Family
              </a>
            </Link>
            <Link href="/contact">
              <a className={`px-3 py-2 rounded-md text-sm font-medium ${
                location === "/contact" 
                  ? "bg-[#B4FF4A] text-[#1A1A1A]" 
                  : "text-gray-700 hover:bg-gray-100"
              }`}>
                Contact
              </a>
            </Link>
            <Link href="/report">
              <a className={`px-3 py-2 rounded-md text-sm font-medium ${
                location === "/contact" 
                  ? "bg-[#B4FF4A] text-[#1A1A1A]" 
                  : "text-gray-700 hover:bg-gray-100"
              }`}>
                Report
              </a>
            </Link>
          </div>
          <div className='absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0'>
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
            <div className="flex space-x-4">
  <a
    className="text-black text-base font-semibold px-4 py-2 border border-lime-400 rounded-lg transition-all duration-500 ease-in-out hover:bg-lime-400 hover:text-black shadow-[0_0_10px_#bef264] hover:shadow-[0_0_25px_#bef264] transform hover:scale-105"
    href="/signup"
  >
    Sign Up
  </a>
  <a
    className="text-black text-base font-semibold px-4 py-2 border border-lime-400 rounded-lg transition-all duration-500 ease-in-out hover:bg-lime-400 hover:text-black shadow-[0_0_10px_#bef264] hover:shadow-[0_0_25px_#bef264] transform hover:scale-105"
    href="/signin"
  >
    Sign In
  </a>
</div>

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

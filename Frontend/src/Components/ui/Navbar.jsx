import React, { useState } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "../../context/AuthContext";
import { Backendurl } from "../../../Private/backend";
import axios from "axios";
export default function Navbar() {
  const [location] = useLocation();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { logout, user, isLoggedIn } = useAuth();

  const handleLogout = async () => {
    try {
      await logout(); // Ensure logout is properly called

      await axios.get(`${Backendurl}/api/v1/users/logout`, {
        withCredentials: true,
      });

      console.log("User logged out successfully");
    } catch (error) {
      console.error(
        "Error during logout:",
        error.response ? error.response.data : error.message
      );
    }
  };

  return (
    <nav className="bg-white">
      <div className="container mx-auto px-4 py-3 max-w-6xl">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <a href="/" className="font-bold text-xl text-[#1A1A1A]">
              Tracify
            </a>
          </div>
          {isLoggedIn ?
          <div className="space-x-4 flex">
            <Link href="/features">
              <a
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  location === "/"
                    ? "bg-[#B4FF4A] text-[#1A1A1A]"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                Features
              </a>
            </Link>
            <Link href="/missing">
              <a
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  location === "/missing"
                    ? "bg-[#B4FF4A] text-[#1A1A1A]"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                Missing
              </a>
            </Link>
            <Link href="/family">
              <a
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  location === "/family"
                    ? "bg-[#B4FF4A] text-[#1A1A1A]"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                Family
              </a>
            </Link>
            <Link href="/contact">
              <a
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  location === "/contact"
                    ? "bg-[#B4FF4A] text-[#1A1A1A]"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                Contact
              </a>
            </Link>
          </div> : <div></div>}
          {isLoggedIn ? (
            <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
              <button
                type="button"
                onMouseEnter={() => setIsDropdownOpen(true)}
                // onMouseLeave={() => setIsDropdownOpen(false)}
                onClick={() => setIsDropdownOpen(false)}
                className="relative rounded-full bg-gray-800 p-1 text-gray-400 hover:text-[#B4FF4A] focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800 focus:outline-none"
              >
                <span className="sr-only">View notifications</span>
                <svg
                  className="size-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0"
                  />
                </svg>
              </button>

              {/* Profile Dropdown */}
              <div
                className="relative ml-3"
                onMouseEnter={() => setIsDropdownOpen(true)}
                // onMouseLeave={() => setIsDropdownOpen(false)}
                onClick={() => setIsDropdownOpen(false)}
              >
                <button
                  type="button"
                  className="relative flex rounded-full bg-gray-800 text-sm focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800 focus:outline-none"
                >
                  <span className="sr-only">Open user menu</span>
                  <img
                    className="size-9 rounded-full"
                    src={user.avatar}
                    alt=""
                  />
                </button>

                {isDropdownOpen && (
                  <div className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black/5">
                    <a
                      href="/profile"
                      className="block px-4 py-2 text-sm text-gray-700"
                    >
                      Your Profile
                    </a>
                    <a
                      href="#"
                      className="block px-4 py-2 text-sm text-gray-700"
                    >
                      Settings
                    </a>
                    <button
                      onClick={handleLogout}
                      className="block px-4 py-2 text-sm text-gray-700"
                    >
                      Sign out
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
              <div className="flex gap-4 p-2 bg-lime-300 rounded-full shadow-md">
                <a className="px-4 py-2 text-sm text-white font-semibold bg-green-700 rounded-full hover:bg-green-600 transition" href="/signup">SignUp</a>
                <a className="px-4 py-2 text-sm text-green-800 font-semibold border-2 border-green-700 rounded-full hover:bg-lime-400 transition" href="/signin">SignIn</a>
              </div>

          )}
        </div>
      </div>
    </nav>
  );
}

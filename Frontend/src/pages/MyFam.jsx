import React, { useRef, useState, useEffect } from "react";
import FamCard from '../Components/FamCard';
import { useAuth } from '../context/AuthContext';
import { useGenerateUserMarker, useMap, useNavigationControl } from "../hooks/MapHooks";
import { useSocket } from "../hooks/Sockethook";

function MyFam() {
  const { user, userFamily } = useAuth();
  const mapContainer = useRef(null); 
  const [usersData, setUsersData] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);  // Toggle state for sidebar
  const map = useMap(mapContainer);

  useNavigationControl(map);
  useSocket(setUsersData, user._id, user.familyId);
  useGenerateUserMarker(map, "#693ff2", usersData, userFamily);

  return (
    <div className="flex flex-col  h-screen p-4 bg-gray-100">
      <div className="flex h-[10vh] items-center justify-between px-4">
        <img 
          src="./public/ham.png" 
          alt="Menu" 
          className="h-8 w-8 cursor-pointer" 
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}  // Toggle sidebar visibility
        />
        <h2 className="ml-auto">My Family Page</h2>
      </div>
      <div className="flex h-[90vh] gap-3 rounded-2xl shadow-lg overflow-hidden">
        {/* Conditionally render the sidebar content */}
        {isSidebarOpen && (
          <div className="w-1/4 p-4 flex flex-col rounded-2xl space-y-4 overflow-y-auto bg-gray-200">
            {userFamily.length > 0 ? (
              userFamily.map((member) => <FamCard key={member._id} member={member} />)
            ) : (
              <p>No family members found.</p>
            )}
          </div>
        )}

        {/* Fix: Make sure the map stays within the designated area */}
        <div
          className={`flex-1 bg-gray-200 rounded-r-2xl p-4 transition-all duration-300 ${isSidebarOpen ? "ml-1/4" : "ml-0"}`}
          style={{ maxWidth: isSidebarOpen ? "75%" : "100%" }} // Ensure map doesn't stretch beyond 75% width
          ref={mapContainer}
        />
      </div>
    </div>
  );
}

export default MyFam;

import React, { useRef, useState, useEffect } from "react";
import FamCard from '../Components/FamCard';
import { useAuth } from '../context/AuthContext';
import { useGenerateUserMarker, useMap, useNavigationControl } from "../hooks/MapHooks";
import { useSocket } from "../hooks/Sockethook";
import { Menu, X, ArrowLeft, ArrowRight } from 'lucide-react';

function MyFam() {
  const { user, userFamily } = useAuth();
  const mapContainer = useRef(null); 
  const [usersData, setUsersData] = useState([]);
  const [isMenuOpen, setIsMenuOpen] = useState(true);
  const map = useMap(mapContainer);
  useNavigationControl(map);
  useSocket(setUsersData, user._id, user.familyId);
  useGenerateUserMarker(map, "#693ff2", usersData, userFamily);

  return (
    <div className="flex flex-col h-screen p-4 bg-gray-white">
      <div className="text-center text-2xl font-semibold mb-4 relative">
        <button
          className="absolute left-4 top-1/2 transform -translate-y-1/2 p-2 bg-gray-white rounded-xl focus:outline-none"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? (
  <div className="rounded-xl bg-white p-2">
    <X size={24} className="text-black" /> 
  </div>
) : (
  <div className="rounded-xl bg-white p-2">
    <Menu size={24} className="text-black" /> 
  </div>
)}

        </button>
        MY FAMILY
      </div>
      <div className="flex flex-1 rounded-2xl shadow-lg overflow-hidden gap-2 border-2">
        {isMenuOpen && (
          <div className="w-1/4 p-4 flex flex-col space-y-4 overflow-y-auto transition-all duration-1000 border-r-2  rounded-xl">
            {userFamily.length > 0 ? (
              userFamily.map((member) => <FamCard key={member._id} member={member} />)
            ) : (
              <p>No family members found.</p>
            )}
          </div>
        )}
        <div className={`flex-1 bg-white rounded-2xl p-4 transition-all duration-1000`} ref={mapContainer} />
      </div>
    </div>
  );
}

export default MyFam;
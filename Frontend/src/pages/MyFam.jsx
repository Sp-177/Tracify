import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import FamCard from "../Components/FamCard";
function MyFam({ userId }) {
  const [familyMembers, setFamilyMembers] = useState([]);
  const { user } = useAuth();

  const handleFetchFamily = async () => {
    try {
      const response = await axios.get(
        `/api/v1/users/getfamily/${user.familyId}`,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      setFamilyMembers(response.data.familyMembers);
    } catch (error) {
      console.error("Error fetching family members", error);
    }
  };

  return (
    <div className="flex flex-col items-center p-4 relative">
      <button
        className="flex items-center px-4 py-2 bg-gray-100 rounded-lg shadow-sm text-black text-lg font-medium"
        onClick={handleFetchFamily}
      >
        Add a Family Member <span className="ml-2 text-2xl">+</span>
      </button>
      
      <div className="mt-4 w-full max-w-md">
        {familyMembers.length > 0 ? (
          familyMembers.map((member) => (
              <FamCard props={member} />
          ))
        ) : (
          <p className="text-gray-500 mt-2">No family members found.</p>
        )}
      </div>
    </div>
  );
}

export default MyFam;

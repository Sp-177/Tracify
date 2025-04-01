import React, { useState, useEffect } from 'react';
import FamCard from '../Components/FamCard';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

function MyFam() {
  const [members, setMembers] = useState([]);
  const { user , userFamily } = useAuth();
  console.log("userfamily is",userFamily);
  useEffect(() => {
    const fetchFamilyMembers = async () => {
      if (user?.familyId) {
        try {
          const response = await axios.get(`/api/v1/users/getfamily/${user.familyId}`, {
            headers: {
              Authorization: `Bearer ${user.accessToken}`,
            },
          });

          console.log("API Response:", response.data);

          // Ensure the data structure is correct

          if (response.data && response.data.data && Array.isArray(response.data.data.familyMembers)) {
            setMembers(response.data.data.familyMembers);
          } else {
            console.error("Unexpected API response structure:", response.data);
            setMembers([]);
          }
        } catch (error) {
          console.error('Error fetching family members:', error);
          setMembers([]); // Set to empty array in case of an error
        }
      }
    };

    fetchFamilyMembers();
  }, [user]);

  return (
    <div className="flex flex-col h-screen p-4 bg-gray-100">
      <div className="text-center text-2xl font-semibold mb-4">
        MY FAMILY
      </div>
      <div className="flex flex-1 rounded-2xl shadow-lg overflow-hidden">
        <div className="w-1/4 p-4 flex flex-col space-y-4 overflow-y-auto">
          {members.length > 0 ? (
            members.map((member) => <FamCard key={member._id} member={member} />)
          ) : (
            <p>No family members found.</p>
          )}
        </div>
        <div className="flex-1 bg-gray-200 rounded-r-2xl p-4">
          {/* Map Content (Add your map component or content here) */}
        </div>
      </div>
    </div>
  );
}

export default MyFam;

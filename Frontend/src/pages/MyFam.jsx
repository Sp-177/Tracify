import React from 'react';
import FamCard from '../Components/FamCard';
import { useAuth } from '../context/AuthContext';


function MyFam() {
  const { userFamily } = useAuth();
  console.log("userfamily is",userFamily);

  return (
    <div className="flex flex-col h-screen p-4 bg-gray-100">
      <div className="text-center text-2xl font-semibold mb-4">
        MY FAMILY
      </div>
      <div className="flex flex-1 rounded-2xl shadow-lg overflow-hidden">
        <div className="w-1/4 p-4 flex flex-col space-y-4 overflow-y-auto">
          {userFamily.length > 0 ? (
            userFamily.map((member) => <FamCard key={member._id} member={member}  />)
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
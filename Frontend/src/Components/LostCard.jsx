import React from 'react';

function LostCard({ member }) {
  return (
    <div className="flex items-center justify-around bg-white shadow-lg rounded-2xl p-2 max-w-md">
      {/* Profile Image */}
      <div className="w-24 h-full rounded-xl overflow-hidden">
        <img
          src={member.imgUrl}  // Fixed: Removed quotes
          alt={member.name}
          className="w-full h-full object-cover"
        />
      </div>

      {/* User Info */}
      <div className="ml-3 flex-1">
        <h2 className="text-xl font-semibold text-center">{member.name}</h2>
        <p className="text-gray-500 text-sm text-center">Age: {member.age}</p>

        {/* Description Section */}
        <div className="flex justify-between text-black bg-gray-100 p-3 rounded-lg mt-1 text-center">
          {member.desciption}  {/* Fixed: Correct property name */}
        </div>

        {/* Buttons */}
        <div className="flex justify-center mt-4">
          <button className="bg-[#B4FF4A] hover:bg-[#AFFF30] text-black px-2 py-1 rounded-lg">
            Find Me
          </button>
        </div>
      </div>
    </div>
  );
}

export default LostCard;

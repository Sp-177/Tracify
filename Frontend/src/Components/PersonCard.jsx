import React from "react";

const PersonCard = () => {
  return (
    <div className="max-w-xs bg-white rounded-2xl shadow-lg p-6 text-center">
      <div className="flex justify-center">
        <div className="w-20 h-20 bg-green-200 rounded-full flex items-center justify-center">
          <img
            src="https://avatars.dicebear.com/api/adventurer/brucelee.svg"
            alt="Avatar"
            className="w-16 h-16 rounded-full"
          />
        </div>
      </div>
      <h2 className="mt-4 text-xl font-bold text-gray-900">Bruce Lee</h2>
      <p className="text-gray-600">UI Designer</p>
      <button className="mt-4 px-6 py-2 border border-blue-500 text-blue-500 rounded-lg hover:bg-blue-500 hover:text-white transition">
        Follow
      </button>
    </div>
  );
};

export default PersonCard;

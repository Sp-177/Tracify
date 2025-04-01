import { FaHeart, FaComment } from "react-icons/fa";

export default function FamCard({member}) {
  return (
    <div className="border rounded-lg shadow-md p-4 flex items-center max-w-sm">
      {/* Profile Image */}
      <div className="w-16 h-16 rounded-full overflow-hidden bg-yellow-400 flex-shrink-0">
        <img
          src="https://randomuser.me/api/portraits/men/1.jpg"
          alt="Mark Anthony"
          className="w-full h-full object-cover"
        />
      </div>
      
      {/* Info Section */}
      <div className="ml-4 flex-1">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold">{member.name}</h2>
          <span className="text-gray-600 font-medium"></span>
        </div>
        <p className="text-gray-500 text-sm">{member.age}</p>
        <div className="text-gray-400 text-xs">////////</div>
        
      </div>
      
      {/* Action Buttons */}
      <div className="flex flex-col space-y-2 ml-4">
        <button className="text-red-500">
          <FaHeart size={20} />
        </button>
        <button className="text-green-500">
          <FaComment size={20} />
        </button>
      </div>
    </div>
  );
}

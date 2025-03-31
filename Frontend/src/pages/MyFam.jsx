import React from 'react'
import { useAuth } from '../context/AuthContext'
import axios from "axios"



function MyFam() {
  
  return (
         <div className='flex flex-col items-center p-4 relative'>
      <button 
        className="flex items-center px-4 py-2 bg-gray-100 rounded-lg shadow-sm text-black text-lg font-medium" 
        onClick={handleChange}
      >
        Add a Family Member <span className="ml-2 text-2xl">+</span>
      </button>
      </div>
  )
}

export default MyFam
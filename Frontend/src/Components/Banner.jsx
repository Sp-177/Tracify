import React from 'react';

const Banner = () => {
  return (
    <div className="bg-white py-12 px-2 sm:px-6 lg:px-2 max-h-[60vh] overflow-hidden flex justify-center">
      <div className="max-w-7xl w-full flex flex-col lg:flex-row items-center justify-center gap-4">
        
       
        <div className="flex flex-col items-center lg:items-start text-center lg:text-left justify-center max-w-[50%]">
          <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl lg:text-5xl">
            Tracify: Find Lost Loved Ones
          </h2>
          <p className="mt-3 text-base text-gray-600">
            Help reunite families by uploading photos of suspected lost persons. 
            Our system matches images against a database to find potential matches and bring them home.
          </p>
          <div className="mt-4">
            <button className="bg-[#CCFF33] text-black px-5 py-2 rounded-md text-sm font-medium hover:bg-[#B3E02D]">
              Find a Person
            </button>
          </div>
        </div>

      
        <div className=" w-[450px] flex justify-center shrink-0">
          <img src="/banner.png" alt="Tracify" className=" object-contain bg-white" />
        </div>

      </div>
    </div>
  );
}

export default Banner;
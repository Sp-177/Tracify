import React from 'react'

function FamCard({members}) {
    return (
        <>
            <div className="flex items-center bg-white shadow-md rounded-2xl p-4 max-w-xl border border-gray-200">
                <div className="w-16 h-16 bg-gray-300 rounded-lg mr-4">
                    
                </div>
                <div className="flex-1">
                    <h2 className="text-lg font-semibold">{members.name}</h2>
                    <h2 className='text-lg font-semibold'>{members.age}</h2>
                </div>
                <button className="bg-[#CCFF33] hover:bg-[#B3E02D] text-white text-sm px-4 py-2 rounded-lg">Locate</button>
            </div>
        </>
    )
}

export default FamCard
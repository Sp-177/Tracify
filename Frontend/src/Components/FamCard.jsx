import React from 'react'

function FamCard() {
    return (
        <>
            <div className="flex items-center bg-white shadow-md rounded-2xl p-4 max-w-xl border border-gray-200">
                <div className="w-16 h-16 bg-gray-300 rounded-lg mr-4"></div>
                <div className="flex-1">
                    <h2 className="text-lg font-semibold">Headline</h2>
                    <p className="text-gray-600 text-sm">
                        Please add your content here. Keep it short and simple. And smile :)
                    </p>
                </div>
                <button className="bg-gray-800 text-white text-sm px-4 py-2 rounded-lg">Button</button>
            </div>
        </>
    )
}

export default FamCard
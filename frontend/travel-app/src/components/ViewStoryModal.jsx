import React from "react";

const ViewStoryModal = ({ isOpen, onClose, storyInfo }) => {
    if (!isOpen || !storyInfo) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm">
            {/* The Modal Box - Added scrolling in case the story is very long */}
            <div className="w-full max-w-3xl bg-white shadow-2xl rounded-2xl max-h-[90vh] overflow-y-auto overflow-x-hidden relative">
                
                {/* Close Button - Floats in the top right corner */}
                <button 
                    onClick={onClose} 
                    className="absolute z-10 flex items-center justify-center w-10 h-10 text-xl text-gray-600 bg-white rounded-full shadow-md top-4 right-4 hover:text-red-500 hover:bg-red-50"
                >
                    &times;
                </button>

                {/* Big Beautiful Image */}
                <div className="relative w-full h-[300px] bg-gray-200">
                    <img 
                        src={storyInfo.imageUrl} 
                        alt={storyInfo.title} 
                        className="object-cover w-full h-full rounded-t-2xl" 
                    />
                </div>

                {/* Content Section */}
                <div className="p-8">
                    <h2 className="mb-2 text-3xl font-bold text-gray-800">{storyInfo.title}</h2>
                    
                    <div className="flex items-center mb-6 space-x-6 text-sm font-medium text-gray-500">
                        <span className="flex items-center text-blue-600">
                            📍 {storyInfo.visitedLocation.join(", ")}
                        </span>
                        <span className="flex items-center text-gray-500">
                            📅 {new Date(storyInfo.visitedDate).toLocaleDateString()}
                        </span>
                    </div>

                    {/* The Full Story - whitespace-pre-line ensures paragraph breaks work! */}
                    <p className="text-lg leading-relaxed text-gray-700 whitespace-pre-line">
                        {storyInfo.story}
                    </p>
                </div>

            </div>
        </div>
    );
};

export default ViewStoryModal;
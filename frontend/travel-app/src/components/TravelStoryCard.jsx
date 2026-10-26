import React from "react";

const TravelStoryCard = ({
    title,
    story,
    date,
    visitedLocation,
    imageUrl,
    isFavourite,
    onFavouriteClick,
    onEdit,
    onDelete,
    onView // 👈 The prop that opens the modal
}) => {
    
    // 🚫 SUPER GHOST BUSTER: Catch empty, "undefined", or completely missing data
    if (!title || String(title).trim() === "" || title === "undefined" || !date) {
        return null;
    }

    return (
        <div className="overflow-hidden transition-all bg-white border border-gray-200 shadow-sm rounded-xl hover:shadow-lg">
            
            {/* 1. CLICKABLE IMAGE */}
            <div className="relative h-48 bg-gray-200 cursor-pointer" onClick={onView}> 
                {imageUrl && imageUrl !== "undefined" ? (
                    <img 
                        src={imageUrl} 
                        alt={title} 
                        className="object-cover w-full h-full"
                    />
                ) : (
                    <div className="flex items-center justify-center w-full h-full text-gray-400 bg-gray-100">
                        No Image Available
                    </div>
                )}
                
                {/* Heart Button */}
                <button 
                    onClick={(e) => { 
                        e.stopPropagation(); // Stops the modal from opening when favoriting
                        onFavouriteClick(); 
                    }}
                    className="absolute flex items-center justify-center w-8 h-8 transition-colors bg-white rounded-full shadow-md top-3 right-3 hover:bg-gray-100"
                >
                    {isFavourite ? "❤️" : "🤍"}
                </button>
            </div>

            <div className="p-5">
                {/* 2. CLICKABLE TITLE */}
                <div className="flex items-start justify-between cursor-pointer" onClick={onView}>
                    <div>
                        <h3 className="text-xl font-bold text-gray-800 transition-colors hover:text-blue-600 line-clamp-1">
                            {title}
                        </h3>
                        <p className="text-sm font-medium text-blue-600 line-clamp-1">
                            📍 {visitedLocation?.length > 0 ? visitedLocation.join(", ") : "Unknown Location"}
                        </p>
                    </div>
                </div>

                <p className="mt-2 text-xs font-medium text-gray-500 md:text-sm">
                    📅 {date ? new Date(date).toLocaleDateString() : "No Date"}
                </p>
                
                {/* 3. CLICKABLE STORY TEXT */}
                <p 
                    className="mt-3 text-sm text-gray-600 cursor-pointer line-clamp-3 hover:text-gray-800" 
                    onClick={onView}
                >
                    {story}
                </p>

                {/* 4. READ MORE BUTTON */}
                <button 
                    onClick={onView}
                    className="inline-block mt-2 text-sm font-bold text-blue-600 hover:underline"
                >
                    Read More...
                </button>

                {/* EDIT & DELETE BUTTONS */}
                <div className="flex items-center justify-end pt-4 mt-5 space-x-2 border-t border-gray-100">
                    <button 
                        onClick={(e) => {
                            e.stopPropagation(); // 👈 Stops the click from bubbling up
                            onEdit();
                        }} 
                        className="px-4 py-2 text-sm font-medium text-blue-600 transition-colors rounded-lg bg-blue-50 hover:bg-blue-100"
                    >
                        ✏️ Edit
                    </button>
                    <button 
                        onClick={(e) => {
                            e.stopPropagation(); // 👈 Stops the click from bubbling up
                            onDelete();
                        }} 
                        className="px-4 py-2 text-sm font-medium text-red-600 transition-colors rounded-lg bg-red-50 hover:bg-red-100"
                    >
                        🗑️ Delete
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TravelStoryCard;
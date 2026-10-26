import React, { useState } from "react";

const DeleteStoryModal = ({ isOpen, onClose, onSuccess, storyInfo }) => {
    const [error, setError] = useState("");

    if (!isOpen || !storyInfo) return null;

    const handleDeleteClick = async () => {
        try {
            const token = localStorage.getItem("token");
            if (!token) return;

            const response = await fetch(`http://localhost:8000/delete-story/${storyInfo._id}`, {
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${token}`
                },
            });

            const data = await response.json();
            
            if (data.error) {
                setError(data.message);
                return;
            }

            // SUCCESS! Tell Home.jsx to refresh the grid
            onSuccess();

        } catch (err) {
            setError("Something went wrong. Could not connect to the server.");
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
            <div className="w-full max-w-md p-6 mx-4 bg-white shadow-2xl rounded-2xl">
                
                <div className="flex flex-col items-center justify-center text-center">
                    {/* Warning Icon */}
                    <div className="flex items-center justify-center w-16 h-16 mb-4 bg-red-100 rounded-full">
                        <span className="text-3xl">🗑️</span>
                    </div>

                    <h2 className="mb-2 text-2xl font-bold text-gray-800">Delete Story?</h2>
                    
                    <p className="mb-6 text-gray-500">
                        Are you sure you want to delete <span className="font-bold text-gray-700">"{storyInfo.title}"</span>? This action cannot be undone.
                    </p>

                    {error && (
                        <p className="w-full p-2 mb-4 text-sm text-red-700 bg-red-100 rounded-lg">
                            {error}
                        </p>
                    )}

                    <div className="flex w-full space-x-3">
                        <button 
                            onClick={onClose}
                            className="w-1/2 px-4 py-3 font-semibold text-gray-700 transition-colors bg-gray-100 rounded-lg hover:bg-gray-200"
                        >
                            Cancel
                        </button>
                        <button 
                            onClick={handleDeleteClick}
                            className="w-1/2 px-4 py-3 font-semibold text-white transition-colors bg-red-600 rounded-lg hover:bg-red-700"
                        >
                            Yes, Delete
                        </button>
                    </div>
                </div>
                
            </div>
        </div>
    );
};

export default DeleteStoryModal;
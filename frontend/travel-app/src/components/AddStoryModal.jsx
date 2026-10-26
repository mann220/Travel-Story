import React, { useState } from "react";

const AddStoryModal = ({ isOpen, onClose, onSuccess }) => {
    const [title, setTitle] = useState("");
    const [story, setStory] = useState("");
    const [location, setLocation] = useState("");
    const [date, setDate] = useState("");
    const [imageFile, setImageFile] = useState(null); 
    const [previewUrl, setPreviewUrl] = useState(""); 
    const [error, setError] = useState("");

    if (!isOpen) return null;

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            setPreviewUrl(URL.createObjectURL(file)); 
        }
    };

    const handleAddClick = async () => {
        if (!title || !story || !date || !location) {
            setError("Title, Story, Location, and Date are required!");
            return;
        }
        if (!imageFile) {
            setError("Please upload an image!");
            return;
        }

        setError("");
        
        try {
            const token = localStorage.getItem("token");
            if (!token) return;

            // STEP 1: UPLOAD THE IMAGE
            const formData = new FormData();
            formData.append("image", imageFile);

            const imageResponse = await fetch("http://localhost:8000/image-upload", {
                method: "POST",
                body: formData,
            });
            const imageData = await imageResponse.json();
            
            if (imageData.error) {
                setError(imageData.message);
                return;
            }

            const uploadedImageUrl = imageData.imageUrl; 

            // STEP 2: SAVE TO MONGODB
            const dateInMilliseconds = new Date(date).getTime().toString(); 
            const locationArray = location.split(",").map(loc => loc.trim());

            const storyResponse = await fetch("http://localhost:8000/add-travel-story", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({
                    title,
                    story,
                    visitedLocation: locationArray, 
                    imageUrl: uploadedImageUrl,
                    visitedDate: dateInMilliseconds 
                }),
            });

            const storyData = await storyResponse.json();
            
            if (storyData.error) {
                setError(storyData.message);
                return;
            }

            // SUCCESS
            if (onSuccess) {
                onSuccess();
            } else {
                onClose();
            }
            window.location.reload();

        } catch (err) {
            setError("Something went wrong. Could not connect to the server.");
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
            <div className="w-full max-w-2xl p-8 mx-4 bg-white shadow-2xl rounded-2xl">
                
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">Add New Story</h2>
                    <button 
                        onClick={onClose}
                        className="text-2xl text-gray-400 transition-colors hover:text-red-500"
                    >
                        &times;
                    </button>
                </div>

                {error && (
                    <p className="p-2 mb-4 text-sm text-red-700 bg-red-100 rounded-lg">
                        {error}
                    </p>
                )}

                <div className="space-y-4">
                    <div>
                        <label className="block mb-1 text-sm font-medium text-gray-700">TITLE</label>
                        <input 
                            type="text" 
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="A Day at the Great Wall" 
                            className="w-full px-4 py-2 text-xl font-bold border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block mb-1 text-sm font-medium text-gray-700">DATE</label>
                            <input 
                                type="date" 
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        
                        <div>
                            <label className="block mb-1 text-sm font-medium text-gray-700">LOCATION</label>
                            <input 
                                type="text" 
                                value={location}
                                onChange={(e) => setLocation(e.target.value)}
                                placeholder="Beijing, China" 
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block mb-1 text-sm font-medium text-gray-700">UPLOAD PHOTO</label>
                        <input 
                            type="file" 
                            accept="image/*" 
                            onChange={handleImageChange}
                            className="w-full px-4 py-2 border rounded-lg cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                        />
                        
                        {previewUrl && (
                            <div className="w-full overflow-hidden border border-gray-200 rounded-lg mt-3 h-[200px]">
                                <img src={previewUrl} alt="Preview" className="object-cover w-full h-full" />
                            </div>
                        )}
                    </div>

                    <div>
                        <label className="block mb-1 text-sm font-medium text-gray-700">STORY</label>
                        <textarea 
                            value={story}
                            onChange={(e) => setStory(e.target.value)}
                            placeholder="Your story goes here..." 
                            rows={3}
                            className="w-full px-4 py-2 border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <button 
                        type="button"
                        onClick={handleAddClick}
                        className="w-full px-4 py-3 mt-4 font-bold text-white transition-colors bg-blue-600 rounded-lg hover:bg-blue-700"
                    >
                        Save Story
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AddStoryModal;
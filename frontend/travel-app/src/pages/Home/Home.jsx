import React, { useState, useEffect } from "react";
import NavBar from "../../components/NavBar";
import TravelStoryCard from "../../components/TravelStoryCard";
import AddStoryModal from "../../components/AddStoryModal";
import EditStoryModal from "../../components/EditStoryModal";
import DeleteStoryModal from "../../components/DeleteStoryModal";
import ViewStoryModal from "../../components/ViewStoryModal";

const Home = () => {
    const [stories, setStories] = useState([]);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false); // For Add Modal
    const [editModalConfig, setEditModalConfig] = useState({ isShown: false, story: null }); // For Edit Modal
    const [deleteModalConfig, setDeleteModalConfig] = useState({ isShown: false, story: null });
    const [viewModalConfig, setViewModalConfig] = useState({ isShown: false, story: null }); 

    const fetchMyStories = async () => {
        const token = localStorage.getItem("token");

        if (!token) {
            window.location.href = "/login";
            return;
        }

        try {
            const response = await fetch("http://localhost:8000/get-all-stories", {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });

            if (response.status === 401 || response.status === 403) {
                localStorage.removeItem("token");
                setError("Your session has expired. Please log in again.");
                return; 
            }

            const data = await response.json();

            if (data.error) {
                setError(data.message);
                return;
            }

            setStories((data.stories || []).filter(story => story.title && story.imageUrl));

        } catch (err) {
            setError("Could not connect to the backend server.");
        }
    };

    const updateIsFavourite = async (story) => {
        try {
            const token = localStorage.getItem("token");
            if (!token) return;

            const response = await fetch(`http://localhost:8000/update-is-favourite/${story._id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({
                    isFavourite: !story.isFavourite 
                }),
            });

            const data = await response.json();
            
            if (data.error) {
                console.error(data.message);
                return;
            }

            fetchMyStories();
            
        } catch (err) {
            console.error("Could not update favourite status.");
        }
    };

    useEffect(() => {
        fetchMyStories();
    }, []);

    return (
        <div className="min-h-screen bg-gray-50">
            <NavBar />
            
            <main className="max-w-6xl px-8 py-10 mx-auto">
                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-3xl font-bold text-gray-800">My Memories</h2>
                    <button 
                        onClick={() => setIsModalOpen(true)}
                        className="px-5 py-2.5 text-white bg-blue-600 rounded-lg hover:bg-blue-700 shadow-md font-medium transition-all"
                    >
                        + Add Story
                    </button>
                </div>

                {error && (
                    <div className="p-4 mb-6 font-medium text-red-700 bg-red-100 border border-red-200 rounded-lg">
                        {error}
                    </div>
                )}

                {!stories || stories.length === 0 && !error ? (
                    <div className="flex flex-col items-center justify-center py-20 text-center bg-white border border-gray-100 shadow-sm rounded-xl">
                        <p className="text-xl text-gray-500">You haven't added any travel stories yet!</p>
                        <p className="mt-2 text-gray-400">Click the "+ Add Story" button to start logging your adventures.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {stories?.map((story) => (
                            <TravelStoryCard 
                                key={story._id}
                                title={story.title}
                                story={story.story}
                                date={story.visitedDate}
                                visitedLocation={story.visitedLocation}
                                imageUrl={story.imageUrl}
                                isFavourite={story.isFavourite}
                                onEdit={() => setEditModalConfig({ isShown: true, story: story })}
                                onDelete={() => setDeleteModalConfig({ isShown: true, story: story })}
                                onView={() => setViewModalConfig({ isShown: true, story: story })}
                                onFavouriteClick={() => updateIsFavourite(story)}
                            />
                        ))}
                    </div>
                )}

                {/* SIMPLE ADD STORY MODAL */}
                <AddStoryModal 
                    isOpen={isModalOpen} 
                    onClose={() => setIsModalOpen(false)} 
                    onSuccess={() => {
                        setIsModalOpen(false);
                        fetchMyStories();      
                    }}
                />
                <EditStoryModal
                    isOpen={editModalConfig.isShown}
                    storyInfo={editModalConfig.story}
                    onClose={() => setEditModalConfig({ isShown: false, story: null })}
                    onSuccess={() => {
                        setEditModalConfig({ isShown: false, story: null });
                        fetchMyStories();
                    }}
                />
                <DeleteStoryModal
                    isOpen={deleteModalConfig.isShown}
                    storyInfo={deleteModalConfig.story}
                    onClose={() => setDeleteModalConfig({ isShown: false, story: null })}
                    onSuccess={() => {
                        setDeleteModalConfig({ isShown: false, story: null });
                        fetchMyStories(); // Refresh the grid!
                    }}
                />
                <ViewStoryModal
                    isOpen={viewModalConfig.isShown}
                    storyInfo={viewModalConfig.story}
                    onClose={() => setViewModalConfig({ isShown: false, story: null })}
                />
            </main>
        </div>
    );
};

export default Home;
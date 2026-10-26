import React from 'react'

function NavBar() {
    const handleLogout = () => {
        localStorage.removeItem("token");
        window.location.href = "/login";
    };

  return (
    <div>
        <nav className="flex items-center justify-between px-8 py-4 bg-white shadow-sm">
            <h1 className="text-2xl font-bold text-gray-800">Travel<span className="text-blue-600">Memories</span></h1>
            
            <button 
                onClick={handleLogout}
                className="px-4 py-1.5 text-sm font-medium text-red-600 transition-colors bg-red-50 rounded-lg hover:bg-red-100"
            >
            Logout
            </button>
        </nav>
    </div>
  )
}

export default NavBar
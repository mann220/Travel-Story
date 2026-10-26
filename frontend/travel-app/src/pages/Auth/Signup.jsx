import React, { useState } from "react";

const Signup = () => {
    // 1. Added a state variable for the user's full name
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);

    const handleSignup = async (e) => {
        e.preventDefault();
        setError(null); 

        try {
            // 2. Connect to your backend's signup route
            const response = await fetch("http://localhost:8000/create-account", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                // 3. Send the full name along with email and password
                body: JSON.stringify({ fullName, email, password }),
            });
            const data = await response.json();

            if (data.error) {
                setError(data.message);
                return;
            }

            // SUCCESS! Save the JWT token to the browser's storage
            localStorage.setItem("token", data.token);
            
            // Redirect the user to the dashboard
            window.location.href = "/login";

        } catch (err) {
            setError("Could not connect to the server. Is your backend running?");
        }
    };

    return (
        <div 
          className="flex items-center justify-center min-h-screen bg-cover bg-center"
        >
          {/* Transparent black overlay */}
          <div className="absolute inset-0 bg-black bg-opacity-40"></div>

          <div className="relative z-10 w-full max-w-md p-8 space-y-6 bg-white rounded-xl shadow-2xl">
            
            <h2 className="text-3xl font-bold text-center text-gray-800">
              Join Us
            </h2>
            <p className="text-center text-gray-500">
              Create an account to start your travel journal
            </p>
    
            {error && (
              <div className="p-3 text-sm text-red-700 bg-red-100 rounded-lg">
                {error}
              </div>
            )}
    
            <form onSubmit={handleSignup} className="space-y-5">
              {/* NEW: Full Name Field */}
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">
                  Full Name
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter your full Name"
                />
              </div>

              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter your email"
                />
              </div>
    
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter your password"
                />
              </div>
    
              <button
                type="submit"
                className="w-full px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300 transition-colors"
              >
                Create Account
              </button>
            </form>
    
            <p className="text-sm text-center text-gray-600">
              Already have an account?{' '}
              <a href="/login" className="text-blue-600 hover:underline">
                Log in here
              </a>
            </p>
    
          </div>
        </div>
    );
}

export default Signup;
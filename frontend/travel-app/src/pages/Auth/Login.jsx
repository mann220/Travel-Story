import React, { useState } from "react";
import bglogin from "../../assets/pages/travel-login.jpg"; 

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);

    const handleLogin = async (e) => {
      e.preventDefault();
      setError(null); 
      try {
          const response = await fetch("http://localhost:8000/login", {
              method: "POST",
              headers: {
                  "Content-Type": "application/json",
              },
              body: JSON.stringify({ email, password }),
          });
          const data = await response.json();
          if (data.error) {
              setError(data.message);
              return;
          }
          localStorage.setItem("token", data.accessToken); 
          window.location.href = "/dashboard"; 
          
      } catch (err) {
          setError("Could not connect to the server.");
      }
  };

    return (
        <div 
          className="flex items-center justify-center min-h-screen bg-cover bg-center"
          // We inject your bglogin variable right here using backticks!
          style={{ backgroundImage: `url(${bglogin})` }} 
        >
          {/* Transparent black overlay */}
          <div className="absolute inset-0 bg-black bg-opacity-40"></div>

          <div className="relative z-10 w-full max-w-md p-8 space-y-6 bg-white rounded-xl shadow-2xl">
            
            <h2 className="text-3xl font-bold text-center text-gray-800">
              Welcome Back
            </h2>
            <p className="text-center text-gray-500">
              Log in to view your travel stories
            </p>
    
            {error && (
              <div className="p-3 text-sm text-red-700 bg-red-100 rounded-lg">
                {error}
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-5">
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
                Log In
              </button>
            </form>
    
            <p className="text-sm text-center text-gray-600">
              Don't have an account?{' '}
              <a href="/signup" className="text-blue-600 hover:underline">
                Sign up here
              </a>
            </p>
    
          </div>
        </div>
    );
}

export default Login;
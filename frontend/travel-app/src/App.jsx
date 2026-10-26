import React from 'react'
import { BrowserRouter, Routes, Route, Router } from "react-router-dom";
import Home from "./pages/Home/Home";
import Login from "./pages/Auth/Login";
import Signup from "./pages/Auth/Signup";

const App = () => {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" exact element={<Home/>} />
          <Route path="/login" exact element={<Login/>} />
          <Route path="/signup" exact element={<Signup/>} />
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App;

import React from "react";
import Navbar from "./components/Navbar";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/home";

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-indigo-50/70 to-blue-50">
        <Navbar />
        <Home />
      </div>
    </Router>
  );
}

export default App;

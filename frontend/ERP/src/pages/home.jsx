import React from "react";
import Navbar from "../components/Navbar";
import Card from "../components/card";
const Home = () => {
    return (
        <div className="pt-40 px-6 md:px-12 lg:px-24 min-h-[200vh]">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-center text-gray-900 tracking-tight mb-8">
                Managing System
            </h1>
            <p className="text-xl text-gray-700 text-center max-w-3xl mx-auto mb-20">
                Scroll down slowly — the navbar should shrink, become more transparent, and show a clear frosted glass (blur) effect over the subtle gradient.
            </p>

            <Card />
        </div>
    );
};

export default Home;
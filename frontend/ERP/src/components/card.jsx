import React from "react";

const Card = () => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto p-4">
            <div className="bg-white/70 backdrop-blur-md border border-indigo-100/50 rounded-2xl p-8 shadow-lg transition-hover hover:shadow-xl">
                <h3 className="text-2xl font-semibold mb-4 text-indigo-700">Feature One</h3>
                <p className="text-gray-700">Core manufacturing module with real-time tracking.</p>
            </div>
        </div>
    );
};

export default Card;
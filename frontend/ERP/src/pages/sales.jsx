import React from "react";
import { createIcons, dollarSign } from 'lucide';

const Sales = () => {
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-slate-900">Sales Management</h1>
                <button className="bg-indigo-600 text-white px-4 py-2 rounded-xl font-semibold hover:bg-indigo-700 flex items-center gap-2"><Plus className="h-5 w-5" /> Add Machine</button>
            </div>
            <div className="bg-white p-12 rounded-2xl border border-slate-100 shadow-sm text-center">
                <dollarSign className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                <p className="text-slate-500">Empowering growth with solutions that sell themselves.</p>
            </div>
        </div>
    );
};

export default Sales;
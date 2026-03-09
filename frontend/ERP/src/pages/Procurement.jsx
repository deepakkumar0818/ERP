import React from 'react';
import { ShoppingBag, Plus } from 'lucide-react';
export default function Procurement() {
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-slate-900">Procurement</h1>
                <button className="bg-indigo-600 text-white px-4 py-2 rounded-xl font-semibold hover:bg-indigo-700 flex items-center gap-2"><Plus className="h-5 w-5" /> Request Quote</button>
            </div>
            <div className="bg-white p-12 rounded-2xl border border-slate-100 shadow-sm text-center">
                <ShoppingBag className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                <p className="text-slate-500">Manage purchase requests and supplier communications.</p>
            </div>
        </div>
    );
}

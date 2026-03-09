import React from 'react';
import { ShoppingCart, Plus, Search, FileText } from 'lucide-react';

export default function SalesOrders() {
    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Sales Orders</h1>
                    <p className="text-slate-500">Manage customer orders and contracts.</p>
                </div>
                <button className="bg-indigo-600 text-white px-4 py-2 rounded-xl font-semibold hover:bg-indigo-700 transition-all shadow-sm flex items-center gap-2">
                    <Plus className="h-5 w-5" />
                    Create Order
                </button>
            </div>

            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-12 text-center">
                <ShoppingCart className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-slate-700">No Sales Orders Found</h3>
                <p className="text-slate-500 max-w-sm mx-auto mt-2">Start by creating your first sales order to begin production planning.</p>
                <button className="mt-6 text-indigo-600 font-semibold hover:underline">Import from Excel</button>
            </div>
        </div>
    );
}

import React from 'react';
import { Layers, Plus, Search } from 'lucide-react';

export default function BOM() {
    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Bill of Materials (BOM)</h1>
                    <p className="text-slate-500 dark:text-slate-400">Define product structures and material requirements.</p>
                </div>
                <button className="bg-indigo-600 text-white px-4 py-2 rounded-xl font-semibold hover:bg-indigo-700 transition-all shadow-sm flex items-center gap-2">
                    <Plus className="h-5 w-5" />
                    Create BOM
                </button>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden">
                <div className="p-4 border-b border-slate-50 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50 flex items-center justify-between">
                    <h3 className="font-semibold text-slate-900 dark:text-white">Product List</h3>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <input type="text" placeholder="Search products..." className="pl-10 pr-4 py-1.5 border border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white rounded-lg text-sm focus:ring-2 focus:ring-indigo-500" />
                    </div>
                </div>
                <div className="p-20 text-center">
                    <Layers className="h-12 w-12 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
                    <p className="text-slate-500 dark:text-slate-400">Select a product to view or edit its BOM structure.</p>
                </div>
            </div>
        </div>
    );
}

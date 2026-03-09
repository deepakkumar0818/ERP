import React from 'react';
import {
    Package,
    ArrowDownCircle,
    ArrowUpCircle,
    AlertTriangle,
    Search,
    Plus
} from 'lucide-react';

export default function Inventory() {
    const items = [
        { name: 'Steel Plate 10mm', category: 'Raw Material', stock: 4500, unit: 'kg', status: 'In Stock', min: 1000 },
        { name: 'Aluminum Casting', category: 'Raw Material', stock: 120, unit: 'units', status: 'Low Stock', min: 200 },
        { name: 'Control Board V4', category: 'Components', stock: 850, unit: 'units', status: 'In Stock', min: 100 },
        { name: 'Hydraulic Oil', category: 'Consumables', stock: 45, unit: 'Liters', status: 'Out of Stock', min: 20 },
    ];

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Inventory Management</h1>
                    <p className="text-slate-500 dark:text-slate-400">Monitor stock levels and warehouse operations.</p>
                </div>
                <div className="flex gap-3">
                    <button className="flex items-center gap-2 px-4 py-2 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-xl font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-slate-700 dark:text-slate-300">
                        <ArrowDownCircle className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                        Stock In
                    </button>
                    <button className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-xl font-semibold hover:bg-indigo-700 transition-all shadow-sm">
                        <Plus className="h-5 w-5" />
                        Add Item
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm">
                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Total SKU Items</p>
                    <p className="text-3xl font-bold text-slate-900 dark:text-white mt-1">1,280</p>
                </div>
                <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm border-l-4 border-l-amber-500">
                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Low Stock Alerts</p>
                    <p className="text-3xl font-bold text-amber-600 mt-1">12</p>
                </div>
                <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm border-l-4 border-l-rose-500">
                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Out of Stock</p>
                    <p className="text-3xl font-bold text-rose-600 mt-1">3</p>
                </div>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden">
                <div className="p-4 border-b border-slate-50 dark:border-slate-800 flex flex-col md:flex-row gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search by SKU, name or category..."
                            className="pl-10 pr-4 py-2 w-full border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white rounded-lg focus:ring-2 focus:ring-indigo-500 transition-all"
                        />
                    </div>
                    <div className="flex gap-2">
                        <select className="px-3 py-2 border-slate-200 dark:border-slate-700 rounded-lg text-sm bg-slate-50 dark:bg-slate-800 dark:text-slate-300">
                            <option>All Categories</option>
                            <option>Raw Materials</option>
                            <option>Components</option>
                            <option>Finished Goods</option>
                        </select>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50/50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 text-xs font-semibold uppercase tracking-wider">
                            <tr>
                                <th className="px-6 py-4">Item Name</th>
                                <th className="px-6 py-4">Category</th>
                                <th className="px-6 py-4">Current Stock</th>
                                <th className="px-6 py-4">Min level</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                            {items.map((item, i) => (
                                <tr key={i} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="font-semibold text-slate-900 dark:text-white">{item.name}</div>
                                        <div className="text-[10px] text-slate-400 font-mono italic">SKU-8923-01</div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">{item.category}</td>
                                    <td className="px-6 py-4">
                                        <span className="font-bold text-slate-900 dark:text-white">{item.stock}</span>
                                        <span className="text-xs text-slate-400 ml-1">{item.unit}</span>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-slate-500 dark:text-slate-400">{item.min} {item.unit}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${item.status === 'In Stock' ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-100 dark:border-emerald-500/20' :
                                            item.status === 'Low Stock' ? 'bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-100 dark:border-amber-500/20' :
                                                'bg-rose-50 dark:bg-rose-500/10 text-rose-700 dark:text-rose-400 border-rose-100 dark:border-rose-500/20'
                                            }`}>
                                            {item.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 font-medium text-sm">Update</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

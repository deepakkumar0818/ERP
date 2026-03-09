import React from 'react';
import {
    Plus,
    Search,
    Filter,
    MoreVertical,
    ChevronRight,
    Clock,
    CheckCircle2,
    AlertCircle
} from 'lucide-react';

const StatusBadge = ({ status }) => {
    const styles = {
        'In Progress': 'bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-100 dark:border-blue-500/20',
        'Completed': 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-100 dark:border-emerald-500/20',
        'Pending': 'bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-100 dark:border-amber-500/20',
        'On Hold': 'bg-rose-50 dark:bg-rose-500/10 text-rose-700 dark:text-rose-400 border-rose-100 dark:border-rose-500/20',
    };
    return (
        <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${styles[status]}`}>
            {status}
        </span>
    );
};

export default function ProductionOrders() {
    const orders = [
        { id: 'PO-2026-001', product: 'Gear Assembly A-301', qty: 1250, status: 'In Progress', due: '2026-03-15', progress: 65 },
        { id: 'PO-2026-002', product: 'Hydraulic Pump HP-5', qty: 450, status: 'Completed', due: '2026-03-10', progress: 100 },
        { id: 'PO-2026-003', product: 'Chassis Frame V2', qty: 85, status: 'Pending', due: '2026-03-20', progress: 0 },
        { id: 'PO-2026-004', product: 'Main Control Unit', qty: 1200, status: 'On Hold', due: '2026-03-12', progress: 30 },
    ];

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Production Orders</h1>
                    <p className="text-slate-500 dark:text-slate-400">Manage and track shop floor operations.</p>
                </div>
                <button className="flex items-center justify-center gap-2 bg-indigo-600 text-white px-4 py-2.5 rounded-xl font-semibold hover:bg-indigo-700 transition-all shadow-sm">
                    <Plus className="h-5 w-5" />
                    New Work Order
                </button>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden">
                <div className="p-4 border-b border-slate-50 dark:border-slate-800 flex flex-col md:flex-row gap-4 justify-between bg-slate-50/50 dark:bg-slate-800/50">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search orders, products..."
                            className="pl-10 pr-4 py-2 w-full border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                        />
                    </div>
                    <div className="flex gap-2">
                        <button className="flex items-center gap-2 px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-medium hover:bg-white dark:hover:bg-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 transition-colors">
                            <Filter className="h-4 w-4" />
                            Filters
                        </button>
                        <button className="px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-medium hover:bg-white dark:hover:bg-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 transition-colors">
                            Export
                        </button>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50/50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 text-xs font-semibold uppercase tracking-wider">
                            <tr>
                                <th className="px-6 py-4">Order ID</th>
                                <th className="px-6 py-4">Product / Material</th>
                                <th className="px-6 py-4">Quantity</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4">Completion</th>
                                <th className="px-6 py-4">Due Date</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                            {orders.map((order) => (
                                <tr key={order.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors group">
                                    <td className="px-6 py-4 font-medium text-indigo-600 dark:text-indigo-400">{order.id}</td>
                                    <td className="px-6 py-4">
                                        <div className="text-sm font-semibold text-slate-900 dark:text-white">{order.product}</div>
                                        <div className="text-xs text-slate-500 dark:text-slate-400">Assembly Line B</div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">{order.qty.toLocaleString()}</td>
                                    <td className="px-6 py-4">
                                        <StatusBadge status={order.status} />
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-1.5 max-w-[100px]">
                                            <div
                                                className={`h-1.5 rounded-full ${order.status === 'Completed' ? 'bg-emerald-500' :
                                                    order.status === 'On Hold' ? 'bg-rose-500' : 'bg-indigo-500'
                                                    }`}
                                                style={{ width: `${order.progress}%` }}
                                            ></div>
                                        </div>
                                        <span className="text-[10px] text-slate-400 dark:text-slate-500 mt-1 block">{order.progress}% done</span>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">{order.due}</td>
                                    <td className="px-6 py-4 text-right">
                                        <button className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded transition-colors text-slate-400 dark:text-slate-500">
                                            <MoreVertical className="h-5 w-5" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="p-4 border-t border-slate-50 dark:border-slate-800 flex items-center justify-between text-sm text-slate-500 dark:text-slate-400">
                    <span>Showing 4 of 248 orders</span>
                    <div className="flex gap-1">
                        <button className="px-3 py-1 border border-slate-200 dark:border-slate-700 rounded hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-50 text-slate-600 dark:text-slate-400" disabled>Previous</button>
                        <button className="px-3 py-1 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-500/20 rounded">1</button>
                        <button className="px-3 py-1 border border-slate-200 dark:border-slate-700 rounded hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400">2</button>
                        <button className="px-3 py-1 border border-slate-200 dark:border-slate-700 rounded hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400">Next</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

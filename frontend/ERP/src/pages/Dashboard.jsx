import React from 'react';
import {
    Users,
    Package,
    TrendingUp,
    AlertTriangle,
    ArrowUpRight,
    ArrowDownRight,
    Clock,
    CheckCircle2
} from 'lucide-react';

const StatCard = ({ title, value, change, trend, icon: Icon, color }) => (
    <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 transition-all hover:shadow-md">
        <div className="flex justify-between items-start">
            <div>
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{title}</p>
                <h3 className="text-2xl font-bold mt-2 text-slate-900 dark:text-white">{value}</h3>
                <div className="flex items-center mt-2">
                    {trend === 'up' ? (
                        <ArrowUpRight className="h-4 w-4 text-emerald-500 mr-1" />
                    ) : (
                        <ArrowDownRight className="h-4 w-4 text-rose-500 mr-1" />
                    )}
                    <span className={`text-xs font-semibold ${trend === 'up' ? 'text-emerald-500' : 'text-rose-500'}`}>
                        {change}
                    </span>
                    <span className="text-xs text-slate-400 dark:text-slate-500 ml-1.5">vs last month</span>
                </div>
            </div>
            <div className={`p-3 rounded-xl ${color} bg-opacity-10 dark:bg-opacity-20`}>
                <Icon className={`h-6 w-6 ${color.replace('bg-', 'text-')}`} />
            </div>
        </div>
    </div>
);

export default function Dashboard() {
    const stats = [
        { title: 'Total Sales', value: '₹42.5L', change: '+12.5%', trend: 'up', icon: TrendingUp, color: 'bg-indigo-600' },
        { title: 'Active Production', value: '18', change: '+2', trend: 'up', icon: Package, color: 'bg-blue-600' },
        { title: 'Inventory Value', value: '₹1.2Cr', change: '-3.2%', trend: 'down', icon: Users, color: 'bg-amber-600' },
        { title: 'Quality Alerts', value: '4', change: '-12%', trend: 'down', icon: AlertTriangle, color: 'bg-rose-600' },
    ];

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Manufacturing Overview</h1>
                    <p className="text-slate-500 dark:text-slate-400">Welcome back, here's what's happening today.</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="flex -space-x-2">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="h-8 w-8 rounded-full border-2 border-white dark:border-slate-800 bg-slate-200 dark:bg-slate-700" />
                        ))}
                    </div>
                    <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-indigo-700 transition-colors shadow-sm">
                        Generate Report
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, idx) => (
                    <StatCard key={idx} {...stat} />
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="font-bold text-slate-900 dark:text-white">Production Efficiency</h3>
                        <select className="text-sm border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-gray-200 rounded-lg focus:ring-indigo-500 focus:border-indigo-500">
                            <option>Last 7 days</option>
                            <option>Last 30 days</option>
                        </select>
                    </div>
                    <div className="h-64 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-dashed border-slate-200 dark:border-slate-700 flex flex-col items-center justify-center text-slate-400 dark:text-slate-500">
                        <TrendingUp className="h-8 w-8 mb-2 opacity-20" />
                        <p className="text-sm">Production Analytics Visualization</p>
                    </div>
                </div>

                <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800">
                    <h3 className="font-bold text-slate-900 dark:text-white mb-6">Recent Activity</h3>
                    <div className="space-y-6">
                        {[
                            { time: '2h ago', event: 'PO-402 Completed', status: 'success', icon: CheckCircle2 },
                            { time: '4h ago', event: 'Raw Material Alert: Steel', status: 'warning', icon: AlertTriangle },
                            { time: '5h ago', event: 'New Sales Order #892', status: 'info', icon: Clock },
                            { time: '1d ago', event: 'Maintenance: Machine A-1', status: 'success', icon: CheckCircle2 },
                        ].map((item, i) => (
                            <div key={i} className="flex gap-4">
                                <div className={`mt-1 h-2 w-2 rounded-full shrink-0 ${item.status === 'success' ? 'bg-emerald-500' :
                                    item.status === 'warning' ? 'bg-amber-500' : 'bg-blue-500'
                                    }`} />
                                <div>
                                    <p className="text-sm font-medium text-slate-800 dark:text-slate-200">{item.event}</p>
                                    <p className="text-xs text-slate-500 dark:text-slate-500">{item.time}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                    <button className="w-full mt-8 py-2 text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors">
                        View All Activity
                    </button>
                </div>
                {/* Sales Leads Section */}
                <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800">
                    <h3 className="font-bold text-slate-900 dark:text-white mb-4">Sales Leads</h3>
                    <table className="w-full text-sm text-left text-slate-600 dark:text-slate-300">
                        <thead className="bg-slate-100 dark:bg-slate-800">
                            <tr>
                                <th className="px-4 py-2">Lead ID</th>
                                <th className="px-4 py-2">Customer</th>
                                <th className="px-4 py-2">Value</th>
                                <th className="px-4 py-2">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr className="border-b border-slate-200 dark:border-slate-700">
                                <td className="px-4 py-2">L-001</td>
                                <td className="px-4 py-2">Acme Corp</td>
                                <td className="px-4 py-2">₹5,00,000</td>
                                <td className="px-4 py-2 text-emerald-600">Qualified</td>
                            </tr>
                            <tr className="border-b border-slate-200 dark:border-slate-700">
                                <td className="px-4 py-2">L-002</td>
                                <td className="px-4 py-2">Beta Ltd</td>
                                <td className="px-4 py-2">₹3,20,000</td>
                                <td className="px-4 py-2 text-amber-600">Pending</td>
                            </tr>
                            <tr>
                                <td className="px-4 py-2">L-003</td>
                                <td className="px-4 py-2">Gamma Inc</td>
                                <td className="px-4 py-2">₹7,80,000</td>
                                <td className="px-4 py-2 text-rose-600">Lost</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                {/* Quotations Section */}
                <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800">
                    <h3 className="font-bold text-slate-900 dark:text-white mb-4">Quotations</h3>
                    <ul className="space-y-3">
                        <li className="flex justify-between items-center">
                            <span className="font-medium">Q-101</span>
                            <span className="text-slate-500">₹2,50,000</span>
                            <span className="text-emerald-600">Approved</span>
                        </li>
                        <li className="flex justify-between items-center">
                            <span className="font-medium">Q-102</span>
                            <span className="text-slate-500">₹1,80,000</span>
                            <span className="text-amber-600">Pending</span>
                        </li>
                        <li className="flex justify-between items-center">
                            <span className="font-medium">Q-103</span>
                            <span className="text-slate-500">₹3,40,000</span>
                            <span className="text-rose-600">Rejected</span>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
}

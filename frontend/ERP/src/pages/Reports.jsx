import React from 'react';
import { BarChart3, Download } from 'lucide-react';
export default function Reports() {
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-slate-900">Reports & Analytics</h1>
                <button className="bg-slate-100 text-slate-700 px-4 py-2 rounded-xl font-semibold hover:bg-slate-200 flex items-center gap-2"><Download className="h-5 w-5" /> Export All</button>
            </div>
            <div className="bg-white p-12 rounded-2xl border border-slate-100 shadow-sm text-center">
                <BarChart3 className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                <p className="text-slate-500">Custom reports and business intelligence dashboards.</p>
            </div>
        </div>
    );
}

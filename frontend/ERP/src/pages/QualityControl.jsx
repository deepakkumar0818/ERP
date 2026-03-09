import React from 'react';
import { ShieldCheck, Plus } from 'lucide-react';

export default function QualityControl() {
    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Quality Control</h1>
                    <p className="text-slate-500">Inspection reports and quality standards management.</p>
                </div>
                <button className="bg-indigo-600 text-white px-4 py-2 rounded-xl font-semibold hover:bg-indigo-700 transition-all shadow-sm flex items-center gap-2">
                    <Plus className="h-5 w-5" />
                    Log Inspection
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                    <h3 className="font-bold text-slate-900 mb-4">Inspection Pass Rate</h3>
                    <div className="flex items-end gap-2">
                        <span className="text-4xl font-extrabold text-emerald-600">99.2%</span>
                        <span className="text-sm text-slate-400 mb-1">Target 98.5%</span>
                    </div>
                    <div className="mt-4 w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                        <div className="bg-emerald-500 h-2 rounded-full" style={{ width: '99.2%' }}></div>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm text-center flex flex-col items-center justify-center">
                    <ShieldCheck className="h-8 w-8 text-indigo-500 mb-2" />
                    <p className="font-medium text-slate-700">All machines passed daily calibration</p>
                </div>
            </div>
        </div>
    );
}

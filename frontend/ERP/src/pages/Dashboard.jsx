import React, { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
    TrendingUp,
    Package,
    AlertTriangle,
    ArrowUpRight,
    ArrowDownRight,
    Clock,
    CheckCircle2,
    ArrowLeft,
    Loader2,
    Users,
    FileText,
} from 'lucide-react';

const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, '') || 'http://localhost:5000';

// ── helpers ────────────────────────────────────────────────
function getInitials(user) {
    const name = user?.name || user?.username || '';
    return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2) || '?';
}

function getGreeting() {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 17) return 'Good afternoon';
    return 'Good evening';
}

function formatCurrency(value) {
    if (value >= 10000000) return `₹${(value / 10000000).toFixed(1)}Cr`;
    if (value >= 100000) return `₹${(value / 100000).toFixed(1)}L`;
    if (value >= 1000) return `₹${(value / 1000).toFixed(0)}K`;
    return `₹${value}`;
}

async function apiFetch(path) {
    const token = localStorage.getItem('erp_token');
    const res = await fetch(`${API_BASE_URL}${path}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    if (!res.ok) throw new Error(`API error: ${res.status}`);
    return res.json();
}

// ── Skeleton ───────────────────────────────────────────────
const Skeleton = ({ className = '' }) => (
    <div className={`animate-pulse bg-slate-200 dark:bg-slate-700 rounded ${className}`} />
);

// ── Stat Card ──────────────────────────────────────────────
const StatCard = ({ title, value, change, trend, icon: Icon, color, loading }) => (
    <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 transition-all hover:shadow-md">
        {loading ? (
            <div className="space-y-3">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-7 w-20" />
                <Skeleton className="h-3 w-32" />
            </div>
        ) : (
            <div className="flex justify-between items-start">
                <div>
                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{title}</p>
                    <h3 className="text-2xl font-bold mt-2 text-slate-900 dark:text-white">{value}</h3>
                    <div className="flex items-center mt-2">
                        {trend === 'up'
                            ? <ArrowUpRight className="h-4 w-4 text-emerald-500 mr-1" />
                            : <ArrowDownRight className="h-4 w-4 text-rose-500 mr-1" />}
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
        )}
    </div>
);

// ── Status badge ───────────────────────────────────────────
const statusStyle = (s = '') => {
    const v = s.toLowerCase();
    if (v === 'qualified' || v === 'approved' || v === 'won') return 'text-emerald-600 dark:text-emerald-400';
    if (v === 'pending' || v === 'new' || v === 'draft') return 'text-amber-600 dark:text-amber-400';
    return 'text-rose-600 dark:text-rose-400';
};

// ══════════════════════════════════════════════════════════
export default function Dashboard() {
    const [user, setUser] = useState(null);
    const [leads, setLeads] = useState([]);
    const [quotations, setQuotations] = useState([]);
    const [efficiencyData] = useState([78, 82, 69, 91, 87, 74, 88]);
    const [loading, setLoading] = useState(true);
    const [apiError, setApiError] = useState(null);

    // ── load user from localStorage ────────────────────────
    useEffect(() => {
        try {
            const stored = localStorage.getItem('erp_user');
            if (stored) setUser(JSON.parse(stored));
        } catch { /* ignore */ }
    }, []);

    // ── fetch leads + first-lead quotations ────────────────
    const fetchData = useCallback(async () => {
        setLoading(true);
        setApiError(null);
        try {
            const leadsData = await apiFetch('/api/sales/leads');
            const fetchedLeads = leadsData.leads || [];
            setLeads(fetchedLeads);

            // fetch quotations for first available lead so we can show them
            if (fetchedLeads.length > 0) {
                try {
                    const qData = await apiFetch(`/api/sales/leads/${fetchedLeads[0]._id}/quotations`);
                    setQuotations(qData.quotations || []);
                } catch { /* quotations optional */ }
            }
        } catch (err) {
            setApiError(err.message);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchData(); }, [fetchData]);

    // ── derived stats ──────────────────────────────────────
    const totalLeads = leads.length;
    const qualifiedLeads = leads.filter(l =>
        ['qualified', 'won', 'approved'].includes((l.status || '').toLowerCase())
    ).length;
    const pendingLeads = leads.filter(l =>
        ['pending', 'new', 'draft'].includes((l.status || '').toLowerCase())
    ).length;
    const lostLeads = leads.filter(l =>
        ['lost', 'rejected', 'closed'].includes((l.status || '').toLowerCase())
    ).length;

    const totalQuotationValue = quotations.reduce((sum, q) => sum + (q.basePrice || q.totalPrice || 0), 0);
    const approvedQuotations = quotations.filter(q =>
        ['approved', 'accepted', 'won'].includes((q.status || '').toLowerCase())
    );

    const stats = [
        {
            title: 'Total Leads',
            value: loading ? '—' : String(totalLeads),
            change: `${qualifiedLeads} qualified`,
            trend: 'up',
            icon: Users,
            color: 'bg-indigo-600',
        },
        {
            title: 'Qualified Leads',
            value: loading ? '—' : String(qualifiedLeads),
            change: totalLeads ? `${Math.round((qualifiedLeads / totalLeads) * 100)}%` : '0%',
            trend: 'up',
            icon: TrendingUp,
            color: 'bg-emerald-600',
        },
        {
            title: 'Pending Leads',
            value: loading ? '—' : String(pendingLeads),
            change: `${lostLeads} lost`,
            trend: pendingLeads > 0 ? 'down' : 'up',
            icon: Clock,
            color: 'bg-amber-600',
        },
        {
            title: 'Quotation Value',
            value: loading ? '—' : (totalQuotationValue > 0 ? formatCurrency(totalQuotationValue) : `${quotations.length} quotes`),
            change: `${approvedQuotations.length} approved`,
            trend: approvedQuotations.length > 0 ? 'up' : 'down',
            icon: FileText,
            color: 'bg-blue-600',
        },
    ];

    const displayName = user?.name || user?.username || 'there';

    return (
        <div className="space-y-8 animate-in fade-in duration-500">

            {/* ── User welcome banner ── */}
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-6 md:p-8 text-white shadow-lg">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        {/* Avatar */}
                        <div className="h-14 w-14 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center text-white text-xl font-black shrink-0 shadow-inner border border-white/30">
                            {getInitials(user)}
                        </div>
                        <div>
                            <p className="text-indigo-200 text-sm font-medium">{getGreeting()}</p>
                            <h1 className="text-2xl md:text-3xl font-black tracking-tight">
                                {displayName}!
                            </h1>
                            {user?.email && (
                                <p className="text-indigo-200 text-xs mt-0.5 truncate max-w-xs">{user.email}</p>
                            )}
                            {user?.role && (
                                <span className="mt-1 inline-block px-2 py-0.5 rounded-full bg-white/20 text-white text-xs font-semibold">
                                    {user.role}
                                </span>
                            )}
                        </div>
                    </div>

                    <div className="flex items-center gap-3 flex-wrap">
                        <button
                            onClick={fetchData}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/20 hover:bg-white/30 text-white text-sm font-semibold transition-all border border-white/20"
                        >
                            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ArrowUpRight className="h-4 w-4" />}
                            Refresh
                        </button>
                        <button className="bg-white text-indigo-600 px-4 py-2 rounded-xl text-sm font-bold hover:bg-indigo-50 transition-colors shadow-sm">
                            Generate Report
                        </button>
                        <Link
                            to="/"
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold border border-white/30 text-white hover:bg-white/20 transition-all"
                        >
                            <ArrowLeft className="h-4 w-4" />
                            Back to Home
                        </Link>
                    </div>
                </div>

                {/* Sub-label */}
                <p className="mt-4 text-indigo-200 text-sm">
                    Live view of your manufacturing and sales performance.
                    {!loading && !apiError && (
                        <span className="ml-2 text-white font-semibold">
                            {totalLeads} lead{totalLeads !== 1 ? 's' : ''} tracked today.
                        </span>
                    )}
                    {apiError && (
                        <span className="ml-2 text-rose-200 font-semibold">
                            Could not reach API — showing cached data.
                        </span>
                    )}
                </p>
            </div>

            {/* ── Stat Cards ── */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, idx) => (
                    <StatCard key={idx} {...stat} loading={loading} />
                ))}
            </div>

            {/* ── Charts + Activity ── */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Production efficiency chart */}
                <div className="lg:col-span-2 bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="font-bold text-slate-900 dark:text-white">Production Efficiency</h3>
                        <select className="text-sm border border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-gray-200 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 px-2 py-1">
                            <option>Last 7 days</option>
                            <option>Last 30 days</option>
                        </select>
                    </div>
                    <div className="h-64 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-dashed border-slate-200 dark:border-slate-700 px-4 py-6">
                        <div className="w-full h-full flex flex-col justify-between">
                            <div className="flex items-end gap-2 h-40">
                                {efficiencyData.map((value, index) => (
                                    <div key={index} className="flex-1 flex flex-col items-center gap-1">
                                        <span className="text-[9px] text-slate-400 font-semibold">{value}%</span>
                                        <div
                                            className="w-full rounded-t-lg bg-gradient-to-t from-indigo-500 to-emerald-400 transition-all duration-700"
                                            style={{ height: `${Math.max(10, value)}%` }}
                                        />
                                        <span className="text-[10px] text-slate-400">D{index + 1}</span>
                                    </div>
                                ))}
                            </div>
                            <div className="flex items-center justify-between mt-4 text-xs text-slate-400 dark:text-slate-500">
                                <span>Production efficiency (%)</span>
                                <div className="inline-flex items-center gap-3">
                                    <span className="inline-flex items-center gap-1">
                                        <span className="h-2 w-2 rounded-full bg-indigo-500" /> Planned
                                    </span>
                                    <span className="inline-flex items-center gap-1">
                                        <span className="h-2 w-2 rounded-full bg-emerald-400" /> Actual
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Recent Activity */}
                <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800">
                    <h3 className="font-bold text-slate-900 dark:text-white mb-6">Recent Activity</h3>
                    <div className="space-y-5">
                        {[
                            { time: '2h ago', event: 'PO-402 Completed', status: 'success' },
                            { time: '4h ago', event: 'Raw Material Alert: Steel', status: 'warning' },
                            { time: '5h ago', event: 'New Sales Order #892', status: 'info' },
                            { time: '1d ago', event: 'Maintenance: Machine A-1', status: 'success' },
                        ].map((item, i) => (
                            <div key={i} className="flex gap-4">
                                <div className={`mt-1.5 h-2 w-2 rounded-full shrink-0 ${item.status === 'success' ? 'bg-emerald-500' : item.status === 'warning' ? 'bg-amber-500' : 'bg-blue-500'}`} />
                                <div>
                                    <p className="text-sm font-medium text-slate-800 dark:text-slate-200">{item.event}</p>
                                    <p className="text-xs text-slate-500">{item.time}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                    <button className="w-full mt-8 py-2 text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 transition-colors">
                        View All Activity
                    </button>
                </div>
            </div>

            {/* ── Sales Leads + Quotations ── */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Sales Leads — real API data */}
                <div className="lg:col-span-2 bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-bold text-slate-900 dark:text-white">Your Sales Leads</h3>
                        <Link to="/sales" className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold hover:underline">
                            View All →
                        </Link>
                    </div>

                    {loading ? (
                        <div className="space-y-3">
                            {[1, 2, 3].map(i => <Skeleton key={i} className="h-10 w-full" />)}
                        </div>
                    ) : leads.length === 0 ? (
                        <div className="text-center py-10 text-slate-400 dark:text-slate-500">
                            <Package className="h-10 w-10 mx-auto mb-2 opacity-40" />
                            <p className="text-sm">No leads yet. Create your first lead in Sales.</p>
                            <Link to="/sales" className="mt-3 inline-block text-xs text-indigo-600 dark:text-indigo-400 font-semibold hover:underline">
                                Go to Sales →
                            </Link>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left text-slate-600 dark:text-slate-300">
                                <thead>
                                    <tr className="bg-slate-50 dark:bg-slate-800 text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400">
                                        <th className="px-4 py-3 rounded-l-xl">Lead ID</th>
                                        <th className="px-4 py-3">Customer</th>
                                        <th className="px-4 py-3">Requirement</th>
                                        <th className="px-4 py-3 rounded-r-xl">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                    {leads.slice(0, 5).map((lead, i) => (
                                        <tr key={lead._id || i} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                            <td className="px-4 py-3 font-mono text-xs text-slate-400">
                                                {lead._id ? `L-${String(lead._id).slice(-4).toUpperCase()}` : `L-00${i + 1}`}
                                            </td>
                                            <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200">
                                                {lead.clientName || lead.name || '—'}
                                            </td>
                                            <td className="px-4 py-3 text-slate-500 dark:text-slate-400 max-w-[160px] truncate">
                                                {lead.requirement || lead.description || '—'}
                                            </td>
                                            <td className="px-4 py-3">
                                                <span className={`font-semibold capitalize ${statusStyle(lead.status)}`}>
                                                    {lead.status || 'New'}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                {/* Quotations — real API data */}
                <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-bold text-slate-900 dark:text-white">Quotations</h3>
                        <Link to="/sales" className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold hover:underline">
                            View All →
                        </Link>
                    </div>

                    {loading ? (
                        <div className="space-y-3">
                            {[1, 2, 3].map(i => <Skeleton key={i} className="h-10 w-full" />)}
                        </div>
                    ) : quotations.length === 0 ? (
                        <div className="text-center py-10 text-slate-400 dark:text-slate-500">
                            <FileText className="h-10 w-10 mx-auto mb-2 opacity-40" />
                            <p className="text-sm">No quotations yet.</p>
                        </div>
                    ) : (
                        <ul className="space-y-3">
                            {quotations.slice(0, 5).map((q, i) => (
                                <li key={q._id || i} className="flex items-center justify-between gap-2 py-2 border-b border-slate-100 dark:border-slate-800 last:border-0">
                                    <span className="font-medium text-slate-800 dark:text-slate-200 font-mono text-xs">
                                        Q-{q._id ? String(q._id).slice(-4).toUpperCase() : `00${i + 1}`}
                                    </span>
                                    <span className="text-slate-500 dark:text-slate-400 text-sm">
                                        {q.basePrice || q.totalPrice
                                            ? formatCurrency(q.basePrice || q.totalPrice)
                                            : '—'}
                                    </span>
                                    <span className={`text-xs font-semibold capitalize ${statusStyle(q.status)}`}>
                                        {q.status || 'Draft'}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        </div>
    );
}

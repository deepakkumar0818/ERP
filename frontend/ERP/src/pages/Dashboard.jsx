import { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
    TrendingUp, Package, ArrowUpRight, ArrowDownRight, Clock,
    CheckCircle2, Loader2, Users, FileText, Plus, X, Wrench,
    ShoppingBag, BarChart2, AlertTriangle, RefreshCw, Activity,
} from 'lucide-react';
import { salesApi, inventoryApi } from '../api/api';

// ── helpers ────────────────────────────────────────────────────────────────────
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
function formatCurrency(v) {
    if (v >= 10000000) return `₹${(v / 10000000).toFixed(1)}Cr`;
    if (v >= 100000)   return `₹${(v / 100000).toFixed(1)}L`;
    if (v >= 1000)     return `₹${(v / 1000).toFixed(0)}K`;
    return `₹${v}`;
}
function loadLocal(key, fallback) {
    try { return JSON.parse(localStorage.getItem(key) || 'null') ?? fallback; } catch { return fallback; }
}

// ── Skeleton ───────────────────────────────────────────────────────────────────
function Skeleton({ className = '' }) {
    return <div className={`animate-pulse bg-slate-200 dark:bg-slate-700 rounded ${className}`} />;
}

// ── Stat Card ──────────────────────────────────────────────────────────────────
function StatCard({ title, value, sub, trend, icon: Icon, colorClass, loading }) {
    return (
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 hover:shadow-md transition-all">
            {loading ? (
                <div className="space-y-3">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-7 w-20" />
                    <Skeleton className="h-3 w-32" />
                </div>
            ) : (
                <div className="flex justify-between items-start gap-3">
                    <div className="min-w-0">
                        <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{title}</p>
                        <h3 className="text-2xl font-black mt-1 text-slate-900 dark:text-white truncate">{value}</h3>
                        {sub && (
                            <div className="flex items-center gap-1 mt-1.5">
                                {trend === 'up'
                                    ? <ArrowUpRight className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                                    : trend === 'down'
                                    ? <ArrowDownRight className="h-3.5 w-3.5 text-rose-500 shrink-0" />
                                    : <Activity className="h-3.5 w-3.5 text-slate-400 shrink-0" />}
                                <span className={`text-xs font-semibold ${trend === 'up' ? 'text-emerald-600 dark:text-emerald-400' : trend === 'down' ? 'text-rose-500' : 'text-slate-500'}`}>
                                    {sub}
                                </span>
                            </div>
                        )}
                    </div>
                    <div className={`p-3 rounded-xl shrink-0 ${colorClass}`}>
                        <Icon className="h-5 w-5" />
                    </div>
                </div>
            )}
        </div>
    );
}

// ── Status badge helper ────────────────────────────────────────────────────────
function statusColor(s = '') {
    const v = s.toLowerCase();
    if (['qualified', 'approved', 'won', 'completed', 'delivered'].includes(v)) return 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10';
    if (['pending', 'new', 'draft', 'in_progress', 'in_transit'].includes(v))   return 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-500/10';
    return 'text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-500/10';
}

// ══════════════════════════════════════════════════════════════════════════════
export default function Dashboard() {
    // ── Auth user ─────────────────────────────────────────────────────────────
    const [user, setUser] = useState(null);

    // ── API data ──────────────────────────────────────────────────────────────
    const [leads, setLeads]               = useState([]);
    const [allQuotations, setAllQuotations] = useState([]);
    const [inventoryItems, setInventoryItems] = useState([]);
    const [loading, setLoading]           = useState(true);
    const [apiError, setApiError]         = useState(null);

    // ── localStorage data (local-only features) ───────────────────────────────
    const [machines]  = useState(() => loadLocal('erp_machines', []));
    const [prs]       = useState(() => loadLocal('erp_purchase_requests', []));

    // ── Quick Add Lead form state ─────────────────────────────────────────────
    const [showLeadForm, setShowLeadForm]         = useState(false);
    const [leadClientName, setLeadClientName]     = useState('');
    const [leadRequirement, setLeadRequirement]   = useState('');
    const [leadSubmitting, setLeadSubmitting]     = useState(false);
    const [leadMsg, setLeadMsg]                   = useState('');
    const [leadErr, setLeadErr]                   = useState('');

    // ── Quick Add Inventory form state ────────────────────────────────────────
    const [showInvForm, setShowInvForm]           = useState(false);
    const [invName, setInvName]                   = useState('');
    const [invSku, setInvSku]                     = useState('');
    const [invQty, setInvQty]                     = useState('');
    const [invUnit, setInvUnit]                   = useState('');
    const [invType, setInvType]                   = useState('RAW');
    const [invSubmitting, setInvSubmitting]       = useState(false);
    const [invMsg, setInvMsg]                     = useState('');
    const [invErr, setInvErr]                     = useState('');

    // ── Efficiency chart data (static demo) ───────────────────────────────────
    const efficiencyData = [78, 82, 69, 91, 87, 74, 88];

    // ── Load user from localStorage ───────────────────────────────────────────
    useEffect(() => {
        try {
            const stored = localStorage.getItem('erp_user');
            if (stored) setUser(JSON.parse(stored));
        } catch { /* ignore */ }
    }, []);

    // ── Fetch API data ────────────────────────────────────────────────────────
    const fetchData = useCallback(async () => {
        setLoading(true);
        setApiError(null);
        try {
            const [leadsRes, invRes] = await Promise.allSettled([
                salesApi.getLeads(),
                inventoryApi.getAll(),
            ]);

            const fetchedLeads = leadsRes.status === 'fulfilled' ? (leadsRes.value.leads || []) : [];
            setLeads(fetchedLeads);

            if (invRes.status === 'fulfilled') setInventoryItems(invRes.value.items || []);
            if (leadsRes.status === 'rejected') setApiError(leadsRes.reason?.message || 'Failed to load leads');

            if (fetchedLeads.length > 0) {
                const results = await Promise.allSettled(
                    fetchedLeads.map(l => salesApi.getQuotationsByLead(l.id))
                );
                setAllQuotations(results.flatMap(r => r.status === 'fulfilled' ? (r.value.quotations || []) : []));
            }
        } catch (err) {
            setApiError(err.message);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchData(); }, [fetchData]);

    // ── Quick Add Lead ────────────────────────────────────────────────────────
    const handleAddLead = async (e) => {
        e.preventDefault();
        setLeadSubmitting(true);
        setLeadErr('');
        setLeadMsg('');
        try {
            await salesApi.createLead(leadClientName.trim(), leadRequirement.trim());
            setLeadMsg(`Lead for "${leadClientName}" created!`);
            setLeadClientName('');
            setLeadRequirement('');
            setShowLeadForm(false);
            await fetchData();
        } catch (err) {
            setLeadErr(err.message);
        } finally {
            setLeadSubmitting(false);
        }
    };

    // ── Quick Add Inventory ───────────────────────────────────────────────────
    const handleAddInventory = async (e) => {
        e.preventDefault();
        setInvSubmitting(true);
        setInvErr('');
        setInvMsg('');
        try {
            await inventoryApi.create(invName.trim(), invSku.trim(), parseFloat(invQty), invUnit.trim(), invType);
            setInvMsg(`"${invName}" added to inventory!`);
            setInvName(''); setInvSku(''); setInvQty(''); setInvUnit(''); setInvType('RAW');
            setShowInvForm(false);
            await fetchData();
        } catch (err) {
            setInvErr(err.message);
        } finally {
            setInvSubmitting(false);
        }
    };

    // ── Derived stats ─────────────────────────────────────────────────────────
    const qualifiedLeads      = leads.filter(l => ['qualified', 'won', 'approved'].includes((l.status || '').toLowerCase())).length;
    const pendingLeads        = leads.filter(l => ['pending', 'new', 'draft'].includes((l.status || '').toLowerCase())).length;
    const lostLeads           = leads.filter(l => ['lost', 'rejected', 'closed'].includes((l.status || '').toLowerCase())).length;
    const approvedQuotations  = allQuotations.filter(q => ['approved', 'accepted', 'won'].includes((q.status || '').toLowerCase()));
    const totalQuotationValue = allQuotations.reduce((s, q) => s + (q.basePrice || 0), 0);
    const outOfStockCount     = inventoryItems.filter(i => i.quantity <= 0).length;
    const activeMachines      = machines.filter(m => m.status === 'ACTIVE').length;
    const pendingPRs          = prs.filter(p => p.status === 'PENDING').length;

    const inputCls = 'w-full px-3 py-2 border border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm';

    return (
        <div className="space-y-6 animate-in fade-in duration-500">

            {/* ── Welcome Banner ── */}
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-6 text-white shadow-lg">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <div className="h-14 w-14 rounded-2xl bg-white/20 flex items-center justify-center text-xl font-black border border-white/30 shrink-0">
                            {getInitials(user)}
                        </div>
                        <div>
                            <p className="text-indigo-200 text-sm">{getGreeting()}</p>
                            <h1 className="text-2xl font-black">{user?.name || user?.username || 'there'}!</h1>
                            {user?.email && <p className="text-indigo-200 text-xs">{user.email}</p>}
                            {user?.role && (
                                <span className="mt-1 inline-block px-2 py-0.5 rounded-full bg-white/20 text-xs font-semibold">{user.role}</span>
                            )}
                        </div>
                    </div>
                    <div className="flex gap-3 flex-wrap">
                        <button onClick={fetchData}
                            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/20 hover:bg-white/30 text-sm font-semibold border border-white/20">
                            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
                            Refresh
                        </button>
                    </div>
                </div>
                <p className="mt-3 text-indigo-200 text-sm">
                    {!loading && !apiError && (
                        <span className="text-white font-semibold">
                            {leads.length} leads · {allQuotations.length} quotations · {inventoryItems.length} inventory items
                        </span>
                    )}
                    {apiError && <span className="text-rose-200 font-semibold">API unreachable — showing cached/partial data.</span>}
                </p>
            </div>

            {/* ── KPI Stats (8 cards) ── */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <StatCard title="Total Leads"       value={loading ? '—' : leads.length}              sub={`${qualifiedLeads} qualified`}                      trend="up"     icon={Users}        colorClass="bg-indigo-100 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400" loading={loading} />
                <StatCard title="Quotation Value"   value={loading ? '—' : (totalQuotationValue > 0 ? formatCurrency(totalQuotationValue) : `${allQuotations.length} quotes`)} sub={`${approvedQuotations.length} approved`} trend={approvedQuotations.length > 0 ? 'up' : 'neutral'} icon={FileText} colorClass="bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400" loading={loading} />
                <StatCard title="Inventory SKUs"    value={loading ? '—' : inventoryItems.length}     sub={outOfStockCount > 0 ? `${outOfStockCount} out of stock` : 'All stocked'} trend={outOfStockCount > 0 ? 'down' : 'up'} icon={Package} colorClass="bg-amber-100 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400" loading={loading} />
                <StatCard title="Active Machines"   value={machines.length === 0 ? '—' : activeMachines} sub={`${machines.length} total`}                     trend="up"     icon={Wrench}       colorClass="bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400" loading={false} />
                <StatCard title="Pending Leads"     value={loading ? '—' : pendingLeads}              sub={`${lostLeads} lost`}                                trend={pendingLeads > 0 ? 'neutral' : 'up'} icon={Clock} colorClass="bg-purple-100 dark:bg-purple-500/20 text-purple-600 dark:text-purple-400" loading={loading} />
                <StatCard title="Approved Revenue"  value={loading ? '—' : (approvedQuotations.length > 0 ? formatCurrency(approvedQuotations.reduce((s, q) => s + (q.negotiatedPrice || q.basePrice || 0), 0)) : '₹0')} sub={`${approvedQuotations.length} won deals`} trend={approvedQuotations.length > 0 ? 'up' : 'neutral'} icon={TrendingUp} colorClass="bg-teal-100 dark:bg-teal-500/20 text-teal-600 dark:text-teal-400" loading={loading} />
                <StatCard title="Purchase Requests" value={prs.length === 0 ? '—' : prs.length}       sub={`${pendingPRs} pending`}                            trend={pendingPRs > 0 ? 'neutral' : 'up'} icon={ShoppingBag} colorClass="bg-rose-100 dark:bg-rose-500/20 text-rose-600 dark:text-rose-400" loading={false} />
                <StatCard title="Conversion Rate"   value={loading ? '—' : (leads.length > 0 ? `${Math.round((qualifiedLeads / leads.length) * 100)}%` : '0%')} sub="qualified vs total" trend={qualifiedLeads > 0 ? 'up' : 'down'} icon={BarChart2} colorClass="bg-sky-100 dark:bg-sky-500/20 text-sky-600 dark:text-sky-400" loading={loading} />
            </div>

            {/* ── Alerts row ── */}
            {!loading && (outOfStockCount > 0 || pendingPRs > 0) && (
                <div className="flex flex-wrap gap-3">
                    {outOfStockCount > 0 && (
                        <div className="flex items-center gap-2 px-4 py-2.5 bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/20 rounded-xl text-sm text-rose-700 dark:text-rose-400">
                            <AlertTriangle className="h-4 w-4 shrink-0" />
                            <span><strong>{outOfStockCount}</strong> inventory item{outOfStockCount > 1 ? 's' : ''} out of stock —</span>
                            <Link to="/procurement" className="font-semibold underline">Create Purchase Request</Link>
                        </div>
                    )}
                    {pendingPRs > 0 && (
                        <div className="flex items-center gap-2 px-4 py-2.5 bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 rounded-xl text-sm text-amber-700 dark:text-amber-400">
                            <Clock className="h-4 w-4 shrink-0" />
                            <span><strong>{pendingPRs}</strong> purchase request{pendingPRs > 1 ? 's' : ''} awaiting approval —</span>
                            <Link to="/procurement" className="font-semibold underline">View</Link>
                        </div>
                    )}
                </div>
            )}

            {/* ── Quick Actions ── */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                {/* Quick Add Lead */}
                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden">
                    <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 dark:border-slate-800">
                        <div className="flex items-center gap-2">
                            <Users className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                            <h3 className="font-semibold text-slate-900 dark:text-white text-sm">Quick Add Lead</h3>
                        </div>
                        <div className="flex items-center gap-2">
                            <Link to="/sales" className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold hover:underline">All leads →</Link>
                            <button onClick={() => { setShowLeadForm(v => !v); setLeadMsg(''); setLeadErr(''); }}
                                className="p-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-500/20">
                                {showLeadForm ? <X className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                            </button>
                        </div>
                    </div>

                    {leadMsg && (
                        <div className="mx-5 mt-3 flex items-center gap-2 text-xs text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 rounded-lg px-3 py-2">
                            <CheckCircle2 className="h-3.5 w-3.5" />{leadMsg}
                        </div>
                    )}
                    {leadErr && (
                        <div className="mx-5 mt-3 flex items-center gap-2 text-xs text-rose-700 dark:text-rose-400 bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/20 rounded-lg px-3 py-2">
                            <X className="h-3.5 w-3.5" />{leadErr}
                        </div>
                    )}

                    {showLeadForm && (
                        <form onSubmit={handleAddLead} className="p-5 space-y-3">
                            <div>
                                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Client Name <span className="text-rose-500">*</span></label>
                                <input
                                    type="text"
                                    value={leadClientName}
                                    onChange={e => setLeadClientName(e.target.value)}
                                    placeholder="e.g. Tata Motors Ltd"
                                    required
                                    className={inputCls}
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Requirement <span className="text-rose-500">*</span></label>
                                <textarea
                                    value={leadRequirement}
                                    onChange={e => setLeadRequirement(e.target.value)}
                                    placeholder="Describe what the client needs…"
                                    required
                                    rows={2}
                                    className={inputCls + ' resize-none'}
                                />
                            </div>
                            <div className="flex justify-end">
                                <button type="submit" disabled={leadSubmitting}
                                    className="inline-flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-indigo-700 disabled:opacity-60">
                                    {leadSubmitting ? <><Loader2 className="h-3.5 w-3.5 animate-spin" />Saving…</> : <><Plus className="h-3.5 w-3.5" />Create Lead</>}
                                </button>
                            </div>
                        </form>
                    )}

                    {/* Recent leads list */}
                    <div className="px-5 pb-5">
                        {loading ? (
                            <div className="space-y-2 mt-3">{[1,2,3].map(i => <Skeleton key={i} className="h-9 w-full" />)}</div>
                        ) : leads.length === 0 ? (
                            <div className="text-center py-6 text-slate-400 dark:text-slate-500">
                                <Users className="h-8 w-8 mx-auto mb-1 opacity-30" />
                                <p className="text-xs">No leads yet. Add your first lead above.</p>
                            </div>
                        ) : (
                            <div className="mt-3 divide-y divide-slate-100 dark:divide-slate-800">
                                {leads.slice(0, 5).map((lead, i) => (
                                    <div key={lead.id || i} className="flex items-center justify-between py-2.5 gap-3">
                                        <div className="min-w-0">
                                            <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 truncate">{lead.clientName || '—'}</p>
                                            <p className="text-xs text-slate-400 truncate">{lead.requirement || '—'}</p>
                                        </div>
                                        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full shrink-0 ${statusColor(lead.status || 'new')}`}>
                                            {lead.status || 'New'}
                                        </span>
                                    </div>
                                ))}
                                {leads.length > 5 && (
                                    <p className="text-xs text-slate-400 text-center pt-2">+{leads.length - 5} more leads</p>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* Quick Add Inventory */}
                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden">
                    <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 dark:border-slate-800">
                        <div className="flex items-center gap-2">
                            <Package className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                            <h3 className="font-semibold text-slate-900 dark:text-white text-sm">Quick Add Inventory</h3>
                        </div>
                        <div className="flex items-center gap-2">
                            <Link to="/inventory" className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold hover:underline">All items →</Link>
                            <button onClick={() => { setShowInvForm(v => !v); setInvMsg(''); setInvErr(''); }}
                                className="p-1.5 rounded-lg bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 hover:bg-amber-100 dark:hover:bg-amber-500/20">
                                {showInvForm ? <X className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                            </button>
                        </div>
                    </div>

                    {invMsg && (
                        <div className="mx-5 mt-3 flex items-center gap-2 text-xs text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 rounded-lg px-3 py-2">
                            <CheckCircle2 className="h-3.5 w-3.5" />{invMsg}
                        </div>
                    )}
                    {invErr && (
                        <div className="mx-5 mt-3 flex items-center gap-2 text-xs text-rose-700 dark:text-rose-400 bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/20 rounded-lg px-3 py-2">
                            <X className="h-3.5 w-3.5" />{invErr}
                        </div>
                    )}

                    {showInvForm && (
                        <form onSubmit={handleAddInventory} className="p-5 space-y-3">
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Item Name <span className="text-rose-500">*</span></label>
                                    <input type="text" value={invName} onChange={e => setInvName(e.target.value)} placeholder="e.g. Steel Rod 10mm" required className={inputCls} />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">SKU <span className="text-rose-500">*</span></label>
                                    <input type="text" value={invSku} onChange={e => setInvSku(e.target.value)} placeholder="e.g. SKU-001" required className={inputCls} />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Quantity <span className="text-rose-500">*</span></label>
                                    <input type="number" value={invQty} onChange={e => setInvQty(e.target.value)} placeholder="0" required min="0" className={inputCls} />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Unit</label>
                                    <input type="text" value={invUnit} onChange={e => setInvUnit(e.target.value)} placeholder="kg, pcs, liters" className={inputCls} />
                                </div>
                                <div className="col-span-2">
                                    <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Type <span className="text-rose-500">*</span></label>
                                    <select value={invType} onChange={e => setInvType(e.target.value)} className={inputCls}>
                                        <option value="RAW">RAW — Raw Material</option>
                                        <option value="FINISHED">FINISHED — Finished Good</option>
                                    </select>
                                </div>
                            </div>
                            <div className="flex justify-end">
                                <button type="submit" disabled={invSubmitting}
                                    className="inline-flex items-center gap-2 bg-amber-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-amber-700 disabled:opacity-60">
                                    {invSubmitting ? <><Loader2 className="h-3.5 w-3.5 animate-spin" />Saving…</> : <><Plus className="h-3.5 w-3.5" />Add Item</>}
                                </button>
                            </div>
                        </form>
                    )}

                    {/* Inventory summary */}
                    <div className="px-5 pb-5">
                        {loading ? (
                            <div className="space-y-2 mt-3">{[1,2,3].map(i => <Skeleton key={i} className="h-9 w-full" />)}</div>
                        ) : inventoryItems.length === 0 ? (
                            <div className="text-center py-6 text-slate-400 dark:text-slate-500">
                                <Package className="h-8 w-8 mx-auto mb-1 opacity-30" />
                                <p className="text-xs">No inventory items yet.</p>
                            </div>
                        ) : (
                            <div className="mt-3 space-y-2">
                                {[
                                    { label: 'Total SKUs', value: inventoryItems.length, color: 'text-slate-900 dark:text-white' },
                                    { label: 'Raw Materials', value: inventoryItems.filter(i => i.type === 'RAW').length, color: 'text-slate-900 dark:text-white' },
                                    { label: 'Finished Goods', value: inventoryItems.filter(i => i.type === 'FINISHED').length, color: 'text-slate-900 dark:text-white' },
                                    { label: 'Out of Stock', value: outOfStockCount, color: outOfStockCount > 0 ? 'text-rose-600 dark:text-rose-400 font-black' : 'text-emerald-600 dark:text-emerald-400' },
                                ].map(({ label, value, color }) => (
                                    <div key={label} className="flex justify-between items-center py-1.5 border-b border-slate-100 dark:border-slate-800 last:border-0">
                                        <span className="text-sm text-slate-500 dark:text-slate-400">{label}</span>
                                        <span className={`text-sm font-bold ${color}`}>{value}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* ── Production Efficiency + Quotations ── */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Efficiency Chart */}
                <div className="lg:col-span-2 bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="font-bold text-slate-900 dark:text-white">Production Efficiency</h3>
                        <select className="text-sm border border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 rounded-lg px-2 py-1 focus:ring-2 focus:ring-indigo-500">
                            <option>Last 7 days</option>
                            <option>Last 30 days</option>
                        </select>
                    </div>
                    <div className="h-52 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-dashed border-slate-200 dark:border-slate-700 px-4 py-4">
                        <div className="w-full h-full flex flex-col justify-between">
                            <div className="flex items-end gap-2 h-36">
                                {efficiencyData.map((value, index) => (
                                    <div key={index} className="flex-1 flex flex-col items-center gap-1">
                                        <span className="text-[9px] text-slate-400 font-semibold">{value}%</span>
                                        <div
                                            className="w-full rounded-t-lg bg-gradient-to-t from-indigo-500 to-emerald-400"
                                            style={{ height: `${Math.max(10, value)}%` }}
                                        />
                                        <span className="text-[10px] text-slate-400">D{index + 1}</span>
                                    </div>
                                ))}
                            </div>
                            <div className="flex items-center justify-between text-xs text-slate-400 dark:text-slate-500 mt-2">
                                <span>Production efficiency (%)</span>
                                <div className="flex gap-3">
                                    <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-indigo-500" /> Planned</span>
                                    <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-emerald-400" /> Actual</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Quotations */}
                <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-bold text-slate-900 dark:text-white">Quotations</h3>
                        <Link to="/sales" className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold hover:underline">View All →</Link>
                    </div>
                    {loading ? (
                        <div className="space-y-3">{[1,2,3].map(i => <Skeleton key={i} className="h-10 w-full" />)}</div>
                    ) : allQuotations.length === 0 ? (
                        <div className="text-center py-10 text-slate-400 dark:text-slate-500">
                            <FileText className="h-8 w-8 mx-auto mb-2 opacity-30" />
                            <p className="text-xs">No quotations yet.</p>
                        </div>
                    ) : (
                        <div className="space-y-2">
                            {allQuotations.slice(0, 7).map((q, i) => (
                                <div key={q.id || i} className="flex items-center justify-between gap-2 py-2 border-b border-slate-100 dark:border-slate-800 last:border-0">
                                    <span className="text-xs font-mono text-slate-400">Q-{q.id ? String(q.id).slice(-4).toUpperCase() : `00${i+1}`}</span>
                                    <span className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex-1 text-center">
                                        {q.negotiatedPrice ? formatCurrency(q.negotiatedPrice) : q.basePrice ? formatCurrency(q.basePrice) : '—'}
                                    </span>
                                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${statusColor(q.status || 'draft')}`}>
                                        {q.status || 'Draft'}
                                    </span>
                                </div>
                            ))}
                            {allQuotations.length > 7 && (
                                <p className="text-xs text-slate-400 text-center pt-1">+{allQuotations.length - 7} more</p>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* ── Machines + Purchase Requests snapshot ── */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                {/* Machines snapshot */}
                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden">
                    <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 dark:border-slate-800">
                        <div className="flex items-center gap-2">
                            <Wrench className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                            <h3 className="font-semibold text-slate-900 dark:text-white text-sm">Machines</h3>
                        </div>
                        <Link to="/machines" className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold hover:underline">Manage →</Link>
                    </div>
                    {machines.length === 0 ? (
                        <div className="text-center py-8 text-slate-400 dark:text-slate-500">
                            <Wrench className="h-7 w-7 mx-auto mb-1 opacity-30" />
                            <p className="text-xs">No machines registered.</p>
                            <Link to="/machines" className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold hover:underline mt-1 inline-block">Add Machine →</Link>
                        </div>
                    ) : (
                        <div className="divide-y divide-slate-100 dark:divide-slate-800">
                            {machines.slice(0, 5).map(m => {
                                const oee = Math.round((m.availability * m.performance * m.quality) / 10000);
                                return (
                                    <div key={m.id} className="flex items-center justify-between px-5 py-3">
                                        <div>
                                            <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">{m.name}</p>
                                            <p className="text-xs text-slate-400 font-mono">{m.machineId}</p>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <span className="text-xs text-slate-500 dark:text-slate-400">OEE {oee}%</span>
                                            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${statusColor(m.status)}`}>{m.status}</span>
                                        </div>
                                    </div>
                                );
                            })}
                            {machines.length > 5 && (
                                <p className="text-xs text-slate-400 text-center py-2">+{machines.length - 5} more</p>
                            )}
                        </div>
                    )}
                </div>

                {/* Purchase Requests snapshot */}
                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden">
                    <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 dark:border-slate-800">
                        <div className="flex items-center gap-2">
                            <ShoppingBag className="h-4 w-4 text-rose-600 dark:text-rose-400" />
                            <h3 className="font-semibold text-slate-900 dark:text-white text-sm">Purchase Requests</h3>
                        </div>
                        <Link to="/procurement" className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold hover:underline">Manage →</Link>
                    </div>
                    {prs.length === 0 ? (
                        <div className="text-center py-8 text-slate-400 dark:text-slate-500">
                            <ShoppingBag className="h-7 w-7 mx-auto mb-1 opacity-30" />
                            <p className="text-xs">No purchase requests yet.</p>
                            <Link to="/procurement" className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold hover:underline mt-1 inline-block">Create Request →</Link>
                        </div>
                    ) : (
                        <div className="divide-y divide-slate-100 dark:divide-slate-800">
                            {prs.slice(0, 5).map(pr => (
                                <div key={pr.id} className="flex items-center justify-between px-5 py-3">
                                    <div>
                                        <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">{pr.itemName}</p>
                                        <p className="text-xs text-slate-400">{pr.quantity} {pr.unit} · {pr.supplier || 'No supplier'}</p>
                                    </div>
                                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${statusColor(pr.status)}`}>{pr.status}</span>
                                </div>
                            ))}
                            {prs.length > 5 && (
                                <p className="text-xs text-slate-400 text-center py-2">+{prs.length - 5} more</p>
                            )}
                        </div>
                    )}
                </div>
            </div>

        </div>
    );
}

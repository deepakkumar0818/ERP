import { useEffect, useState, useCallback } from 'react';
import { BarChart3, Download, RefreshCw, Loader2, TrendingUp, Package, FileText, Users } from 'lucide-react';
import { salesApi, inventoryApi } from '../api/api';

function formatCurrency(v) {
    if (!v) return '₹0';
    if (v >= 10000000) return `₹${(v / 10000000).toFixed(2)}Cr`;
    if (v >= 100000)   return `₹${(v / 100000).toFixed(2)}L`;
    return `₹${Number(v).toLocaleString('en-IN')}`;
}

const BAR_COLORS = ['bg-indigo-500', 'bg-emerald-500', 'bg-amber-500', 'bg-rose-500', 'bg-purple-500', 'bg-blue-500'];

function MiniBar({ label, value, max, color }) {
    const pct = max > 0 ? Math.round((value / max) * 100) : 0;
    return (
        <div className="flex items-center gap-3">
            <span className="text-xs text-slate-500 dark:text-slate-400 w-28 truncate shrink-0">{label}</span>
            <div className="flex-1 bg-slate-100 dark:bg-slate-800 rounded-full h-2">
                <div className={`h-2 rounded-full transition-all duration-500 ${color}`} style={{ width: `${pct}%` }} />
            </div>
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 w-8 text-right">{value}</span>
        </div>
    );
}

export default function Reports() {
    const [leads, setLeads]                 = useState([]);
    const [allQuotations, setAllQuotations] = useState([]);
    const [inventory, setInventory]         = useState([]);
    const [loading, setLoading]             = useState(true);
    const [error, setError]                 = useState('');

    const fetchAll = useCallback(async () => {
        setLoading(true);
        setError('');
        try {
            const [leadsRes, invRes] = await Promise.allSettled([
                salesApi.getLeads(),
                inventoryApi.getAll(),
            ]);

            const fetchedLeads = leadsRes.status === 'fulfilled' ? (leadsRes.value.leads || []) : [];
            setLeads(fetchedLeads);
            if (invRes.status === 'fulfilled') setInventory(invRes.value.items || []);

            if (fetchedLeads.length > 0) {
                const qResults = await Promise.allSettled(
                    fetchedLeads.map((l) => salesApi.getQuotationsByLead(l.id))
                );
                const merged = qResults.flatMap((r, i) =>
                    r.status === 'fulfilled'
                        ? (r.value.quotations || []).map((q) => ({ ...q, clientName: fetchedLeads[i].clientName }))
                        : []
                );
                setAllQuotations(merged);
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchAll(); }, [fetchAll]);

    // Metrics
    const totalLeads        = leads.length;
    const qualifiedLeads    = leads.filter(l => ['qualified', 'won', 'approved'].includes((l.status || '').toLowerCase())).length;
    const totalQuotes       = allQuotations.length;
    const approvedQuotes    = allQuotations.filter(q => q.status === 'APPROVED').length;
    const totalRevenue      = allQuotations.filter(q => q.status === 'APPROVED').reduce((s, q) => s + (q.negotiatedPrice || q.basePrice || 0), 0);
    const pipelineValue     = allQuotations.reduce((s, q) => s + (q.basePrice || 0), 0);
    const conversionRate    = totalLeads > 0 ? Math.round((qualifiedLeads / totalLeads) * 100) : 0;
    const quoteApprovalRate = totalQuotes > 0 ? Math.round((approvedQuotes / totalQuotes) * 100) : 0;

    const rawCount      = inventory.filter(i => i.type === 'RAW').length;
    const finishedCount = inventory.filter(i => i.type === 'FINISHED').length;
    const outOfStock    = inventory.filter(i => i.quantity <= 0).length;

    const leadStatusMap = leads.reduce((acc, l) => {
        const s = l.status || 'NEW';
        acc[s] = (acc[s] || 0) + 1;
        return acc;
    }, {});
    const leadStatusEntries = Object.entries(leadStatusMap).sort((a, b) => b[1] - a[1]);
    const maxLeadCount = Math.max(...leadStatusEntries.map(([, c]) => c), 1);

    const clientValueMap = allQuotations.reduce((acc, q) => {
        const c = q.clientName || 'Unknown';
        acc[c] = (acc[c] || 0) + (q.basePrice || 0);
        return acc;
    }, {});
    const topClients     = Object.entries(clientValueMap).sort((a, b) => b[1] - a[1]).slice(0, 6);
    const maxClientValue = Math.max(...topClients.map(([, v]) => v), 1);

    const kpis = [
        { label: 'Total Leads',      value: totalLeads,               icon: Users,     colorBg: 'bg-indigo-500/10', colorText: 'text-indigo-600 dark:text-indigo-400' },
        { label: 'Total Quotations', value: totalQuotes,              icon: FileText,  colorBg: 'bg-blue-500/10',   colorText: 'text-blue-600 dark:text-blue-400' },
        { label: 'Approved Revenue', value: formatCurrency(totalRevenue), icon: TrendingUp, colorBg: 'bg-emerald-500/10', colorText: 'text-emerald-600 dark:text-emerald-400' },
        { label: 'Pipeline Value',   value: formatCurrency(pipelineValue), icon: BarChart3, colorBg: 'bg-amber-500/10',  colorText: 'text-amber-600 dark:text-amber-400' },
        { label: 'Inventory SKUs',   value: inventory.length,         icon: Package,   colorBg: 'bg-purple-500/10', colorText: 'text-purple-600 dark:text-purple-400' },
        { label: 'Out of Stock',     value: outOfStock,               icon: Package,   colorBg: 'bg-rose-500/10',   colorText: 'text-rose-600 dark:text-rose-400' },
    ];

    const handleExport = () => {
        const rows = [
            ['Metric', 'Value'],
            ['Total Leads', totalLeads],
            ['Qualified Leads', qualifiedLeads],
            ['Conversion Rate (%)', conversionRate],
            ['Total Quotations', totalQuotes],
            ['Approved Quotations', approvedQuotes],
            ['Quote Approval Rate (%)', quoteApprovalRate],
            ['Approved Revenue (INR)', totalRevenue],
            ['Pipeline Value (INR)', pipelineValue],
            ['Inventory SKUs', inventory.length],
            ['Raw Materials', rawCount],
            ['Finished Goods', finishedCount],
            ['Out of Stock', outOfStock],
        ];
        const csv  = rows.map(r => r.join(',')).join('\n');
        const blob = new Blob([csv], { type: 'text/csv' });
        const url  = URL.createObjectURL(blob);
        const a    = document.createElement('a');
        a.href     = url;
        a.download = `erp_report_${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        URL.revokeObjectURL(url);
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Reports &amp; Analytics</h1>
                    <p className="text-slate-500 dark:text-slate-400">Live business intelligence from your ERP data.</p>
                </div>
                <div className="flex gap-3">
                    <button onClick={fetchAll}
                        className="flex items-center gap-2 px-4 py-2 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 rounded-xl font-semibold text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800">
                        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}Refresh
                    </button>
                    <button onClick={handleExport}
                        className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-xl font-semibold text-sm hover:bg-indigo-700 shadow-sm">
                        <Download className="h-4 w-4" />Export CSV
                    </button>
                </div>
            </div>

            {error && <p className="text-sm text-rose-600 bg-rose-50 border border-rose-100 rounded-lg px-3 py-2">{error}</p>}

            {/* KPI cards */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {kpis.map(({ label, value, icon: Icon, colorBg, colorText }) => (
                    <div key={label} className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm">
                        <div className={`inline-flex p-2 rounded-xl mb-3 ${colorBg}`}>
                            <Icon className={`h-4 w-4 ${colorText}`} />
                        </div>
                        <p className="text-xs font-medium text-slate-500 dark:text-slate-400">{label}</p>
                        {loading
                            ? <div className="h-6 w-16 bg-slate-200 dark:bg-slate-700 rounded animate-pulse mt-1" />
                            : <p className="text-xl font-bold text-slate-900 dark:text-white mt-0.5">{value}</p>}
                    </div>
                ))}
            </div>

            {/* Charts row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Sales Funnel */}
                <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm">
                    <h3 className="font-bold text-slate-900 dark:text-white mb-5">Sales Funnel</h3>
                    {loading ? <div className="space-y-3">{[1,2,3,4].map(i=><div key={i} className="h-4 bg-slate-200 dark:bg-slate-700 rounded animate-pulse"/>)}</div> : (
                        <div className="space-y-4">
                            {[
                                { label: 'Total Leads',   value: totalLeads,      pct: 100,            color: 'bg-indigo-500' },
                                { label: 'Qualified',     value: qualifiedLeads,  pct: conversionRate,     color: 'bg-emerald-500' },
                                { label: 'Quotations',    value: totalQuotes,     pct: totalLeads > 0 ? Math.round((totalQuotes/totalLeads)*100) : 0, color: 'bg-blue-500' },
                                { label: 'Approved',      value: approvedQuotes,  pct: quoteApprovalRate, color: 'bg-amber-500' },
                            ].map(({ label, value, pct, color }) => (
                                <div key={label}>
                                    <div className="flex justify-between text-xs mb-1">
                                        <span className="text-slate-500 dark:text-slate-400">{label}</span>
                                        <span className="font-semibold text-slate-700 dark:text-slate-300">{value} <span className="text-slate-400">({pct}%)</span></span>
                                    </div>
                                    <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2.5">
                                        <div className={`h-2.5 rounded-full transition-all duration-500 ${color}`} style={{ width: `${pct}%` }} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Lead status breakdown */}
                <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm">
                    <h3 className="font-bold text-slate-900 dark:text-white mb-5">Lead Status Breakdown</h3>
                    {loading ? <div className="space-y-3">{[1,2,3].map(i=><div key={i} className="h-4 bg-slate-200 dark:bg-slate-700 rounded animate-pulse"/>)}</div>
                    : leadStatusEntries.length === 0 ? <p className="text-sm text-slate-400 text-center py-8">No leads yet.</p>
                    : (
                        <div className="space-y-3">
                            {leadStatusEntries.map(([status, count], i) => (
                                <MiniBar key={status} label={status} value={count} max={maxLeadCount} color={BAR_COLORS[i % BAR_COLORS.length]} />
                            ))}
                        </div>
                    )}
                </div>

                {/* Inventory overview */}
                <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm">
                    <h3 className="font-bold text-slate-900 dark:text-white mb-5">Inventory Breakdown</h3>
                    {loading ? <div className="space-y-3">{[1,2,3].map(i=><div key={i} className="h-4 bg-slate-200 dark:bg-slate-700 rounded animate-pulse"/>)}</div> : (
                        <div className="space-y-4">
                            {[
                                { label: 'Raw Materials',  value: rawCount,      color: 'bg-amber-500' },
                                { label: 'Finished Goods', value: finishedCount, color: 'bg-indigo-500' },
                                { label: 'Out of Stock',   value: outOfStock,    color: 'bg-rose-500' },
                            ].map(({ label, value, color }) => (
                                <MiniBar key={label} label={label} value={value} max={Math.max(rawCount, finishedCount, outOfStock, 1)} color={color} />
                            ))}
                            <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                                <p className="text-xs text-slate-500 dark:text-slate-400">Total SKUs: <span className="font-bold text-slate-900 dark:text-white">{inventory.length}</span></p>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Top clients */}
            {!loading && topClients.length > 0 && (
                <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm">
                    <h3 className="font-bold text-slate-900 dark:text-white mb-5">Top Clients by Pipeline Value</h3>
                    <div className="space-y-3">
                        {topClients.map(([client, value], i) => (
                            <div key={client} className="flex items-center gap-4">
                                <span className="text-xs font-bold text-slate-400 dark:text-slate-500 w-4">{i + 1}</span>
                                <span className="text-sm font-medium text-slate-700 dark:text-slate-300 w-40 truncate">{client}</span>
                                <div className="flex-1 bg-slate-100 dark:bg-slate-800 rounded-full h-2">
                                    <div className={`h-2 rounded-full transition-all duration-500 ${BAR_COLORS[i % BAR_COLORS.length]}`}
                                        style={{ width: `${Math.round((value / maxClientValue) * 100)}%` }} />
                                </div>
                                <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 w-20 text-right">{formatCurrency(value)}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

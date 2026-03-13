import { useEffect, useState, useCallback } from 'react';
import { FileText, Loader2, RefreshCw, Download } from 'lucide-react';
import { salesApi } from '../api/api';

const statusStyle = {
    APPROVED: 'bg-emerald-50 text-emerald-700 border-emerald-100 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20',
    REJECTED: 'bg-rose-50 text-rose-700 border-rose-100 dark:bg-rose-500/10 dark:text-rose-400 dark:border-rose-500/20',
    PENDING_APPROVAL: 'bg-amber-50 text-amber-700 border-amber-100 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20',
};

function formatCurrency(v) {
    if (!v) return '—';
    if (v >= 10000000) return `₹${(v / 10000000).toFixed(2)}Cr`;
    if (v >= 100000)   return `₹${(v / 100000).toFixed(2)}L`;
    return `₹${Number(v).toLocaleString('en-IN')}`;
}

export default function Invoices() {
    const [allQuotations, setAllQuotations] = useState([]);
    const [loading, setLoading]       = useState(true);
    const [error, setError]           = useState('');
    const [filter, setFilter]         = useState('ALL');

    const fetchData = useCallback(async () => {
        setLoading(true);
        setError('');
        try {
            const leadsData = await salesApi.getLeads();
            const fetchedLeads = leadsData.leads || [];

            if (fetchedLeads.length > 0) {
                const results = await Promise.allSettled(
                    fetchedLeads.map((l) => salesApi.getQuotationsByLead(l.id))
                );
                const merged = results.flatMap((r, i) => {
                    if (r.status !== 'fulfilled') return [];
                    return (r.value.quotations || []).map((q) => ({
                        ...q,
                        clientName: fetchedLeads[i].clientName,
                    }));
                });
                setAllQuotations(merged);
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchData(); }, [fetchData]);

    const filtered = filter === 'ALL'
        ? allQuotations
        : allQuotations.filter((q) => (q.status || 'PENDING_APPROVAL') === filter);

    const totalApproved = allQuotations
        .filter((q) => q.status === 'APPROVED')
        .reduce((s, q) => s + (q.negotiatedPrice || q.basePrice || 0), 0);

    const handlePrint = (q) => {
        const win = window.open('', '_blank');
        win.document.open();
        win.document.write(`
            <html><head><title>Invoice Q-${q.id.slice(-8).toUpperCase()}</title>
            <style>body{font-family:sans-serif;padding:40px;max-width:600px;margin:auto}
            h1{font-size:24px;margin-bottom:4px}p{color:#555;margin:2px 0}
            table{width:100%;border-collapse:collapse;margin-top:20px}
            th,td{border:1px solid #ddd;padding:10px;text-align:left}th{background:#f5f5f5}
            .total{font-size:18px;font-weight:bold;text-align:right;margin-top:16px}
            </style></head><body>
            <h1>Invoice / Quotation</h1>
            <p><strong>Client:</strong> ${q.clientName}</p>
            <p><strong>Quotation ID:</strong> ${q.id}</p>
            <p><strong>Date:</strong> ${new Date(q.createdAt || Date.now()).toLocaleDateString('en-IN')}</p>
            <table>
                <tr><th>Description</th><th>Base Price</th><th>Negotiated Price</th><th>Status</th></tr>
                <tr>
                    <td>Quotation for ${q.clientName}</td>
                    <td>₹${Number(q.basePrice).toLocaleString('en-IN')}</td>
                    <td>${q.negotiatedPrice != null ? '₹' + Number(q.negotiatedPrice).toLocaleString('en-IN') : '—'}</td>
                    <td>${q.status || 'PENDING'}</td>
                </tr>
            </table>
            <p class="total">Total: ₹${Number(q.negotiatedPrice || q.basePrice).toLocaleString('en-IN')}</p>
            </body></html>
        `);
        win.document.close();
        win.print();
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Billing &amp; Invoices</h1>
                    <p className="text-slate-500 dark:text-slate-400">View and print invoices from approved quotations.</p>
                </div>
                <button onClick={fetchData} className="flex items-center gap-2 px-4 py-2 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 rounded-xl font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 text-sm text-slate-700 dark:text-slate-300">
                    <RefreshCw className="h-4 w-4" />Refresh
                </button>
            </div>

            {error && <p className="text-sm text-rose-600 bg-rose-50 border border-rose-100 rounded-lg px-3 py-2">{error}</p>}

            {/* Summary cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm">
                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Total Quotations</p>
                    <p className="text-3xl font-bold text-slate-900 dark:text-white mt-1">{loading ? '—' : allQuotations.length}</p>
                </div>
                <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm border-l-4 border-l-emerald-500">
                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Approved Revenue</p>
                    <p className="text-3xl font-bold text-emerald-600 mt-1">{loading ? '—' : formatCurrency(totalApproved)}</p>
                </div>
                <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm border-l-4 border-l-amber-500">
                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Pending Approval</p>
                    <p className="text-3xl font-bold text-amber-600 mt-1">
                        {loading ? '—' : allQuotations.filter((q) => !q.status || q.status === 'PENDING_APPROVAL').length}
                    </p>
                </div>
            </div>

            {/* Filter + Table */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden">
                <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex flex-wrap gap-2 items-center justify-between bg-slate-50/50 dark:bg-slate-800/50">
                    <div className="flex gap-2">
                        {['ALL', 'APPROVED', 'PENDING_APPROVAL', 'REJECTED'].map((s) => (
                            <button key={s} onClick={() => setFilter(s)}
                                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${filter === s ? 'bg-indigo-600 text-white' : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700'}`}>
                                {s === 'ALL' ? 'All' : s.replace('_', ' ')}
                            </button>
                        ))}
                    </div>
                    <span className="text-xs text-slate-400 dark:text-slate-500">{filtered.length} records</span>
                </div>

                <div className="overflow-x-auto">
                    {loading ? (
                        <div className="flex items-center justify-center py-16 text-slate-400">
                            <Loader2 className="h-6 w-6 animate-spin mr-2" />Loading invoices…
                        </div>
                    ) : filtered.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-16 text-slate-400 dark:text-slate-500">
                            <FileText className="h-10 w-10 mb-2 opacity-30" />
                            <p className="text-sm">No records for this filter.</p>
                        </div>
                    ) : (
                        <table className="min-w-full text-sm text-left">
                            <thead className="bg-slate-50/50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider">
                                <tr>
                                    <th className="px-6 py-4">Invoice/Quote ID</th>
                                    <th className="px-6 py-4">Client</th>
                                    <th className="px-6 py-4">Base Price</th>
                                    <th className="px-6 py-4">Final Price</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4 text-right">Print</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                {filtered.map((q) => (
                                    <tr key={q.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                                        <td className="px-6 py-4 font-mono text-xs text-slate-500 dark:text-slate-400">
                                            INV-{q.id.slice(-8).toUpperCase()}
                                        </td>
                                        <td className="px-6 py-4 font-semibold text-slate-900 dark:text-white">{q.clientName}</td>
                                        <td className="px-6 py-4 text-slate-600 dark:text-slate-400">{formatCurrency(q.basePrice)}</td>
                                        <td className="px-6 py-4 font-semibold text-slate-900 dark:text-white">
                                            {formatCurrency(q.negotiatedPrice || q.basePrice)}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-semibold border ${statusStyle[q.status || 'PENDING_APPROVAL'] || statusStyle.PENDING_APPROVAL}`}>
                                                {q.status || 'PENDING'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button onClick={() => handlePrint(q)}
                                                className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline">
                                                <Download className="h-3.5 w-3.5" />Print
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </div>
    );
}

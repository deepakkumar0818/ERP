import { useEffect, useState, useCallback } from 'react';
import { Plus, Search, Loader2, X, RefreshCw, Copy, ChevronDown } from 'lucide-react';
import { jobOrderApi, inventoryApi } from '../api/api';

const JOB_STATUSES = ['PENDING', 'IN_PROGRESS', 'COMPLETED'];
const SO_STORE_KEY  = 'erp_sales_orders';
const JO_STORE_KEY  = 'erp_job_orders';

const statusStyle = {
    IN_PROGRESS: 'bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-100 dark:border-blue-500/20',
    COMPLETED:   'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-100 dark:border-emerald-500/20',
    PENDING:     'bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-100 dark:border-amber-500/20',
};
const progressColor = { COMPLETED: 'bg-emerald-500', IN_PROGRESS: 'bg-indigo-500', PENDING: 'bg-amber-400' };
const progressValue = { PENDING: 0, IN_PROGRESS: 50, COMPLETED: 100 };

function loadLocal(key) {
    try { return JSON.parse(localStorage.getItem(key) || '[]'); } catch { return []; }
}
function saveJO(entry) {
    const existing = loadLocal(JO_STORE_KEY);
    if (existing.some(j => j.id === entry.id)) return;
    localStorage.setItem(JO_STORE_KEY, JSON.stringify([entry, ...existing]));
}

export default function ProductionOrders() {
    const [salesOrderIdInput, setSalesOrderIdInput] = useState('');
    const [jobOrders, setJobOrders]   = useState([]);
    const [products, setProducts]     = useState([]);
    const [loading, setLoading]       = useState(false);
    const [productsLoading, setProductsLoading] = useState(true);
    const [error, setError]           = useState('');
    const [message, setMessage]       = useState('');
    const [search, setSearch]         = useState('');
    const [statusFilter, setStatusFilter] = useState('ALL');
    const [showForm, setShowForm]     = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [updatingId, setUpdatingId] = useState(null);
    const [showSODropdown, setShowSODropdown] = useState(false);

    // form fields — flat individual state (no object spread issues)
    const [formSalesOrderId, setFormSalesOrderId] = useState('');
    const [formProductId, setFormProductId]       = useState('');
    const [formQuantity, setFormQuantity]         = useState('');

    // saved Sales Orders from localStorage
    const [savedSOs] = useState(() => loadLocal(SO_STORE_KEY));

    useEffect(() => {
        inventoryApi.getAll()
            .then(d => setProducts(d.items || []))
            .catch(() => {})
            .finally(() => setProductsLoading(false));
    }, []);

    const fetchJobOrders = useCallback(async (id) => {
        if (!id.trim()) return;
        setLoading(true);
        setError('');
        try {
            const data = await jobOrderApi.getBySalesOrder(id.trim());
            setJobOrders(data.jobOrders || []);
        } catch (err) {
            setError(err.message);
            setJobOrders([]);
        } finally {
            setLoading(false);
        }
    }, []);

    const handleSearch = (e) => { e.preventDefault(); fetchJobOrders(salesOrderIdInput); };

    const handleSelectSO = (so) => {
        setSalesOrderIdInput(so.id);
        setShowSODropdown(false);
        fetchJobOrders(so.id);
    };

    const handleCreateJobOrder = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setError('');
        setMessage('');
        try {
            const res = await jobOrderApi.create(formSalesOrderId, formProductId, parseFloat(formQuantity));
            const jo = res.jobOrder || res;
            if (jo?.id) {
                const productName = products.find(p => p.id === formProductId)?.name || formProductId;
                saveJO({ id: jo.id, salesOrderId: formSalesOrderId, productName, productId: formProductId, quantity: parseFloat(formQuantity), createdAt: new Date().toISOString() });
            }
            setMessage(`Job order created! ID: ${jo?.id || '—'}`);
            setFormSalesOrderId(''); setFormProductId(''); setFormQuantity('');
            setShowForm(false);
            const targetSO = formSalesOrderId;
            if (targetSO === salesOrderIdInput) await fetchJobOrders(salesOrderIdInput);
            else { setSalesOrderIdInput(targetSO); await fetchJobOrders(targetSO); }
        } catch (err) {
            setError(err.message);
        } finally {
            setSubmitting(false);
        }
    };

    const handleStatusUpdate = async (jobOrder) => {
        const idx = JOB_STATUSES.indexOf(jobOrder.status);
        const next = JOB_STATUSES[(idx + 1) % JOB_STATUSES.length];
        setUpdatingId(jobOrder.id);
        setError('');
        try {
            await jobOrderApi.updateStatus(jobOrder.id, next);
            setJobOrders(prev => prev.map(j => j.id === jobOrder.id ? { ...j, status: next } : j));
        } catch (err) { setError(err.message); }
        finally { setUpdatingId(null); }
    };

    const filtered = jobOrders.filter(j => {
        const matchesSearch = !search || j.id.toLowerCase().includes(search.toLowerCase()) || (j.productId || '').toLowerCase().includes(search.toLowerCase());
        const matchesStatus = statusFilter === 'ALL' || j.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const counts = { ALL: jobOrders.length, ...Object.fromEntries(JOB_STATUSES.map(s => [s, jobOrders.filter(j => j.status === s).length])) };

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Production Orders</h1>
                    <p className="text-slate-500 dark:text-slate-400">Manage and track shop floor job orders.</p>
                </div>
                <button onClick={() => { setShowForm(true); setError(''); setMessage(''); }}
                    className="flex items-center justify-center gap-2 bg-indigo-600 text-white px-4 py-2.5 rounded-xl font-semibold hover:bg-indigo-700 shadow-sm">
                    <Plus className="h-5 w-5" />New Job Order
                </button>
            </div>

            {/* Feedback */}
            {error   && <p className="text-sm text-rose-600 bg-rose-50 border border-rose-100 dark:bg-rose-500/10 dark:border-rose-500/20 dark:text-rose-400 rounded-lg px-3 py-2">{error}</p>}
            {message && <p className="text-sm text-emerald-700 bg-emerald-50 border border-emerald-100 dark:bg-emerald-500/10 dark:border-emerald-500/20 dark:text-emerald-400 rounded-lg px-3 py-2">{message}</p>}

            {/* Create Job Order Form */}
            {showForm && (
                <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Create Job Order</h2>
                        <button onClick={() => setShowForm(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"><X className="h-5 w-5" /></button>
                    </div>
                    <form onSubmit={handleCreateJobOrder} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* Sales Order selector */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Sales Order ID <span className="text-rose-500">*</span></label>
                            {savedSOs.length > 0 ? (
                                <div className="space-y-1">
                                    <select value={formSalesOrderId} onChange={e => setFormSalesOrderId(e.target.value)} required
                                        className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm">
                                        <option value="">— Select Sales Order —</option>
                                        {savedSOs.map(so => (
                                            <option key={so.id} value={so.id}>{so.clientName} — {so.id.slice(-8).toUpperCase()}</option>
                                        ))}
                                    </select>
                                    <p className="text-[10px] text-slate-400 font-mono truncate">{formSalesOrderId || 'No SO selected'}</p>
                                </div>
                            ) : (
                                <input type="text" value={formSalesOrderId} onChange={e => setFormSalesOrderId(e.target.value)} required
                                    className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm font-mono"
                                    placeholder="Paste Sales Order UUID" />
                            )}
                        </div>
                        {/* Product selector */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Product <span className="text-rose-500">*</span></label>
                            <select value={formProductId} onChange={e => setFormProductId(e.target.value)} required
                                className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm">
                                <option value="">{productsLoading ? 'Loading…' : '— Select product —'}</option>
                                {products.map(p => (
                                    <option key={p.id} value={p.id}>{p.name} ({p.sku}) — {p.type}</option>
                                ))}
                            </select>
                        </div>
                        {/* Quantity */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Quantity <span className="text-rose-500">*</span></label>
                            <input type="number" min="0.01" step="0.01" value={formQuantity} onChange={e => setFormQuantity(e.target.value)} required
                                className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm"
                                placeholder="e.g. 100" />
                        </div>
                        <div className="md:col-span-3 flex justify-end">
                            <button type="submit" disabled={submitting}
                                className="inline-flex items-center gap-2 bg-indigo-600 text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-indigo-700 disabled:opacity-60">
                                {submitting ? <><Loader2 className="h-4 w-4 animate-spin" />Creating…</> : <><Plus className="h-4 w-4" />Create</>}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Lookup by Sales Order ID */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden">
                <div className="p-4 border-b border-slate-50 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50 space-y-3">
                    {/* SO search row */}
                    <div className="flex flex-col md:flex-row gap-3">
                        <form onSubmit={handleSearch} className="flex flex-1 gap-2">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                <input type="text" value={salesOrderIdInput} onChange={e => setSalesOrderIdInput(e.target.value)}
                                    placeholder="Enter or select a Sales Order ID…"
                                    className="pl-10 pr-4 py-2 w-full border border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm font-mono" />
                            </div>
                            <button type="submit" disabled={loading}
                                className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-semibold hover:bg-indigo-700 disabled:opacity-60">
                                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}Load
                            </button>
                        </form>
                        <div className="relative">
                            <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Filter results…"
                                className="pl-9 pr-4 py-2 border border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm" />
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                        </div>
                    </div>

                    {/* Known Sales Orders dropdown */}
                    {savedSOs.length > 0 && (
                        <div>
                            <button type="button" onClick={() => setShowSODropdown(v => !v)}
                                className="flex items-center gap-2 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline">
                                <ChevronDown className={`h-3.5 w-3.5 transition-transform ${showSODropdown ? 'rotate-180' : ''}`} />
                                {showSODropdown ? 'Hide' : 'Pick from'} {savedSOs.length} known Sales Order{savedSOs.length > 1 ? 's' : ''}
                            </button>
                            {showSODropdown && (
                                <div className="mt-2 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                                    {savedSOs.map(so => (
                                        <button key={so.id} type="button" onClick={() => handleSelectSO(so)}
                                            className={`text-left px-3 py-2 rounded-xl border text-xs transition-colors ${salesOrderIdInput === so.id ? 'border-indigo-400 bg-indigo-50 dark:bg-indigo-500/10 dark:border-indigo-500' : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 hover:border-indigo-300 dark:hover:border-indigo-600'}`}>
                                            <p className="font-semibold text-slate-900 dark:text-white truncate">{so.clientName}</p>
                                            <p className="font-mono text-slate-400 mt-0.5 truncate">{so.id}</p>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {/* Status filter tabs */}
                    {jobOrders.length > 0 && (
                        <div className="flex gap-2 flex-wrap">
                            {['ALL', ...JOB_STATUSES].map(s => (
                                <button key={s} onClick={() => setStatusFilter(s)}
                                    className={`px-3 py-1 rounded-lg text-xs font-semibold border transition-colors ${statusFilter === s ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:border-indigo-300'}`}>
                                    {s} ({counts[s] ?? 0})
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                <div className="overflow-x-auto">
                    {loading ? (
                        <div className="flex items-center justify-center py-16 text-slate-400"><Loader2 className="h-6 w-6 animate-spin mr-2" />Loading…</div>
                    ) : filtered.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-16 text-slate-400 dark:text-slate-500">
                            <p className="text-sm">{jobOrders.length === 0 ? 'Select a Sales Order above and click Load.' : 'No job orders match your filter.'}</p>
                        </div>
                    ) : (
                        <table className="w-full text-left">
                            <thead className="bg-slate-50/50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 text-xs font-semibold uppercase tracking-wider">
                                <tr>
                                    <th className="px-5 py-4">Job Order ID</th>
                                    <th className="px-5 py-4">Product</th>
                                    <th className="px-5 py-4">Qty</th>
                                    <th className="px-5 py-4">Status</th>
                                    <th className="px-5 py-4">Progress</th>
                                    <th className="px-5 py-4">Created</th>
                                    <th className="px-5 py-4">Copy ID</th>
                                    <th className="px-5 py-4 text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                {filtered.map((order) => {
                                    const pct = progressValue[order.status] ?? 0;
                                    const productName = products.find(p => p.id === order.productId)?.name;
                                    return (
                                        <tr key={order.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                                            <td className="px-5 py-4">
                                                <code className="text-xs font-mono text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-500/10 px-2 py-0.5 rounded">
                                                    {order.id.slice(-8).toUpperCase()}
                                                </code>
                                            </td>
                                            <td className="px-5 py-4">
                                                <p className="text-sm font-semibold text-slate-900 dark:text-white">{productName || order.productId}</p>
                                                <p className="text-xs text-slate-400 font-mono">{order.productId.slice(-8)}</p>
                                            </td>
                                            <td className="px-5 py-4 text-sm text-slate-600 dark:text-slate-400">{order.quantity?.toLocaleString()}</td>
                                            <td className="px-5 py-4">
                                                <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${statusStyle[order.status] || ''}`}>{order.status}</span>
                                            </td>
                                            <td className="px-5 py-4">
                                                <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-1.5 max-w-[80px]">
                                                    <div className={`h-1.5 rounded-full ${progressColor[order.status] || 'bg-slate-400'}`} style={{ width: `${pct}%` }} />
                                                </div>
                                                <span className="text-[10px] text-slate-400 mt-0.5 block">{pct}%</span>
                                            </td>
                                            <td className="px-5 py-4 text-sm text-slate-500 dark:text-slate-400">{new Date(order.createdAt).toLocaleDateString()}</td>
                                            <td className="px-5 py-4">
                                                <button onClick={() => navigator.clipboard.writeText(order.id)}
                                                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-indigo-100 dark:hover:bg-indigo-500/20 text-xs text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 font-semibold transition-colors">
                                                    <Copy className="h-3 w-3" />Copy
                                                </button>
                                            </td>
                                            <td className="px-5 py-4 text-right">
                                                <button onClick={() => handleStatusUpdate(order)}
                                                    disabled={updatingId === order.id || order.status === 'COMPLETED'}
                                                    className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline disabled:opacity-40 disabled:no-underline">
                                                    {updatingId === order.id ? 'Updating…' : order.status === 'COMPLETED' ? 'Done ✓' : 'Advance →'}
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    )}
                </div>

                <div className="p-4 border-t border-slate-50 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400">
                    {jobOrders.length > 0 ? `Showing ${filtered.length} of ${jobOrders.length} job orders` : 'No data loaded'}
                </div>
            </div>
        </div>
    );
}

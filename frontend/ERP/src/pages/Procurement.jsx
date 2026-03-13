import { useEffect, useState, useCallback } from 'react';
import { ShoppingBag, Plus, Loader2, X, CheckCircle2, AlertTriangle, RefreshCw } from 'lucide-react';
import { inventoryApi } from '../api/api';

const emptyForm = { itemName: '', sku: '', quantity: '', unit: '', supplier: '', notes: '' };
const PR_KEY = 'erp_purchase_requests';

function loadPRs() {
    try { return JSON.parse(localStorage.getItem(PR_KEY) || '[]'); } catch { return []; }
}
function savePRs(prs) {
    localStorage.setItem(PR_KEY, JSON.stringify(prs));
}

const prStatusStyle = {
    PENDING:  'bg-amber-50 text-amber-700 border-amber-100 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20',
    APPROVED: 'bg-emerald-50 text-emerald-700 border-emerald-100 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20',
    ORDERED:  'bg-blue-50 text-blue-700 border-blue-100 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20',
    RECEIVED: 'bg-indigo-50 text-indigo-700 border-indigo-100 dark:bg-indigo-500/10 dark:text-indigo-400 dark:border-indigo-500/20',
    REJECTED: 'bg-rose-50 text-rose-700 border-rose-100 dark:bg-rose-500/10 dark:text-rose-400 dark:border-rose-500/20',
};

export default function Procurement() {
    const [inventory, setInventory]   = useState([]);
    const [invLoading, setInvLoading] = useState(true);
    const [prs, setPrs]               = useState(loadPRs());
    const [showForm, setShowForm]     = useState(false);
    const [form, setForm]             = useState(emptyForm);
    const [submitting, setSubmitting] = useState(false);
    const [message, setMessage]       = useState('');
    const [error, setError]           = useState('');

    const fetchInventory = useCallback(async () => {
        setInvLoading(true);
        try {
            const data = await inventoryApi.getAll();
            setInventory(data.items || []);
        } catch { /* non-fatal */ }
        finally { setInvLoading(false); }
    }, []);

    useEffect(() => { fetchInventory(); }, [fetchInventory]);

    const lowStockItems = inventory.filter((i) => i.quantity <= 0);

    const handleCreatePR = (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const newPR = {
                id: `PR-${Date.now()}`,
                ...form,
                quantity: parseFloat(form.quantity),
                status: 'PENDING',
                createdAt: new Date().toISOString(),
            };
            const updated = [newPR, ...prs];
            setPrs(updated);
            savePRs(updated);
            setForm(emptyForm);
            setShowForm(false);
            setMessage('Purchase request created.');
            setError('');
        } catch (err) {
            setError(err.message);
        } finally {
            setSubmitting(false);
        }
    };

    const handleCreateFromInventory = (item) => {
        setForm((p) => ({ ...p, itemName: item.name, sku: item.sku, unit: item.unit }));
        setShowForm(true);
        setMessage('');
        setError('');
    };

    const advanceStatus = (prId) => {
        const order = ['PENDING', 'APPROVED', 'ORDERED', 'RECEIVED'];
        const updated = prs.map((p) => {
            if (p.id !== prId) return p;
            const idx = order.indexOf(p.status);
            return { ...p, status: idx < order.length - 1 ? order[idx + 1] : p.status };
        });
        setPrs(updated);
        savePRs(updated);
    };

    const rejectPR = (prId) => {
        const updated = prs.map((p) => p.id === prId ? { ...p, status: 'REJECTED' } : p);
        setPrs(updated);
        savePRs(updated);
    };

    const deletePR = (prId) => {
        const updated = prs.filter((p) => p.id !== prId);
        setPrs(updated);
        savePRs(updated);
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Procurement</h1>
                    <p className="text-slate-500 dark:text-slate-400">Manage purchase requests and restock inventory.</p>
                </div>
                <div className="flex gap-3">
                    <button onClick={fetchInventory} className="flex items-center gap-2 px-4 py-2 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 rounded-xl font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 text-sm text-slate-700 dark:text-slate-300">
                        <RefreshCw className="h-4 w-4" />Refresh
                    </button>
                    <button onClick={() => { setShowForm(true); setMessage(''); setError(''); }}
                        className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-xl font-semibold hover:bg-indigo-700 shadow-sm text-sm">
                        <Plus className="h-5 w-5" />New Request
                    </button>
                </div>
            </div>

            {error   && <div className="flex gap-2 items-start text-sm text-rose-700 bg-rose-50 border border-rose-200 rounded-xl px-4 py-3 dark:bg-rose-500/10 dark:text-rose-400 dark:border-rose-500/20"><X className="h-4 w-4 shrink-0 mt-0.5" />{error}</div>}
            {message && <div className="flex gap-2 items-start text-sm text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-3 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20"><CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5" />{message}</div>}

            {/* Create PR Form */}
            {showForm && (
                <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-semibold text-slate-900 dark:text-white">New Purchase Request</h2>
                        <button onClick={() => setShowForm(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"><X className="h-5 w-5" /></button>
                    </div>
                    <form onSubmit={handleCreatePR} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {[
                            { label: 'Item Name', key: 'itemName', placeholder: 'e.g. Steel Plate 10mm', required: true },
                            { label: 'SKU', key: 'sku', placeholder: 'e.g. SKU-001' },
                            { label: 'Quantity', key: 'quantity', type: 'number', placeholder: '0', required: true },
                            { label: 'Unit', key: 'unit', placeholder: 'e.g. kg, units, liters' },
                            { label: 'Supplier', key: 'supplier', placeholder: 'e.g. ABC Metals Ltd' },
                            { label: 'Notes', key: 'notes', placeholder: 'Additional notes…' },
                        ].map(({ label, key, type = 'text', placeholder, required }) => (
                            <div key={key}>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">{label}</label>
                                <input type={type} value={form[key]} onChange={(e) => setForm((p) => ({ ...p, [key]: e.target.value }))}
                                    className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm"
                                    placeholder={placeholder} required={required} />
                            </div>
                        ))}
                        <div className="md:col-span-3 flex justify-end">
                            <button type="submit" disabled={submitting}
                                className="inline-flex items-center gap-2 bg-indigo-600 text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-indigo-700 disabled:opacity-60">
                                {submitting ? <><Loader2 className="h-4 w-4 animate-spin" />Saving…</> : <><Plus className="h-4 w-4" />Create Request</>}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Low Stock Alert */}
                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden">
                    <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4 text-amber-500" />
                        <h3 className="font-semibold text-slate-900 dark:text-white">Out-of-Stock Items</h3>
                        <span className="ml-auto text-xs text-slate-400">{lowStockItems.length}</span>
                    </div>
                    {invLoading ? (
                        <div className="flex items-center justify-center py-10 text-slate-400"><Loader2 className="h-5 w-5 animate-spin mr-2" />Loading…</div>
                    ) : lowStockItems.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-10 text-slate-400 dark:text-slate-500">
                            <CheckCircle2 className="h-8 w-8 mb-2 opacity-40 text-emerald-500" />
                            <p className="text-sm">All items are stocked.</p>
                        </div>
                    ) : (
                        <ul className="divide-y divide-slate-100 dark:divide-slate-800">
                            {lowStockItems.map((item) => (
                                <li key={item.id} className="px-4 py-3 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/40">
                                    <div>
                                        <p className="text-sm font-semibold text-slate-900 dark:text-white">{item.name}</p>
                                        <p className="text-xs text-slate-400 font-mono">{item.sku}</p>
                                    </div>
                                    <button onClick={() => handleCreateFromInventory(item)}
                                        className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline ml-3 shrink-0">
                                        Request +
                                    </button>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                {/* Purchase Requests Table */}
                <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden">
                    <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                        <h3 className="font-semibold text-slate-900 dark:text-white">Purchase Requests</h3>
                        <span className="text-xs text-slate-400">{prs.length} total</span>
                    </div>
                    {prs.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-16 text-slate-400 dark:text-slate-500">
                            <ShoppingBag className="h-10 w-10 mb-2 opacity-30" />
                            <p className="text-sm">No purchase requests yet.</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="min-w-full text-sm text-left">
                                <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider">
                                    <tr>
                                        <th className="px-4 py-3">Item</th>
                                        <th className="px-4 py-3">Qty</th>
                                        <th className="px-4 py-3">Supplier</th>
                                        <th className="px-4 py-3">Status</th>
                                        <th className="px-4 py-3 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                    {prs.map((pr) => (
                                        <tr key={pr.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                                            <td className="px-4 py-3">
                                                <p className="font-semibold text-slate-900 dark:text-white">{pr.itemName}</p>
                                                <p className="text-xs text-slate-400 font-mono">{pr.sku || '—'}</p>
                                            </td>
                                            <td className="px-4 py-3 text-slate-600 dark:text-slate-400">{pr.quantity} {pr.unit}</td>
                                            <td className="px-4 py-3 text-slate-600 dark:text-slate-400">{pr.supplier || '—'}</td>
                                            <td className="px-4 py-3">
                                                <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-semibold border ${prStatusStyle[pr.status] || ''}`}>
                                                    {pr.status}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 text-right flex justify-end gap-2">
                                                {pr.status !== 'RECEIVED' && pr.status !== 'REJECTED' && (
                                                    <button onClick={() => advanceStatus(pr.id)}
                                                        className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline">
                                                        Advance →
                                                    </button>
                                                )}
                                                {pr.status === 'PENDING' && (
                                                    <button onClick={() => rejectPR(pr.id)}
                                                        className="text-xs font-semibold text-rose-600 dark:text-rose-400 hover:underline">
                                                        Reject
                                                    </button>
                                                )}
                                                {(pr.status === 'RECEIVED' || pr.status === 'REJECTED') && (
                                                    <button onClick={() => deletePR(pr.id)}
                                                        className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:underline">
                                                        Remove
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

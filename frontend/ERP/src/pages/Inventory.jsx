import { useEffect, useState, useCallback } from 'react';
import {
    Package,
    ArrowDownCircle,
    AlertTriangle,
    Search,
    Plus,
    Loader2,
    X,
} from 'lucide-react';
import { inventoryApi } from '../api/api';

const ITEM_TYPES = ['RAW', 'FINISHED'];

function stockStatus(item) {
    if (item.quantity <= 0) return 'Out of Stock';
    return 'In Stock';
}

const statusClasses = {
    'In Stock': 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-100 dark:border-emerald-500/20',
    'Out of Stock': 'bg-rose-50 dark:bg-rose-500/10 text-rose-700 dark:text-rose-400 border-rose-100 dark:border-rose-500/20',
};

const emptyForm = { name: '', sku: '', quantity: '', unit: '', type: 'RAW' };

export default function Inventory() {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const [search, setSearch] = useState('');
    const [typeFilter, setTypeFilter] = useState('All');
    const [showForm, setShowForm] = useState(false);
    const [form, setForm] = useState(emptyForm);
    const [submitting, setSubmitting] = useState(false);

    const fetchItems = useCallback(async () => {
        setLoading(true);
        setError('');
        try {
            const data = await inventoryApi.getAll();
            setItems(data.items || []);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchItems(); }, [fetchItems]);

    const handleAddItem = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setError('');
        setMessage('');
        try {
            await inventoryApi.create(
                form.name,
                form.sku,
                parseFloat(form.quantity) || 0,
                form.unit,
                form.type,
            );
            setMessage(`Item "${form.name}" added to inventory.`);
            setForm(emptyForm);
            setShowForm(false);
            await fetchItems();
        } catch (err) {
            setError(err.message);
        } finally {
            setSubmitting(false);
        }
    };

    const filtered = items.filter((item) => {
        const matchesSearch =
            !search ||
            item.name.toLowerCase().includes(search.toLowerCase()) ||
            item.sku.toLowerCase().includes(search.toLowerCase());
        const matchesType = typeFilter === 'All' || item.type === typeFilter;
        return matchesSearch && matchesType;
    });

    const outOfStock = items.filter((i) => i.quantity <= 0).length;
    const totalSku = items.length;

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Inventory Management</h1>
                    <p className="text-slate-500 dark:text-slate-400">Monitor stock levels and warehouse operations.</p>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={fetchItems}
                        className="flex items-center gap-2 px-4 py-2 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-xl font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-slate-700 dark:text-slate-300"
                    >
                        <ArrowDownCircle className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                        Refresh
                    </button>
                    <button
                        onClick={() => { setShowForm(true); setError(''); setMessage(''); }}
                        className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-xl font-semibold hover:bg-indigo-700 transition-all shadow-sm"
                    >
                        <Plus className="h-5 w-5" />
                        Add Item
                    </button>
                </div>
            </div>

            {/* Feedback */}
            {error && (
                <p className="text-sm text-rose-600 bg-rose-50 border border-rose-100 rounded-lg px-3 py-2">
                    {error}
                </p>
            )}
            {message && (
                <p className="text-sm text-emerald-700 bg-emerald-50 border border-emerald-100 rounded-lg px-3 py-2">
                    {message}
                </p>
            )}

            {/* Add Item Form */}
            {showForm && (
                <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-semibold text-slate-900 dark:text-white">New Inventory Item</h2>
                        <button onClick={() => setShowForm(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                            <X className="h-5 w-5" />
                        </button>
                    </div>
                    <form onSubmit={handleAddItem} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Name</label>
                            <input
                                type="text"
                                value={form.name}
                                onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                                className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm"
                                placeholder="e.g. Steel Plate 10mm"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">SKU</label>
                            <input
                                type="text"
                                value={form.sku}
                                onChange={(e) => setForm((p) => ({ ...p, sku: e.target.value }))}
                                className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm"
                                placeholder="e.g. SKU-001"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Quantity</label>
                            <input
                                type="number"
                                min="0"
                                step="0.01"
                                value={form.quantity}
                                onChange={(e) => setForm((p) => ({ ...p, quantity: e.target.value }))}
                                className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm"
                                placeholder="0"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Unit</label>
                            <input
                                type="text"
                                value={form.unit}
                                onChange={(e) => setForm((p) => ({ ...p, unit: e.target.value }))}
                                className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm"
                                placeholder="e.g. kg, units, liters"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Type</label>
                            <select
                                value={form.type}
                                onChange={(e) => setForm((p) => ({ ...p, type: e.target.value }))}
                                className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm"
                            >
                                {ITEM_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                            </select>
                        </div>
                        <div className="flex items-end">
                            <button
                                type="submit"
                                disabled={submitting}
                                className="w-full inline-flex items-center justify-center gap-2 bg-indigo-600 text-white px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-indigo-700 disabled:opacity-60"
                            >
                                {submitting ? <><Loader2 className="h-4 w-4 animate-spin" /> Saving…</> : <><Plus className="h-4 w-4" /> Add Item</>}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm">
                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Total SKU Items</p>
                    <p className="text-3xl font-bold text-slate-900 dark:text-white mt-1">
                        {loading ? '—' : totalSku.toLocaleString()}
                    </p>
                </div>
                <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm border-l-4 border-l-amber-500">
                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Raw Materials</p>
                    <p className="text-3xl font-bold text-amber-600 mt-1">
                        {loading ? '—' : items.filter((i) => i.type === 'RAW').length}
                    </p>
                </div>
                <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm border-l-4 border-l-rose-500">
                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Out of Stock</p>
                    <p className="text-3xl font-bold text-rose-600 mt-1">
                        {loading ? '—' : outOfStock}
                    </p>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden">
                <div className="p-4 border-b border-slate-50 dark:border-slate-800 flex flex-col md:flex-row gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search by name or SKU…"
                            className="pl-10 pr-4 py-2 w-full border border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white rounded-lg focus:ring-2 focus:ring-indigo-500 transition-all text-sm"
                        />
                    </div>
                    <div className="flex gap-2">
                        <select
                            value={typeFilter}
                            onChange={(e) => setTypeFilter(e.target.value)}
                            className="px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg text-sm bg-slate-50 dark:bg-slate-800 dark:text-slate-300"
                        >
                            <option value="All">All Types</option>
                            <option value="RAW">Raw Material</option>
                            <option value="FINISHED">Finished Good</option>
                        </select>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    {loading ? (
                        <div className="flex items-center justify-center py-16 text-slate-400">
                            <Loader2 className="h-6 w-6 animate-spin mr-2" />
                            Loading inventory…
                        </div>
                    ) : filtered.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-16 text-slate-400 dark:text-slate-500">
                            <Package className="h-10 w-10 mb-2 opacity-40" />
                            <p className="text-sm">
                                {items.length === 0 ? 'No inventory items yet. Add your first item above.' : 'No items match your search.'}
                            </p>
                        </div>
                    ) : (
                        <table className="w-full text-left">
                            <thead className="bg-slate-50/50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 text-xs font-semibold uppercase tracking-wider">
                                <tr>
                                    <th className="px-6 py-4">Item Name</th>
                                    <th className="px-6 py-4">SKU</th>
                                    <th className="px-6 py-4">Type</th>
                                    <th className="px-6 py-4">Quantity</th>
                                    <th className="px-6 py-4">Unit</th>
                                    <th className="px-6 py-4">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                {filtered.map((item) => {
                                    const status = stockStatus(item);
                                    return (
                                        <tr key={item.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="font-semibold text-slate-900 dark:text-white">{item.name}</div>
                                            </td>
                                            <td className="px-6 py-4 font-mono text-xs text-slate-400">{item.sku}</td>
                                            <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">
                                                <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${item.type === 'FINISHED' ? 'bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 border-indigo-100 dark:border-indigo-500/20' : 'bg-slate-50 dark:bg-slate-700 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-600'}`}>
                                                    {item.type}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="font-bold text-slate-900 dark:text-white">{item.quantity}</span>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-slate-500 dark:text-slate-400">{item.unit}</td>
                                            <td className="px-6 py-4">
                                                <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${statusClasses[status]}`}>
                                                    {status}
                                                </span>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    )}
                </div>

                <div className="p-4 border-t border-slate-50 dark:border-slate-800 text-sm text-slate-500 dark:text-slate-400">
                    Showing {filtered.length} of {items.length} items
                </div>
            </div>
        </div>
    );
}

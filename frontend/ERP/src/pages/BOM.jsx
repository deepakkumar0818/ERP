import { useEffect, useState, useCallback } from 'react';
import { Layers, Plus, Search, Loader2, X } from 'lucide-react';
import { productionApi, inventoryApi } from '../api/api';

const emptyForm = { finishedProductId: '', materialId: '', quantityRequired: '' };

export default function BOM() {
    const [products, setProducts]               = useState([]);
    const [productsLoading, setProductsLoading] = useState(true);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [bom, setBom]                         = useState([]);
    const [bomLoading, setBomLoading]           = useState(false);
    const [search, setSearch]                   = useState('');
    const [showForm, setShowForm]               = useState(false);
    const [form, setForm]                       = useState(emptyForm);
    const [submitting, setSubmitting]           = useState(false);
    const [error, setError]                     = useState('');
    const [message, setMessage]                 = useState('');

    useEffect(() => {
        inventoryApi.getAll()
            .then((d) => setProducts(d.items || []))
            .catch((err) => setError(err.message))
            .finally(() => setProductsLoading(false));
    }, []);

    const fetchBOM = useCallback(async (productId) => {
        setBomLoading(true);
        setError('');
        try {
            const data = await productionApi.getBOMByProduct(productId);
            setBom(data.bom || []);
        } catch (err) {
            setError(err.message);
            setBom([]);
        } finally {
            setBomLoading(false);
        }
    }, []);

    const handleSelectProduct = (product) => {
        setSelectedProduct(product);
        setError('');
        setMessage('');
        fetchBOM(product.id);
    };

    const handleAddBOM = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setError('');
        setMessage('');
        try {
            await productionApi.addBOM(
                form.finishedProductId,
                form.materialId,
                parseFloat(form.quantityRequired),
            );
            setMessage('BOM entry added successfully.');
            setForm(emptyForm);
            setShowForm(false);
            if (selectedProduct?.id === form.finishedProductId) {
                await fetchBOM(form.finishedProductId);
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setSubmitting(false);
        }
    };

    const finishedProducts = products.filter((p) => p.type === 'FINISHED');
    const rawMaterials     = products.filter((p) => p.type === 'RAW');

    const filteredProducts = finishedProducts.filter(
        (p) =>
            !search ||
            p.name.toLowerCase().includes(search.toLowerCase()) ||
            p.sku.toLowerCase().includes(search.toLowerCase())
    );

    const getMaterialName = (materialId) =>
        products.find((p) => p.id === materialId)?.name || materialId.slice(-8);

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Bill of Materials (BOM)</h1>
                    <p className="text-slate-500 dark:text-slate-400">Define product structures and material requirements.</p>
                </div>
                <button
                    onClick={() => { setShowForm(true); setError(''); setMessage(''); }}
                    className="bg-indigo-600 text-white px-4 py-2 rounded-xl font-semibold hover:bg-indigo-700 transition-all shadow-sm flex items-center gap-2"
                >
                    <Plus className="h-5 w-5" />
                    Add BOM Entry
                </button>
            </div>

            {/* Feedback */}
            {error && (
                <p className="text-sm text-rose-600 bg-rose-50 border border-rose-100 rounded-lg px-3 py-2">{error}</p>
            )}
            {message && (
                <p className="text-sm text-emerald-700 bg-emerald-50 border border-emerald-100 rounded-lg px-3 py-2">{message}</p>
            )}

            {/* Add BOM Form */}
            {showForm && (
                <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-semibold text-slate-900 dark:text-white">New BOM Entry</h2>
                        <button onClick={() => setShowForm(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                            <X className="h-5 w-5" />
                        </button>
                    </div>
                    <form onSubmit={handleAddBOM} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Finished Product</label>
                            <select
                                value={form.finishedProductId}
                                onChange={(e) => setForm((p) => ({ ...p, finishedProductId: e.target.value }))}
                                className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm"
                                required
                            >
                                <option value="">{productsLoading ? 'Loading…' : '— Select finished product —'}</option>
                                {finishedProducts.map((p) => (
                                    <option key={p.id} value={p.id}>{p.name} ({p.sku})</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Raw Material</label>
                            <select
                                value={form.materialId}
                                onChange={(e) => setForm((p) => ({ ...p, materialId: e.target.value }))}
                                className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm"
                                required
                            >
                                <option value="">{productsLoading ? 'Loading…' : '— Select raw material —'}</option>
                                {rawMaterials.map((p) => (
                                    <option key={p.id} value={p.id}>{p.name} ({p.sku})</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Quantity Required</label>
                            <input
                                type="number"
                                min="0.001"
                                step="0.001"
                                value={form.quantityRequired}
                                onChange={(e) => setForm((p) => ({ ...p, quantityRequired: e.target.value }))}
                                className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm"
                                placeholder="e.g. 2.5"
                                required
                            />
                        </div>
                        <div className="md:col-span-3 flex justify-end">
                            <button
                                type="submit"
                                disabled={submitting}
                                className="inline-flex items-center gap-2 bg-indigo-600 text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-indigo-700 disabled:opacity-60"
                            >
                                {submitting
                                    ? <><Loader2 className="h-4 w-4 animate-spin" /> Saving…</>
                                    : <><Plus className="h-4 w-4" /> Add Entry</>}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Product list + BOM details side by side */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Finished products list */}
                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden">
                    <div className="p-4 border-b border-slate-50 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50 flex items-center justify-between">
                        <h3 className="font-semibold text-slate-900 dark:text-white">Finished Products</h3>
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search…"
                                className="pl-9 pr-3 py-1.5 border border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white rounded-lg text-sm focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>
                    </div>
                    {productsLoading ? (
                        <div className="flex items-center justify-center py-12 text-slate-400">
                            <Loader2 className="h-5 w-5 animate-spin mr-2" /> Loading…
                        </div>
                    ) : filteredProducts.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-12 text-slate-400 dark:text-slate-500">
                            <Layers className="h-8 w-8 mb-2 opacity-30" />
                            <p className="text-xs text-center px-4">
                                {finishedProducts.length === 0
                                    ? 'No finished products in inventory. Add items with type FINISHED.'
                                    : 'No matches found.'}
                            </p>
                        </div>
                    ) : (
                        <ul className="divide-y divide-slate-50 dark:divide-slate-800">
                            {filteredProducts.map((p) => (
                                <li key={p.id}>
                                    <button
                                        onClick={() => handleSelectProduct(p)}
                                        className={`w-full text-left px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors ${selectedProduct?.id === p.id ? 'bg-indigo-50 dark:bg-indigo-500/10 border-l-2 border-l-indigo-500' : ''}`}
                                    >
                                        <p className="text-sm font-semibold text-slate-900 dark:text-white">{p.name}</p>
                                        <p className="text-xs text-slate-400 font-mono">{p.sku}</p>
                                    </button>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                {/* BOM details */}
                <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden">
                    <div className="p-4 border-b border-slate-50 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50">
                        <h3 className="font-semibold text-slate-900 dark:text-white">
                            {selectedProduct ? `BOM — ${selectedProduct.name}` : 'BOM Details'}
                        </h3>
                        {selectedProduct && (
                            <p className="text-xs text-slate-400 font-mono mt-0.5">{selectedProduct.sku}</p>
                        )}
                    </div>

                    {!selectedProduct ? (
                        <div className="flex flex-col items-center justify-center py-20 text-slate-400 dark:text-slate-500">
                            <Layers className="h-12 w-12 mb-4 opacity-20" />
                            <p className="text-sm">Select a finished product to view its BOM structure.</p>
                        </div>
                    ) : bomLoading ? (
                        <div className="flex items-center justify-center py-16 text-slate-400">
                            <Loader2 className="h-6 w-6 animate-spin mr-2" /> Loading BOM…
                        </div>
                    ) : bom.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-16 text-slate-400 dark:text-slate-500">
                            <Layers className="h-8 w-8 mb-2 opacity-30" />
                            <p className="text-sm">No BOM entries for this product yet.</p>
                            <p className="text-xs mt-1">Use "Add BOM Entry" above to define material requirements.</p>
                        </div>
                    ) : (
                        <table className="w-full text-left">
                            <thead className="bg-slate-50/50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 text-xs font-semibold uppercase tracking-wider">
                                <tr>
                                    <th className="px-6 py-4">Raw Material</th>
                                    <th className="px-6 py-4">SKU</th>
                                    <th className="px-6 py-4">Qty Required</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                {bom.map((entry) => {
                                    const mat = products.find((p) => p.id === entry.materialId);
                                    return (
                                        <tr key={entry.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                                            <td className="px-6 py-4 font-semibold text-slate-900 dark:text-white">
                                                {getMaterialName(entry.materialId)}
                                            </td>
                                            <td className="px-6 py-4 text-xs font-mono text-slate-400">
                                                {mat?.sku || entry.materialId.slice(-8)}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">
                                                {entry.quantityRequired} {mat?.unit || ''}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </div>
    );
}

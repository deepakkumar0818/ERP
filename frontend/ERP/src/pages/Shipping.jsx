import { useState, useCallback } from 'react';
import { Truck, Plus, Search, Loader2, X, RefreshCw, Copy, ChevronDown } from 'lucide-react';
import { shippingApi } from '../api/api';

const SO_STORE_KEY = 'erp_sales_orders';

const statusStyle = {
    IN_TRANSIT: 'bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-100 dark:border-blue-500/20',
    DELIVERED:  'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-100 dark:border-emerald-500/20',
    CANCELLED:  'bg-rose-50 dark:bg-rose-500/10 text-rose-700 dark:text-rose-400 border-rose-100 dark:border-rose-500/20',
};

const SHIP_STATUSES = ['IN_TRANSIT', 'DELIVERED', 'CANCELLED'];

function loadLocal(key) {
    try { return JSON.parse(localStorage.getItem(key) || '[]'); } catch { return []; }
}

export default function Shipping() {
    const [salesOrderIdInput, setSalesOrderIdInput] = useState('');
    const [shipments, setShipments]     = useState([]);
    const [loading, setLoading]         = useState(false);
    const [error, setError]             = useState('');
    const [message, setMessage]         = useState('');
    const [showForm, setShowForm]       = useState(false);
    const [submitting, setSubmitting]   = useState(false);
    const [updatingId, setUpdatingId]   = useState(null);
    const [statusFilter, setStatusFilter] = useState('ALL');
    const [showSODropdown, setShowSODropdown] = useState(false);

    // form fields — flat individual state
    const [formSalesOrderId, setFormSalesOrderId] = useState('');
    const [formCarrier, setFormCarrier]           = useState('');
    const [formTrackingNo, setFormTrackingNo]     = useState('');

    const [savedSOs] = useState(() => loadLocal(SO_STORE_KEY));

    const fetchShipments = useCallback(async (id) => {
        if (!id.trim()) return;
        setLoading(true);
        setError('');
        try {
            const data = await shippingApi.getBySalesOrder(id.trim());
            setShipments(data.shippings || []);
        } catch (err) {
            setError(err.message);
            setShipments([]);
        } finally {
            setLoading(false);
        }
    }, []);

    const handleSearch = (e) => { e.preventDefault(); fetchShipments(salesOrderIdInput); };

    const handleSelectSO = (so) => {
        setSalesOrderIdInput(so.id);
        setShowSODropdown(false);
        fetchShipments(so.id);
    };

    const handleCreateShipment = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setError('');
        setMessage('');
        try {
            await shippingApi.create(formSalesOrderId, formCarrier, formTrackingNo || undefined);
            setMessage('Shipment created successfully.');
            const targetId = formSalesOrderId;
            setFormSalesOrderId(''); setFormCarrier(''); setFormTrackingNo('');
            setShowForm(false);
            setSalesOrderIdInput(targetId);
            await fetchShipments(targetId);
        } catch (err) {
            setError(err.message);
        } finally {
            setSubmitting(false);
        }
    };

    const handleStatusUpdate = async (shipment, newStatus) => {
        setUpdatingId(shipment.id);
        setError('');
        try {
            await shippingApi.updateStatus(shipment.id, newStatus);
            setShipments(prev => prev.map(s => s.id === shipment.id ? { ...s, status: newStatus } : s));
            setMessage(`Status updated to ${newStatus}.`);
        } catch (err) { setError(err.message); }
        finally { setUpdatingId(null); }
    };

    const handleMarkDelivered = async (shipment) => {
        setUpdatingId(shipment.id);
        setError('');
        try {
            await shippingApi.markDelivery(shipment.id);
            await shippingApi.updateStatus(shipment.id, 'DELIVERED');
            setShipments(prev => prev.map(s => s.id === shipment.id ? { ...s, status: 'DELIVERED' } : s));
            setMessage('Delivery confirmed.');
        } catch (err) { setError(err.message); }
        finally { setUpdatingId(null); }
    };

    const filtered = statusFilter === 'ALL' ? shipments : shipments.filter(s => s.status === statusFilter);
    const counts = { ALL: shipments.length, ...Object.fromEntries(SHIP_STATUSES.map(s => [s, shipments.filter(sh => sh.status === s).length])) };

    const inputCls = 'w-full px-3 py-2 border border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm';

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Shipping &amp; Logistics</h1>
                    <p className="text-slate-500 dark:text-slate-400">Manage dispatch, tracking, and delivery.</p>
                </div>
                <button onClick={() => { setShowForm(true); setError(''); setMessage(''); }}
                    className="bg-indigo-600 text-white px-4 py-2 rounded-xl font-semibold hover:bg-indigo-700 flex items-center gap-2 shadow-sm">
                    <Plus className="h-5 w-5" />New Shipment
                </button>
            </div>

            {/* Feedback */}
            {error   && <p className="text-sm text-rose-600 bg-rose-50 border border-rose-100 dark:bg-rose-500/10 dark:border-rose-500/20 dark:text-rose-400 rounded-lg px-3 py-2">{error}</p>}
            {message && <p className="text-sm text-emerald-700 bg-emerald-50 border border-emerald-100 dark:bg-emerald-500/10 dark:border-emerald-500/20 dark:text-emerald-400 rounded-lg px-3 py-2">{message}</p>}

            {/* Create Shipment Form */}
            {showForm && (
                <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-semibold text-slate-900 dark:text-white">New Shipment</h2>
                        <button onClick={() => setShowForm(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"><X className="h-5 w-5" /></button>
                    </div>
                    <form onSubmit={handleCreateShipment} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* Sales Order selector */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Sales Order ID <span className="text-rose-500">*</span></label>
                            {savedSOs.length > 0 ? (
                                <div className="space-y-1">
                                    <select value={formSalesOrderId} onChange={e => setFormSalesOrderId(e.target.value)} required className={inputCls}>
                                        <option value="">— Select Sales Order —</option>
                                        {savedSOs.map(so => (
                                            <option key={so.id} value={so.id}>{so.clientName} — {so.id.slice(-8).toUpperCase()}</option>
                                        ))}
                                    </select>
                                    <p className="text-[10px] text-slate-400 font-mono truncate">{formSalesOrderId || 'No SO selected'}</p>
                                </div>
                            ) : (
                                <input type="text" value={formSalesOrderId} onChange={e => setFormSalesOrderId(e.target.value)} required
                                    className={inputCls + ' font-mono'} placeholder="Paste Sales Order UUID" />
                            )}
                        </div>
                        {/* Carrier */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Carrier <span className="text-rose-500">*</span></label>
                            <input type="text" value={formCarrier} onChange={e => setFormCarrier(e.target.value)} required
                                className={inputCls} placeholder="e.g. FedEx, DHL, DTDC" />
                        </div>
                        {/* Tracking No */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Tracking No. (optional)</label>
                            <input type="text" value={formTrackingNo} onChange={e => setFormTrackingNo(e.target.value)}
                                className={inputCls} placeholder="e.g. 1Z999AA10123456784" />
                        </div>
                        <div className="md:col-span-3 flex justify-end">
                            <button type="submit" disabled={submitting}
                                className="inline-flex items-center gap-2 bg-indigo-600 text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-indigo-700 disabled:opacity-60">
                                {submitting ? <><Loader2 className="h-4 w-4 animate-spin" />Creating…</> : <><Truck className="h-4 w-4" />Create Shipment</>}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Lookup + table */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden">
                <div className="p-4 border-b border-slate-50 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50 space-y-3">
                    {/* Search row */}
                    <form onSubmit={handleSearch} className="flex gap-2">
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
                                            className={`text-left px-3 py-2 rounded-xl border text-xs transition-colors ${salesOrderIdInput === so.id ? 'border-indigo-400 bg-indigo-50 dark:bg-indigo-500/10 dark:border-indigo-500' : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 hover:border-indigo-300'}`}>
                                            <p className="font-semibold text-slate-900 dark:text-white truncate">{so.clientName}</p>
                                            <p className="font-mono text-slate-400 mt-0.5 truncate">{so.id}</p>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {/* Status filter */}
                    {shipments.length > 0 && (
                        <div className="flex gap-2 flex-wrap">
                            {['ALL', ...SHIP_STATUSES].map(s => (
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
                            <Truck className="h-12 w-12 mb-4 opacity-20" />
                            <p className="text-sm">{shipments.length === 0 ? 'Select a Sales Order above to view its shipments.' : 'No shipments match this filter.'}</p>
                        </div>
                    ) : (
                        <table className="w-full text-left">
                            <thead className="bg-slate-50/50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 text-xs font-semibold uppercase tracking-wider">
                                <tr>
                                    <th className="px-6 py-4">Shipment ID</th>
                                    <th className="px-6 py-4">Carrier</th>
                                    <th className="px-6 py-4">Tracking No.</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4">Copy ID</th>
                                    <th className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                {filtered.map((s) => (
                                    <tr key={s.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                                        <td className="px-6 py-4">
                                            <code className="text-xs font-mono text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">
                                                {s.id.slice(-8).toUpperCase()}
                                            </code>
                                        </td>
                                        <td className="px-6 py-4 font-semibold text-slate-900 dark:text-white">{s.carrier}</td>
                                        <td className="px-6 py-4 text-sm text-slate-500 dark:text-slate-400 font-mono">
                                            {s.trackingNo || <span className="text-slate-300 dark:text-slate-600">—</span>}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${statusStyle[s.status] || ''}`}>{s.status}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <button onClick={() => navigator.clipboard.writeText(s.id)}
                                                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-indigo-100 dark:hover:bg-indigo-500/20 text-xs text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 font-semibold transition-colors">
                                                <Copy className="h-3 w-3" />Copy
                                            </button>
                                        </td>
                                        <td className="px-6 py-4 text-right flex justify-end gap-2 flex-wrap">
                                            {s.status === 'IN_TRANSIT' && (
                                                <>
                                                    <button onClick={() => handleMarkDelivered(s)} disabled={updatingId === s.id}
                                                        className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline disabled:opacity-40">
                                                        {updatingId === s.id ? 'Updating…' : 'Mark Delivered'}
                                                    </button>
                                                    <button onClick={() => handleStatusUpdate(s, 'CANCELLED')} disabled={updatingId === s.id}
                                                        className="text-xs font-semibold text-rose-600 dark:text-rose-400 hover:underline disabled:opacity-40">
                                                        Cancel
                                                    </button>
                                                </>
                                            )}
                                            {s.status === 'DELIVERED' && <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">Delivered ✓</span>}
                                            {s.status === 'CANCELLED' && <span className="text-xs text-rose-500 dark:text-rose-400 font-medium">Cancelled</span>}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>

                <div className="p-4 border-t border-slate-50 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400">
                    {shipments.length > 0 ? `${filtered.length} of ${shipments.length} shipment(s) shown` : 'No data loaded'}
                </div>
            </div>
        </div>
    );
}

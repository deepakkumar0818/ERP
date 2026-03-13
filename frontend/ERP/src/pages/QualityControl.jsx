import { useState, useCallback, useEffect } from 'react';
import { ShieldCheck, Plus, Search, Loader2, X, RefreshCw, Copy, ChevronDown } from 'lucide-react';
import { qualityCheckApi, jobOrderApi, inventoryApi } from '../api/api';

const QC_STATUSES = ['PASSED', 'FAILED', 'PENDING'];

const statusStyle = {
    PASSED:  'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-100 dark:border-emerald-500/20',
    FAILED:  'bg-rose-50 dark:bg-rose-500/10 text-rose-700 dark:text-rose-400 border-rose-100 dark:border-rose-500/20',
    PENDING: 'bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-100 dark:border-amber-500/20',
};

export default function QualityControl() {
    const [jobOrderIdInput, setJobOrderIdInput] = useState('');
    const [checks, setChecks]           = useState([]);
    const [loading, setLoading]         = useState(false);
    const [error, setError]             = useState('');
    const [message, setMessage]         = useState('');
    const [showForm, setShowForm]       = useState(false);
    const [submitting, setSubmitting]   = useState(false);
    const [statusFilter, setStatusFilter] = useState('ALL');
    const [showJODropdown, setShowJODropdown] = useState(false);

    // form fields — flat individual state
    const [formJobOrderId, setFormJobOrderId] = useState('');
    const [formStatus, setFormStatus]         = useState('PENDING');
    const [formRemarks, setFormRemarks]       = useState('');

    const [savedJOs, setSavedJOs] = useState([]);
    const [josLoading, setJosLoading] = useState(true);
    const [products, setProducts] = useState([]);

    useEffect(() => {
        jobOrderApi.getAll()
            .then(d => setSavedJOs(d.jobOrders || []))
            .catch(() => {})
            .finally(() => setJosLoading(false));
        inventoryApi.getAll()
            .then(d => setProducts(d.items || []))
            .catch(() => {});
    }, []);

    const fetchChecks = useCallback(async (id) => {
        if (!id.trim()) return;
        setLoading(true);
        setError('');
        try {
            const data = await qualityCheckApi.getByJobOrder(id.trim());
            setChecks(data.qualityChecks || []);
        } catch (err) {
            setError(err.message);
            setChecks([]);
        } finally {
            setLoading(false);
        }
    }, []);

    const handleSearch = (e) => { e.preventDefault(); fetchChecks(jobOrderIdInput); };

    const handleSelectJO = (jo) => {
        setJobOrderIdInput(jo.id);
        setShowJODropdown(false);
        fetchChecks(jo.id);
    };

    const handleAddCheck = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setError('');
        setMessage('');
        try {
            await qualityCheckApi.add(formJobOrderId, formStatus, formRemarks || undefined);
            setMessage('Quality check logged successfully.');
            setFormJobOrderId(''); setFormStatus('PENDING'); setFormRemarks('');
            setShowForm(false);
            const target = formJobOrderId;
            if (target === jobOrderIdInput) await fetchChecks(jobOrderIdInput);
            else { setJobOrderIdInput(target); await fetchChecks(target); }
        } catch (err) {
            setError(err.message);
        } finally {
            setSubmitting(false);
        }
    };

    const passed   = checks.filter(c => c.status === 'PASSED').length;
    const failed   = checks.filter(c => c.status === 'FAILED').length;
    const total    = checks.length;
    const passRate = total > 0 ? Math.round((passed / total) * 100) : null;

    const filteredChecks = statusFilter === 'ALL' ? checks : checks.filter(c => c.status === statusFilter);
    const counts = { ALL: total, ...Object.fromEntries(QC_STATUSES.map(s => [s, checks.filter(c => c.status === s).length])) };

    const inputCls = 'w-full px-3 py-2 border border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm';

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Quality Control</h1>
                    <p className="text-slate-500 dark:text-slate-400">Inspection reports and quality standards management.</p>
                </div>
                <button onClick={() => { setShowForm(true); setError(''); setMessage(''); }}
                    className="bg-indigo-600 text-white px-4 py-2 rounded-xl font-semibold hover:bg-indigo-700 shadow-sm flex items-center gap-2">
                    <Plus className="h-5 w-5" />Log Inspection
                </button>
            </div>

            {/* Feedback */}
            {error   && <p className="text-sm text-rose-600 bg-rose-50 border border-rose-100 dark:bg-rose-500/10 dark:border-rose-500/20 dark:text-rose-400 rounded-lg px-3 py-2">{error}</p>}
            {message && <p className="text-sm text-emerald-700 bg-emerald-50 border border-emerald-100 dark:bg-emerald-500/10 dark:border-emerald-500/20 dark:text-emerald-400 rounded-lg px-3 py-2">{message}</p>}

            {/* Log Inspection Form */}
            {showForm && (
                <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Log Quality Check</h2>
                        <button onClick={() => setShowForm(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"><X className="h-5 w-5" /></button>
                    </div>
                    <form onSubmit={handleAddCheck} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* Job Order selector */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Job Order <span className="text-rose-500">*</span></label>
                            <select value={formJobOrderId} onChange={e => setFormJobOrderId(e.target.value)} required className={inputCls}>
                                <option value="">{josLoading ? 'Loading…' : savedJOs.length === 0 ? 'No job orders found' : '— Select Job Order —'}</option>
                                {savedJOs.map(jo => {
                                    const productName = products.find(p => p.id === jo.productId)?.name || jo.productId?.slice(-8);
                                    return (
                                        <option key={jo.id} value={jo.id}>
                                            {productName} — {jo.id.slice(-8).toUpperCase()}
                                        </option>
                                    );
                                })}
                            </select>
                        </div>
                        {/* Result */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Result</label>
                            <select value={formStatus} onChange={e => setFormStatus(e.target.value)} className={inputCls}>
                                {QC_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                            </select>
                        </div>
                        {/* Remarks */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Remarks (optional)</label>
                            <input type="text" value={formRemarks} onChange={e => setFormRemarks(e.target.value)}
                                className={inputCls} placeholder="e.g. Minor surface defects" />
                        </div>
                        <div className="md:col-span-3 flex justify-end">
                            <button type="submit" disabled={submitting}
                                className="inline-flex items-center gap-2 bg-indigo-600 text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-indigo-700 disabled:opacity-60">
                                {submitting ? <><Loader2 className="h-4 w-4 animate-spin" />Saving…</> : <><Plus className="h-4 w-4" />Log Check</>}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm">
                    <h3 className="font-bold text-slate-900 dark:text-white mb-4">Inspection Pass Rate</h3>
                    {passRate === null ? (
                        <p className="text-slate-400 text-sm">Load a job order below to see stats.</p>
                    ) : (
                        <>
                            <div className="flex items-end gap-3 mb-3">
                                <span className="text-4xl font-extrabold text-emerald-600">{passRate}%</span>
                                <span className="text-sm text-slate-400 mb-1">{passed} passed · {failed} failed · {total} total</span>
                            </div>
                            <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                                <div className="bg-emerald-500 h-2 rounded-full transition-all" style={{ width: `${passRate}%` }} />
                            </div>
                            <div className="flex gap-4 mt-3">
                                {QC_STATUSES.map(s => (
                                    <div key={s} className="text-center">
                                        <p className="text-xs text-slate-400">{s}</p>
                                        <p className={`font-bold text-sm ${s === 'PASSED' ? 'text-emerald-600' : s === 'FAILED' ? 'text-rose-600' : 'text-amber-600'}`}>
                                            {counts[s]}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </>
                    )}
                </div>
                <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col items-center justify-center">
                    <ShieldCheck className="h-10 w-10 text-indigo-500 mb-3" />
                    <p className="font-medium text-slate-700 dark:text-slate-300 text-center">
                        {total === 0 ? 'No checks loaded yet'
                            : failed === 0 ? 'All inspections passed ✓'
                            : `${failed} inspection${failed > 1 ? 's' : ''} failed — review required`}
                    </p>
                    {jobOrderIdInput && (
                        <div className="mt-3 flex items-center gap-2">
                            <code className="text-xs font-mono text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">{jobOrderIdInput.slice(-12).toUpperCase()}</code>
                            <button onClick={() => navigator.clipboard.writeText(jobOrderIdInput)}
                                className="text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400">
                                <Copy className="h-3.5 w-3.5" />
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Lookup + table */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden">
                <div className="p-4 border-b border-slate-50 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50 space-y-3">
                    {/* Search row */}
                    <form onSubmit={handleSearch} className="flex gap-2">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                            <input type="text" value={jobOrderIdInput} onChange={e => setJobOrderIdInput(e.target.value)}
                                placeholder="Enter or select a Job Order ID…"
                                className="pl-10 pr-4 py-2 w-full border border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm font-mono" />
                        </div>
                        <button type="submit" disabled={loading}
                            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-semibold hover:bg-indigo-700 disabled:opacity-60">
                            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}Load
                        </button>
                    </form>

                    {/* Job Orders quick-pick */}
                    {savedJOs.length > 0 && (
                        <div>
                            <button type="button" onClick={() => setShowJODropdown(v => !v)}
                                className="flex items-center gap-2 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline">
                                <ChevronDown className={`h-3.5 w-3.5 transition-transform ${showJODropdown ? 'rotate-180' : ''}`} />
                                {showJODropdown ? 'Hide' : 'Pick from'} {savedJOs.length} Job Order{savedJOs.length > 1 ? 's' : ''}
                            </button>
                            {showJODropdown && (
                                <div className="mt-2 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                                    {savedJOs.map(jo => {
                                        const productName = products.find(p => p.id === jo.productId)?.name || jo.productId?.slice(-8);
                                        return (
                                            <button key={jo.id} type="button" onClick={() => handleSelectJO(jo)}
                                                className={`text-left px-3 py-2 rounded-xl border text-xs transition-colors ${jobOrderIdInput === jo.id ? 'border-indigo-400 bg-indigo-50 dark:bg-indigo-500/10 dark:border-indigo-500' : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 hover:border-indigo-300'}`}>
                                                <p className="font-semibold text-slate-900 dark:text-white truncate">{productName}</p>
                                                <p className="font-mono text-slate-400 mt-0.5 truncate">{jo.id}</p>
                                            </button>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    )}

                    {/* Status filter */}
                    {checks.length > 0 && (
                        <div className="flex gap-2 flex-wrap">
                            {['ALL', ...QC_STATUSES].map(s => (
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
                    ) : filteredChecks.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-16 text-slate-400 dark:text-slate-500">
                            <ShieldCheck className="h-10 w-10 mb-2 opacity-30" />
                            <p className="text-sm">{checks.length === 0 ? 'Select a Job Order above to view quality checks.' : 'No checks match this filter.'}</p>
                        </div>
                    ) : (
                        <table className="w-full text-left">
                            <thead className="bg-slate-50/50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 text-xs font-semibold uppercase tracking-wider">
                                <tr>
                                    <th className="px-6 py-4">Check ID</th>
                                    <th className="px-6 py-4">Result</th>
                                    <th className="px-6 py-4">Remarks</th>
                                    <th className="px-6 py-4">Date</th>
                                    <th className="px-6 py-4">Copy ID</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                {filteredChecks.map((c) => (
                                    <tr key={c.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                                        <td className="px-6 py-4">
                                            <code className="text-xs font-mono text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">
                                                {c.id.slice(-8).toUpperCase()}
                                            </code>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${statusStyle[c.status] || ''}`}>{c.status}</span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">{c.remarks || <span className="text-slate-300 dark:text-slate-600">—</span>}</td>
                                        <td className="px-6 py-4 text-sm text-slate-500 dark:text-slate-400">{new Date(c.createdAt || Date.now()).toLocaleDateString()}</td>
                                        <td className="px-6 py-4">
                                            <button onClick={() => navigator.clipboard.writeText(c.id)}
                                                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-indigo-100 dark:hover:bg-indigo-500/20 text-xs text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 font-semibold transition-colors">
                                                <Copy className="h-3 w-3" />Copy
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

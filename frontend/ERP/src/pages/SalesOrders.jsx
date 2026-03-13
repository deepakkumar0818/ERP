import { useEffect, useState, useCallback } from 'react';
import { ShoppingCart, Plus, Upload, Loader2, CheckCircle2, X, Copy, Check, RefreshCw } from 'lucide-react';
import { salesApi, productionApi } from '../api/api';

function CopyBtn({ text }) {
    const [copied, setCopied] = useState(false);
    const handle = () => {
        navigator.clipboard.writeText(text).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 1800);
        });
    };
    return (
        <button onClick={handle} title="Copy ID"
            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-700 hover:bg-indigo-100 dark:hover:bg-indigo-500/20 text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
            {copied ? <Check className="h-3 w-3 text-emerald-500" /> : <Copy className="h-3 w-3" />}
            <span className="text-[10px] font-mono">{text.slice(-8).toUpperCase()}</span>
        </button>
    );
}

export default function SalesOrders() {
    // ── data ──────────────────────────────────────────────────────────────────
    const [leads, setLeads]               = useState([]);
    const [selectedLead, setSelectedLead] = useState(null);
    const [quotations, setQuotations]     = useState([]);
    const [salesOrders, setSalesOrders]   = useState([]);
    const [sosLoading, setSosLoading]     = useState(true);

    // ── form state ────────────────────────────────────────────────────────────
    const [leadClientName, setLeadClientName]         = useState('');
    const [leadRequirement, setLeadRequirement]       = useState('');
    const [quotationBasePrice, setQuotationBasePrice] = useState('');
    const [negLeadId, setNegLeadId]                   = useState('');
    const [negQuotations, setNegQuotations]           = useState([]);
    const [negQuotationId, setNegQuotationId]         = useState('');
    const [negPrice, setNegPrice]                     = useState('');
    const [negStatus, setNegStatus]                   = useState('APPROVED');
    const [excelFile, setExcelFile]                   = useState(null);

    // ── UI state ──────────────────────────────────────────────────────────────
    const [activeTab, setActiveTab]       = useState('leads');
    const [soFilter, setSoFilter]         = useState('ALL');
    const [isLoading, setIsLoading]       = useState(false);
    const [leadsLoading, setLeadsLoading] = useState(true);
    const [message, setMessage]           = useState('');
    const [error, setError]               = useState('');
    const [createdSO, setCreatedSO]       = useState(null);
    const [leadFilter, setLeadFilter]     = useState('ALL');

    const showMsg = (m) => { setMessage(m); setError(''); };
    const showErr = (e) => { setError(e);   setMessage(''); };

    // ── fetch leads ───────────────────────────────────────────────────────────
    const fetchLeads = useCallback(async () => {
        setLeadsLoading(true);
        try {
            const data = await salesApi.getLeads();
            setLeads(data.leads || []);
        } catch (err) { showErr(err.message); }
        finally { setLeadsLoading(false); }
    }, []);

    // ── fetch all sales orders from DB ────────────────────────────────────────
    const fetchSalesOrders = useCallback(async () => {
        setSosLoading(true);
        try {
            const data = await productionApi.getAll();
            setSalesOrders(
                (data.salesOrders || []).map(so => ({
                    id: so.id,
                    clientName: so.quotation?.lead?.clientName || '—',
                    requirement: so.quotation?.lead?.requirement || '',
                    basePrice: so.quotation?.basePrice,
                    negotiatedPrice: so.quotation?.negotiatedPrice,
                    status: so.status,
                    createdAt: so.createdAt,
                }))
            );
        } catch (err) { showErr(err.message); }
        finally { setSosLoading(false); }
    }, []);

    useEffect(() => {
        fetchLeads();
        fetchSalesOrders();
    }, [fetchLeads, fetchSalesOrders]);

    // ── lead selection ────────────────────────────────────────────────────────
    const handleSelectLead = async (lead) => {
        if (selectedLead?.id === lead.id) { setSelectedLead(null); setQuotations([]); return; }
        setSelectedLead(lead);
        setQuotations([]);
        try {
            const data = await salesApi.getQuotationsByLead(lead.id);
            setQuotations(data.quotations || []);
        } catch (err) { showErr(err.message); }
    };

    // ── create lead ───────────────────────────────────────────────────────────
    const handleCreateLead = async (e) => {
        e.preventDefault();
        setIsLoading(true); setError(''); setMessage('');
        try {
            await salesApi.createLead(leadClientName, leadRequirement);
            setLeadClientName('');
            setLeadRequirement('');
            showMsg('Lead created successfully.');
            await fetchLeads();
        } catch (err) { showErr(err.message); }
        finally { setIsLoading(false); }
    };

    // ── create quotation ──────────────────────────────────────────────────────
    const handleCreateQuotation = async (e) => {
        e.preventDefault();
        if (!selectedLead) { showErr('Select a lead first.'); return; }
        setIsLoading(true); setError(''); setMessage('');
        try {
            await salesApi.createQuotation(selectedLead.id, parseFloat(quotationBasePrice));
            setQuotationBasePrice('');
            showMsg('Quotation created.');
            const [qData, lData] = await Promise.all([
                salesApi.getQuotationsByLead(selectedLead.id),
                salesApi.getLeads(),
            ]);
            setQuotations(qData.quotations || []);
            setLeads(lData.leads || []);
        } catch (err) { showErr(err.message); }
        finally { setIsLoading(false); }
    };

    // ── negotiate: lead selection → load quotations ───────────────────────────
    const handleNegLeadChange = async (leadId) => {
        setNegLeadId(leadId);
        setNegQuotationId('');
        setNegQuotations([]);
        if (!leadId) return;
        try {
            const data = await salesApi.getQuotationsByLead(leadId);
            setNegQuotations(data.quotations || []);
        } catch (err) { showErr(err.message); }
    };

    // ── negotiate: submit ─────────────────────────────────────────────────────
    const handleNegotiate = async (e) => {
        e.preventDefault();
        if (!negQuotationId) { showErr('Select a quotation.'); return; }
        setIsLoading(true); setError(''); setMessage('');
        try {
            await salesApi.negotiateQuotation(
                negQuotationId,
                negPrice ? parseFloat(negPrice) : undefined,
                negStatus,
            );
            showMsg(`Quotation ${negStatus} successfully.`);
            setNegPrice('');
            setNegStatus('APPROVED');
            // Refresh quotations list for the selected lead in negotiate tab
            const data = await salesApi.getQuotationsByLead(negLeadId);
            setNegQuotations(data.quotations || []);
            setNegQuotationId('');
            // Also refresh the leads tab quotations if same lead is selected
            if (selectedLead?.id === negLeadId) {
                const qData = await salesApi.getQuotationsByLead(negLeadId);
                setQuotations(qData.quotations || []);
            }
        } catch (err) { showErr(err.message); }
        finally { setIsLoading(false); }
    };

    // ── create sales order ────────────────────────────────────────────────────
    const handleCreateSalesOrder = async (quotation) => {
        setIsLoading(true); setError(''); setMessage(''); setCreatedSO(null);
        try {
            const data = await productionApi.createSalesOrder(quotation.id);
            const so = data.salesOrder;
            const entry = {
                id: so?.id,
                clientName: selectedLead?.clientName || '—',
                requirement: selectedLead?.requirement || '',
                basePrice: quotation.basePrice,
                negotiatedPrice: quotation.negotiatedPrice,
                status: so?.status || 'CONFIRMED',
                createdAt: so?.createdAt || new Date().toISOString(),
            };
            setCreatedSO(entry);
            showMsg(`Sales Order created!`);
            // Refresh from DB
            await fetchSalesOrders();
        } catch (err) { showErr(err.message); }
        finally { setIsLoading(false); }
    };

    // ── excel import ──────────────────────────────────────────────────────────
    const handleExcelUpload = async (e) => {
        e.preventDefault();
        if (!excelFile) { showErr('Select an Excel file.'); return; }
        setIsLoading(true); setError(''); setMessage('');
        try {
            const data = await salesApi.importLeadsFromExcel(excelFile);
            showMsg(data.message || `Imported ${data.count || 0} leads.`);
            setExcelFile(null);
            e.target.reset();
            await fetchLeads();
        } catch (err) { showErr(err.message); }
        finally { setIsLoading(false); }
    };

    // ── derived ───────────────────────────────────────────────────────────────
    const statusColor = (s = '') => {
        const v = (s || '').toUpperCase();
        if (v === 'APPROVED')   return 'bg-emerald-50 text-emerald-700 border-emerald-100 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20';
        if (v === 'REJECTED')   return 'bg-rose-50 text-rose-700 border-rose-100 dark:bg-rose-500/10 dark:text-rose-400 dark:border-rose-500/20';
        if (v === 'CONFIRMED')  return 'bg-blue-50 text-blue-700 border-blue-100 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20';
        return 'bg-amber-50 text-amber-700 border-amber-100 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20';
    };

    const leadStatusOptions = ['ALL', 'new', 'pending', 'qualified', 'won', 'lost'];
    const filteredLeads = leadFilter === 'ALL' ? leads : leads.filter(l => (l.status || 'new').toLowerCase() === leadFilter);

    const filteredSOs = soFilter === 'ALL' ? salesOrders : salesOrders.filter(s => {
        if (soFilter === 'recent') return new Date(s.createdAt) > new Date(Date.now() - 7 * 86400000);
        return true;
    });

    const tabs = [
        { id: 'leads',     label: 'Leads & Quotations' },
        { id: 'negotiate', label: 'Negotiate'           },
        { id: 'orders',    label: `Sales Orders (${salesOrders.length})` },
        { id: 'excel',     label: 'Import Excel'        },
    ];

    const inputCls = 'w-full px-3 py-2 border border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm';

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Sales: Leads &amp; Quotations</h1>
                    <p className="text-slate-500 dark:text-slate-400">Capture enquiries, generate quotations, and close sales orders.</p>
                </div>
                <div className="flex gap-2 flex-wrap">
                    {tabs.map(({ id, label }) => (
                        <button key={id} onClick={() => { setActiveTab(id); setCreatedSO(null); setError(''); setMessage(''); }}
                            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${activeTab === id ? 'bg-indigo-600 text-white shadow-sm' : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'}`}>
                            {label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Feedback */}
            {error   && <div className="flex items-start gap-2 text-sm text-rose-700 bg-rose-50 border border-rose-200 rounded-xl px-4 py-3 dark:bg-rose-500/10 dark:border-rose-500/20 dark:text-rose-400"><X className="h-4 w-4 shrink-0 mt-0.5" />{error}</div>}
            {message && <div className="flex items-start gap-2 text-sm text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-3 dark:bg-emerald-500/10 dark:border-emerald-500/20 dark:text-emerald-400"><CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5" />{message}</div>}

            {/* ── New Sales Order Banner ── */}
            {createdSO && (
                <div className="bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-200 dark:border-indigo-500/30 rounded-2xl p-5">
                    <div className="flex items-start justify-between gap-4">
                        <div>
                            <p className="text-sm font-bold text-indigo-800 dark:text-indigo-300 mb-1">Sales Order Created Successfully!</p>
                            <p className="text-xs text-indigo-600 dark:text-indigo-400 mb-3">Client: <strong>{createdSO.clientName}</strong></p>
                            <div className="flex items-center gap-3 flex-wrap">
                                <div className="bg-white dark:bg-slate-900 border border-indigo-200 dark:border-indigo-500/30 rounded-xl px-4 py-2.5 flex items-center gap-3">
                                    <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Sales Order ID</span>
                                    <code className="text-sm font-bold font-mono text-indigo-700 dark:text-indigo-300">{createdSO.id}</code>
                                    <button onClick={() => navigator.clipboard.writeText(createdSO.id)}
                                        className="p-1 rounded hover:bg-indigo-100 dark:hover:bg-indigo-500/20 text-indigo-500">
                                        <Copy className="h-3.5 w-3.5" />
                                    </button>
                                </div>
                                <button onClick={() => { setActiveTab('orders'); setCreatedSO(null); }}
                                    className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline">
                                    View all Sales Orders →
                                </button>
                            </div>
                        </div>
                        <button onClick={() => setCreatedSO(null)} className="text-indigo-400 hover:text-indigo-600 dark:hover:text-indigo-200 shrink-0"><X className="h-4 w-4" /></button>
                    </div>
                </div>
            )}

            {/* ── LEADS TAB ── */}
            {activeTab === 'leads' && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm p-6 space-y-5">
                        <div>
                            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Create Lead</h2>
                            <p className="text-sm text-slate-500 dark:text-slate-400">Capture a new enquiry.</p>
                        </div>
                        <form className="space-y-4" onSubmit={handleCreateLead}>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Client Name</label>
                                <input type="text" value={leadClientName} onChange={e => setLeadClientName(e.target.value)}
                                    className={inputCls} placeholder="e.g. Acme Steel Pvt Ltd" required />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Requirement</label>
                                <textarea rows={3} value={leadRequirement} onChange={e => setLeadRequirement(e.target.value)}
                                    className={inputCls} placeholder="Custom machine line…" required />
                            </div>
                            <button type="submit" disabled={isLoading}
                                className="w-full inline-flex items-center justify-center gap-2 bg-indigo-600 text-white px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-indigo-700 disabled:opacity-60">
                                {isLoading ? <><Loader2 className="h-4 w-4 animate-spin" />Saving…</> : <><Plus className="h-4 w-4" />Create Lead</>}
                            </button>
                        </form>

                        {selectedLead && (
                            <div className="border-t border-slate-100 dark:border-slate-800 pt-4">
                                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-2">
                                    Add Quotation — <span className="text-indigo-600 dark:text-indigo-400">{selectedLead.clientName}</span>
                                </p>
                                <form className="flex gap-2" onSubmit={handleCreateQuotation}>
                                    <input type="number" step="0.01" min="0" value={quotationBasePrice}
                                        onChange={e => setQuotationBasePrice(e.target.value)}
                                        className="flex-1 px-3 py-2 border border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm"
                                        placeholder="Base price (₹)" required />
                                    <button type="submit" disabled={isLoading}
                                        className="inline-flex items-center gap-1 bg-slate-900 dark:bg-slate-700 text-white px-3 py-2 rounded-lg text-sm font-semibold hover:bg-slate-800 disabled:opacity-60">
                                        {isLoading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Plus className="h-3.5 w-3.5" />}Add
                                    </button>
                                </form>
                            </div>
                        )}
                    </div>

                    <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden">
                        <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
                            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">All Leads</h2>
                            <div className="flex gap-2 flex-wrap">
                                {leadStatusOptions.map(s => (
                                    <button key={s} onClick={() => setLeadFilter(s)}
                                        className={`px-2.5 py-1 rounded-lg text-xs font-semibold border transition-colors ${leadFilter === s ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:border-indigo-300'}`}>
                                        {s === 'ALL' ? `All (${leads.length})` : s}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div className="overflow-x-auto">
                            {leadsLoading ? (
                                <div className="flex items-center justify-center py-12 text-slate-400"><Loader2 className="h-5 w-5 animate-spin mr-2" />Loading…</div>
                            ) : filteredLeads.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-12 text-slate-400 dark:text-slate-500">
                                    <ShoppingCart className="h-10 w-10 mb-2 opacity-30" />
                                    <p className="text-sm">{leads.length === 0 ? 'No leads yet. Create one on the left.' : 'No leads match this filter.'}</p>
                                </div>
                            ) : (
                                <>
                                    <table className="min-w-full text-sm text-left">
                                        <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider">
                                            <tr>
                                                <th className="px-4 py-3">Client</th>
                                                <th className="px-4 py-3">Requirement</th>
                                                <th className="px-4 py-3">Status</th>
                                                <th className="px-4 py-3 text-right">Quotes</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                            {filteredLeads.map((lead) => (
                                                <tr key={lead.id} onClick={() => handleSelectLead(lead)}
                                                    className={`cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors ${selectedLead?.id === lead.id ? 'bg-indigo-50/70 dark:bg-indigo-500/10 border-l-2 border-indigo-500' : ''}`}>
                                                    <td className="px-4 py-3 font-medium text-slate-900 dark:text-white">{lead.clientName}</td>
                                                    <td className="px-4 py-3 text-slate-500 dark:text-slate-400 max-w-xs truncate">{lead.requirement}</td>
                                                    <td className="px-4 py-3">
                                                        <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-semibold border ${statusColor(lead.status)}`}>{lead.status || 'NEW'}</span>
                                                    </td>
                                                    <td className="px-4 py-3 text-right text-slate-500 dark:text-slate-400">{lead.quotations?.length || 0}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>

                                    {selectedLead && (
                                        <div className="border-t border-slate-100 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-800/20 p-4">
                                            <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-3">
                                                Quotations — {selectedLead.clientName}
                                            </h3>
                                            {quotations.length === 0 ? (
                                                <p className="text-sm text-slate-400 dark:text-slate-500 py-3 text-center">No quotations yet. Add one above.</p>
                                            ) : (
                                                <div className="overflow-x-auto rounded-xl border border-slate-100 dark:border-slate-700">
                                                    <table className="min-w-full text-sm">
                                                        <thead className="bg-white dark:bg-slate-900 text-slate-500 dark:text-slate-400 text-xs uppercase">
                                                            <tr>
                                                                <th className="px-4 py-2 text-left">ID</th>
                                                                <th className="px-4 py-2 text-left">Base Price</th>
                                                                <th className="px-4 py-2 text-left">Negotiated</th>
                                                                <th className="px-4 py-2 text-left">Status</th>
                                                                <th className="px-4 py-2 text-right">Action</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                                            {quotations.map((q) => (
                                                                <tr key={q.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                                                                    <td className="px-4 py-2"><CopyBtn text={q.id} /></td>
                                                                    <td className="px-4 py-2 dark:text-slate-300">₹{q.basePrice?.toLocaleString('en-IN')}</td>
                                                                    <td className="px-4 py-2 text-slate-500 dark:text-slate-400">{q.negotiatedPrice != null ? `₹${q.negotiatedPrice?.toLocaleString('en-IN')}` : '—'}</td>
                                                                    <td className="px-4 py-2">
                                                                        <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-semibold border ${statusColor(q.status)}`}>{q.status || 'PENDING'}</span>
                                                                    </td>
                                                                    <td className="px-4 py-2 text-right">
                                                                        {q.status === 'APPROVED' ? (
                                                                            <button onClick={() => handleCreateSalesOrder(q)} disabled={isLoading}
                                                                                className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline disabled:opacity-40">
                                                                                Create Sales Order →
                                                                            </button>
                                                                        ) : (
                                                                            <button onClick={async () => {
                                                                                setActiveTab('negotiate');
                                                                                await handleNegLeadChange(selectedLead.id);
                                                                                setNegQuotationId(q.id);
                                                                            }}
                                                                                className="text-xs font-semibold text-amber-600 dark:text-amber-400 hover:underline">
                                                                                Negotiate →
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
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* ── NEGOTIATE TAB ── */}
            {activeTab === 'negotiate' && (
                <div className="max-w-xl bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm p-6 space-y-5">
                    <div>
                        <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Negotiate / Approve Quotation</h2>
                        <p className="text-sm text-slate-500 dark:text-slate-400">Set final price and approve or reject a quotation.</p>
                    </div>
                    <form className="space-y-4" onSubmit={handleNegotiate}>
                        {/* Step 1: Select Lead */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                                Step 1 — Select Lead
                            </label>
                            <select value={negLeadId} onChange={e => handleNegLeadChange(e.target.value)} className={inputCls}>
                                <option value="">{leadsLoading ? 'Loading…' : leads.length === 0 ? 'No leads found' : '— Select a lead —'}</option>
                                {leads.map(l => (
                                    <option key={l.id} value={l.id}>{l.clientName}</option>
                                ))}
                            </select>
                        </div>

                        {/* Step 2: Select Quotation */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                                Step 2 — Select Quotation
                            </label>
                            <select value={negQuotationId} onChange={e => setNegQuotationId(e.target.value)} className={inputCls} required disabled={!negLeadId}>
                                <option value="">
                                    {!negLeadId
                                        ? 'Select a lead first'
                                        : negQuotations.length === 0
                                            ? 'No quotations for this lead'
                                            : '— Select quotation —'}
                                </option>
                                {negQuotations.map(q => (
                                    <option key={q.id} value={q.id}>
                                        ₹{q.basePrice?.toLocaleString('en-IN')}
                                        {q.negotiatedPrice ? ` → ₹${q.negotiatedPrice.toLocaleString('en-IN')}` : ''}
                                        {' '}— {q.status} — #{q.id.slice(-6).toUpperCase()}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Step 3: Negotiated Price */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                                Step 3 — Negotiated Price (₹) <span className="text-slate-400 font-normal">optional</span>
                            </label>
                            <input type="number" step="0.01" min="0" value={negPrice} onChange={e => setNegPrice(e.target.value)}
                                className={inputCls} placeholder="Leave blank to keep base price" disabled={!negQuotationId} />
                        </div>

                        {/* Step 4: Decision */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                                Step 4 — Decision
                            </label>
                            <select value={negStatus} onChange={e => setNegStatus(e.target.value)} className={inputCls} disabled={!negQuotationId}>
                                <option value="APPROVED">APPROVED</option>
                                <option value="REJECTED">REJECTED</option>
                                <option value="PENDING_APPROVAL">PENDING_APPROVAL</option>
                            </select>
                        </div>

                        <button type="submit" disabled={isLoading || !negQuotationId}
                            className="w-full inline-flex items-center justify-center gap-2 bg-indigo-600 text-white px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-indigo-700 disabled:opacity-60">
                            {isLoading ? <><Loader2 className="h-4 w-4 animate-spin" />Saving…</> : <><CheckCircle2 className="h-4 w-4" />Update Quotation</>}
                        </button>
                    </form>

                    {/* Show current quotation details */}
                    {negQuotationId && (() => {
                        const q = negQuotations.find(x => x.id === negQuotationId);
                        if (!q) return null;
                        return (
                            <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 text-sm space-y-1 border border-slate-100 dark:border-slate-700">
                                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-2">Selected Quotation Details</p>
                                <div className="flex justify-between">
                                    <span className="text-slate-500 dark:text-slate-400">Base Price</span>
                                    <span className="font-medium dark:text-white">₹{q.basePrice?.toLocaleString('en-IN')}</span>
                                </div>
                                {q.negotiatedPrice != null && (
                                    <div className="flex justify-between">
                                        <span className="text-slate-500 dark:text-slate-400">Negotiated Price</span>
                                        <span className="font-medium dark:text-white">₹{q.negotiatedPrice?.toLocaleString('en-IN')}</span>
                                    </div>
                                )}
                                <div className="flex justify-between">
                                    <span className="text-slate-500 dark:text-slate-400">Current Status</span>
                                    <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-semibold border ${statusColor(q.status)}`}>{q.status}</span>
                                </div>
                            </div>
                        );
                    })()}
                </div>
            )}

            {/* ── SALES ORDERS TAB ── */}
            {activeTab === 'orders' && (
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                            All confirmed sales orders from the database.
                        </p>
                        <button onClick={fetchSalesOrders} disabled={sosLoading}
                            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-50">
                            <RefreshCw className={`h-3.5 w-3.5 ${sosLoading ? 'animate-spin' : ''}`} />
                            Refresh
                        </button>
                    </div>

                    {/* Filters */}
                    <div className="flex gap-2 flex-wrap items-center">
                        {['ALL', 'recent'].map(f => (
                            <button key={f} onClick={() => setSoFilter(f)}
                                className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors ${soFilter === f ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:border-indigo-300'}`}>
                                {f === 'ALL' ? `All (${salesOrders.length})` : 'Last 7 days'}
                            </button>
                        ))}
                    </div>

                    {sosLoading ? (
                        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-16 text-center text-slate-400">
                            <Loader2 className="h-8 w-8 mx-auto mb-3 animate-spin opacity-50" />
                            <p className="text-sm">Loading sales orders…</p>
                        </div>
                    ) : filteredSOs.length === 0 ? (
                        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-16 text-center text-slate-400 dark:text-slate-500">
                            <ShoppingCart className="h-10 w-10 mx-auto mb-3 opacity-25" />
                            <p className="text-sm">No sales orders yet.</p>
                            <p className="text-xs mt-1">Approve a quotation and click "Create Sales Order →" on the Leads tab.</p>
                        </div>
                    ) : (
                        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden">
                            <table className="min-w-full text-sm text-left">
                                <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider">
                                    <tr>
                                        <th className="px-5 py-3">Sales Order ID</th>
                                        <th className="px-5 py-3">Client</th>
                                        <th className="px-5 py-3">Requirement</th>
                                        <th className="px-5 py-3">Value</th>
                                        <th className="px-5 py-3">Status</th>
                                        <th className="px-5 py-3">Created</th>
                                        <th className="px-5 py-3">Copy ID</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                    {filteredSOs.map((so) => (
                                        <tr key={so.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                                            <td className="px-5 py-3">
                                                <code className="text-xs font-mono text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-500/10 px-2 py-0.5 rounded">
                                                    {so.id.slice(-8).toUpperCase()}
                                                </code>
                                            </td>
                                            <td className="px-5 py-3 font-semibold text-slate-900 dark:text-white">{so.clientName}</td>
                                            <td className="px-5 py-3 text-slate-500 dark:text-slate-400 max-w-[180px] truncate">{so.requirement || '—'}</td>
                                            <td className="px-5 py-3 text-slate-700 dark:text-slate-300">
                                                {so.negotiatedPrice ? `₹${so.negotiatedPrice.toLocaleString('en-IN')}` : so.basePrice ? `₹${so.basePrice.toLocaleString('en-IN')}` : '—'}
                                            </td>
                                            <td className="px-5 py-3">
                                                <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-semibold border ${statusColor(so.status)}`}>{so.status || 'CONFIRMED'}</span>
                                            </td>
                                            <td className="px-5 py-3 text-slate-500 dark:text-slate-400">{new Date(so.createdAt).toLocaleDateString('en-IN')}</td>
                                            <td className="px-5 py-3">
                                                <button onClick={() => navigator.clipboard.writeText(so.id)}
                                                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-indigo-100 dark:hover:bg-indigo-500/20 text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 text-xs font-semibold transition-colors">
                                                    <Copy className="h-3.5 w-3.5" />Copy
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            )}

            {/* ── EXCEL TAB ── */}
            {activeTab === 'excel' && (
                <div className="max-w-lg bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm p-6 space-y-5">
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center">
                            <Upload className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Import Leads from Excel</h2>
                            <p className="text-sm text-slate-500 dark:text-slate-400">Bulk-create leads from an .xlsx file.</p>
                        </div>
                    </div>
                    <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-3 text-xs text-slate-500 dark:text-slate-400">
                        <p className="font-semibold mb-1">Required columns:</p>
                        <ul className="list-disc list-inside space-y-0.5">
                            <li><span className="font-medium">Client Name</span> — customer name</li>
                            <li><span className="font-medium">Requirement</span> — enquiry detail</li>
                            <li><span className="font-medium">Base Price</span> (optional)</li>
                        </ul>
                    </div>
                    <form className="space-y-3" onSubmit={handleExcelUpload}>
                        <input type="file" accept=".xlsx,.xls" onChange={e => setExcelFile(e.target.files?.[0] || null)}
                            className="block w-full text-sm text-slate-600 dark:text-slate-400 file:mr-4 file:py-2 file:px-3 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 dark:file:bg-indigo-500/20 file:text-indigo-700 dark:file:text-indigo-400 hover:file:bg-indigo-100" />
                        <button type="submit" disabled={isLoading}
                            className="w-full inline-flex items-center justify-center gap-2 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-60">
                            {isLoading ? <><Loader2 className="h-4 w-4 animate-spin" />Uploading…</> : <><Upload className="h-4 w-4" />Upload &amp; Import</>}
                        </button>
                    </form>
                </div>
            )}
        </div>
    );
}

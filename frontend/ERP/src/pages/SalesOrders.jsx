import React, { useEffect, useState } from 'react';
import { ShoppingCart, Plus, FileText, Upload, Loader2 } from 'lucide-react';

const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, '') || 'http://localhost:5000';

async function requestSales(endpoint, options = {}) {
    const url = `${API_BASE_URL}/api/sales/${endpoint}`;
    const response = await fetch(url, options);

    let data = null;
    try {
        data = await response.json();
    } catch {
        data = null;
    }

    if (!response.ok) {
        throw new Error(data?.message || 'Sales request failed');
    }

    return data;
}

export default function SalesOrders() {
    const [leads, setLeads] = useState([]);
    const [selectedLeadId, setSelectedLeadId] = useState('');
    const [quotations, setQuotations] = useState([]);
    const [leadForm, setLeadForm] = useState({ clientName: '', requirement: '' });
    const [quotationForm, setQuotationForm] = useState({ basePrice: '' });
    const [excelFile, setExcelFile] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const fetchLeads = async () => {
        try {
            const data = await requestSales('leads');
            setLeads(data.leads || []);
        } catch (err) {
            console.error(err);
            setError(err.message);
        }
    };

    useEffect(() => {
        fetchLeads();
    }, []);

    const handleCreateLead = async (event) => {
        event.preventDefault();
        setError('');
        setMessage('');
        setIsLoading(true);

        try {
            await requestSales('leads', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(leadForm),
            });
            setLeadForm({ clientName: '', requirement: '' });
            setMessage('Lead created successfully');
            await fetchLeads();
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSelectLead = async (leadId) => {
        setSelectedLeadId(leadId);
        setQuotations([]);
        setError('');
        setMessage('');

        if (!leadId) return;

        try {
            const data = await requestSales(`leads/${leadId}/quotations`);
            setQuotations(data.quotations || []);
        } catch (err) {
            setError(err.message);
        }
    };

    const handleCreateQuotation = async (event) => {
        event.preventDefault();
        if (!selectedLeadId) {
            setError('Please select a lead first');
            return;
        }

        setError('');
        setMessage('');
        setIsLoading(true);

        try {
            await requestSales('quotations', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    leadId: selectedLeadId,
                    basePrice: parseFloat(quotationForm.basePrice),
                }),
            });
            setQuotationForm({ basePrice: '' });
            setMessage('Quotation created successfully');

            const data = await requestSales(`leads/${selectedLeadId}/quotations`);
            setQuotations(data.quotations || []);
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleExcelUpload = async (event) => {
        event.preventDefault();
        if (!excelFile) {
            setError('Please select an Excel file to upload');
            return;
        }

        setError('');
        setMessage('');
        setIsLoading(true);

        try {
            const formData = new FormData();
            formData.append('file', excelFile);

            const response = await fetch(`${API_BASE_URL}/api/sales/import-excel`, {
                method: 'POST',
                body: formData,
            });

            const data = await response.json();
            if (!response.ok) {
                throw new Error(data?.message || 'Failed to import Excel file');
            }

            setMessage(
                data.message ||
                `Imported ${data.count || 0} leads from Excel file.`,
            );
            setExcelFile(null);
            (event.target.reset?.() || null);
            await fetchLeads();
        } catch (err) {
            console.error(err);
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Sales: Leads & Quotations</h1>
                    <p className="text-slate-500">
                        Capture new enquiries, generate quotations, and import leads from Excel.
                    </p>
                </div>
                <div className="flex gap-3">
                    <button
                        type="button"
                        className="bg-indigo-600 text-white px-4 py-2 rounded-xl font-semibold hover:bg-indigo-700 transition-all shadow-sm flex items-center gap-2"
                    >
                        <Plus className="h-5 w-5" />
                        New Lead
                    </button>
                </div>
            </div>

            {(error || message) && (
                <div className="space-y-2">
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
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Leads form + list */}
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-6 lg:col-span-1">
                    <div>
                        <h2 className="text-lg font-semibold text-slate-900">Create Sales Lead</h2>
                        <p className="text-sm text-slate-500">
                            Capture basic enquiry details from your prospects.
                        </p>
                    </div>

                    <form className="space-y-4" onSubmit={handleCreateLead}>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">
                                Client Name
                            </label>
                            <input
                                type="text"
                                value={leadForm.clientName}
                                onChange={(e) =>
                                    setLeadForm((prev) => ({ ...prev, clientName: e.target.value }))
                                }
                                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                                placeholder="e.g. Acme Steel Pvt Ltd"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">
                                Requirement / Notes
                            </label>
                            <textarea
                                value={leadForm.requirement}
                                onChange={(e) =>
                                    setLeadForm((prev) => ({ ...prev, requirement: e.target.value }))
                                }
                                rows={3}
                                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                                placeholder="e.g. Need custom machine line for automotive components…"
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full inline-flex items-center justify-center gap-2 bg-indigo-600 text-white px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-indigo-700 disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                    Saving…
                                </>
                            ) : (
                                <>
                                    <Plus className="h-4 w-4" />
                                    Create Lead
                                </>
                            )}
                        </button>
                    </form>
                </div>

                {/* Leads table */}
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-4 lg:col-span-2">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-lg font-semibold text-slate-900">Leads</h2>
                            <p className="text-sm text-slate-500">
                                Select a lead to view or create quotations.
                            </p>
                        </div>
                    </div>
                    <div className="overflow-x-auto rounded-xl border border-slate-100">
                        <table className="min-w-full text-sm text-left">
                            <thead className="bg-slate-50">
                                <tr className="text-slate-500">
                                    <th className="px-4 py-2">Client</th>
                                    <th className="px-4 py-2">Requirement</th>
                                    <th className="px-4 py-2">Status</th>
                                    <th className="px-4 py-2 text-right">Quotations</th>
                                </tr>
                            </thead>
                            <tbody>
                                {leads.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan={4}
                                            className="px-4 py-6 text-center text-slate-400"
                                        >
                                            No leads found yet. Create one using the form on the left
                                            or import from Excel below.
                                        </td>
                                    </tr>
                                ) : (
                                    leads.map((lead) => (
                                        <tr
                                            key={lead.id}
                                            className={`border-t border-slate-100 cursor-pointer hover:bg-slate-50 ${
                                                selectedLeadId === lead.id ? 'bg-indigo-50/60' : ''
                                            }`}
                                            onClick={() => handleSelectLead(lead.id)}
                                        >
                                            <td className="px-4 py-2 font-medium text-slate-900">
                                                {lead.clientName}
                                            </td>
                                            <td className="px-4 py-2 text-slate-600 max-w-xs truncate">
                                                {lead.requirement}
                                            </td>
                                            <td className="px-4 py-2">
                                                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700">
                                                    {lead.status || 'NEW'}
                                                </span>
                                            </td>
                                            <td className="px-4 py-2 text-right text-slate-500">
                                                {(lead.quotations?.length || 0) || 0} quotations
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Quotations + Excel import */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-4 lg:col-span-2">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-lg font-semibold text-slate-900">Quotations</h2>
                            <p className="text-sm text-slate-500">
                                For the selected lead, manage base price and negotiation.
                            </p>
                        </div>
                    </div>

                    {!selectedLeadId ? (
                        <div className="flex flex-col items-center justify-center py-12 text-center text-slate-400">
                            <FileText className="h-10 w-10 mb-3" />
                            <p className="text-sm">
                                Select a lead from the table above to view its quotations.
                            </p>
                        </div>
                    ) : (
                        <>
                            <form className="flex flex-col md:flex-row gap-3 items-end mb-4" onSubmit={handleCreateQuotation}>
                                <div className="w-full md:w-1/3">
                                    <label className="block text-sm font-medium text-slate-700 mb-1">
                                        Base Price (₹)
                                    </label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        value={quotationForm.basePrice}
                                        onChange={(e) =>
                                            setQuotationForm({ basePrice: e.target.value })
                                        }
                                        className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                                        placeholder="e.g. 250000"
                                        required
                                    />
                                </div>
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="inline-flex items-center gap-2 bg-slate-900 text-white px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-slate-800 disabled:opacity-60 disabled:cursor-not-allowed"
                                >
                                    {isLoading ? (
                                        <>
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                            Saving…
                                        </>
                                    ) : (
                                        <>
                                            <Plus className="h-4 w-4" />
                                            Add Quotation
                                        </>
                                    )}
                                </button>
                            </form>

                            <div className="overflow-x-auto rounded-xl border border-slate-100">
                                <table className="min-w-full text-sm text-left">
                                    <thead className="bg-slate-50">
                                        <tr className="text-slate-500">
                                            <th className="px-4 py-2">Quotation ID</th>
                                            <th className="px-4 py-2">Base Price</th>
                                            <th className="px-4 py-2">Negotiated Price</th>
                                            <th className="px-4 py-2">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {quotations.length === 0 ? (
                                            <tr>
                                                <td
                                                    colSpan={4}
                                                    className="px-4 py-6 text-center text-slate-400"
                                                >
                                                    No quotations yet for this lead.
                                                </td>
                                            </tr>
                                        ) : (
                                            quotations.map((q) => (
                                                <tr
                                                    key={q.id}
                                                    className="border-t border-slate-100"
                                                >
                                                    <td className="px-4 py-2 font-mono text-xs text-slate-500">
                                                        {q.id}
                                                    </td>
                                                    <td className="px-4 py-2">
                                                        ₹{q.basePrice?.toLocaleString?.('en-IN') ?? q.basePrice}
                                                    </td>
                                                    <td className="px-4 py-2">
                                                        {q.negotiatedPrice != null
                                                            ? `₹${q.negotiatedPrice?.toLocaleString?.('en-IN') ?? q.negotiatedPrice
                                                            }`
                                                            : <span className="text-slate-400">—</span>}
                                                    </td>
                                                    <td className="px-4 py-2">
                                                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700">
                                                            {q.status || 'PENDING_APPROVAL'}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </>
                    )}
                </div>

                {/* Excel import card */}
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-4">
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-xl bg-indigo-50 flex items-center justify-center">
                            <Upload className="h-5 w-5 text-indigo-600" />
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold text-slate-900">
                                Import Leads from Excel
                            </h2>
                            <p className="text-sm text-slate-500">
                                Upload an .xlsx file to bulk-create leads and optional base
                                quotations.
                            </p>
                        </div>
                    </div>

                    <div className="bg-slate-50 rounded-xl p-3 text-xs text-slate-500">
                        <p className="font-semibold mb-1">Expected columns:</p>
                        <ul className="list-disc list-inside space-y-0.5">
                            <li><span className="font-medium">Client Name</span> – customer name</li>
                            <li><span className="font-medium">Requirement</span> – enquiry / requirement</li>
                            <li><span className="font-medium">Base Price</span> (optional) – creates initial quotation</li>
                        </ul>
                    </div>

                    <form className="space-y-3" onSubmit={handleExcelUpload}>
                        <input
                            type="file"
                            accept=".xlsx,.xls"
                            onChange={(e) => setExcelFile(e.target.files?.[0] || null)}
                            className="block w-full text-sm text-slate-600 file:mr-4 file:py-2 file:px-3 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                        />
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full inline-flex items-center justify-center gap-2 border border-slate-200 text-slate-800 px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-slate-50 disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                    Uploading…
                                </>
                            ) : (
                                <>
                                    <Upload className="h-4 w-4" />
                                    Upload Excel & Import
                                </>
                            )}
                        </button>
                    </form>
                    <p className="text-[11px] text-slate-400">
                        We only read the first worksheet in your file. Invalid rows (without
                        client name or requirement) are skipped automatically.
                    </p>
                </div>
            </div>
        </div>
    );
}

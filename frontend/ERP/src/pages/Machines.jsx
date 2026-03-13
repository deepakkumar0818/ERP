import { useState, useEffect } from 'react';
import { Wrench, Plus, X, CheckCircle2, AlertTriangle, Activity, Settings, Edit2, Trash2 } from 'lucide-react';

const MACHINES_KEY = 'erp_machines';
const LOGS_KEY = 'erp_machine_logs';

const emptyForm = { name: '', machineId: '', type: '', location: '', status: 'ACTIVE', oeeTarget: '85' };

const statusStyle = {
    ACTIVE:       'bg-emerald-50 text-emerald-700 border-emerald-100 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20',
    MAINTENANCE:  'bg-amber-50 text-amber-700 border-amber-100 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20',
    IDLE:         'bg-slate-50 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700',
    FAULT:        'bg-rose-50 text-rose-700 border-rose-100 dark:bg-rose-500/10 dark:text-rose-400 dark:border-rose-500/20',
};

const statusIcon = {
    ACTIVE:      <Activity className="h-3.5 w-3.5" />,
    MAINTENANCE: <Wrench className="h-3.5 w-3.5" />,
    IDLE:        <Settings className="h-3.5 w-3.5" />,
    FAULT:       <AlertTriangle className="h-3.5 w-3.5" />,
};

function loadData(key, fallback) {
    try { return JSON.parse(localStorage.getItem(key) || 'null') ?? fallback; } catch { return fallback; }
}

function StatCard({ label, value, sub, color = 'indigo' }) {
    const colors = {
        indigo: 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-500/10',
        emerald: 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10',
        amber:   'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-500/10',
        rose:    'text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-500/10',
    };
    return (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm p-5">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">{label}</p>
            <p className={`text-3xl font-bold ${colors[color].split(' ')[0]}`}>{value}</p>
            {sub && <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">{sub}</p>}
        </div>
    );
}

function OEEBar({ label, value, target }) {
    const pct = Math.min(100, Math.round(value));
    const good = pct >= target;
    return (
        <div>
            <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-600 dark:text-slate-400 font-medium">{label}</span>
                <span className={good ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400'}>{pct}%</span>
            </div>
            <div className="h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                <div
                    className={`h-full rounded-full transition-all ${good ? 'bg-emerald-500' : 'bg-amber-400'}`}
                    style={{ width: `${pct}%` }}
                />
            </div>
        </div>
    );
}

export default function Machines() {
    const [machines, setMachines]   = useState(() => loadData(MACHINES_KEY, []));
    const [logs, setLogs]           = useState(() => loadData(LOGS_KEY, []));
    const [showForm, setShowForm]   = useState(false);
    const [form, setForm]           = useState(emptyForm);
    const [editId, setEditId]       = useState(null);
    const [selected, setSelected]   = useState(null);
    const [logNote, setLogNote]     = useState('');
    const [saved, setSaved]         = useState(false);
    const [filterStatus, setFilter] = useState('ALL');

    useEffect(() => { localStorage.setItem(MACHINES_KEY, JSON.stringify(machines)); }, [machines]);
    useEffect(() => { localStorage.setItem(LOGS_KEY, JSON.stringify(logs)); }, [logs]);

    const persist = (updated) => { setMachines(updated); };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (editId) {
            const updated = machines.map((m) => m.id === editId ? { ...m, ...form } : m);
            persist(updated);
            if (selected?.id === editId) setSelected((s) => ({ ...s, ...form }));
        } else {
            const newMachine = {
                id: `MCH-${Date.now()}`,
                ...form,
                oeeTarget: parseFloat(form.oeeTarget) || 85,
                availability: Math.floor(80 + Math.random() * 20),
                performance:  Math.floor(75 + Math.random() * 25),
                quality:      Math.floor(85 + Math.random() * 15),
                lastMaintenance: new Date().toISOString().slice(0, 10),
                nextMaintenance: new Date(Date.now() + 30 * 86400000).toISOString().slice(0, 10),
                createdAt: new Date().toISOString(),
            };
            persist([newMachine, ...machines]);
        }
        setForm(emptyForm);
        setShowForm(false);
        setEditId(null);
        setSaved(true);
        setTimeout(() => setSaved(false), 2500);
    };

    const handleEdit = (m) => {
        setForm({ name: m.name, machineId: m.machineId, type: m.type, location: m.location, status: m.status, oeeTarget: String(m.oeeTarget) });
        setEditId(m.id);
        setShowForm(true);
    };

    const handleDelete = (id) => {
        if (!window.confirm('Remove this machine?')) return;
        const updated = machines.filter((m) => m.id !== id);
        persist(updated);
        if (selected?.id === id) setSelected(null);
    };

    const handleStatusChange = (id, status) => {
        const updated = machines.map((m) => m.id === id ? { ...m, status } : m);
        persist(updated);
        if (selected?.id === id) setSelected((s) => ({ ...s, status }));
    };

    const handleAddLog = () => {
        if (!logNote.trim() || !selected) return;
        const newLog = { id: `LOG-${Date.now()}`, machineId: selected.id, note: logNote.trim(), timestamp: new Date().toISOString() };
        setLogs((prev) => [newLog, ...prev]);
        setLogNote('');
    };

    const machineLogs = logs.filter((l) => l.machineId === selected?.id);
    const filtered    = filterStatus === 'ALL' ? machines : machines.filter((m) => m.status === filterStatus);

    const counts = {
        ACTIVE:      machines.filter((m) => m.status === 'ACTIVE').length,
        MAINTENANCE: machines.filter((m) => m.status === 'MAINTENANCE').length,
        FAULT:       machines.filter((m) => m.status === 'FAULT').length,
        IDLE:        machines.filter((m) => m.status === 'IDLE').length,
    };

    const avgOEE = machines.length
        ? Math.round(machines.reduce((s, m) => s + ((m.availability * m.performance * m.quality) / 10000), 0) / machines.length)
        : 0;

    const inputCls = 'w-full px-3 py-2 border border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm';

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Machine Management</h1>
                    <p className="text-slate-500 dark:text-slate-400">Track machine health, OEE metrics, and maintenance schedules.</p>
                </div>
                <div className="flex items-center gap-3">
                    {saved && (
                        <span className="flex items-center gap-1.5 text-sm text-emerald-700 dark:text-emerald-400">
                            <CheckCircle2 className="h-4 w-4" /> Saved
                        </span>
                    )}
                    <button
                        onClick={() => { setShowForm(true); setEditId(null); setForm(emptyForm); }}
                        className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-xl font-semibold hover:bg-indigo-700 shadow-sm text-sm"
                    >
                        <Plus className="h-5 w-5" /> Add Machine
                    </button>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard label="Total Machines"   value={machines.length}      sub={`${counts.ACTIVE} active`}       color="indigo" />
                <StatCard label="Avg OEE"          value={`${avgOEE}%`}         sub="Overall equipment effectiveness"  color="emerald" />
                <StatCard label="In Maintenance"   value={counts.MAINTENANCE}   sub={`${counts.IDLE} idle`}            color="amber" />
                <StatCard label="Faulted"          value={counts.FAULT}         sub="Requires immediate attention"     color="rose" />
            </div>

            {/* Add / Edit Form */}
            {showForm && (
                <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-semibold text-slate-900 dark:text-white">{editId ? 'Edit Machine' : 'Add New Machine'}</h2>
                        <button onClick={() => { setShowForm(false); setEditId(null); }} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                            <X className="h-5 w-5" />
                        </button>
                    </div>
                    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {[
                            { label: 'Machine Name', key: 'name', placeholder: 'e.g. CNC Lathe #1', required: true },
                            { label: 'Machine ID',   key: 'machineId', placeholder: 'e.g. MCH-001', required: true },
                            { label: 'Type',         key: 'type', placeholder: 'e.g. CNC, Press, Welder' },
                            { label: 'Location',     key: 'location', placeholder: 'e.g. Bay A, Floor 2' },
                            { label: 'OEE Target (%)', key: 'oeeTarget', type: 'number', placeholder: '85' },
                        ].map(({ label, key, type = 'text', placeholder, required }) => (
                            <div key={key}>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">{label}</label>
                                <input
                                    type={type} value={form[key]} placeholder={placeholder} required={required}
                                    onChange={(e) => setForm((p) => ({ ...p, [key]: e.target.value }))}
                                    className={inputCls}
                                />
                            </div>
                        ))}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Status</label>
                            <select value={form.status} onChange={(e) => setForm((p) => ({ ...p, status: e.target.value }))} className={inputCls}>
                                {['ACTIVE', 'IDLE', 'MAINTENANCE', 'FAULT'].map((s) => (
                                    <option key={s} value={s}>{s}</option>
                                ))}
                            </select>
                        </div>
                        <div className="md:col-span-3 flex justify-end">
                            <button type="submit" className="inline-flex items-center gap-2 bg-indigo-600 text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-indigo-700">
                                <Plus className="h-4 w-4" />{editId ? 'Update Machine' : 'Add Machine'}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Filter tabs */}
            <div className="flex gap-2 flex-wrap">
                {['ALL', 'ACTIVE', 'IDLE', 'MAINTENANCE', 'FAULT'].map((s) => (
                    <button
                        key={s}
                        onClick={() => setFilter(s)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors ${
                            filterStatus === s
                                ? 'bg-indigo-600 text-white border-indigo-600'
                                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:border-indigo-300'
                        }`}
                    >
                        {s}{s !== 'ALL' ? ` (${counts[s] ?? 0})` : ` (${machines.length})`}
                    </button>
                ))}
            </div>

            {/* Machine list + Detail panel */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Machine Cards */}
                <div className="lg:col-span-2 space-y-3">
                    {filtered.length === 0 ? (
                        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col items-center justify-center py-20 text-slate-400 dark:text-slate-500">
                            <Wrench className="h-10 w-10 mb-3 opacity-25" />
                            <p className="text-sm">No machines found. Add your first machine above.</p>
                        </div>
                    ) : (
                        filtered.map((m) => {
                            const oee = Math.round((m.availability * m.performance * m.quality) / 10000);
                            const isSelected = selected?.id === m.id;
                            return (
                                <div
                                    key={m.id}
                                    onClick={() => setSelected(isSelected ? null : m)}
                                    className={`bg-white dark:bg-slate-900 rounded-2xl border shadow-sm p-5 cursor-pointer transition-all ${
                                        isSelected
                                            ? 'border-indigo-400 dark:border-indigo-500 ring-1 ring-indigo-300 dark:ring-indigo-600'
                                            : 'border-slate-100 dark:border-slate-800 hover:border-indigo-200 dark:hover:border-slate-600'
                                    }`}
                                >
                                    <div className="flex items-start justify-between gap-4 mb-4">
                                        <div>
                                            <p className="font-semibold text-slate-900 dark:text-white">{m.name}</p>
                                            <p className="text-xs text-slate-400 font-mono">{m.machineId} · {m.type || 'General'} · {m.location || '—'}</p>
                                        </div>
                                        <div className="flex items-center gap-2 shrink-0">
                                            <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${statusStyle[m.status]}`}>
                                                {statusIcon[m.status]}{m.status}
                                            </span>
                                            <button onClick={(e) => { e.stopPropagation(); handleEdit(m); }} className="text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 p-1">
                                                <Edit2 className="h-4 w-4" />
                                            </button>
                                            <button onClick={(e) => { e.stopPropagation(); handleDelete(m.id); }} className="text-slate-400 hover:text-rose-500 p-1">
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-3 gap-3 mb-3">
                                        {[
                                            { label: 'OEE', value: oee, target: m.oeeTarget },
                                            { label: 'Availability', value: m.availability, target: 80 },
                                            { label: 'Performance', value: m.performance, target: 80 },
                                        ].map(({ label, value, target }) => (
                                            <OEEBar key={label} label={label} value={value} target={target} />
                                        ))}
                                    </div>

                                    <div className="flex items-center justify-between text-xs text-slate-400 dark:text-slate-500 pt-2 border-t border-slate-100 dark:border-slate-800">
                                        <span>Last maint: {m.lastMaintenance}</span>
                                        <span>Next maint: {m.nextMaintenance}</span>
                                        <div className="flex gap-1" onClick={(e) => e.stopPropagation()}>
                                            {['ACTIVE', 'IDLE', 'MAINTENANCE', 'FAULT'].filter((s) => s !== m.status).map((s) => (
                                                <button
                                                    key={s}
                                                    onClick={() => handleStatusChange(m.id, s)}
                                                    className="px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700 hover:border-indigo-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                                                >
                                                    → {s}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>

                {/* Detail / Log Panel */}
                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col">
                    <div className="p-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50">
                        <h3 className="font-semibold text-slate-900 dark:text-white text-sm">
                            {selected ? `${selected.name} — Log` : 'Maintenance Log'}
                        </h3>
                        {selected && <p className="text-xs text-slate-400 font-mono mt-0.5">{selected.machineId}</p>}
                    </div>

                    {!selected ? (
                        <div className="flex flex-col items-center justify-center py-16 text-slate-400 dark:text-slate-500 flex-1">
                            <Wrench className="h-8 w-8 mb-2 opacity-25" />
                            <p className="text-xs text-center px-4">Click a machine card to view its maintenance log.</p>
                        </div>
                    ) : (
                        <div className="flex flex-col flex-1">
                            <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex gap-2">
                                <input
                                    type="text"
                                    value={logNote}
                                    onChange={(e) => setLogNote(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleAddLog()}
                                    placeholder="Add maintenance note…"
                                    className="flex-1 px-3 py-1.5 border border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white rounded-lg text-sm focus:ring-2 focus:ring-indigo-500"
                                />
                                <button
                                    onClick={handleAddLog}
                                    className="px-3 py-1.5 bg-indigo-600 text-white rounded-lg text-sm font-semibold hover:bg-indigo-700"
                                >
                                    Add
                                </button>
                            </div>
                            <div className="flex-1 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800 max-h-96">
                                {machineLogs.length === 0 ? (
                                    <p className="text-xs text-slate-400 dark:text-slate-500 text-center py-8">No log entries yet.</p>
                                ) : (
                                    machineLogs.map((log) => (
                                        <div key={log.id} className="px-4 py-3">
                                            <p className="text-sm text-slate-700 dark:text-slate-300">{log.note}</p>
                                            <p className="text-xs text-slate-400 mt-0.5">{new Date(log.timestamp).toLocaleString()}</p>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

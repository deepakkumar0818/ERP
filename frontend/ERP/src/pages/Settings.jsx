import { useState, useEffect } from 'react';
import { Settings as SettingsIcon, User, Bell, Lock, Globe, Database, CheckCircle2, ChevronRight } from 'lucide-react';

const SETTINGS_KEY = 'erp_settings';

const defaultSettings = {
    companyName: 'Factory ERP',
    currency: 'INR',
    timezone: 'Asia/Kolkata',
    language: 'en',
    emailNotifications: true,
    lowStockAlerts: true,
    orderUpdates: true,
    twoFactorAuth: false,
    sessionTimeout: '24',
};

function loadSettings() {
    try { return { ...defaultSettings, ...JSON.parse(localStorage.getItem(SETTINGS_KEY) || '{}') }; }
    catch { return defaultSettings; }
}

function Section({ title, icon: Icon, children }) {
    return (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden">
            <div className="flex items-center gap-3 px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50">
                <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-500/10">
                    <Icon className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                </div>
                <h3 className="font-semibold text-slate-900 dark:text-white">{title}</h3>
            </div>
            <div className="p-6 space-y-4">{children}</div>
        </div>
    );
}

function Field({ label, hint, children }) {
    return (
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div>
                <p className="text-sm font-medium text-slate-700 dark:text-slate-300">{label}</p>
                {hint && <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">{hint}</p>}
            </div>
            <div className="md:w-56 shrink-0">{children}</div>
        </div>
    );
}

function Toggle({ checked, onChange }) {
    return (
        <button type="button" role="switch" aria-checked={checked} onClick={() => onChange(!checked)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${checked ? 'bg-indigo-600' : 'bg-slate-200 dark:bg-slate-700'}`}>
            <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${checked ? 'translate-x-6' : 'translate-x-1'}`} />
        </button>
    );
}

export default function Settings() {
    const [cfg, setCfg]     = useState(loadSettings);
    const [saved, setSaved] = useState(false);

    useEffect(() => {
        localStorage.setItem(SETTINGS_KEY, JSON.stringify(cfg));
    }, [cfg]);

    const set = (key, val) => { setCfg((p) => ({ ...p, [key]: val })); setSaved(false); };

    const handleSave = (e) => {
        e.preventDefault();
        localStorage.setItem(SETTINGS_KEY, JSON.stringify(cfg));
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
    };

    const inputCls  = 'w-full px-3 py-2 border border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm';
    const selectCls = inputCls;

    return (
        <div className="space-y-6 animate-in fade-in duration-500 max-w-3xl">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white">System Settings</h1>
                    <p className="text-slate-500 dark:text-slate-400">Configure your manufacturing workspace.</p>
                </div>
                {saved && (
                    <div className="flex items-center gap-2 text-sm text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-2 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20">
                        <CheckCircle2 className="h-4 w-4" />Settings saved
                    </div>
                )}
            </div>

            <form onSubmit={handleSave} className="space-y-6">
                <Section title="General" icon={SettingsIcon}>
                    <Field label="Company Name" hint="Displayed in headers and reports.">
                        <input className={inputCls} value={cfg.companyName} onChange={(e) => set('companyName', e.target.value)} />
                    </Field>
                    <Field label="Currency" hint="Used in all financial displays.">
                        <select className={selectCls} value={cfg.currency} onChange={(e) => set('currency', e.target.value)}>
                            <option value="INR">INR — Indian Rupee (₹)</option>
                            <option value="USD">USD — US Dollar ($)</option>
                            <option value="EUR">EUR — Euro (€)</option>
                            <option value="GBP">GBP — British Pound (£)</option>
                        </select>
                    </Field>
                    <Field label="Timezone">
                        <select className={selectCls} value={cfg.timezone} onChange={(e) => set('timezone', e.target.value)}>
                            <option value="Asia/Kolkata">Asia/Kolkata (IST +5:30)</option>
                            <option value="UTC">UTC</option>
                            <option value="America/New_York">America/New_York (EST)</option>
                            <option value="Europe/London">Europe/London (GMT)</option>
                            <option value="Asia/Dubai">Asia/Dubai (GST +4)</option>
                        </select>
                    </Field>
                    <Field label="Language">
                        <select className={selectCls} value={cfg.language} onChange={(e) => set('language', e.target.value)}>
                            <option value="en">English</option>
                            <option value="hi">Hindi</option>
                            <option value="mr">Marathi</option>
                        </select>
                    </Field>
                </Section>

                <Section title="Notifications" icon={Bell}>
                    <Field label="Email Notifications" hint="Send summary emails for key events.">
                        <Toggle checked={cfg.emailNotifications} onChange={(v) => set('emailNotifications', v)} />
                    </Field>
                    <Field label="Low Stock Alerts" hint="Alert when inventory quantity hits zero.">
                        <Toggle checked={cfg.lowStockAlerts} onChange={(v) => set('lowStockAlerts', v)} />
                    </Field>
                    <Field label="Order Status Updates" hint="Notify on sales order and job order changes.">
                        <Toggle checked={cfg.orderUpdates} onChange={(v) => set('orderUpdates', v)} />
                    </Field>
                </Section>

                <Section title="Security" icon={Lock}>
                    <Field label="Two-Factor Authentication" hint="Require OTP on login (coming soon).">
                        <Toggle checked={cfg.twoFactorAuth} onChange={(v) => set('twoFactorAuth', v)} />
                    </Field>
                    <Field label="Session Timeout" hint="Auto logout after inactivity.">
                        <select className={selectCls} value={cfg.sessionTimeout} onChange={(e) => set('sessionTimeout', e.target.value)}>
                            <option value="1">1 hour</option>
                            <option value="8">8 hours</option>
                            <option value="24">24 hours</option>
                            <option value="72">72 hours</option>
                        </select>
                    </Field>
                </Section>

                <Section title="Data Management" icon={Database}>
                    <div className="flex flex-col md:flex-row gap-3">
                        <button type="button"
                            onClick={() => { if (window.confirm('Clear all local data and reload?')) { localStorage.clear(); window.location.reload(); } }}
                            className="flex items-center justify-between gap-2 w-full px-4 py-3 border border-rose-200 dark:border-rose-500/30 rounded-xl text-sm font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-colors">
                            <span>Clear All Local Data</span><ChevronRight className="h-4 w-4" />
                        </button>
                        <button type="button"
                            onClick={() => { const d = JSON.stringify(cfg, null, 2); const b = new Blob([d], { type: 'application/json' }); const u = URL.createObjectURL(b); const a = document.createElement('a'); a.href = u; a.download = 'erp_settings.json'; a.click(); URL.revokeObjectURL(u); }}
                            className="flex items-center justify-between gap-2 w-full px-4 py-3 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                            <span>Export Settings (JSON)</span><ChevronRight className="h-4 w-4" />
                        </button>
                    </div>
                </Section>

                <Section title="Integrations" icon={Globe}>
                    <div className="space-y-3">
                        {[
                            { label: 'Backend API', status: 'Connected',             hint: (typeof import.meta !== 'undefined' && import.meta.env?.VITE_API_BASE_URL) || 'http://localhost:5000' },
                            { label: 'Database',    status: 'NeonDB (PostgreSQL)',   hint: 'Managed via Prisma ORM' },
                            { label: 'Auth',        status: 'JWT Bearer Token',      hint: '24-hour token expiry' },
                        ].map(({ label, status, hint }) => (
                            <div key={label} className="flex items-center justify-between py-2 border-b border-slate-100 dark:border-slate-800 last:border-0">
                                <div>
                                    <p className="text-sm font-medium text-slate-700 dark:text-slate-300">{label}</p>
                                    <p className="text-xs text-slate-400 dark:text-slate-500">{hint}</p>
                                </div>
                                <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-100 dark:border-emerald-500/20">
                                    {status}
                                </span>
                            </div>
                        ))}
                    </div>
                </Section>

                <div className="flex justify-end">
                    <button type="submit"
                        className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-2.5 rounded-xl font-semibold text-sm hover:bg-indigo-700 shadow-sm">
                        <User className="h-4 w-4" />Save Settings
                    </button>
                </div>
            </form>
        </div>
    );
}

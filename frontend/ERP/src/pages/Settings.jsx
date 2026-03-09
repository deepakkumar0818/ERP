import React from 'react';
import { Settings as SettingsIcon, User, Bell, Lock, Globe, Database } from 'lucide-react';

export default function Settings() {
    const sections = [
        { title: 'General', icon: SettingsIcon, desc: 'Company profile, currency, and language.' },
        { title: 'Team Management', icon: User, desc: 'Manage user roles and permissions.' },
        { title: 'Notifications', icon: Bell, desc: 'Configure system alerts and email reports.' },
        { title: 'Security', icon: Lock, desc: 'Password policies and two-factor authentication.' },
        { title: 'Integrations', icon: Globe, desc: 'Connect with external ERPs and IoT devices.' },
        { title: 'Data Management', icon: Database, desc: 'Backups, export data, and system logs.' },
    ];

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div>
                <h1 className="text-2xl font-bold text-slate-900">System Settings</h1>
                <p className="text-slate-500">Global configuration for your manufacturing workspace.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {sections.map((section, i) => (
                    <button key={i} className="flex flex-col items-start p-6 bg-white rounded-2xl border border-slate-100 shadow-sm hover:border-indigo-300 hover:shadow-md transition-all text-left group">
                        <div className="p-3 rounded-xl bg-slate-50 text-slate-500 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors mb-4">
                            <section.icon className="h-6 w-6" />
                        </div>
                        <h3 className="font-bold text-slate-900">{section.title}</h3>
                        <p className="text-sm text-slate-500 mt-1">{section.desc}</p>
                    </button>
                ))}
            </div>
        </div>
    );
}

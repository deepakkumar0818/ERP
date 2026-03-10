import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import {
    BarChart2, Package, Truck, ShieldCheck, Settings, Globe,
    ArrowRight, CheckCircle
} from 'lucide-react';

const features = [
    {
        icon: BarChart2,
        title: 'Deep Analytics',
        description: 'Real-time dashboards, custom KPIs, and predictive insights to keep operations ahead of schedule.',
    },
    {
        icon: Package,
        title: 'Inventory Engine',
        description: 'Automated stock tracking, multi-warehouse support, and intelligent reorder alerts.',
    },
    {
        icon: Truck,
        title: 'Logistics Hub',
        description: 'End-to-end shipment tracking, carrier integration, and automated packing slips.',
    },
    {
        icon: ShieldCheck,
        title: 'Quality Shield',
        description: 'Inline quality checkpoints, non-conformance reports, and audit trails.',
    },
    {
        icon: Settings,
        title: 'Smart Production',
        description: 'Work order scheduling, BOM management, and machine utilisation monitoring.',
    },
    {
        icon: Globe,
        title: 'Global Scale',
        description: 'Multi-currency, multi-language, and multi-entity support out of the box.',
    },
];

const highlights = [
    'No-code configuration for most workflows',
    'Open REST API for custom integrations',
    'Role-based access control',
    'SOC 2 Type II certified infrastructure',
    'Real-time collaboration across teams',
    '99.9% uptime SLA',
];

export default function Platform() {
    return (
        <div className="min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-white">
            <Navbar />

            {/* Hero */}
            <section className="pt-36 pb-20 px-6 text-center bg-gradient-to-b from-indigo-50/60 to-white dark:from-indigo-950/30 dark:to-slate-950">
                <span className="inline-block mb-4 px-4 py-1.5 rounded-full text-xs font-semibold bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 uppercase tracking-widest">
                    The Platform
                </span>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight max-w-3xl mx-auto">
                    Everything your factory needs,{' '}
                    <span className="bg-gradient-to-r from-indigo-600 to-purple-500 bg-clip-text text-transparent">
                        in one place
                    </span>
                </h1>
                <p className="mt-6 text-lg text-slate-600 dark:text-slate-400 max-w-xl mx-auto">
                    A unified manufacturing ERP built for speed, scale, and simplicity — from shop floor to C-suite.
                </p>
                <div className="mt-10 flex flex-wrap gap-4 justify-center">
                    <Link
                        to="/register"
                        className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-indigo-600 text-white font-semibold hover:bg-indigo-700 shadow-lg transition-all"
                    >
                        Start Free Trial <ArrowRight className="h-4 w-4" />
                    </Link>
                    <Link
                        to="/login"
                        className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full border border-slate-300 dark:border-slate-700 font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"
                    >
                        Sign In
                    </Link>
                </div>
            </section>

            {/* Features Grid */}
            <section className="py-20 px-6 max-w-6xl mx-auto">
                <h2 className="text-3xl font-bold text-center mb-4">Core Modules</h2>
                <p className="text-center text-slate-500 dark:text-slate-400 mb-12 max-w-xl mx-auto">
                    Every module is deeply integrated so data flows automatically across your entire operation.
                </p>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {features.map(({ icon: Icon, title, description }) => (
                        <div
                            key={title}
                            className="p-6 rounded-2xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 hover:shadow-lg hover:border-indigo-200 dark:hover:border-indigo-800 transition-all group"
                        >
                            <div className="h-12 w-12 rounded-xl bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                <Icon className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                            </div>
                            <h3 className="font-bold text-lg mb-2">{title}</h3>
                            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{description}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Highlights */}
            <section className="py-16 px-6 bg-indigo-50/50 dark:bg-slate-900/50">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-3xl font-bold mb-12">Built for enterprise, priced for growth</h2>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 text-left">
                        {highlights.map((h) => (
                            <div key={h} className="flex items-start gap-3 p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
                                <CheckCircle className="h-5 w-5 text-emerald-500 mt-0.5 shrink-0" />
                                <span className="text-sm font-medium">{h}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-20 px-6 text-center">
                <h2 className="text-3xl font-bold mb-4">Ready to transform your operations?</h2>
                <p className="text-slate-500 dark:text-slate-400 mb-8">Get up and running in under 14 days.</p>
                <Link
                    to="/register"
                    className="inline-flex items-center gap-2 px-10 py-4 rounded-full bg-indigo-600 text-white font-semibold hover:bg-indigo-700 shadow-lg text-lg transition-all"
                >
                    Get Started Free <ArrowRight className="h-5 w-5" />
                </Link>
            </section>

            {/* Footer back link */}
            <div className="pb-10 text-center">
                <Link to="/" className="text-sm text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                    ← Back to Home
                </Link>
            </div>
        </div>
    );
}

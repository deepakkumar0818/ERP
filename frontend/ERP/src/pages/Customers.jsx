import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { Star, ArrowRight, TrendingUp, Clock, Package } from 'lucide-react';

const testimonials = [
    {
        name: 'Rajesh Kumar',
        role: 'Director of Operations',
        company: 'Bharat-Forge Inc.',
        quote:
            'We reduced our inventory holding costs by 42% within the first quarter. The platform\'s real-time visibility completely changed how we manage our supply chain.',
        metric: '42% cost reduction',
        metricIcon: TrendingUp,
    },
    {
        name: 'Priya Sharma',
        role: 'VP Manufacturing',
        company: 'Tata Motors',
        quote:
            'Production scheduling that used to take our team 3 days now takes 20 minutes. The BOM and production order modules are best-in-class.',
        metric: '3 days → 20 mins',
        metricIcon: Clock,
    },
    {
        name: 'Arun Mehta',
        role: 'Supply Chain Head',
        company: 'Mahindra Group',
        quote:
            'On-time delivery jumped from 72% to 98% in six months. Our customers noticed before we even announced the change.',
        metric: '98% on-time delivery',
        metricIcon: Package,
    },
];

const logos = [
    'Tata Motors', 'Mahindra', 'Godrej', 'Hero MotoCorp', 'Bharat Forge', 'TVS Motor',
];

const stats = [
    { label: 'Manufacturers', value: '1,200+' },
    { label: 'Countries', value: '28' },
    { label: 'Orders processed', value: '50M+' },
    { label: 'Avg. ROI in year 1', value: '3.2×' },
];

export default function Customers() {
    return (
        <div className="min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-white">
            <Navbar />

            {/* Hero */}
            <section className="pt-36 pb-16 px-6 text-center bg-gradient-to-b from-emerald-50/60 to-white dark:from-emerald-950/20 dark:to-slate-950">
                <span className="inline-block mb-4 px-4 py-1.5 rounded-full text-xs font-semibold bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">
                    Customers
                </span>
                <h1 className="text-4xl md:text-5xl font-extrabold leading-tight max-w-2xl mx-auto">
                    Trusted by{' '}
                    <span className="bg-gradient-to-r from-emerald-600 to-indigo-500 bg-clip-text text-transparent">
                        India's best manufacturers
                    </span>
                </h1>
                <p className="mt-6 text-lg text-slate-600 dark:text-slate-400 max-w-xl mx-auto">
                    See how leading companies transformed their operations with our ERP platform.
                </p>
            </section>

            {/* Stats */}
            <section className="max-w-5xl mx-auto px-6 py-12">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {stats.map(({ label, value }) => (
                        <div key={label} className="text-center p-6 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
                            <p className="text-3xl font-extrabold text-indigo-600 dark:text-indigo-400">{value}</p>
                            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{label}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Logo strip */}
            <section className="max-w-5xl mx-auto px-6 pb-12">
                <p className="text-center text-xs font-semibold uppercase tracking-widest text-slate-400 mb-6">Trusted by</p>
                <div className="flex flex-wrap justify-center gap-6">
                    {logos.map((name) => (
                        <div
                            key={name}
                            className="px-6 py-3 rounded-xl border border-slate-200 dark:border-slate-800 text-sm font-semibold text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-900"
                        >
                            {name}
                        </div>
                    ))}
                </div>
            </section>

            {/* Testimonials */}
            <section className="max-w-6xl mx-auto px-6 py-12 pb-20">
                <h2 className="text-3xl font-bold text-center mb-12">What our customers say</h2>
                <div className="grid md:grid-cols-3 gap-8">
                    {testimonials.map(({ name, role, company, quote, metric, metricIcon: Icon }) => (
                        <div
                            key={name}
                            className="p-8 rounded-2xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 hover:shadow-lg transition-all flex flex-col"
                        >
                            <div className="flex gap-0.5 mb-4">
                                {Array.from({ length: 5 }).map((_, i) => (
                                    <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                                ))}
                            </div>
                            <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed flex-1 mb-6">"{quote}"</p>
                            <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-800 pt-4">
                                <div>
                                    <p className="font-bold text-sm">{name}</p>
                                    <p className="text-xs text-slate-500">{role}, {company}</p>
                                </div>
                                <div className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 text-xs font-bold">
                                    <Icon className="h-4 w-4" />
                                    {metric}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* CTA */}
            <section className="py-16 px-6 text-center bg-indigo-50/50 dark:bg-slate-900/50">
                <h2 className="text-2xl font-bold mb-4">Join 1,200+ manufacturers</h2>
                <p className="text-slate-500 dark:text-slate-400 mb-8">Start your free trial today. No credit card required.</p>
                <Link
                    to="/register"
                    className="inline-flex items-center gap-2 px-10 py-4 rounded-full bg-indigo-600 text-white font-semibold hover:bg-indigo-700 shadow-lg text-lg transition-all"
                >
                    Get Started Free <ArrowRight className="h-5 w-5" />
                </Link>
            </section>

            <div className="pb-10 text-center">
                <Link to="/" className="text-sm text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                    ← Back to Home
                </Link>
            </div>
        </div>
    );
}

import React, { useRef, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import {
    CheckCircle2,
    Settings,
    BarChart3,
    ShieldCheck,
    Zap,
    Box,
    Truck,
    ChevronRight,
    ArrowRight,
    Monitor,
    Database,
    Users,
    MessageSquare
} from 'lucide-react';

const Counter = ({ end, duration = 2000, suffix = "", decimals = 0 }) => {
    const [count, setCount] = useState(0);
    const countRef = useRef(null);
    const [hasStarted, setHasStarted] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting && !hasStarted) {
                    setHasStarted(true);
                }
            },
            { threshold: 0.1 }
        );

        if (countRef.current) observer.observe(countRef.current);
        return () => observer.disconnect();
    }, [hasStarted]);

    useEffect(() => {
        if (hasStarted) {
            let startTime = null;
            const step = (timestamp) => {
                if (!startTime) startTime = timestamp;
                const progress = Math.min((timestamp - startTime) / duration, 1);
                setCount(progress * end);
                if (progress < 1) {
                    window.requestAnimationFrame(step);
                }
            };
            window.requestAnimationFrame(step);
        }
    }, [hasStarted, end, duration]);

    return (
        <span ref={countRef}>
            {decimals > 0 ? count.toFixed(decimals) : Math.floor(count)}
            {suffix}
        </span>
    );
};

const caseStudies = ['Tata Motors', 'Mahindra', 'Godrej', 'Hero MotoCorp', 'Bharat Forge', 'TVS Motor'];

export default function LandingPage() {
    return (
        <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-indigo-100 selection:text-indigo-900">
            <Navbar />

            {/* Hero Section */}
            <section className="relative pt-44 pb-32 overflow-hidden">
                <div className="absolute inset-0 -z-10">
                    <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-200/30 rounded-full blur-[120px] animate-pulse" />
                    <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-purple-100/30 rounded-full blur-[120px]" />
                </div>

                <div className="max-w-7xl mx-auto px-6 text-center">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-sm font-semibold mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
                        </span>
                        v4.2 Now Live: AI-Powered Predictive Maintenance
                    </div>

                    <h1 className="text-6xl md:text-8xl font-black text-slate-900 leading-[1.1] tracking-tight max-w-5xl mx-auto animate-in fade-in slide-in-from-bottom-6 duration-1000">
                        The Future of <span className="text-transparent bg-clip-text bg-linear-to-r from-indigo-600 to-purple-600">Manufacturing</span> is Here.
                    </h1>

                    <p className="mt-8 text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200">
                        One platform to unify your shop floor, inventory, and analytics.
                        Decrease downtime by 34% and boost OEE within your first 30 days.
                    </p>

                    <div className="mt-12 flex flex-col sm:flex-row justify-center gap-4 animate-in fade-in slide-in-from-bottom-10 duration-1000 delay-300">
                        <Link
                            to="/dashboard"
                            className="group flex items-center justify-center gap-2 bg-indigo-600 text-white px-8 py-4 rounded-2xl text-lg font-bold hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-200"
                        >
                            Start Free Trial
                            <ChevronRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                        </Link>
                        <Link
                            to="/dashboard"
                            className="flex items-center justify-center gap-2 border-2 border-slate-200 text-slate-700 px-8 py-4 rounded-2xl text-lg font-bold hover:bg-slate-50 transition-all"
                        >
                            Book Live Demo
                        </Link>
                    </div>

                    {/* Dashboard Mockup */}
                    <div className="mt-24 relative max-w-6xl mx-auto animate-in fade-in zoom-in-95 duration-1000 delay-500">
                        <div className="absolute -inset-1 bg-linear-to-r from-indigo-500 to-purple-500 rounded-[32px] blur opacity-20" />
                        <div className="relative bg-slate-900 rounded-[28px] p-2 shadow-2xl border border-slate-800">
                            <img
                                src="/manufacturing_dashboard_mockup_1773044155894.png"
                                alt="ERP Dashboard Screenshot"
                                className="rounded-[24px] w-full"
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* Trusted By Section */}
            <section className="py-24 border-y border-slate-100 bg-slate-50/30">
                <div className="max-w-7xl mx-auto px-6">
                    <p className="text-center text-sm font-bold text-slate-400 uppercase tracking-widest mb-12">Trusted by 500+ Global Manufacturers</p>
                    <div className="flex flex-wrap justify-center items-center gap-12 md:gap-20 opacity-50 grayscale hover:grayscale-0 transition-all">
                        {caseStudies.map(name => (
                            <span key={name} className="text-2xl font-black text-slate-400 select-none">{name}</span>
                        ))}
                    </div>
                </div>
            </section>

            {/* Problems Section */}
            <section className="py-32 bg-white">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid lg:grid-cols-2 gap-20 items-center">
                        <div>
                            <h2 className="text-4xl md:text-5xl font-bold leading-tight mb-8">
                                Stop managing your factory with <span className="line-through text-slate-300">spreadsheets</span>.
                            </h2>
                            <div className="space-y-6">
                                {[
                                    { title: "Siloed Data", desc: "Disconnect between sales and production floor leads to missed deadlines." },
                                    { title: "Phantom Inventory", desc: "Stock outs on critical raw materials because of manual tracking errors." },
                                    { title: "Reactive Maintenance", desc: "Fixing machines only when they break costs 5x more than scheduled repairs." }
                                ].map((item, i) => (
                                    <div key={i} className="flex gap-4">
                                        <div className="shrink-0 h-6 w-6 rounded-full bg-rose-100 flex items-center justify-center mt-1">
                                            <div className="h-2 w-2 rounded-full bg-rose-500" />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-lg">{item.title}</h4>
                                            <p className="text-slate-500">{item.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="bg-slate-900 rounded-3xl p-10 text-white relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:rotate-12 transition-transform">
                                <Zap className="h-64 w-64" />
                            </div>
                            <h3 className="text-3xl font-bold mb-6 relative z-10">The ERP Solution</h3>
                            <div className="space-y-4 relative z-10">
                                {[
                                    "Real-time visibility across all assembly lines",
                                    "Automated material requirements planning (MRP)",
                                    "AI-driven predictive maintenance schedules",
                                    "Unified communication between all departments"
                                ].map((feat, i) => (
                                    <div key={i} className="flex items-center gap-3">
                                        <CheckCircle2 className="h-5 w-5 text-indigo-400" />
                                        <span className="font-medium">{feat}</span>
                                    </div>
                                ))}
                            </div>
                            <button className="mt-10 bg-white text-slate-900 px-6 py-3 rounded-xl font-bold hover:bg-slate-100 transition-colors">
                                Explore All Features
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Grid */}
            <section className="py-32 bg-slate-50">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center max-w-3xl mx-auto mb-24">
                        <h2 className="text-4xl md:text-5xl font-bold mb-6 italic">Built for the Shop Floor.</h2>
                        <p className="text-xl text-slate-600">Modules designed with factory workers in mind—simple enough for the floor, powerful enough for the boardroom.</p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[
                            { title: "Inventory Engine", icon: Box, color: "text-blue-600", bg: "bg-blue-50", desc: "Multi-warehouse tracking with QR/Barcode integration and automated reorder alerts." },
                            { title: "Smart Production", icon: Settings, color: "text-indigo-600", bg: "bg-indigo-50", desc: "Visual drag-and-drop scheduling for jobs, machines, and personnel with real-time OEE." },
                            { title: "Logistics Hub", icon: Truck, color: "text-emerald-600", bg: "bg-emerald-50", desc: "End-to-end shipping management from packing lists to GPS-tracked delivery confirmation." },
                            { title: "Quality Shield", icon: ShieldCheck, color: "text-rose-600", bg: "bg-rose-50", desc: "Rigorous digital checkpoints at every stage. Export ISO-compliant quality reports in seconds." },
                            { title: "Deep Analytics", icon: BarChart3, color: "text-amber-600", bg: "bg-amber-50", desc: "Predict your quarterly output and revenue with 94% accuracy using our ML engine." },
                            { title: "Global Scale", icon: Users, color: "text-purple-600", bg: "bg-purple-50", desc: "Manage 50+ plants from a single login. Multi-currency and localized tax compliance built-in." }
                        ].map((f, i) => (
                            <div key={i} className="bg-white p-10 rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all group">
                                <div className={`h-14 w-14 ${f.bg} ${f.color} rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform`}>
                                    <f.icon className="h-7 w-7" />
                                </div>
                                <h3 className="text-2xl font-bold mb-4">{f.title}</h3>
                                <p className="text-slate-500 leading-relaxed mb-6">{f.desc}</p>
                                <button className="text-indigo-600 font-bold flex items-center gap-1 group/btn hover:gap-2 transition-all">
                                    Learn more <ArrowRight className="h-4 w-4" />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Testimonials */}
            <section className="py-32 bg-white overflow-hidden">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="bg-indigo-600 rounded-[48px] p-12 md:p-24 text-white relative overflow-hidden">
                        <div className="relative z-10 flex flex-col md:flex-row gap-12 items-center">
                            <div className="shrink-0">
                                <div className="h-24 w-24 rounded-full border-4 border-white/20 p-1">
                                    <div className="h-full w-full rounded-full bg-slate-200" />
                                </div>
                            </div>
                            <div>
                                <MessageSquare className="h-12 w-12 text-indigo-300 mb-8 opacity-50" />
                                <p className="text-2xl md:text-4xl font-medium leading-snug mb-8">
                                    "Switching to ERP was the turning point for our Pune facility. We reduced waste by 22% in the first quarter alone. It's not just software; it's a productivity multiplier."
                                </p>
                                <div>
                                    <p className="text-xl font-bold">Rajesh Kumar</p>
                                    <p className="text-indigo-200 uppercase tracking-widest text-sm font-bold mt-1">Director of Operations, Bharat-Forge Inc</p>
                                </div>
                            </div>
                        </div>
                        {/* Abstract background shapes */}
                        <div className="absolute -bottom-24 -right-24 h-96 w-96 bg-white/10 rounded-full blur-3xl" />
                        <div className="absolute top-24 -left-24 h-64 w-64 bg-indigo-400/20 rounded-full blur-2xl" />
                    </div>
                </div>
            </section>

            <section className="py-24 bg-slate-900 text-white">
                <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-4 gap-12 text-center">
                    <div className="space-y-2">
                        <div className="text-5xl font-black text-indigo-400 tracking-tighter decoration-4 decoration-indigo-500 underline underline-offset-8">
                            <Counter end={98} suffix="%" />
                        </div>
                        <p className="text-slate-400 font-medium pt-4">On-time Delivery</p>
                    </div>
                    <div className="space-y-2">
                        <div className="text-5xl font-black text-indigo-400 tracking-tighter decoration-4 decoration-indigo-500 underline underline-offset-8">
                            <Counter end={42} suffix="%" />
                        </div>
                        <p className="text-slate-400 font-medium pt-4">Inventory Cost reduction</p>
                    </div>
                    <div className="space-y-2">
                        <div className="text-5xl font-black text-indigo-400 tracking-tighter decoration-4 decoration-indigo-500 underline underline-offset-8">
                            <Counter end={3.2} suffix="x" decimals={1} />
                        </div>
                        <p className="text-slate-400 font-medium pt-4">Production Speed</p>
                    </div>
                    <div className="space-y-2">
                        <div className="text-5xl font-black text-indigo-400 tracking-tighter decoration-4 decoration-indigo-500 underline underline-offset-8">
                            <Counter end={14} suffix=" Days" />
                        </div>
                        <p className="text-slate-400 font-medium pt-4">Implementation Time</p>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-32 bg-white">
                <div className="max-w-4xl mx-auto px-6 text-center">
                    <h2 className="text-4xl md:text-6xl font-black mb-8">Ready to modernize your operations?</h2>
                    <p className="text-xl text-slate-500 mb-12">Join hundreds of factories already building the future with ERP.</p>
                    <div className="flex flex-col sm:flex-row justify-center gap-4">
                        <Link to="/dashboard" className="bg-indigo-600 text-white px-10 py-5 rounded-2xl text-xl font-bold hover:bg-indigo-700 hover:scale-105 transition-all shadow-2xl shadow-indigo-200">
                            Start Free Trial
                        </Link>
                        <Link to="/dashboard" className="border-2 border-slate-200 text-slate-700 px-10 py-5 rounded-2xl text-xl font-bold hover:bg-slate-50 transition-all">
                            Talk to an Expert
                        </Link>
                    </div>
                    <p className="mt-8 text-slate-400 font-medium italic">No credit card required. Cancel anytime.</p>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-slate-50 pt-24 pb-12 border-t border-slate-200">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-12 mb-20">
                        <div className="col-span-2 lg:col-span-2">
                            <span className="text-2xl font-black text-indigo-600 tracking-tighter">ERP.</span>
                            <p className="mt-6 text-slate-500 max-w-xs leading-relaxed">
                                The operating system for modern global manufacturing. Built by experts, for the shop floor.
                            </p>
                        </div>
                        <div>
                            <h4 className="font-bold mb-6 text-slate-900">Platform</h4>
                            <ul className="space-y-4 text-slate-500 text-sm">
                                <li><Link to="/dashboard" className="hover:text-indigo-600 transition-colors">Production Dashboard</Link></li>
                                <li><Link to="/inventory" className="hover:text-indigo-600 transition-colors">Inventory Suite</Link></li>
                                <li><Link to="/quality" className="hover:text-indigo-600 transition-colors">Quality Control</Link></li>
                                <li><Link to="/reports" className="hover:text-indigo-600 transition-colors">Custom Analytics</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-bold mb-6 text-slate-900">Company</h4>
                            <ul className="space-y-4 text-slate-500 text-sm">
                                <li><Link to="/" className="hover:text-indigo-600 transition-colors">About Us</Link></li>
                                <li><Link to="/" className="hover:text-indigo-600 transition-colors">Careers</Link></li>
                                <li><Link to="/" className="hover:text-indigo-600 transition-colors">Press Kit</Link></li>
                                <li><Link to="/" className="hover:text-indigo-600 transition-colors">Contact</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-bold mb-6 text-slate-900">Support</h4>
                            <ul className="space-y-4 text-slate-500 text-sm">
                                <li><Link to="/" className="hover:text-indigo-600 transition-colors">Documentation</Link></li>
                                <li><Link to="/" className="hover:text-indigo-600 transition-colors">API Reference</Link></li>
                                <li><Link to="/" className="hover:text-indigo-600 transition-colors">Community</Link></li>
                                <li><Link to="/" className="hover:text-indigo-600 transition-colors">Privacy Policy</Link></li>
                            </ul>
                        </div>
                    </div>
                    <div className="pt-12 border-t border-slate-200 flex flex-col md:flex-row justify-between items-center gap-6">
                        <p className="text-slate-400 text-sm font-medium">© 2026 ERP. All rights reserved. Made in India for the World.</p>
                        <div className="flex gap-6 text-slate-400">
                            <Monitor className="h-5 w-5 hover:text-indigo-600 cursor-pointer transition-colors" />
                            <Database className="h-5 w-5 hover:text-indigo-600 cursor-pointer transition-colors" />
                            <Users className="h-5 w-5 hover:text-indigo-600 cursor-pointer transition-colors" />
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}
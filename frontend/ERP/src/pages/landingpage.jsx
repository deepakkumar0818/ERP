import React, { useRef, useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import AuthModal from '../components/AuthModal';
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

const erpProcessSlides = [
    {
        id: 0,
        label: "Raw Material Procurement",
        color: "#6366f1",
        accent: "#a5b4fc",
        bg: "from-indigo-950 to-slate-900",
        desc: "Automated PO generation, vendor evaluation, and real-time material tracking from source to store.",
        svg: (
            <svg viewBox="0 0 520 260" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                {/* Supplier boxes */}
                {[0, 1, 2].map(i => (
                    <g key={i} transform={`translate(${20 + i * 10}, ${40 + i * 60})`}>
                        <rect x="0" y="0" width="80" height="50" rx="8" fill="#312e81" stroke="#6366f1" strokeWidth="1.5" />
                        <rect x="10" y="8" width="20" height="16" rx="3" fill="#6366f1" opacity="0.6" />
                        <rect x="35" y="8" width="35" height="5" rx="2" fill="#a5b4fc" opacity="0.5" />
                        <rect x="35" y="17" width="25" height="5" rx="2" fill="#a5b4fc" opacity="0.3" />
                        <text x="40" y="42" fill="#a5b4fc" fontSize="9" fontWeight="bold" textAnchor="middle">Vendor {i + 1}</text>
                    </g>
                ))}
                {/* Arrows to central hub */}
                {[0, 1, 2].map(i => (
                    <line key={i} x1="110" y1={65 + i * 60} x2="200" y2="130" stroke="#6366f1" strokeWidth="1.5" strokeDasharray="5,3" opacity="0.7" />
                ))}
                {/* Central ERP Hub */}
                <circle cx="240" cy="130" r="48" fill="#1e1b4b" stroke="#6366f1" strokeWidth="2" />
                <circle cx="240" cy="130" r="38" fill="#312e81" opacity="0.5" />
                <text x="240" y="124" fill="#a5b4fc" fontSize="11" fontWeight="bold" textAnchor="middle">ERP</text>
                <text x="240" y="138" fill="#818cf8" fontSize="9" textAnchor="middle">Hub</text>
                {/* Arrows out to warehouse */}
                <line x1="288" y1="130" x2="360" y2="90" stroke="#6366f1" strokeWidth="1.5" opacity="0.7" />
                <line x1="288" y1="130" x2="360" y2="130" stroke="#6366f1" strokeWidth="1.5" opacity="0.7" />
                <line x1="288" y1="130" x2="360" y2="170" stroke="#6366f1" strokeWidth="1.5" opacity="0.7" />
                {/* Warehouse shelves */}
                {[0, 1, 2].map(i => (
                    <g key={i} transform={`translate(360, ${72 + i * 42})`}>
                        <rect width="110" height="34" rx="6" fill="#1e1b4b" stroke="#6366f1" strokeWidth="1.2" />
                        {[0, 1, 2, 3].map(j => (
                            <rect key={j} x={8 + j * 24} y="7" width="16" height="20" rx="3" fill="#6366f1" opacity={0.3 + j * 0.15} />
                        ))}
                        <text x="55" y="28" fill="#a5b4fc" fontSize="8" textAnchor="middle">Rack {String.fromCharCode(65 + i)}</text>
                    </g>
                ))}
                {/* Animated dots on arrows */}
                <circle cx="160" cy="97" r="4" fill="#6366f1" opacity="0.9">
                    <animateMotion dur="2s" repeatCount="indefinite" path="M-50,-35 L90,33" />
                </circle>
                <circle cx="160" cy="130" r="4" fill="#818cf8" opacity="0.9">
                    <animateMotion dur="2.5s" repeatCount="indefinite" path="M-50,0 L90,0" />
                </circle>
                {/* Label */}
                <text x="260" y="245" fill="#6366f1" fontSize="12" fontWeight="bold" textAnchor="middle" opacity="0.7">Procurement Flow</text>
            </svg>
        )
    },
    {
        id: 1,
        label: "Production Planning",
        color: "#0ea5e9",
        accent: "#7dd3fc",
        bg: "from-sky-950 to-slate-900",
        desc: "Visual Gantt scheduling, MRP automation, and capacity planning aligned with real-time demand.",
        svg: (
            <svg viewBox="0 0 520 260" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                {/* Gantt grid */}
                <rect x="20" y="20" width="480" height="200" rx="10" fill="#0c1a2e" stroke="#0ea5e9" strokeWidth="1.2" opacity="0.7" />
                {/* Column headers */}
                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((d, i) => (
                    <g key={d}>
                        <rect x={70 + i * 58} y="24" width="56" height="22" rx="4" fill="#0ea5e9" opacity="0.15" />
                        <text x={98 + i * 58} y="39" fill="#7dd3fc" fontSize="10" textAnchor="middle">{d}</text>
                    </g>
                ))}
                {/* Row labels */}
                {['Assembly', 'Welding', 'Painting', 'Packing', 'QC'].map((r, i) => (
                    <text key={r} x="60" y={78 + i * 32} fill="#7dd3fc" fontSize="10" textAnchor="end">{r}</text>
                ))}
                {/* Gantt bars */}
                {[
                    { row: 0, start: 0, span: 3, color: "#0ea5e9" },
                    { row: 0, start: 4, span: 2, color: "#38bdf8" },
                    { row: 1, start: 1, span: 4, color: "#0284c7" },
                    { row: 2, start: 2, span: 3, color: "#0ea5e9" },
                    { row: 2, start: 6, span: 1, color: "#38bdf8" },
                    { row: 3, start: 3, span: 3, color: "#0369a1" },
                    { row: 4, start: 0, span: 2, color: "#0ea5e9" },
                    { row: 4, start: 4, span: 3, color: "#0284c7" },
                ].map((b, i) => (
                    <rect key={i} x={70 + b.start * 58} y={65 + b.row * 32} width={b.span * 58 - 4} height="20" rx="5" fill={b.color} opacity="0.75" />
                ))}
                {/* Today marker */}
                <line x1="244" y1="46" x2="244" y2="218" stroke="#f59e0b" strokeWidth="2" strokeDasharray="4,3" opacity="0.8" />
                <rect x="230" y="18" width="28" height="14" rx="3" fill="#f59e0b" />
                <text x="244" y="28" fill="#1c1917" fontSize="8" fontWeight="bold" textAnchor="middle">TODAY</text>
                {/* Progress dots */}
                {[0, 1, 2].map(i => (
                    <circle key={i} cx={80 + i * 58} cy="175" r="5" fill="#0ea5e9" opacity={0.4 + i * 0.2} />
                ))}
                <text x="260" y="245" fill="#0ea5e9" fontSize="12" fontWeight="bold" textAnchor="middle" opacity="0.7">Production Schedule</text>
            </svg>
        )
    },
    {
        id: 2,
        label: "Shop Floor Operations",
        color: "#10b981",
        accent: "#6ee7b7",
        bg: "from-emerald-950 to-slate-900",
        desc: "Real-time OEE monitoring, machine status, and operator assignment across all production lines.",
        svg: (
            <svg viewBox="0 0 520 260" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                {/* Conveyor belt */}
                <rect x="30" y="160" width="460" height="16" rx="8" fill="#064e3b" stroke="#10b981" strokeWidth="1.5" />
                {[0, 1, 2, 3, 4, 5, 6, 7].map(i => (
                    <rect key={i} x={42 + i * 56} y="162" width="28" height="12" rx="4" fill="#10b981" opacity="0.3" />
                ))}
                {/* Conveyor items */}
                {[0, 1, 2, 3].map(i => (
                    <g key={i}>
                        <rect x={60 + i * 110} y="140" width="40" height="22" rx="5" fill="#065f46" stroke="#10b981" strokeWidth="1.2" />
                        <rect x={68 + i * 110} y="146" width="12" height="10" rx="2" fill="#10b981" opacity="0.6" />
                    </g>
                ))}
                {/* Machines */}
                {[
                    { x: 50, label: "CNC-01", status: "#10b981", oee: 87 },
                    { x: 170, label: "WLD-02", status: "#f59e0b", oee: 72 },
                    { x: 290, label: "PNT-03", status: "#10b981", oee: 91 },
                    { x: 410, label: "ASM-04", status: "#ef4444", oee: 45 },
                ].map((m, i) => (
                    <g key={i}>
                        <rect x={m.x} y="50" width="80" height="80" rx="10" fill="#022c22" stroke={m.status} strokeWidth="2" />
                        <rect x={m.x + 10} y="60" width="60" height="35" rx="5" fill="#065f46" opacity="0.5" />
                        <circle cx={m.x + 40} cy="110" r="8" fill={m.status} opacity="0.85" />
                        <circle cx={m.x + 40} cy="110" r="4" fill="#022c22" />
                        <text x={m.x + 40} y="146" fill="#6ee7b7" fontSize="9" textAnchor="middle">{m.label}</text>
                        {/* OEE bar */}
                        <rect x={m.x + 8} y="120" width="64" height="7" rx="3" fill="#065f46" />
                        <rect x={m.x + 8} y="120" width={64 * m.oee / 100} height="7" rx="3" fill={m.status} opacity="0.8" />
                        <text x={m.x + 40} y="130" fill={m.status} fontSize="7" textAnchor="middle">{m.oee}%</text>
                    </g>
                ))}
                {/* Legend */}
                <circle cx="50" cy="235" r="5" fill="#10b981" />
                <text x="60" y="239" fill="#6ee7b7" fontSize="9">Running</text>
                <circle cx="115" cy="235" r="5" fill="#f59e0b" />
                <text x="125" y="239" fill="#6ee7b7" fontSize="9">Warning</text>
                <circle cx="183" cy="235" r="5" fill="#ef4444" />
                <text x="193" y="239" fill="#6ee7b7" fontSize="9">Down</text>
                <text x="340" y="239" fill="#10b981" fontSize="10" fontWeight="bold" textAnchor="middle" opacity="0.7">Live Shop Floor</text>
                {/* Pulse on running machine */}
                <circle cx="90" cy="110" r="12" fill="#10b981" opacity="0">
                    <animate attributeName="r" values="8;18;8" dur="2s" repeatCount="indefinite" />
                    <animate attributeName="opacity" values="0.4;0;0.4" dur="2s" repeatCount="indefinite" />
                </circle>
            </svg>
        )
    },
    {
        id: 3,
        label: "Quality Control",
        color: "#f59e0b",
        accent: "#fcd34d",
        bg: "from-amber-950 to-slate-900",
        desc: "Digital inspection checkpoints, automated defect detection, and ISO-compliant reporting at every stage.",
        svg: (
            <svg viewBox="0 0 520 260" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                {/* Checklist */}
                <rect x="30" y="30" width="180" height="200" rx="12" fill="#1c1007" stroke="#f59e0b" strokeWidth="1.5" />
                <rect x="50" y="20" width="140" height="24" rx="6" fill="#f59e0b" />
                <text x="120" y="36" fill="#1c1007" fontSize="11" fontWeight="bold" textAnchor="middle">QC Checklist</text>
                {[
                    { label: "Dimensions", pass: true },
                    { label: "Surface Finish", pass: true },
                    { label: "Weld Integrity", pass: true },
                    { label: "Paint Thickness", pass: false },
                    { label: "Load Testing", pass: true },
                    { label: "ISO Cert.", pass: true },
                ].map((item, i) => (
                    <g key={i}>
                        <rect x="45" y={60 + i * 28} width="155" height="22" rx="5" fill={item.pass ? "#451a03" : "#7f1d1d"} opacity="0.7" />
                        <circle cx="62" cy={71 + i * 28} r="7" fill={item.pass ? "#f59e0b" : "#ef4444"} />
                        <text x="63" y="74" dy={i * 28} fill="#1c1007" fontSize="10" fontWeight="bold" textAnchor="middle">{item.pass ? "✓" : "✗"}</text>
                        <text x="76" y={75 + i * 28} fill="#fcd34d" fontSize="9">{item.label}</text>
                    </g>
                ))}
                {/* Pie chart */}
                <g transform="translate(280,130)">
                    <circle cx="0" cy="0" r="80" fill="#1c1007" stroke="#f59e0b" strokeWidth="1.2" />
                    {/* Pass arc ~92% */}
                    <path d="M0,-80 A80,80 0 1,1 -49.5,62.5 L0,0 Z" fill="#f59e0b" opacity="0.8" />
                    {/* Fail arc ~8% */}
                    <path d="M-49.5,62.5 A80,80 0 0,1 0,-80 L0,0 Z" fill="#ef4444" opacity="0.7" />
                    <circle cx="0" cy="0" r="52" fill="#1c1007" />
                    <text x="0" y="-8" fill="#fcd34d" fontSize="22" fontWeight="black" textAnchor="middle">92%</text>
                    <text x="0" y="10" fill="#f59e0b" fontSize="10" textAnchor="middle">Pass Rate</text>
                    {/* Legend */}
                    <rect x="-80" y="95" width="12" height="12" rx="2" fill="#f59e0b" opacity="0.8" />
                    <text x="-62" y="105" fill="#fcd34d" fontSize="9">Pass (1,104)</text>
                    <rect x="20" y="95" width="12" height="12" rx="2" fill="#ef4444" opacity="0.7" />
                    <text x="38" y="105" fill="#fcd34d" fontSize="9">Fail (96)</text>
                </g>
                <text x="260" y="245" fill="#f59e0b" fontSize="12" fontWeight="bold" textAnchor="middle" opacity="0.7">Quality Dashboard</text>
            </svg>
        )
    },
    {
        id: 4,
        label: "Inventory Management",
        color: "#8b5cf6",
        accent: "#c4b5fd",
        bg: "from-violet-950 to-slate-900",
        desc: "Multi-warehouse bin tracking, automated reorder triggers, and barcode/RFID integration.",
        svg: (
            <svg viewBox="0 0 520 260" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                {/* Warehouse outline */}
                <rect x="20" y="40" width="480" height="180" rx="12" fill="#1e1035" stroke="#8b5cf6" strokeWidth="1.5" />
                {/* Roof */}
                <path d="M20 52 L260 18 L500 52" stroke="#8b5cf6" strokeWidth="1.5" fill="none" opacity="0.5" />
                {/* Shelf racks */}
                {[0, 1, 2, 3].map(col => (
                    <g key={col} transform={`translate(${40 + col * 115}, 55)`}>
                        {/* Vertical posts */}
                        <rect x="0" y="0" width="5" height="140" rx="2" fill="#8b5cf6" opacity="0.5" />
                        <rect x="95" y="0" width="5" height="140" rx="2" fill="#8b5cf6" opacity="0.5" />
                        {/* Shelves */}
                        {[0, 1, 2, 3].map(row => (
                            <g key={row}>
                                <rect x="0" y={row * 35} width="100" height="4" rx="2" fill="#8b5cf6" opacity="0.4" />
                                {/* Items on shelf */}
                                {[0, 1, 2].map(item => (
                                    <rect key={item}
                                        x={6 + item * 30} y={row * 35 - 24}
                                        width="24" height="22" rx="3"
                                        fill="#7c3aed"
                                        opacity={Math.random() > 0.25 ? 0.6 + item * 0.1 : 0.15}
                                    />
                                ))}
                            </g>
                        ))}
                    </g>
                ))}
                {/* Forklift icon */}
                <g transform="translate(430,165)">
                    <rect x="0" y="0" width="45" height="30" rx="5" fill="#4c1d95" stroke="#8b5cf6" strokeWidth="1.2" />
                    <rect x="45" y="5" width="5" height="25" rx="2" fill="#8b5cf6" opacity="0.7" />
                    <rect x="45" y="5" width="20" height="4" rx="2" fill="#8b5cf6" opacity="0.7" />
                    <circle cx="10" cy="32" r="7" fill="#6d28d9" />
                    <circle cx="35" cy="32" r="7" fill="#6d28d9" />
                    <circle cx="10" cy="32" r="3" fill="#1e1035" />
                    <circle cx="35" cy="32" r="3" fill="#1e1035" />
                </g>
                {/* Stock level bars on side */}
                <g transform="translate(6, 55)">
                    {[
                        { label: "SKU-A", pct: 0.85, color: "#8b5cf6" },
                        { label: "SKU-B", pct: 0.30, color: "#ef4444" },
                        { label: "SKU-C", pct: 0.65, color: "#8b5cf6" },
                        { label: "SKU-D", pct: 0.10, color: "#ef4444" },
                    ].map((s, i) => (
                        <g key={i} transform={`translate(0, ${i * 35})`}>
                            <text x="8" y="10" fill="#c4b5fd" fontSize="7">{s.label}</text>
                            <rect x="8" y="14" width="20" height="4" rx="2" fill="#2e1065" />
                            <rect x="8" y="14" width={20 * s.pct} height="4" rx="2" fill={s.color} opacity="0.8" />
                        </g>
                    ))}
                </g>
                {/* Alert badge */}
                <rect x="380" y="22" width="110" height="20" rx="10" fill="#ef4444" opacity="0.85" />
                <text x="435" y="36" fill="white" fontSize="9" fontWeight="bold" textAnchor="middle">⚠ 2 Low Stock Alerts</text>
                <text x="260" y="248" fill="#8b5cf6" fontSize="12" fontWeight="bold" textAnchor="middle" opacity="0.7">Warehouse Overview</text>
            </svg>
        )
    },
    {
        id: 5,
        label: "Dispatch & Shipping",
        color: "#06b6d4",
        accent: "#67e8f9",
        bg: "from-cyan-950 to-slate-900",
        desc: "Route optimization, GPS-tracked delivery, e-way bill generation, and customer delivery confirmation.",
        svg: (
            <svg viewBox="0 0 520 260" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                {/* Road */}
                <rect x="0" y="155" width="520" height="50" fill="#0a1628" opacity="0.7" />
                <line x1="0" y1="180" x2="520" y2="180" stroke="#1e40af" strokeWidth="2" strokeDasharray="30,20" />
                {/* Truck */}
                <g transform="translate(60, 115)">
                    <rect x="40" y="0" width="130" height="55" rx="6" fill="#0e7490" stroke="#06b6d4" strokeWidth="1.5" />
                    <rect x="0" y="12" width="46" height="43" rx="6" fill="#0c4a6e" stroke="#06b6d4" strokeWidth="1.5" />
                    <rect x="4" y="16" width="34" height="22" rx="4" fill="#06b6d4" opacity="0.3" />
                    <circle cx="20" cy="58" r="13" fill="#164e63" stroke="#06b6d4" strokeWidth="2" />
                    <circle cx="20" cy="58" r="6" fill="#0e7490" />
                    <circle cx="140" cy="58" r="13" fill="#164e63" stroke="#06b6d4" strokeWidth="2" />
                    <circle cx="140" cy="58" r="6" fill="#0e7490" />
                    {/* Cargo */}
                    <rect x="50" y="10" width="30" height="35" rx="4" fill="#0891b2" opacity="0.5" />
                    <rect x="86" y="10" width="30" height="35" rx="4" fill="#0891b2" opacity="0.6" />
                    <rect x="122" y="10" width="30" height="35" rx="4" fill="#0891b2" opacity="0.7" />
                    {/* Speed lines */}
                    {[-5, -12, -19].map((y, i) => (
                        <line key={i} x1="-10" y1={35 + y} x2="-30" y2={35 + y} stroke="#06b6d4" strokeWidth="1.5" opacity={0.6 - i * 0.15} strokeDasharray="8,4" />
                    ))}
                </g>
                {/* Route map */}
                <g transform="translate(300, 20)">
                    <rect x="0" y="0" width="200" height="130" rx="10" fill="#0a1628" stroke="#06b6d4" strokeWidth="1.2" />
                    {/* Route line */}
                    <path d="M20,100 C40,80 60,40 80,50 C100,60 120,30 150,20 C170,14 185,30 185,50" stroke="#06b6d4" strokeWidth="2" fill="none" strokeDasharray="6,3" />
                    {/* Origin */}
                    <circle cx="20" cy="100" r="8" fill="#0891b2" opacity="0.9" />
                    <text x="20" y="116" fill="#67e8f9" fontSize="8" textAnchor="middle">Origin</text>
                    {/* Destination */}
                    <circle cx="185" cy="50" r="8" fill="#f59e0b" opacity="0.9" />
                    <text x="185" y="66" fill="#67e8f9" fontSize="8" textAnchor="middle">Dest.</text>
                    {/* Truck marker on route */}
                    <circle cx="80" cy="50" r="6" fill="#06b6d4">
                        <animateMotion dur="4s" repeatCount="indefinite" path="M0,0 C20,-20 40,10 70,0 C90,-6 105,10 105,30" />
                    </circle>
                    <text x="100" y="110" fill="#67e8f9" fontSize="9" textAnchor="middle">ETA: 2h 14m</text>
                    <rect x="60" y="100" width="80" height="18" rx="4" fill="#0c4a6e" />
                    <text x="100" y="112" fill="#06b6d4" fontSize="8" textAnchor="middle">● Live Tracking</text>
                </g>
                {/* Stats */}
                {[
                    { label: "Orders Today", val: "148" },
                    { label: "In Transit", val: "37" },
                    { label: "Delivered", val: "111" },
                ].map((s, i) => (
                    <g key={i} transform={`translate(${20 + i * 90}, 210)`}>
                        <rect width="80" height="36" rx="6" fill="#0a1628" stroke="#06b6d4" strokeWidth="1" />
                        <text x="40" y="14" fill="#67e8f9" fontSize="14" fontWeight="bold" textAnchor="middle">{s.val}</text>
                        <text x="40" y="27" fill="#0891b2" fontSize="7" textAnchor="middle">{s.label}</text>
                    </g>
                ))}
                <text x="370" y="248" fill="#06b6d4" fontSize="12" fontWeight="bold" textAnchor="middle" opacity="0.7">Dispatch Console</text>
            </svg>
        )
    }
];

const testimonials = [
    {
        quote: "Switching to ERP was the turning point for our Pune facility. We reduced waste by 22% in the first quarter alone. It's not just software; it's a productivity multiplier.",
        name: "Rajesh Kumar",
        title: "Director of Operations",
        company: "Bharat-Forge Inc",
        initials: "RK",
        color: "from-indigo-500 to-purple-600",
    },
    {
        quote: "Our inventory accuracy jumped from 74% to 99.1% within two months. The automated reorder system alone saved us ₹40 lakhs in emergency procurement costs last year.",
        name: "Priya Sharma",
        title: "Supply Chain Head",
        company: "Mahindra Logistics",
        initials: "PS",
        color: "from-sky-500 to-indigo-600",
    },
    {
        quote: "We manage 12 plants across India from a single dashboard now. The real-time OEE visibility is something we never had before. Our board meetings are completely data-driven.",
        name: "Amit Desai",
        title: "VP Manufacturing",
        company: "Tata AutoComp Systems",
        initials: "AD",
        color: "from-emerald-500 to-teal-600",
    },
    {
        quote: "The quality control module caught a batch defect that would have resulted in a major recall. The ROI on ERP paid off in that single incident. I can't imagine going back.",
        name: "Sunita Rao",
        title: "Quality Assurance Manager",
        company: "TVS Motor Company",
        initials: "SR",
        color: "from-amber-500 to-orange-600",
    },
    {
        quote: "Implementation was seamless — we were live in 11 days. The support team held our hand through every step. Our on-time delivery rate is now consistently above 97%.",
        name: "Kiran Mehta",
        title: "CEO",
        company: "Precision Parts Ltd",
        initials: "KM",
        color: "from-rose-500 to-pink-600",
    },
];

function TestimonialCarousel() {
    const [current, setCurrent] = useState(0);
    const [animating, setAnimating] = useState(false);
    const [direction, setDirection] = useState('next');
    const timerRef = useRef(null);

    const goTo = (idx, dir = 'next') => {
        if (animating) return;
        setDirection(dir);
        setAnimating(true);
        setTimeout(() => {
            setCurrent(idx);
            setAnimating(false);
        }, 320);
    };

    useEffect(() => {
        timerRef.current = setInterval(() => {
            setCurrent(prev => {
                const next = (prev + 1) % testimonials.length;
                setDirection('next');
                setAnimating(true);
                setTimeout(() => setAnimating(false), 320);
                return next;
            });
        }, 2500);
        return () => clearInterval(timerRef.current);
    }, []);

    const t = testimonials[current];

    return (
        <div className="relative">
            {/* Main card */}
            <div className="bg-indigo-500 dark:bg-indigo-700 rounded-[48px] overflow-hidden relative min-h-[320px]">
                {/* Background blobs */}
                <div className="absolute -bottom-24 -right-24 h-96 w-96 bg-white/10 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute top-24 -left-24 h-64 w-64 bg-indigo-400/20 rounded-full blur-2xl pointer-events-none" />

                {/* Slide content */}
                <div
                    className="relative z-10 p-12 md:p-20 text-white transition-all duration-300"
                    style={{
                        opacity: animating ? 0 : 1,
                        transform: animating
                            ? (direction === 'next' ? 'translateX(40px)' : 'translateX(-40px)')
                            : 'translateX(0)',
                    }}
                >
                    <div className="flex flex-col md:flex-row gap-10 items-start md:items-center">
                        {/* Avatar */}
                        <div className="shrink-0">
                            <div className={`h-20 w-20 rounded-full bg-gradient-to-br ${t.color} flex items-center justify-center text-2xl font-black text-white shadow-xl border-4 border-white/20`}>
                                {t.initials}
                            </div>
                        </div>
                        {/* Text */}
                        <div className="flex-1">
                            <MessageSquare className="h-10 w-10 text-indigo-300 mb-6 opacity-50" />
                            <p className="text-xl md:text-3xl font-medium leading-snug mb-8">
                                "{t.quote}"
                            </p>
                            <div>
                                <p className="text-lg font-bold">{t.name}</p>
                                <p className="text-indigo-200 uppercase tracking-widest text-xs font-bold mt-1">{t.title}, {t.company}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Controls row */}
            <div className="flex items-center justify-between mt-8 px-4">
                {/* Prev / Next */}
                <div className="flex gap-3">
                    <button
                        onClick={() => goTo((current - 1 + testimonials.length) % testimonials.length, 'prev')}
                        className="h-10 w-10 rounded-full border-2 border-indigo-200 dark:border-indigo-800 flex items-center justify-center text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/40 transition-all font-bold text-lg"
                    >‹</button>
                    <button
                        onClick={() => goTo((current + 1) % testimonials.length, 'next')}
                        className="h-10 w-10 rounded-full border-2 border-indigo-200 dark:border-indigo-800 flex items-center justify-center text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/40 transition-all font-bold text-lg"
                    >›</button>
                </div>

                {/* Dot indicators */}
                <div className="flex gap-2 items-center">
                    {testimonials.map((_, i) => (
                        <button
                            key={i}
                            onClick={() => goTo(i, i > current ? 'next' : 'prev')}
                            className="rounded-full transition-all duration-300"
                            style={{
                                width: i === current ? '32px' : '8px',
                                height: '8px',
                                background: i === current ? '#6366f1' : '#e0e7ff',
                            }}
                        />
                    ))}
                </div>

                {/* Counter */}
                <p className="text-sm font-bold text-slate-400 tabular-nums">
                    {current + 1} / {testimonials.length}
                </p>
            </div>

            {/* Bottom preview strip */}
            <div className="mt-8 grid grid-cols-5 gap-3">
                {testimonials.map((rev, i) => (
                    <button
                        key={i}
                        onClick={() => goTo(i, i > current ? 'next' : 'prev')}
                        className={`rounded-2xl p-4 text-left border-2 transition-all duration-300 ${i === current ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/30 shadow-md' : 'border-transparent bg-slate-50 dark:bg-slate-900/40 hover:border-indigo-200 dark:hover:border-indigo-800'}`}
                    >
                        <div className={`h-8 w-8 rounded-full bg-gradient-to-br ${rev.color} flex items-center justify-center text-xs font-black text-white mb-2`}>
                            {rev.initials}
                        </div>
                        <p className="text-xs font-bold text-slate-700 dark:text-slate-300 leading-tight truncate">{rev.name}</p>
                        <p className="text-xs text-slate-400 truncate">{rev.company}</p>
                    </button>
                ))}
            </div>
        </div>
    );
}

function ERPProcessCarousel() {
    const [active, setActive] = useState(0);
    const [hovered, setHovered] = useState(false);
    const timerRef = useRef(null);

    const startTimer = () => {
        timerRef.current = setInterval(() => {
            setActive(prev => (prev + 1) % erpProcessSlides.length);
        }, 3200);
    };

    useEffect(() => {
        if (!hovered) startTimer();
        return () => clearInterval(timerRef.current);
    }, [hovered]);

    const slide = erpProcessSlides[active];

    return (
        <div
            className={`mt-20 relative mx-auto animate-in fade-in zoom-in-95 duration-1000 delay-500 transition-all duration-700 ease-in-out ${hovered ? 'max-w-[90vw]' : 'max-w-5xl'}`}
            onMouseEnter={() => { setHovered(true); clearInterval(timerRef.current); }}
            onMouseLeave={() => { setHovered(false); }}
        >
            {/* Glow */}
            <div className={`absolute -inset-1 rounded-[32px] blur-xl opacity-30 transition-opacity duration-700 ${hovered ? 'opacity-60' : 'opacity-20'}`}
                style={{ background: `linear-gradient(135deg, ${slide.color}, #a21caf)` }} />

            {/* Main card */}
            <div className={`relative bg-gradient-to-br ${slide.bg} rounded-[28px] border overflow-hidden shadow-2xl transition-all duration-700`}
                style={{ borderColor: slide.color + '55' }}>

                {/* Top bar */}
                <div className="flex items-center justify-between px-8 pt-6 pb-2">
                    <div className="flex items-center gap-3">
                        <span className="inline-block w-3 h-3 rounded-full animate-pulse" style={{ background: slide.color }} />
                        <span className="text-xs font-bold uppercase tracking-widest" style={{ color: slide.accent }}>
                            ERP Manufacturing — Process {active + 1}/{erpProcessSlides.length}
                        </span>
                    </div>
                    <div className="flex gap-2">
                        {erpProcessSlides.map((s, i) => (
                            <button
                                key={i}
                                onClick={() => setActive(i)}
                                className="rounded-full transition-all duration-300"
                                style={{
                                    width: i === active ? '28px' : '8px',
                                    height: '8px',
                                    background: i === active ? slide.color : slide.color + '44'
                                }}
                            />
                        ))}
                    </div>
                </div>

                {/* Content */}
                <div className={`grid transition-all duration-700 ${hovered ? 'grid-cols-[1fr_420px]' : 'grid-cols-[1fr_340px]'} gap-0 px-8 pb-8 pt-4`}>
                    {/* SVG panel */}
                    <div className={`transition-all duration-700 ${hovered ? 'h-80' : 'h-64'}`}>
                        {slide.svg}
                    </div>

                    {/* Info panel */}
                    <div className="flex flex-col justify-center pl-8 border-l" style={{ borderColor: slide.color + '33' }}>
                        <div className="mb-4">
                            <span className="text-xs font-bold uppercase tracking-widest mb-2 block" style={{ color: slide.color }}>
                                Stage {active + 1}
                            </span>
                            <h3 className="text-2xl font-black text-white mb-3 leading-tight">{slide.label}</h3>
                            <p className="text-slate-400 text-sm leading-relaxed">{slide.desc}</p>
                        </div>

                        {/* Process steps */}
                        <div className="space-y-2 mt-2">
                            {erpProcessSlides.map((s, i) => (
                                <button
                                    key={i}
                                    onClick={() => setActive(i)}
                                    className={`w-full text-left px-4 py-2 rounded-xl text-xs font-semibold transition-all duration-200 ${i === active ? 'text-white' : 'text-slate-500 hover:text-slate-300'}`}
                                    style={i === active ? { background: slide.color + '33', borderLeft: `3px solid ${slide.color}` } : { borderLeft: '3px solid transparent' }}
                                >
                                    {i === active ? '▶ ' : ''}{s.label}
                                </button>
                            ))}
                        </div>

                        {hovered && (
                            <div className="mt-6 flex gap-3">
                                <button
                                    className="text-xs font-bold px-4 py-2 rounded-xl text-white transition-all hover:opacity-80"
                                    style={{ background: slide.color }}
                                    onClick={() => setActive(prev => (prev - 1 + erpProcessSlides.length) % erpProcessSlides.length)}
                                >
                                    ← Prev
                                </button>
                                <button
                                    className="text-xs font-bold px-4 py-2 rounded-xl text-white transition-all hover:opacity-80"
                                    style={{ background: slide.color }}
                                    onClick={() => setActive(prev => (prev + 1) % erpProcessSlides.length)}
                                >
                                    Next →
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Bottom progress bar */}
                <div className="h-1 w-full bg-slate-800">
                    <div
                        className="h-full transition-none rounded-full"
                        style={{ width: `${((active + 1) / erpProcessSlides.length) * 100}%`, background: slide.color }}
                    />
                </div>
            </div>
        </div>
    );
}

export default function LandingPage() {
    const [authModalOpen, setAuthModalOpen] = useState(false);
    const [authModalMode, setAuthModalMode] = useState('login');
    const [loggedInUser, setLoggedInUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        try {
            const token = localStorage.getItem('erp_token');
            const stored = localStorage.getItem('erp_user');
            if (token && stored) setLoggedInUser(JSON.parse(stored));
        } catch {
            setLoggedInUser(null);
        }
    }, []);

    const openAuthModal = (mode) => {
        if (loggedInUser) { navigate('/dashboard'); return; }
        setAuthModalMode(mode);
        setAuthModalOpen(true);
    };

    return (
        <div className="min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans selection:bg-indigo-100 dark:selection:bg-indigo-900 selection:text-indigo-900 dark:selection:text-indigo-100">
            <Navbar />

            {/* Hero Section */}
            <section className="relative pt-44 pb-32 overflow-hidden">
                <div className="absolute inset-0 -z-10">
                    <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-200/30 dark:bg-indigo-900/20 rounded-full blur-[120px] animate-pulse" />
                    <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-purple-100/30 dark:bg-purple-900/20 rounded-full blur-[120px]" />
                </div>

                <div className="max-w-7xl mx-auto px-6 text-center">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-900/30 border border-indigo-100 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 text-sm font-semibold mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
                        </span>
                        v4.2 Now Live: AI-Powered Predictive Maintenance
                    </div>

                    <h1 className="text-6xl md:text-8xl font-black text-slate-900 dark:text-white leading-[1.1] tracking-tight max-w-5xl mx-auto animate-in fade-in slide-in-from-bottom-6 duration-1000">
                        The Future of <span className="text-transparent bg-clip-text bg-linear-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400">Manufacturing</span> is Here.
                    </h1>

                    <p className="mt-8 text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200">
                        One platform to unify your shop floor, inventory, and analytics.
                        Decrease downtime by 34% and boost OEE within your first 30 days.
                    </p>

                    <div className="mt-12 flex flex-col sm:flex-row justify-center gap-4 animate-in fade-in slide-in-from-bottom-10 duration-1000 delay-300">
                        {loggedInUser ? (
                            <>
                                <Link
                                    to="/dashboard"
                                    className="group flex items-center justify-center gap-2 bg-indigo-600 text-white px-8 py-4 rounded-2xl text-lg font-bold hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-200 dark:shadow-indigo-900/40"
                                >
                                    Go to Dashboard
                                    <ChevronRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                                </Link>
                                <p className="flex items-center justify-center text-slate-500 dark:text-slate-400 text-base">
                                    Welcome back,{' '}
                                    <span className="ml-1 font-semibold text-slate-800 dark:text-slate-200">
                                        {loggedInUser?.name || loggedInUser?.username}
                                    </span>
                                </p>
                            </>
                        ) : (
                            <>
                                <button
                                    type="button"
                                    onClick={() => openAuthModal('register')}
                                    className="group flex items-center justify-center gap-2 bg-indigo-600 text-white px-8 py-4 rounded-2xl text-lg font-bold hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-200 dark:shadow-indigo-900/40"
                                >
                                    Start Free Trial
                                    <ChevronRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                                </button>
                                <button
                                    type="button"
                                    onClick={() => openAuthModal('login')}
                                    className="flex items-center justify-center gap-2 border-2 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 px-8 py-4 rounded-2xl text-lg font-bold hover:bg-slate-50 dark:hover:bg-slate-900 transition-all"
                                >
                                    Book Live Demo
                                </button>
                            </>
                        )}
                    </div>

                    {/* ERP Process Carousel */}
                    <ERPProcessCarousel />
                </div>
            </section>

            {/* Trusted By Section */}
            <section className="py-24 border-y border-slate-100 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-900/20">
                <div className="max-w-7xl mx-auto px-6">
                    <p className="text-center text-sm font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-12">Trusted by 500+ Global Manufacturers</p>
                    <div className="flex flex-wrap justify-center items-center gap-12 md:gap-20 opacity-50 grayscale hover:grayscale-0 transition-all">
                        {caseStudies.map(name => (
                            <span key={name} className="text-2xl font-black text-slate-400 dark:text-slate-600 select-none">{name}</span>
                        ))}
                    </div>
                </div>
            </section>

            {/* Problems Section */}
            <section className="py-32 bg-white dark:bg-slate-950">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid lg:grid-cols-2 gap-20 items-center">
                        <div>
                            <h2 className="text-4xl md:text-5xl font-bold leading-tight mb-8 dark:text-white">
                                Stop managing your factory with <span className="line-through text-slate-300 dark:text-slate-700">spreadsheets</span>.
                            </h2>
                            <div className="space-y-6">
                                {[
                                    { title: "Siloed Data", desc: "Disconnect between sales and production floor leads to missed deadlines." },
                                    { title: "Phantom Inventory", desc: "Stock outs on critical raw materials because of manual tracking errors." },
                                    { title: "Reactive Maintenance", desc: "Fixing machines only when they break costs 5x more than scheduled repairs." }
                                ].map((item, i) => (
                                    <div key={i} className="flex gap-4">
                                        <div className="shrink-0 h-6 w-6 rounded-full bg-rose-100 dark:bg-rose-900/30 flex items-center justify-center mt-1">
                                            <div className="h-2 w-2 rounded-full bg-rose-500" />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-lg dark:text-slate-200">{item.title}</h4>
                                            <p className="text-slate-500 dark:text-slate-400">{item.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="bg-slate-900 dark:bg-slate-900/50 rounded-3xl p-10 text-white relative overflow-hidden group border border-slate-800">
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
                            <button
                                type="button"
                                onClick={() => openAuthModal('register')}
                                className="mt-10 bg-white text-slate-900 px-6 py-3 rounded-xl font-bold hover:bg-slate-100 transition-colors"
                            >
                                Explore All Features
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Grid */}
            <section className="py-32 bg-slate-50 dark:bg-slate-900/30">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center max-w-3xl mx-auto mb-24">
                        <h2 className="text-4xl md:text-5xl font-bold mb-6 italic dark:text-white">Built for the Shop Floor.</h2>
                        <p className="text-xl text-slate-600 dark:text-slate-400">Modules designed with factory workers in mind—simple enough for the floor, powerful enough for the boardroom.</p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[
                            { title: "Inventory Engine", icon: Box, color: "text-blue-600", bg: "bg-blue-50 dark:bg-blue-900/20", desc: "Multi-warehouse tracking with QR/Barcode integration and automated reorder alerts." },
                            { title: "Smart Production", icon: Settings, color: "text-indigo-600", bg: "bg-indigo-50 dark:bg-indigo-900/20", desc: "Visual drag-and-drop scheduling for jobs, machines, and personnel with real-time OEE." },
                            { title: "Logistics Hub", icon: Truck, color: "text-emerald-600", bg: "bg-emerald-50 dark:bg-emerald-900/20", desc: "End-to-end shipping management from packing lists to GPS-tracked delivery confirmation." },
                            { title: "Quality Shield", icon: ShieldCheck, color: "text-rose-600", bg: "bg-rose-50 dark:bg-rose-900/20", desc: "Rigorous digital checkpoints at every stage. Export ISO-compliant quality reports in seconds." },
                            { title: "Deep Analytics", icon: BarChart3, color: "text-amber-600", bg: "bg-amber-50 dark:bg-amber-900/20", desc: "Predict your quarterly output and revenue with 94% accuracy using our ML engine." },
                            { title: "Global Scale", icon: Users, color: "text-purple-600", bg: "bg-purple-50 dark:bg-purple-900/20", desc: "Manage 50+ plants from a single login. Multi-currency and localized tax compliance built-in." }
                        ].map((f, i) => (
                            <div key={i} className="bg-white dark:bg-slate-900 p-10 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all group">
                                <div className={`h-14 w-14 ${f.bg} ${f.color} rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform`}>
                                    <f.icon className="h-7 w-7" />
                                </div>
                                <h3 className="text-2xl font-bold mb-4 dark:text-white">{f.title}</h3>
                                <p className="text-slate-500 dark:text-slate-400 leading-relaxed mb-6">{f.desc}</p>
                                <button className="text-indigo-600 dark:text-indigo-400 font-bold flex items-center gap-1 group/btn hover:gap-2 transition-all">
                                    Learn more <ArrowRight className="h-4 w-4" />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Testimonials */}
            <section className="py-32 bg-white dark:bg-slate-950 overflow-hidden">
                <div className="max-w-7xl mx-auto px-6">
                    <p className="text-center text-sm font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-14">What our customers say</p>
                    <TestimonialCarousel />
                </div>
            </section>

            <section className="py-24 bg-slate-900 dark:bg-slate-950 text-white border-t border-slate-800">
                <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-4 gap-12 text-center">
                    <div className="space-y-2">
                        <div className="text-5xl font-black text-indigo-400 tracking-tighter decoration-4 decoration-indigo-500 underline underline-offset-8">
                            <Counter end={98} suffix="%" />
                        </div>
                        <p className="text-slate-400 dark:text-slate-500 font-medium pt-4">On-time Delivery</p>
                    </div>
                    <div className="space-y-2">
                        <div className="text-5xl font-black text-indigo-400 tracking-tighter decoration-4 decoration-indigo-500 underline underline-offset-8">
                            <Counter end={42} suffix="%" />
                        </div>
                        <p className="text-slate-400 dark:text-slate-500 font-medium pt-4">Inventory Cost reduction</p>
                    </div>
                    <div className="space-y-2">
                        <div className="text-5xl font-black text-indigo-400 tracking-tighter decoration-4 decoration-indigo-500 underline underline-offset-8">
                            <Counter end={3.2} suffix="x" decimals={1} />
                        </div>
                        <p className="text-slate-400 dark:text-slate-500 font-medium pt-4">Production Speed</p>
                    </div>
                    <div className="space-y-2">
                        <div className="text-5xl font-black text-indigo-400 tracking-tighter decoration-4 decoration-indigo-500 underline underline-offset-8">
                            <Counter end={14} suffix=" Days" />
                        </div>
                        <p className="text-slate-400 dark:text-slate-500 font-medium pt-4">Implementation Time</p>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-32 bg-white dark:bg-slate-950">
                <div className="max-w-4xl mx-auto px-6 text-center">
                    <h2 className="text-4xl md:text-6xl font-black mb-8 dark:text-white">Ready to modernize your operations?</h2>
                    <p className="text-xl text-slate-500 dark:text-slate-400 mb-12">Join hundreds of factories already building the future with ERP.</p>
                    <div className="flex flex-col sm:flex-row justify-center gap-4">
                        <button
                            type="button"
                            onClick={() => openAuthModal('register')}
                            className="bg-indigo-600 text-white px-10 py-5 rounded-2xl text-xl font-bold hover:bg-indigo-700 hover:scale-105 transition-all shadow-2xl shadow-indigo-200 dark:shadow-indigo-900/40"
                        >
                            Start Free Trial
                        </button>
                        <button
                            type="button"
                            onClick={() => openAuthModal('login')}
                            className="border-2 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 px-10 py-5 rounded-2xl text-xl font-bold hover:bg-slate-50 dark:hover:bg-slate-900 transition-all"
                        >
                            Talk to an Expert
                        </button>
                    </div>
                    <p className="mt-8 text-slate-400 font-medium italic">No credit card required. Cancel anytime.</p>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-slate-50 dark:bg-slate-900 pt-24 pb-12 border-t border-slate-200 dark:border-slate-800">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-12 mb-20">
                        <div className="col-span-2 lg:col-span-2">
                            <span className="text-2xl font-black text-indigo-600 dark:text-indigo-400 tracking-tighter">ERP.</span>
                            <p className="mt-6 text-slate-500 dark:text-slate-400 max-w-xs leading-relaxed">
                                The operating system for modern global manufacturing. Built by experts, for the shop floor.
                            </p>
                        </div>
                        <div>
                            <h4 className="font-bold mb-6 text-slate-900 dark:text-white">Platform</h4>
                            <ul className="space-y-4 text-slate-500 dark:text-slate-400 text-sm">
                                <li><Link to="/dashboard" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Production Dashboard</Link></li>
                                <li><Link to="/inventory" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Inventory Suite</Link></li>
                                <li><Link to="/quality" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Quality Control</Link></li>
                                <li><Link to="/reports" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Custom Analytics</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-bold mb-6 text-slate-900 dark:text-white">Company</h4>
                            <ul className="space-y-4 text-slate-500 dark:text-slate-400 text-sm">
                                <li><Link to="/" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">About Us</Link></li>
                                <li><Link to="/" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Careers</Link></li>
                                <li><Link to="/" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Press Kit</Link></li>
                                <li><Link to="/" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Contact</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-bold mb-6 text-slate-900 dark:text-white">Support</h4>
                            <ul className="space-y-4 text-slate-500 dark:text-slate-400 text-sm">
                                <li><Link to="/" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Documentation</Link></li>
                                <li><Link to="/" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">API Reference</Link></li>
                                <li><Link to="/" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Community</Link></li>
                                <li><Link to="/" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Privacy Policy</Link></li>
                            </ul>
                        </div>
                    </div>
                    <div className="pt-12 border-t border-slate-200 dark:border-slate-800 flex flex-col md:flex-row justify-between items-center gap-6">
                        <p className="text-slate-400 dark:text-slate-500 text-sm font-medium">© 2026 ERP. All rights reserved. Made in India for the World.</p>
                        <div className="flex gap-6 text-slate-400 dark:text-slate-500">
                            <Monitor className="h-5 w-5 hover:text-indigo-600 dark:hover:text-indigo-400 cursor-pointer transition-colors" />
                            <Database className="h-5 w-5 hover:text-indigo-600 dark:hover:text-indigo-400 cursor-pointer transition-colors" />
                            <Users className="h-5 w-5 hover:text-indigo-600 dark:hover:text-indigo-400 cursor-pointer transition-colors" />
                        </div>
                    </div>
                </div>
            </footer>

            {/* Auth modal overlay - Login / Register (only shown when not logged in) */}
            {!loggedInUser && (
                <AuthModal
                    isOpen={authModalOpen}
                    onClose={() => setAuthModalOpen(false)}
                    initialMode={authModalMode}
                />
            )}
        </div>
    );
}

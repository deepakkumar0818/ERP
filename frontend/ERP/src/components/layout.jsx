import { Link, NavLink, Outlet, useLocation } from 'react-router-dom'
import {
    LayoutDashboard,
    ShoppingCart,
    Layers,
    Factory,
    ShieldCheck,
    Package,
    Truck,
    FileText,
    Wrench,
    BarChart3,
    Settings as SettingsIcon,
    LogOut,
    Menu,
    ChevronDown,
    ShoppingBag
} from 'lucide-react'
import { useState } from 'react'
import ThemeToggle from './ThemeToggle'

export default function Layout() {
    const [sidebarOpen, setSidebarOpen] = useState(true)
    const location = useLocation()

    const menuGroups = [
        {
            title: 'General',
            items: [
                { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
            ]
        },
        {
            title: 'Commercial',
            items: [
                { path: '/sales', label: 'Sales Orders', icon: ShoppingCart },
                { path: '/procurement', label: 'Procurement', icon: ShoppingBag },
                { path: '/billing', label: 'Billing/Invoices', icon: FileText },
            ]
        },
        {
            title: 'Manufacturing',
            items: [
                { path: '/bom', label: 'Bill of Materials', icon: Layers },
                { path: '/production', label: 'Production Tracking', icon: Factory },
                { path: '/quality', label: 'Quality Control', icon: ShieldCheck },
            ]
        },
        {
            title: 'Logistics',
            items: [
                { path: '/inventory', label: 'Inventory (Store)', icon: Package },
                { path: '/shipping', label: 'Shipping/Packing', icon: Truck },
            ]
        },
        {
            title: 'Administration',
            items: [
                { path: '/machines', label: 'Machines', icon: Wrench },
                { path: '/reports', label: 'Reports', icon: BarChart3 },
                { path: '/settings', label: 'Settings', icon: SettingsIcon },
            ]
        },
    ]

    const getPageTitle = () => {
        const path = location.pathname;
        for (const group of menuGroups) {
            const item = group.items.find(i => i.path === path);
            if (item) return item.label;
        }
        return 'Overview';
    }

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex transition-colors duration-300">
            {/* Sidebar */}
            <aside className={`
                fixed inset-y-0 left-0 z-50 w-72 bg-[#0f172a] dark:bg-slate-900 text-slate-300 transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0 border-r border-slate-800/50
                ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
            `}>
                <div className="h-20 flex items-center px-8 border-b border-slate-800/50 bg-[#0f172a] dark:bg-slate-900">
                    <Link to="/dashboard" className="flex items-center gap-3 group">
                        <div className="h-10 w-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20 group-hover:scale-110 transition-transform">
                            <Factory className="h-6 w-6 text-white" />
                        </div>
                        <span className="text-xl font-bold text-white tracking-tight">ERP</span>
                    </Link>
                </div>

                <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-8 custom-scrollbar">
                    {menuGroups.map((group, gIdx) => (
                        <div key={gIdx} className="space-y-2">
                            <h4 className="px-4 text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">{group.title}</h4>
                            <div className="space-y-1">
                                {group.items.map((item, iIdx) => (
                                    <NavLink
                                        key={iIdx}
                                        to={item.path}
                                        className={({ isActive }) => `
                                            flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all group
                                            ${isActive
                                                ? 'bg-indigo-600/10 text-white border-l-4 border-indigo-500'
                                                : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-100'
                                            }
                                        `}
                                    >
                                        <item.icon className={`h-5 w-5 transition-colors ${location.pathname === item.path ? 'text-indigo-400' : 'text-slate-500 group-hover:text-slate-300'}`} />
                                        <span>{item.label}</span>
                                    </NavLink>
                                ))}
                            </div>
                        </div>
                    ))}
                </nav>

                <div className="p-4 border-t border-slate-800/50 bg-[#0f172a]/50">
                    <button className="flex items-center gap-3 w-full px-4 py-3 text-sm font-medium text-slate-400 hover:text-rose-400 hover:bg-rose-500/5 rounded-xl transition-all">
                        <LogOut className="h-5 w-5" />
                        <span>Sign Out</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
                <header className="h-20 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-8 shrink-0 transition-colors duration-300">
                    <div className="flex items-center gap-4">
                        <button
                            className="lg:hidden p-2 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                            onClick={() => setSidebarOpen(!sidebarOpen)}
                        >
                            <Menu className="h-6 w-6" />
                        </button>
                        <h2 className="text-xl font-bold text-slate-800 dark:text-white">{getPageTitle()}</h2>
                    </div>

                    <div className="flex items-center gap-6">
                        <ThemeToggle />

                        <div className="flex items-center gap-4">
                            <div className="hidden md:flex flex-col items-end mr-2">
                                <span className="text-sm font-bold text-slate-900 dark:text-white">John Doe</span>
                                <span className="text-xs text-slate-500 dark:text-slate-400">Plant Manager</span>
                            </div>
                            <div className="h-10 w-10 rounded-xl bg-linear-to-br from-indigo-500 to-purple-600 border-2 border-white dark:border-slate-800 shadow-sm" />
                        </div>
                    </div>
                </header>

                <main className="flex-1 overflow-y-auto p-8 custom-scrollbar bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
                    <Outlet />
                </main>
            </div>
        </div>
    )
}
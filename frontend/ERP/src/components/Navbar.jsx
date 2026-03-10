import { useEffect, useState, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import ThemeToggle from "./ThemeToggle";
import { LayoutDashboard, LogOut, User, ChevronDown } from "lucide-react";

function Navbar() {
    const [openMenu, setOpenMenu] = useState(null);
    const [scrolled, setScrolled] = useState(false);
    const [user, setUser] = useState(null);
    const [userMenuOpen, setUserMenuOpen] = useState(false);
    const userMenuRef = useRef(null);
    const location = useLocation();
    const navigate = useNavigate();

    // Read auth state from localStorage
    useEffect(() => {
        const syncAuth = () => {
            try {
                const token = localStorage.getItem('erp_token');
                const stored = localStorage.getItem('erp_user');
                if (token && stored) {
                    setUser(JSON.parse(stored));
                } else {
                    setUser(null);
                }
            } catch {
                setUser(null);
            }
        };
        syncAuth();
        window.addEventListener('storage', syncAuth);
        return () => window.removeEventListener('storage', syncAuth);
    }, [location]);

    const handleSignOut = () => {
        localStorage.removeItem('erp_token');
        localStorage.removeItem('erp_user');
        setUser(null);
        setUserMenuOpen(false);
        navigate('/');
    };

    const getInitials = (u) => {
        const name = u?.name || u?.username || '';
        return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2) || '?';
    };

    // Close user dropdown on outside click
    useEffect(() => {
        const handleOutside = (e) => {
            if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
                setUserMenuOpen(false);
            }
        };
        document.addEventListener('mousedown', handleOutside);
        return () => document.removeEventListener('mousedown', handleOutside);
    }, []);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 40);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const toggleMenu = (menu) => {
        setOpenMenu(openMenu === menu ? null : menu);
    };

    const navLinks = {
        platform: '/platform',
        resources: '/resources',
        customers: '/customers',
        pricing: '/pricing',
    };

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (!e.target.closest("nav")) setOpenMenu(null);
        };
        document.addEventListener("click", handleClickOutside);
        return () => document.removeEventListener("click", handleClickOutside);
    }, []);

    return (
        <nav
            className={`
        fixed top-0 left-0 right-0 z-50 flex justify-center 
        transition-all duration-500 ease-in-out
        ${scrolled ? "pt-3 pb-3" : "pt-6 pb-6"}
      `}
        >
            <div
                className={`
          flex items-center justify-between rounded-full 
          border border-white/20 transition-all duration-500 ease-in-out
          ${scrolled
                        ? "w-[90%] md:w-[78%] lg:w-[68%] xl:w-[60%] backdrop-blur-xl bg-white/65 dark:bg-slate-900/65 shadow-2xl shadow-black/15 px-6 py-3.5"
                        : "w-[94%] md:w-[88%] backdrop-blur-md bg-white/85 dark:bg-slate-900/85 shadow-xl px-8 py-4.5"
                    }
        `}
            >
                {/* Logo */}
                <div className="shrink-0">
                    <Link to="/" className="font-bold text-xl md:text-2xl text-indigo-600 tracking-tight hover:text-indigo-900 dark:hover:text-indigo-400">
                        ERP.
                    </Link>
                </div>

                {/* Middle Menu */}
                <ul className="hidden md:flex items-center gap-6 lg:gap-10 text-sm font-medium text-gray-800 dark:text-gray-200">
                    {["Platform", "Resources", "Customers", "Pricing"].map((item) => {
                        const isOpen = openMenu === item.toLowerCase();
                        const isActive = location.pathname === navLinks[item.toLowerCase()];

                        return (
                            <li
                                key={item}
                                className={`
                  relative group px-4 py-2 rounded-full cursor-pointer transition-all duration-300
                  ${scrolled
                                        ? "backdrop-blur-md bg-white/40 dark:bg-slate-800/40 hover:bg-white/60 dark:hover:bg-slate-700/60 border border-white/30 dark:border-slate-700/30"
                                        : "hover:bg-white/30 dark:hover:bg-slate-800/30"
                                    }
                  ${isOpen ? "bg-white/55 dark:bg-slate-800/55 shadow-sm" : ""}
                `}
                                onMouseEnter={() => toggleMenu(item.toLowerCase())}
                                onMouseLeave={() => setOpenMenu(null)}
                            >
                                <Link
                                    to={navLinks[item.toLowerCase()]}
                                    className={`transition-colors group-hover:text-indigo-600 dark:group-hover:text-indigo-400 ${isActive ? 'text-indigo-600 dark:text-indigo-400 font-semibold' : ''}`}
                                >
                                    {item}
                                </Link>

                                {isOpen && (
                                    <div
                                        className={`
                       absolute top-full left-1/2 -translate-x-1/2 mt-3 
                       bg-white/90 dark:bg-slate-900/90 backdrop-blur-lg shadow-2xl rounded-xl border border-white/30 dark:border-slate-700/30
                       min-w-[280px] lg:min-w-[340px] p-6
                       opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto
                       transition-all duration-300 ease-out translate-y-1 group-hover:translate-y-0
                     `}
                                    >
                                        {item === "Resources" ? (
                                            <div className="grid grid-cols-3 gap-6 text-sm">
                                                <div>
                                                    <p className="text-indigo-600 dark:text-indigo-400 font-semibold mb-2">Featured</p>
                                                    <div className="bg-gray-100/70 dark:bg-slate-800/70 backdrop-blur-sm h-28 rounded-lg mb-2 border border-white/40 dark:border-slate-700/40"></div>
                                                    <Link to="/resources" className="font-medium dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400">AI Agents Guide 2025</Link>
                                                </div>
                                                <div>
                                                    <p className="text-indigo-600 dark:text-indigo-400 font-semibold mb-2">Read</p>
                                                    <Link to="/resources" className="font-medium mb-1 block line-clamp-1 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400">Documentation</Link>
                                                    <p className="text-gray-500 dark:text-gray-400 text-[10px] mb-3 leading-tight">Developer docs & API</p>
                                                    <Link to="/customers" className="font-medium dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400 block">Case Studies</Link>
                                                    <p className="text-gray-500 dark:text-gray-400 text-[10px] leading-tight">Real-world success stories</p>
                                                </div>
                                                <div>
                                                    <p className="text-indigo-600 dark:text-indigo-400 font-semibold mb-2">Explore</p>
                                                    <Link to="/resources" className="mb-1 block hover:text-indigo-600 dark:hover:text-indigo-400 text-xs dark:text-gray-300">Blog</Link>
                                                    <Link to="/resources" className="mb-1 block hover:text-indigo-600 dark:hover:text-indigo-400 text-xs dark:text-gray-300">Webinars</Link>
                                                    <Link to="/resources" className="mb-1 block hover:text-indigo-600 dark:hover:text-indigo-400 text-xs dark:text-gray-300">Community</Link>
                                                    <Link to="/resources" className="block hover:text-indigo-600 dark:hover:text-indigo-400 text-xs dark:text-gray-300">Changelog</Link>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="space-y-4 text-sm">
                                                <Link
                                                    to={navLinks[item.toLowerCase()]}
                                                    className="font-medium hover:text-indigo-600 dark:hover:text-indigo-400 block dark:text-white"
                                                >
                                                    {item === "Platform" ? "Overview & Features" : item === "Customers" ? "Case Studies" : "Plans & Compare"}
                                                </Link>
                                                <p className="text-gray-600 dark:text-gray-400 text-xs leading-relaxed">
                                                    {item === "Platform"
                                                        ? "Explore powerful tools built for manufacturing teams"
                                                        : item === "Customers"
                                                            ? "See how leading companies transformed operations"
                                                            : "Choose the perfect plan for your scale"}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </li>
                        );
                    })}
                </ul>

                {/* Right Buttons */}
                <div className="flex items-center gap-4 shrink-0">
                    <ThemeToggle />

                    {user ? (
                        /* ── Logged-in state ── */
                        <div className="flex items-center gap-3">
                            <Link
                                to="/dashboard"
                                className="hidden sm:inline-flex items-center gap-2 text-sm font-semibold px-5 py-2 rounded-full bg-indigo-600 text-white hover:bg-indigo-700 shadow-md transition-all duration-300"
                            >
                                <LayoutDashboard className="h-4 w-4" />
                                Dashboard
                            </Link>

                            {/* User avatar + dropdown */}
                            <div className="relative" ref={userMenuRef}>
                                <button
                                    onClick={() => setUserMenuOpen(v => !v)}
                                    className={`
                                        flex items-center gap-2 pl-1 pr-3 py-1 rounded-full transition-all duration-300 cursor-pointer
                                        ${scrolled
                                            ? "bg-white/50 dark:bg-slate-800/50 border border-white/40 dark:border-slate-700/40"
                                            : "bg-white/30 dark:bg-slate-800/30 border border-white/20 dark:border-slate-700/20"
                                        }
                                        hover:bg-white/80 dark:hover:bg-slate-700/80
                                    `}
                                >
                                    <div className="h-7 w-7 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold select-none">
                                        {getInitials(user)}
                                    </div>
                                    <span className="hidden sm:block text-sm font-medium text-slate-800 dark:text-slate-200 max-w-[100px] truncate">
                                        {user?.name || user?.username || 'User'}
                                    </span>
                                    <ChevronDown className={`h-3.5 w-3.5 text-slate-500 transition-transform duration-200 ${userMenuOpen ? 'rotate-180' : ''}`} />
                                </button>

                                {userMenuOpen && (
                                    <div className="absolute right-0 top-full mt-2 w-56 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-2xl overflow-hidden z-50">
                                        {/* User info header */}
                                        <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
                                            <div className="flex items-center gap-3">
                                                <div className="h-9 w-9 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-sm font-bold shrink-0">
                                                    {getInitials(user)}
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">{user?.name || user?.username}</p>
                                                    <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{user?.email || ''}</p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Actions */}
                                        <div className="p-2">
                                            <Link
                                                to="/dashboard"
                                                onClick={() => setUserMenuOpen(false)}
                                                className="flex items-center gap-2.5 w-full px-3 py-2.5 rounded-xl text-sm text-slate-700 dark:text-slate-200 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                                            >
                                                <LayoutDashboard className="h-4 w-4" />
                                                Go to Dashboard
                                            </Link>
                                            <Link
                                                to="/settings"
                                                onClick={() => setUserMenuOpen(false)}
                                                className="flex items-center gap-2.5 w-full px-3 py-2.5 rounded-xl text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                                            >
                                                <User className="h-4 w-4" />
                                                Profile & Settings
                                            </Link>
                                        </div>

                                        <div className="p-2 border-t border-slate-100 dark:border-slate-800">
                                            <button
                                                onClick={handleSignOut}
                                                className="flex items-center gap-2.5 w-full px-3 py-2.5 rounded-xl text-sm text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-900/20 transition-colors"
                                            >
                                                <LogOut className="h-4 w-4" />
                                                Sign Out
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    ) : (
                        /* ── Guest state ── */
                        <>
                            <Link
                                to="/login"
                                className={`
                       text-sm font-medium px-5 py-2 rounded-full transition-all duration-300
                       ${location.pathname === "/login"
                                        ? "bg-indigo-600 text-white shadow-lg shadow-indigo-300/40 dark:shadow-indigo-900/60"
                                        : scrolled
                                            ? "bg-white/50 dark:bg-slate-800/50 backdrop-blur-md border border-white/40 dark:border-slate-700/40 hover:bg-white/90 dark:hover:bg-slate-700 text-gray-800 dark:text-gray-200"
                                            : "bg-white/30 dark:bg-slate-800/30 hover:bg-white/50 dark:hover:bg-slate-700 text-gray-800 dark:text-gray-200 shadow-sm"
                                    }
                     `}
                            >
                                Login
                            </Link>

                            <Link
                                to="/register"
                                className={`
                       text-sm font-semibold px-6 py-2.5 rounded-full transition-all duration-300 shadow-md
                       ${location.pathname === "/register"
                                        ? "bg-indigo-700 text-white shadow-indigo-500/40 scale-[1.02]"
                                        : scrolled
                                            ? "bg-indigo-600/90 text-white hover:bg-indigo-700 shadow-indigo-500/30 backdrop-blur-sm"
                                            : "bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg"
                                    }
                     `}
                            >
                                Get Started
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
}

export default Navbar;

import React, { useState, useEffect } from "react";
import { Link } from 'react-router-dom';
import ThemeToggle from "./ThemeToggle";


function Navbar() {
    const [openMenu, setOpenMenu] = useState(null);
    const [scrolled, setScrolled] = useState(false);

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
                <div className="flex-shrink-0">
                    <Link to="/" className="font-bold text-xl md:text-2xl text-indigo-600 tracking-tight hover:text-indigo-900 dark:hover:text-indigo-400">
                        ERP.
                    </Link>
                </div>

                {/* Middle Menu */}
                <ul className="hidden md:flex items-center gap-6 lg:gap-10 text-sm font-medium text-gray-800 dark:text-gray-200">
                    {["Platform", "Resources", "Customers", "Pricing"].map((item) => {
                        const isOpen = openMenu === item.toLowerCase();

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
                                <span className="transition-colors group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
                                    {item}
                                </span>

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
                                                    <p className="font-medium dark:text-white">AI Agents Guide 2025</p>
                                                </div>
                                                <div>
                                                    <p className="text-indigo-600 dark:text-indigo-400 font-semibold mb-2">Read</p>
                                                    <p className="font-medium mb-1 line-clamp-1 dark:text-white">Documentation</p>
                                                    <p className="text-gray-500 dark:text-gray-400 text-[10px] mb-3 leading-tight">Developer docs & API</p>
                                                    <p className="font-medium dark:text-white">Case Studies</p>
                                                    <p className="text-gray-500 dark:text-gray-400 text-[10px] leading-tight">Real-world success stories</p>
                                                </div>
                                                <div>
                                                    <p className="text-indigo-600 dark:text-indigo-400 font-semibold mb-2">Explore</p>
                                                    <p className="mb-1 hover:text-indigo-600 dark:hover:text-indigo-400 cursor-pointer text-xs dark:text-gray-300">Blog</p>
                                                    <p className="mb-1 hover:text-indigo-600 dark:hover:text-indigo-400 cursor-pointer text-xs dark:text-gray-300">Webinars</p>
                                                    <p className="mb-1 hover:text-indigo-600 dark:hover:text-indigo-400 cursor-pointer text-xs dark:text-gray-300">Community</p>
                                                    <p className="hover:text-indigo-600 dark:hover:text-indigo-400 cursor-pointer text-xs dark:text-gray-300">Changelog</p>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="space-y-4 text-sm">
                                                <p className="font-medium hover:text-indigo-600 dark:hover:text-indigo-400 cursor-pointer dark:text-white">
                                                    {item === "Platform" ? "Overview & Features" : item === "Customers" ? "Case Studies" : "Plans & Compare"}
                                                </p>
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
                <div className="flex items-center gap-4 flex-shrink-0">
                    <ThemeToggle />

                    <Link
                        to="/dashboard"
                        className={`
               text-sm font-medium px-5 py-2 rounded-full transition-all duration-300
               ${scrolled
                                ? "bg-white/50 dark:bg-slate-800/50 backdrop-blur-md border border-white/40 dark:border-slate-700/40 hover:bg-white/90 dark:hover:bg-slate-700 text-gray-800 dark:text-gray-200"
                                : "bg-white/30 dark:bg-slate-800/30 hover:bg-white/50 dark:hover:bg-slate-700 text-gray-800 dark:text-gray-200 shadow-sm"
                            }
             `}
                    >
                        Login
                    </Link>

                    <Link
                        to="/dashboard"
                        className={`
               text-sm font-semibold px-6 py-2.5 rounded-full transition-all duration-300 shadow-md
               ${scrolled
                                ? "bg-indigo-600/90 text-white hover:bg-indigo-700 shadow-indigo-500/30 backdrop-blur-sm"
                                : "bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg"
                            }
             `}
                    >
                        Get Started
                    </Link>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;
import React, { useState, useEffect } from "react";

function Navbar() {
    const [scrolled, setScrolled] = useState(false);
    const [openMenu, setOpenMenu] = useState(null);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 40);
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
        fixed top-0 left-0 right-0 z-50 flex justify-center transition-all duration-500
        ${scrolled ? "pt-3 pb-3" : "pt-6 pb-6"}
      `}
        >
            // In Navbar.jsx – key changes for light background
            <div
                className={`
    flex items-center justify-between rounded-full border transition-all duration-500
    ${scrolled
                        ? "w-[88%] md:w-[76%] lg:w-[66%] backdrop-blur-xl bg-white/65 border-gray-200/40 shadow-xl shadow-gray-300/30 px-6 py-3.5"
                        : "w-[92%] md:w-[86%] backdrop-blur-lg bg-white/80 border-gray-200/30 shadow-lg shadow-gray-200/20 px-8 py-4.5"
                    }
  `}
            >
                {/* Logo – dark text for light bg */}
                <span className="font-bold text-2xl text-indigo-600">
                    ERP-Manufacturing
                </span>

                {/* Menu items – subtle glass buttons */}
                <ul className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-800">
                    {["Platform", "Resources", "Customers", "Pricing"].map((item) => (
                        <li
                            key={item}
                            className={`
          relative group px-5 py-2.5 rounded-full cursor-pointer transition-all duration-300
          ${scrolled
                                    ? "backdrop-blur-md bg-white/50 hover:bg-white/70 border border-gray-200/40 hover:border-gray-300/60"
                                    : "bg-white/60 hover:bg-white/80 border border-gray-200/30"
                                }
        `}
                        // ... rest of your dropdown logic
                        >
                            <span className="group-hover:text-indigo-600 transition-colors">{item}</span>
                        </li>
                    ))}
                </ul>

                {/* Buttons */}
                <div className="flex items-center gap-4">
                    <button
                        className={`
        px-5 py-2.5 rounded-full text-sm font-medium transition-all
        ${scrolled
                                ? "bg-white/60 backdrop-blur-md border border-gray-200/40 hover:bg-white/80 text-gray-800"
                                : "bg-white/70 border border-gray-200/30 hover:bg-white/90 text-gray-800"
                            }
      `}
                    >
                        Login
                    </button>
                    <button
                        className={`
        px-6 py-2.5 rounded-full text-sm font-semibold text-white transition-all shadow-md
        bg-gradient-to-r from-indigo-500 to-blue-500 hover:from-indigo-600 hover:to-blue-600
        ${scrolled ? "backdrop-blur-sm shadow-indigo-300/30" : "shadow-indigo-400/20"}
      `}
                    >
                        Sign up
                    </button>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;
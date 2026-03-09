import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const ThemeToggle = () => {
    const { theme, toggleTheme } = useTheme();

    return (
        <button
            onClick={toggleTheme}
            className={`
                relative flex items-center w-14 h-8 rounded-full p-1 cursor-pointer transition-colors duration-300 ease-in-out
                ${theme === 'dark' ? 'bg-slate-700 border-slate-600' : 'bg-indigo-100 border-indigo-200'}
                border
            `}
            aria-label="Toggle Theme"
        >
            <div
                className={`
                    flex items-center justify-center w-6 h-6 rounded-full shadow-md transform transition-transform duration-300 ease-in-out
                    ${theme === 'dark'
                        ? 'translate-x-6 bg-slate-900 text-yellow-400'
                        : 'translate-x-0 bg-white text-indigo-600'}
                `}
            >
                {theme === 'dark' ? (
                    <Moon size={14} className="fill-current" />
                ) : (
                    <Sun size={14} className="fill-current" />
                )}
            </div>

            {/* Background Icons (optional, but adds nice detail) */}
            <div className="absolute inset-0 flex justify-between items-center px-2 pointer-events-none opacity-20">
                <Sun size={12} className={theme === 'dark' ? 'invisible' : 'visible'} />
                <Moon size={12} className={theme === 'dark' ? 'visible' : 'invisible'} />
            </div>
        </button>
    );
};

export default ThemeToggle;

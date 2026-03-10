import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { X, Eye, EyeOff } from "lucide-react";

const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, "") || "http://localhost:5000";

async function requestAuth(endpoint, payload) {
    const response = await fetch(`${API_BASE_URL}/api/auth/${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
    });

    let data = null;
    try {
        data = await response.json();
    } catch {
        data = null;
    }

    if (!response.ok) {
        throw new Error(data?.message || "Authentication request failed");
    }

    return data;
}

/**
 * Glassmorphism auth modal for Login + Register.
 * Opens on top of landing page; no separate routes.
 */
export default function AuthModal({ isOpen, onClose, initialMode = "login" }) {
    const navigate = useNavigate();
    const [mode, setMode] = useState(initialMode);

    useEffect(() => {
        if (isOpen) setMode(initialMode);
    }, [isOpen, initialMode]);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    const resetForm = () => {
        setName("");
        setEmail("");
        setPassword("");
        setError("");
        setSuccessMessage("");
    };

    const switchMode = (newMode) => {
        setMode(newMode);
        resetForm();
    };

    const handleClose = () => {
        resetForm();
        setMode(initialMode);
        onClose();
    };

    const handleBackdropClick = (e) => {
        if (e.target === e.currentTarget) handleClose();
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setError("");
        setSuccessMessage("");
        setIsLoading(true);

        try {
            const data = await requestAuth("login", { email, password });
            localStorage.setItem("erp_token", data.token);
            localStorage.setItem("erp_user", JSON.stringify(data.user));
            handleClose();
            navigate("/dashboard");
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        setError("");
        setSuccessMessage("");
        setIsLoading(true);

        try {
            const data = await requestAuth("register", { name, email, password });
            setSuccessMessage(data.message || "Account created. Please sign in.");
            setName("");
            setEmail("");
            setPassword("");
            setTimeout(() => switchMode("login"), 1200);
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen) return null;

    const inputBase =
        "w-full px-4 py-3 rounded-xl bg-white/10 dark:bg-white/5 border border-white/20 dark:border-white/10 " +
        "text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 " +
        "focus:outline-none focus:ring-2 focus:ring-indigo-500/80 focus:border-indigo-400/50 transition-all";

    return (
        <div
            className="fixed inset-0 z-100 flex items-center justify-center p-4 animate-in fade-in duration-300"
            role="dialog"
            aria-modal="true"
            aria-labelledby="auth-modal-title"
        >
            {/* Dim overlay */}
            <div
                className="absolute inset-0 bg-slate-900/60 dark:bg-black/70 backdrop-blur-sm"
                onClick={handleBackdropClick}
            />

            {/* Glassmorphism modal */}
            <div
                className="relative w-full max-w-md animate-in zoom-in-95 fade-in duration-300"
                onClick={(e) => e.stopPropagation()}
            >
                <div
                    className="rounded-3xl border border-white/15 dark:border-white/10 shadow-2xl shadow-black/30 "
                    style={{
                        background: "rgba(255,255,255,0.08)",
                        backdropFilter: "blur(24px) saturate(180%)",
                        WebkitBackdropFilter: "blur(24px) saturate(180%)",
                    }}
                >
                    {/* Dark mode override for better contrast */}
                    <div className="bg-white/5 dark:bg-slate-900/30 rounded-3xl p-8 border border-white/10 dark:border-slate-700/50">
                        {/* Close button */}
                        <button
                            type="button"
                            onClick={handleClose}
                            className="absolute top-4 right-4 p-2 rounded-full text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-white/10 dark:hover:bg-white/5 transition-colors"
                            aria-label="Close"
                        >
                            <X className="h-5 w-5" />
                        </button>

                        {/* Tabs */}
                        <div className="flex gap-2 mb-8">
                            <button
                                type="button"
                                onClick={() => switchMode("login")}
                                className={`flex-1 py-2.5 px-4 rounded-xl text-sm font-semibold transition-all ${
                                    mode === "login"
                                        ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/30"
                                        : "text-slate-600 dark:text-slate-400 hover:bg-white/10 dark:hover:bg-white/5"
                                }`}
                            >
                                Login
                            </button>
                            <button
                                type="button"
                                onClick={() => switchMode("register")}
                                className={`flex-1 py-2.5 px-4 rounded-xl text-sm font-semibold transition-all ${
                                    mode === "register"
                                        ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/30"
                                        : "text-slate-600 dark:text-slate-400 hover:bg-white/10 dark:hover:bg-white/5"
                                }`}
                            >
                                Register
                            </button>
                        </div>

                        <h2 id="auth-modal-title" className="text-xl font-bold text-slate-900 dark:text-white mb-6">
                            {mode === "login" ? "Welcome back" : "Create your account"}
                        </h2>

                        {mode === "login" ? (
                            <form onSubmit={handleLogin} className="space-y-4">
                                <input
                                    type="email"
                                    placeholder="Email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className={inputBase}
                                    required
                                    autoComplete="email"
                                />
                                <div className="relative">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        placeholder="Password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className={inputBase}
                                        required
                                        autoComplete="current-password"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                                        aria-label={showPassword ? "Hide password" : "Show password"}
                                    >
                                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                    </button>
                                </div>
                                <p className="text-xs text-slate-500 dark:text-slate-400">
                                    Forgot password?{" "}
                                    <button type="button" className="text-indigo-400 hover:text-indigo-300 font-medium">
                                        Reset it
                                    </button>
                                </p>
                                {error && (
                                    <div className="rounded-xl bg-rose-500/20 border border-rose-400/30 px-4 py-3 text-sm text-rose-700 dark:text-rose-200">
                                        {error}
                                    </div>
                                )}
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full py-3.5 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 disabled:opacity-60 disabled:cursor-not-allowed shadow-lg shadow-indigo-500/30 transition-all active:scale-[0.98]"
                                >
                                    {isLoading ? "Signing in…" : "Sign in"}
                                </button>
                            </form>
                        ) : (
                            <form onSubmit={handleRegister} className="space-y-4">
                                <input
                                    type="text"
                                    placeholder="Full Name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className={inputBase}
                                    required
                                    autoComplete="name"
                                />
                                <input
                                    type="email"
                                    placeholder="Email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className={inputBase}
                                    required
                                    autoComplete="email"
                                />
                                <div className="relative">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        placeholder="Password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className={inputBase}
                                        required
                                        autoComplete="new-password"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                                        aria-label={showPassword ? "Hide password" : "Show password"}
                                    >
                                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                    </button>
                                </div>
                                {error && (
                                    <div className="rounded-xl bg-rose-500/20 border border-rose-400/30 px-4 py-3 text-sm text-rose-700 dark:text-rose-200">
                                        {error}
                                    </div>
                                )}
                                {successMessage && (
                                    <div className="rounded-xl bg-emerald-500/20 border border-emerald-400/30 px-4 py-3 text-sm text-emerald-700 dark:text-emerald-200">
                                        {successMessage}
                                    </div>
                                )}
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full py-3.5 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 disabled:opacity-60 disabled:cursor-not-allowed shadow-lg shadow-indigo-500/30 transition-all active:scale-[0.98]"
                                >
                                    {isLoading ? "Creating account…" : "Create account"}
                                </button>
                            </form>
                        )}

                        <p className="mt-6 text-center text-sm text-slate-500 dark:text-slate-400">
                            {mode === "login" ? (
                                <>
                                    Don&apos;t have an account?{" "}
                                    <button
                                        type="button"
                                        onClick={() => switchMode("register")}
                                        className="font-semibold text-indigo-400 hover:text-indigo-300"
                                    >
                                        Sign up
                                    </button>
                                </>
                            ) : (
                                <>
                                    Already have an account?{" "}
                                    <button
                                        type="button"
                                        onClick={() => switchMode("login")}
                                        className="font-semibold text-indigo-400 hover:text-indigo-300"
                                    >
                                        Sign in
                                    </button>
                                </>
                            )}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

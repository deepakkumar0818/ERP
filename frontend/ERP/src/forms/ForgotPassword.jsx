import { useState } from "react";
import { Link } from "react-router-dom";
import loginVideo from "../assets/loginvideo.mp4";

const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, "") || "http://localhost:5000";

async function requestPasswordReset(payload) {
    const response = await fetch(`${API_BASE_URL}/api/auth/forgot-password`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
    });

    let data = null;
    try {
        data = await response.json();
    } catch {
        data = null;
    }

    if (!response.ok) {
        throw new Error(data?.message || "Password reset request failed");
    }

    return data;
}

export default function ForgotPassword() {
    const [email, setEmail] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError("");
        setMessage("");
        setIsLoading(true);

        try {
            const data = await requestPasswordReset({ email });
            setMessage(
                data?.message ||
                "If an account exists with this email, we’ve sent a reset link."
            );
            setEmail("");
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex bg-linear-to-br from-slate-50 via-indigo-50 to-slate-100">
            <div className="hidden lg:flex w-1/2 items-center justify-center overflow-hidden">
                <video
                    className="w-full h-full object-cover"
                    src={loginVideo}
                    autoPlay
                    muted
                    loop
                    playsInline
                />
            </div>
            <div className="flex w-full lg:w-1/2 items-center justify-center px-4 py-10">
                <div className="w-full max-w-md bg-white/90 backdrop-blur-xl p-8 rounded-2xl shadow-2xl border border-slate-100">
                    <div className="mb-6 text-center">
                        <p className="text-xs font-semibold tracking-[0.2em] text-indigo-500 uppercase mb-2">
                            Reset access
                        </p>
                        <h1 className="text-3xl font-bold mb-1 text-slate-900">Forgot password</h1>
                        <p className="text-sm text-slate-500">
                            Enter the email linked to your account and we&apos;ll send you a secure reset link.
                        </p>
                    </div>

                    <form className="space-y-5" onSubmit={handleSubmit}>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">
                                Work email
                            </label>
                            <input
                                type="email"
                                value={email}
                                onChange={(event) => setEmail(event.target.value)}
                                placeholder="you@company.com"
                                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                                required
                            />
                        </div>
                        {error && (
                            <p className="text-xs text-rose-600 bg-rose-50 border border-rose-100 rounded-lg px-3 py-2">
                                {error}
                            </p>
                        )}
                        {message && (
                            <p className="text-xs text-emerald-700 bg-emerald-50 border border-emerald-100 rounded-lg px-3 py-2">
                                {message}
                            </p>
                        )}

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-60 disabled:cursor-not-allowed shadow-md shadow-indigo-200 transition-transform duration-150 active:scale-[0.98]"
                        >
                            {isLoading ? "Sending link..." : "Send reset link"}
                        </button>
                    </form>

                    <p className="text-center mt-6 text-sm text-slate-600">
                        Remembered your password?{" "}
                        <Link to="/login" className="text-indigo-600 font-medium hover:text-indigo-700">
                            Back to login
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}


import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import loginVideo from "../assets/loginvideo.mp4";

const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, "") || "http://localhost:5000";

async function requestAuth(endpoint, payload) {
    const response = await fetch(`${API_BASE_URL}/api/auth/${endpoint}`, {
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
        throw new Error(data?.message || "Authentication request failed");
    }

    return data;
}

function Login() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    const handleLogin = async (event) => {
        event.preventDefault();
        setError("");
        setIsLoading(true);

        try {
            const data = await requestAuth("login", { email, password });
            localStorage.setItem("erp_token", data.token);
            localStorage.setItem("erp_user", JSON.stringify(data.user));
            navigate("/dashboard");
        } catch (requestError) {
            setError(requestError.message);
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
                            Secure access
                        </p>
                        <h2 className="text-3xl font-bold mb-1 text-slate-900">Welcome back</h2>
                        <p className="text-sm text-slate-500">
                            Sign in to continue to your manufacturing workspace.
                        </p>
                    </div>
                    <form className="space-y-5" onSubmit={handleLogin}>
                        <input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(event) => setEmail(event.target.value)}
                            className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                            required
                        />

                        <div className="space-y-2">
                            <input
                                type="password"
                                placeholder="Password"
                                value={password}
                                onChange={(event) => setPassword(event.target.value)}
                                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                                required
                            />
                            <div className="flex justify-between items-center text-xs">
                                <span className="text-slate-400">Forgot your password?</span>
                                <Link
                                    to="/forgot-password"
                                    className="font-medium text-indigo-600 hover:text-indigo-700"
                                >
                                    Reset it
                                </Link>
                            </div>
                        </div>

                        {error && <p className="text-sm text-red-600">{error}</p>}

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-60 disabled:cursor-not-allowed shadow-md shadow-indigo-200 transition-transform duration-150 active:scale-[0.98]"
                        >
                            {isLoading ? "Signing in..." : "Login"}
                        </button>
                    </form>

                    <p className="text-center mt-6 text-sm text-slate-600">
                        Don&apos;t have an account?{" "}
                        <Link to="/register" className="text-indigo-600 font-medium hover:text-indigo-700">
                            Create one
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}

function Register() {
    const navigate = useNavigate();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    const handleRegister = async (event) => {
        event.preventDefault();
        setError("");
        setSuccessMessage("");
        setIsLoading(true);

        try {
            const data = await requestAuth("register", { name, email, password });
            setSuccessMessage(data.message || "Account created. Please login.");
            setName("");
            setEmail("");
            setPassword("");
            setTimeout(() => navigate("/login"), 800);
        } catch (requestError) {
            setError(requestError.message);
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
                            Create account
                        </p>
                        <h2 className="text-3xl font-bold mb-1 text-slate-900">Join the workspace</h2>
                        <p className="text-sm text-slate-500">
                            Get a secure account for your team&apos;s operations.
                        </p>
                    </div>

                    <form className="space-y-5" onSubmit={handleRegister}>
                        <input
                            type="text"
                            placeholder="Full Name"
                            value={name}
                            onChange={(event) => setName(event.target.value)}
                            className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                            required
                        />

                        <input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(event) => setEmail(event.target.value)}
                            className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                            required
                        />

                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(event) => setPassword(event.target.value)}
                            className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                            required
                        />

                        {error && <p className="text-sm text-red-600">{error}</p>}
                        {successMessage && <p className="text-sm text-emerald-700">{successMessage}</p>}

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-60 disabled:cursor-not-allowed shadow-md shadow-indigo-200 transition-transform duration-150 active:scale-[0.98]"
                        >
                            {isLoading ? "Creating account..." : "Create Account"}
                        </button>
                    </form>

                    <p className="text-center mt-6 text-sm text-slate-600">
                        Already have an account?{" "}
                        <Link to="/login" className="text-indigo-600 font-medium hover:text-indigo-700">
                            Login
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}

export { Register };
export default Login;

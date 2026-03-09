import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

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
        <div className="min-h-screen flex">
            <div className="hidden lg:flex w-1/2 items-center justify-center overflow-hidden">
                <video className="w-full h-full object-cover" src="/assets/loginvideo.mp4" autoPlay muted loop playsInline/>
            </div>
            <div className="flex w-full lg:w-1/2 items-center justify-center bg-gray-100 px-4">
                <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-lg">
                    <h2 className="text-3xl font-bold text-center mb-6">Welcome Back</h2>
                    <form className="space-y-5" onSubmit={handleLogin}>
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

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                            {isLoading ? "Signing in..." : "Login"}
                        </button>
                    </form>

                    <p className="text-center mt-6 text-sm">
                        Don&apos;t have an account?{" "}
                        <Link to="/register" className="text-indigo-600 font-medium">
                            Register
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
        <div className="min-h-screen flex">
            <div className="hidden lg:flex w-1/2 items-center justify-center overflow-hidden">
                <video className="w-full h-full object-cover" autoPlay muted loop playsInline>
                    <source src="./assets/login" type="video/mp4" />
                    Your browser does not support the video tag.
                </video>
            </div>

            <div className="flex w-full lg:w-1/2 items-center justify-center bg-gray-100 px-4">
                <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-lg">
                    <h2 className="text-3xl font-bold text-center mb-6">Register</h2>

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
                            className="w-full py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                            {isLoading ? "Creating account..." : "Create Account"}
                        </button>
                    </form>

                    <p className="text-center mt-6 text-sm">
                        Already have an account?{" "}
                        <Link to="/login" className="text-indigo-600 font-medium">
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

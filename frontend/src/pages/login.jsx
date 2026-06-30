import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleLogin = (e) => {
        e.preventDefault();

        if (username === "admin" && password === "admin123") {
            navigate("/dashboard");
        } else {
            alert("Invalid username or password");
        }
    };

    return (
        <div className="min-h-screen bg-[#F9FBFD] flex flex-col items-center justify-center p-4 font-sans antialiased selection:bg-blue-100">
            {/* Top Minimal Branding Header */}
            <div className="mb-8 flex items-center space-x-2.5">
                <div className="h-9 w-9 bg-gradient-to-tr from-blue-600 to-indigo-500 rounded-lg flex items-center justify-center text-white font-black shadow-md shadow-blue-200/50 tracking-wider text-sm">
                    VD
                </div>
                <span className="text-2xl font-semibold tracking-tight text-slate-800">VDocs</span>
            </div>

            {/* Main Form Box Container */}
            <form 
                className="w-full max-w-md bg-white border border-slate-200/70 rounded-2xl p-8 md:p-10 shadow-xl shadow-slate-200/30 flex flex-col" 
                onSubmit={handleLogin}
            >
                <h1 className="text-2xl font-bold text-slate-900 tracking-tight mb-1">Sign in</h1>
                <p className="text-sm text-slate-500 mb-6">to continue to your real-time collaborative workspace</p>

                {/* Username Field */}
                <div className="mb-4">
                    <input
                        className="w-full bg-white border border-slate-200 text-slate-800 rounded-lg px-4 py-3 text-sm placeholder-slate-400 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:outline-none transition-all"
                        type="text"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                </div>

                {/* Password Field */}
                <div className="mb-6">
                    <input
                        className="w-full bg-white border border-slate-200 text-slate-800 rounded-lg px-4 py-3 text-sm placeholder-slate-400 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:outline-none transition-all"
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>

                {/* Submit Action Button */}
                <button 
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm py-2.5 px-4 rounded-lg shadow-sm shadow-blue-200 transition-all active:scale-[0.99] mb-6"
                    type="submit"
                >
                    Login
                </button>

                {/* Redirection Link Area */}
                <p className="text-center text-xs md:text-sm text-slate-500 font-medium">
                    Don’t have an account?{" "}
                    <Link 
                        to="/register" 
                        className="text-blue-600 hover:text-blue-700 font-semibold underline underline-offset-4 transition"
                    >
                        Create a new account
                    </Link>
                </p>
            </form>
            
            {/* Soft Footer Detail */}
            <div className="mt-8 text-xs text-slate-400 font-medium tracking-wide">
                &copy; 2026 VDocs Suite
            </div>
        </div>
    );
}

export default Login;
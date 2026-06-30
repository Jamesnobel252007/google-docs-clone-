import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Register() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleRegister = (e) => {
        e.preventDefault();
        alert("Account Created Successfully!");
        navigate("/");
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
                onSubmit={handleRegister}
            >
                <h1 className="text-2xl font-bold text-slate-900 tracking-tight mb-1">Create an account</h1>
                <p className="text-sm text-slate-500 mb-6">Get started with your collaborative document workspace</p>

                {/* Username Input */}
                <div className="mb-4">
                    <input
                        className="w-full bg-white border border-slate-200 text-slate-800 rounded-lg px-4 py-3 text-sm placeholder-slate-400 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:outline-none transition-all"
                        type="text"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                </div>

                {/* Password Input */}
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
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm py-2.5 px-4 rounded-lg shadow-sm shadow-blue-200 transition-all active:scale-[0.99] mb-4"
                    type="submit"
                >
                    Register
                </button>

                {/* Back to Login Redirect Link */}
                <button
                    type="button"
                    onClick={() => navigate("/")}
                    className="text-center text-xs md:text-sm text-blue-600 hover:text-blue-700 font-semibold underline underline-offset-4 transition bg-transparent border-none cursor-pointer focus:outline-none"
                >
                    Already have an account? Sign in
                </button>
            </form>
            
            {/* Soft Footer Detail */}
            <div className="mt-8 text-xs text-slate-400 font-medium tracking-wide">
                &copy; 2026 VDocs Suite
            </div>
        </div>
    );
}

export default Register;
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from '../api/api';

function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            const response = await api.post("token/", {
                username,
                password,
            });
            localStorage.setItem("access", response.data.access);
            localStorage.setItem("refresh", response.data.refresh);

            navigate("/dashboard");
        } catch (error) {
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

const styles = {
    page: {
        minHeight: "100vh",
        display: "grid",
        gridTemplateColumns: "46% 54%",
        background: "#f8fafc",
        fontFamily: "Arial, sans-serif",
    },

    sidebar: {
        background:
            "linear-gradient(145deg, #0f172a 0%, #111827 45%, #1e293b 100%)",
        color: "white",
        padding: "70px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
    },

    brandBox: {
        display: "flex",
        alignItems: "center",
        gap: "18px",
        marginBottom: "52px",
    },

    docLogo: {
        width: "72px",
        height: "84px",
        borderRadius: "12px",
        background: "linear-gradient(135deg, #2563eb, #60a5fa)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        boxShadow: "0 12px 30px rgba(37,99,235,0.35)",
    },

    docV: {
        color: "white",
        fontSize: "38px",
        fontWeight: "900",
    },

    logoText: {
        margin: 0,
        fontSize: "58px",
        fontWeight: "900",
        color: "white",
    },

    logoSub: {
        margin: "4px 0 0 0",
        color: "#94a3b8",
        fontSize: "14px",
        letterSpacing: "1px",
    },

    heroTitle: {
        fontSize: "54px",
        lineHeight: "1.05",
        maxWidth: "600px",
        margin: "0 0 22px",
        color: "white",
    },

    heroText: {
        fontSize: "19px",
        lineHeight: "1.7",
        color: "#e2e8f0",
        maxWidth: "560px",
    },

    previewCard: {
        marginTop: "48px",
        width: "430px",
        padding: "24px",
        borderRadius: "22px",
        background: "rgba(255,255,255,0.08)",
    },

    previewTop: {
        display: "flex",
        gap: "8px",
        marginBottom: "28px",
    },

    dot: {
        width: "10px",
        height: "10px",
        borderRadius: "50%",
        background: "#60a5fa",
    },

    previewLineBig: {
        height: "18px",
        width: "78%",
        borderRadius: "999px",
        background: "rgba(255,255,255,0.75)",
        marginBottom: "16px",
    },

    previewLine: {
        height: "12px",
        width: "92%",
        borderRadius: "999px",
        background: "rgba(209, 28, 28, 0.35)",
        marginBottom: "12px",
    },

    previewLineSmall: {
        height: "12px",
        width: "62%",
        borderRadius: "999px",
        background: "rgba(255,255,255,0.28)",
    },

    main: {
        position: "relative",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "60px",
    },

    topRight: {
        position: "absolute",
        top: "34px",
        right: "46px",
        display: "flex",
        alignItems: "center",
        gap: "14px",
    },

    muted: {
        color: "#64748b",
    },

    secondaryBtn: {
        border: "1px solid #dbe3ef",
        background: "white",
        padding: "10px 16px",
        borderRadius: "12px",
        cursor: "pointer",
        fontWeight: "700",
    },

    card: {
        width: "430px",
        background: "white",
        borderRadius: "28px",
        padding: "44px",
        boxShadow: "0 30px 80px rgba(15,23,42,0.12)",
    },

    kicker: {
        color: "#2563eb",
        fontWeight: "800",
    },

    title: {
        color: "#0f172a",
        fontSize: "38px",
    },

    desc: {
        color: "#64748b",
    },

    label: {
        display: "block",
        margin: "16px 0 8px",
        fontWeight: "700",
    },

    input: {
        width: "100%",
        padding: "16px",
        borderRadius: "14px",
        border: "1px solid #dbe3ef",
        background: "#f8fafc",
        boxSizing: "border-box",
    },

    primaryBtn: {
        width: "100%",
        marginTop: "28px",
        padding: "16px",
        border: "none",
        borderRadius: "14px",
        background: "#0f172a",
        color: "white",
        fontSize: "17px",
        fontWeight: "900",
        cursor: "pointer",
    },

    testBox: {
        marginTop: "20px",
        padding: "13px",
        borderRadius: "14px",
        background: "#f1f5f9",
        color: "#475569",
        fontSize: "14px",
        textAlign: "center",
    },
};

export default Login;
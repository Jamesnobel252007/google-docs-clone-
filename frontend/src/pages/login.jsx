import { useState } from "react";
import { useNavigate } from "react-router-dom";
import vdartLogo from "../assets/vdart-logo.png";

function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleLogin = () => {
        if (!username || !password) {
            alert("Fill all fields");
            return;
        }

        const defaultUsers = [
            { username: "admin", password: "admin123", role: "admin" },
            { username: "user", password: "user123", role: "user" },
        ];

        const storedUsers = JSON.parse(localStorage.getItem("users")) || [];
        const allUsers = [...defaultUsers, ...storedUsers];

        const foundUser = allUsers.find(
            (u) => u.username === username && u.password === password
        );

        if (foundUser) {
            localStorage.setItem("loggedInUser", JSON.stringify(foundUser));
            navigate("/dashboard");
        } else {
            alert("Invalid username or password");
        }
    };

    return (
        <div style={styles.page}>
            <div style={styles.sidebar}>
                <div style={styles.logoRow}>
                    <img src={vdartLogo} alt="VDart Logo" style={styles.logoImage} />
                    <h1 style={styles.logoText}>VDocs</h1>
                </div>

                <h2 style={styles.heroTitle}>Your workspace for smarter documents.</h2>

                <p style={styles.heroText}>
                    Create, edit, organize, and collaborate on documents from a clean
                    productivity dashboard.
                </p>

                <div style={styles.previewCard}>
                    <div style={styles.previewTop}>
                        <span style={styles.dot}></span>
                        <span style={styles.dot}></span>
                        <span style={styles.dot}></span>
                    </div>
                    <div style={styles.previewLineBig}></div>
                    <div style={styles.previewLine}></div>
                    <div style={styles.previewLineSmall}></div>
                </div>
            </div>

            <div style={styles.main}>
                <div style={styles.topRight}>
                    <span style={styles.muted}>New here?</span>
                    <button style={styles.secondaryBtn} onClick={() => navigate("/register")}>
                        Create account
                    </button>
                </div>

                <div style={styles.card}>
                    <p style={styles.kicker}>Welcome back</p>
                    <h2 style={styles.title}>Sign in to continue</h2>
                    <p style={styles.desc}>Access your VDocs workspace securely.</p>

                    <label style={styles.label}>Username</label>
                    <input
                        style={styles.input}
                        type="text"
                        placeholder="admin / user"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />

                    <label style={styles.label}>Password</label>
                    <input
                        style={styles.input}
                        type="password"
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />

                    <button style={styles.primaryBtn} onClick={handleLogin}>
                        Sign in
                    </button>

                    <div style={styles.testBox}>
                        Demo: <b>admin</b> / <b>admin123</b> or <b>user</b> / <b>user123</b>
                    </div>
                </div>
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
        fontFamily: "Inter, Arial, sans-serif",
    },
    sidebar: {
        background:
            "linear-gradient(145deg, #0f172a 0%, #111827 45%, #1e293b 100%)",
        color: "white",
        padding: "70px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        position: "relative",
        overflow: "hidden",
    },
    logoRow: {
        display: "flex",
        alignItems: "center",
        gap: "18px",
        marginBottom: "52px",
    },
    logoImage: {
        width: "82px",
        height: "82px",
        objectFit: "contain",
    },
    logoText: {
        fontSize: "48px",
        margin: 0,
        fontWeight: "900",
        letterSpacing: "-2px",
    },
    heroTitle: {
        fontSize: "54px",
        lineHeight: "1.05",
        maxWidth: "600px",
        margin: "0 0 22px",
        letterSpacing: "-2px",
        color: "#ffffff",   // add this
        fontWeight: "900",
    },
    heroText: {
        fontSize: "19px",
        lineHeight: "1.7",
        color: "#e2e8f0",
        maxWidth: "560px",
        margin: 0,
    },
    previewCard: {
        marginTop: "48px",
        width: "430px",
        padding: "24px",
        borderRadius: "22px",
        background: "rgba(255,255,255,0.08)",
        border: "1px solid rgba(255,255,255,0.14)",
        boxShadow: "0 24px 70px rgba(0,0,0,0.35)",
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
        background: "rgba(255,255,255,0.35)",
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
        fontSize: "15px",
    },
    secondaryBtn: {
        border: "1px solid #dbe3ef",
        background: "white",
        color: "#0f172a",
        padding: "10px 16px",
        borderRadius: "12px",
        cursor: "pointer",
        fontWeight: "700",
    },
    card: {
        width: "430px",
        background: "white",
        border: "1px solid #e5e7eb",
        borderRadius: "28px",
        padding: "44px",
        boxShadow: "0 30px 80px rgba(15,23,42,0.12)",
    },
    kicker: {
        margin: "0 0 10px",
        color: "#2563eb",
        fontSize: "14px",
        fontWeight: "800",
        textTransform: "uppercase",
        letterSpacing: "1px",
    },
    title: {
        margin: "0 0 10px",
        color: "#0f172a",
        fontSize: "38px",
        letterSpacing: "-1px",
    },
    desc: {
        margin: "0 0 28px",
        color: "#64748b",
        fontSize: "16px",
    },
    label: {
        display: "block",
        margin: "16px 0 8px",
        color: "#334155",
        fontSize: "14px",
        fontWeight: "800",
    },
    input: {
        width: "100%",
        padding: "16px",
        borderRadius: "14px",
        border: "1px solid #dbe3ef",
        background: "#f8fafc",
        color: "#0f172a",
        fontSize: "16px",
        outline: "none",
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
        boxShadow: "0 16px 36px rgba(15,23,42,0.24)",
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
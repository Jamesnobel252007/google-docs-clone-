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
        <div style={styles.container}>
            <div style={styles.card}>
                {/* Header / Logo Section */}
                <div style={styles.header}>
                    <img src={vdartLogo} alt="VDart Logo" style={styles.logoImage} />
                    <h2 style={styles.brandName}>VDocs</h2>
                </div>

                <div style={styles.greeting}>
                    <h3 style={styles.welcomeText}>Welcome back</h3>
                    <p style={styles.subtitle}>Please enter your details to sign in.</p>
                </div>

                {/* Form Section */}
                <div style={styles.form}>
                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Username</label>
                        <input
                            style={styles.input}
                            type="text"
                            placeholder="Enter your username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                    </div>

                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Password</label>
                        <input
                            style={styles.input}
                            type="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    <button style={styles.button} onClick={handleLogin}>
                        Sign In
                    </button>
                </div>

                {/* Footer Section */}
                <p style={styles.footerText}>
                    Don’t have an account?{" "}
                    <span style={styles.link} onClick={() => navigate("/register")}>
                        Create one now
                    </span>
                </p>
            </div>
        </div>
    );
}

const styles = {
    container: {
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #f0f4f8 0%, #d9e2ec 100%)",
        fontFamily: "'Inter', 'Segoe UI', sans-serif",
    },
    card: {
        width: "100%",
        maxWidth: "440px",
        background: "white",
        padding: "48px",
        borderRadius: "24px",
        boxShadow: "0 10px 40px rgba(0, 0, 0, 0.08)",
        boxSizing: "border-box",
    },
    header: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "12px",
        marginBottom: "32px",
    },
    logoImage: {
        width: "48px",
        height: "48px",
        objectFit: "contain",
    },
    brandName: {
        fontSize: "28px",
        fontWeight: "800",
        color: "#1a73e8",
        margin: 0,
    },
    greeting: {
        textAlign: "center",
        marginBottom: "32px",
    },
    welcomeText: {
        fontSize: "24px",
        fontWeight: "700",
        color: "#102a43",
        margin: "0 0 8px 0",
    },
    subtitle: {
        fontSize: "15px",
        color: "#627d98",
        margin: 0,
    },
    form: {
        display: "flex",
        flexDirection: "column",
        gap: "20px",
    },
    inputGroup: {
        display: "flex",
        flexDirection: "column",
        gap: "8px",
    },
    label: {
        fontSize: "14px",
        fontWeight: "600",
        color: "#334e68",
    },
    input: {
        width: "100%",
        padding: "14px 16px",
        border: "1px solid #bcccdc",
        borderRadius: "10px",
        fontSize: "15px",
        color: "#102a43",
        outline: "none",
        transition: "border-color 0.2s",
        boxSizing: "border-box",
        backgroundColor: "#f0f4f8",
    },
    button: {
        width: "100%",
        padding: "16px",
        marginTop: "10px",
        border: "none",
        borderRadius: "10px",
        background: "#1a73e8",
        color: "white",
        fontSize: "16px",
        fontWeight: "700",
        cursor: "pointer",
        transition: "background 0.2s, transform 0.1s",
        boxShadow: "0 4px 14px rgba(26, 115, 232, 0.3)",
    },
    footerText: {
        marginTop: "32px",
        textAlign: "center",
        color: "#627d98",
        fontSize: "14px",
    },
    link: {
        color: "#1a73e8",
        fontWeight: "700",
        cursor: "pointer",
        textDecoration: "none",
    },
};

export default Login;
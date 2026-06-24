import vdartLogo from "../assets/vdart-logo.png";

function Login() {
    return (
        <div style={styles.page}>
            <div style={styles.left}>
                <div style={styles.brandRow}>
                    <img
                        src={vdartLogo}
                        alt="VDart Logo"
                        style={styles.logoImage}
                    />
                    <h1 style={styles.logo}>VDocs</h1>
                </div>

                <h2>Real-Time Collaborative Document Editor</h2>
                <p>Create, edit, and collaborate on documents in one place.</p>
            </div>

            <div style={styles.card}>
                <h2>Sign in</h2>

                <input style={styles.input} type="text" placeholder="Username" />
                <input style={styles.input} type="password" placeholder="Password" />

                <button style={styles.button}>Login</button>

                <p style={styles.text}>
                    Don’t have an account? <span style={styles.link}>Register</span>
                </p>
            </div>
        </div>
    );
}

const styles = {
    page: {
        minHeight: "100vh",
        display: "flex",
        background: "#f1f5f9",
    },

    left: {
        flex: 1,
        background: "linear-gradient(135deg, #1a73e8, #0f172a)",
        color: "white",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: "80px",
    },

    brandRow: {
        display: "flex",
        alignItems: "center",
        gap: "18px",
        marginBottom: "20px",
    },

    logoImage: {
        width: "90px",
        height: "90px",
        objectFit: "contain",
    },

    logo: {
        fontSize: "64px",
        color: "white",
        margin: 0,
    },

    card: {
        width: "380px",
        background: "white",
        margin: "auto 90px",
        padding: "40px",
        borderRadius: "18px",
        boxShadow: "0 20px 40px rgba(0,0,0,0.15)",
    },

    input: {
        width: "100%",
        padding: "14px",
        marginTop: "15px",
        border: "1px solid #d1d5db",
        borderRadius: "10px",
        fontSize: "15px",
        boxSizing: "border-box",
    },

    button: {
        width: "100%",
        padding: "14px",
        marginTop: "22px",
        border: "none",
        borderRadius: "10px",
        background: "#1a73e8",
        color: "white",
        fontSize: "16px",
        cursor: "pointer",
    },

    text: {
        marginTop: "20px",
        textAlign: "center",
        color: "#64748b",
    },

    link: {
        color: "#1a73e8",
        fontWeight: "bold",
        cursor: "pointer",
    },
};

export default Login;
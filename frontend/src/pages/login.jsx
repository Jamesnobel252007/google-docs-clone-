import vdartLogo from "../assets/vdart-logo.png";

function Login() {
    return (
        <div style={styles.page}>
            <div style={styles.left}>
                <div style={styles.brandRow}>
                    <img src={vdartLogo} alt="VDart Logo" style={styles.logoImage} />
                    <h1 style={styles.logo}>VDocs</h1>
                </div>

                <h2 style={styles.heading}>
                    Real-Time Collaborative Document Editor
                </h2>

                <p style={styles.subtitle}>
                    Create, edit, and collaborate on documents in one place.
                </p>

                <p style={styles.powered}>Powered by VDart</p>
            </div>

            <div style={styles.right}>
                <div style={styles.card}>
                    <h2 style={styles.signin}>Sign in</h2>

                    <input style={styles.input} type="text" placeholder="Username" />
                    <input style={styles.input} type="password" placeholder="Password" />

                    <button style={styles.button}>Login</button>

                    <p style={styles.text}>
                        Don’t have an account? <span style={styles.link}>Register</span>
                    </p>
                </div>
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
        flex: 1.2,
        background: "linear-gradient(135deg, #1d70d6, #0f172a)",
        color: "white",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: "90px",
    },
    right: {
        flex: 1,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
    },
    brandRow: {
        display: "flex",
        alignItems: "center",
        gap: "28px",
        marginBottom: "35px",
    },
    logoImage: {
        width: "140px",
        height: "140px",
        objectFit: "contain",
    },
    logo: {
        fontSize: "72px",
        color: "white",
        margin: 0,
        fontWeight: "800",
    },
    heading: {
        fontSize: "34px",
        color: "#e2e8f0",
        marginBottom: "14px",
    },
    subtitle: {
        fontSize: "21px",
        color: "white",
        margin: 0,
    },
    powered: {
        marginTop: "34px",
        color: "#bfdbfe",
        fontWeight: "600",
        fontSize: "17px",
    },
    card: {
        width: "420px",
        background: "white",
        padding: "48px",
        borderRadius: "24px",
        boxShadow: "0 24px 55px rgba(15,23,42,0.18)",
    },
    signin: {
        fontSize: "34px",
        marginBottom: "28px",
    },
    input: {
        width: "100%",
        padding: "18px",
        marginTop: "16px",
        border: "1px solid #d1d5db",
        borderRadius: "14px",
        fontSize: "17px",
        boxSizing: "border-box",
    },
    button: {
        width: "100%",
        padding: "18px",
        marginTop: "26px",
        border: "none",
        borderRadius: "14px",
        background: "#1a73e8",
        color: "white",
        fontSize: "18px",
        cursor: "pointer",
        fontWeight: "600",
    },
    text: {
        marginTop: "28px",
        textAlign: "center",
        color: "#64748b",
        fontSize: "17px",
    },
    link: {
        color: "#1a73e8",
        fontWeight: "700",
        cursor: "pointer",
    },
};

export default Login;
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import vdartLogo from "../assets/vdart-logo.png";

function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleRegister = () => {
    if (!username || !password) {
      alert("Fill all fields");
      return;
    }

    const users = JSON.parse(localStorage.getItem("users")) || [];

    const userExists = users.find((u) => u.username === username);

    if (userExists || username === "admin" || username === "user") {
      alert("Username already exists");
      return;
    }

    const newUser = {
      username,
      password,
      role: "user",
    };

    users.push(newUser);
    localStorage.setItem("users", JSON.stringify(users));

    alert("Registered successfully");
    navigate("/");
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <img src={vdartLogo} alt="VDart Logo" style={styles.logo} />

        <h2 style={styles.title}>Create Account</h2>

        <input
          style={styles.input}
          type="text"
          placeholder="Create username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <input
          style={styles.input}
          type="password"
          placeholder="Create password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button style={styles.button} onClick={handleRegister}>
          Register
        </button>

        <p style={styles.text}>
          Already have an account?{" "}
          <span style={styles.link} onClick={() => navigate("/")}>
            Login
          </span>
        </p>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "#f1f5f9",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    width: "420px",
    background: "white",
    padding: "45px",
    borderRadius: "24px",
    boxShadow: "0 24px 55px rgba(15,23,42,0.18)",
    textAlign: "center",
  },
  logo: {
    width: "95px",
    height: "95px",
    objectFit: "contain",
    marginBottom: "10px",
  },
  title: {
    fontSize: "32px",
    marginBottom: "25px",
  },
  input: {
    width: "100%",
    padding: "17px",
    marginTop: "16px",
    border: "1px solid #d1d5db",
    borderRadius: "14px",
    fontSize: "16px",
    boxSizing: "border-box",
  },
  button: {
    width: "100%",
    padding: "17px",
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
    marginTop: "25px",
    color: "#64748b",
    fontSize: "16px",
  },
  link: {
    color: "#1a73e8",
    fontWeight: "700",
    cursor: "pointer",
  },
};

export default Register;
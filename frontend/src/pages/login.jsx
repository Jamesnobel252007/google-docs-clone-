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
        <div className="login-page">
            <form className="login-box" onSubmit={handleLogin}>
                <h1>Login</h1>

                <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />

                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />

                <button type="submit">Login</button>

                <p>
                    Don’t have an account?{" "}
                    <Link to="/register">Create a new account</Link>
                </p>
            </form>
        </div>
    );
}

export default Login;
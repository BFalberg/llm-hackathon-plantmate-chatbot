import { useNavigate } from "react-router-dom";
import { useState } from "react";
import "./app.css";

export default function LoginFlow() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function handleLogin(e) {
    e.preventDefault();

    if (email === "test@test.com" && password === "1234") {
      navigate("/app");
    } else {
      alert("Forkert login");
    }
  }

  return (
    <div className="login-container">
      <h1>Log ind</h1>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Adgangskode"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Log ind</button>
      </form>
    </div>
  );
}

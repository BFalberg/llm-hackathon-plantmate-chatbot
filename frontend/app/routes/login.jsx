import { useState } from "react";
import { useNavigate, Link, Form, redirect } from "react-router";
import plantMateLogo from "../assets/plant-mate-logo.svg";
import { supabase } from "../lib/client";

export async function clientAction({ params, request }) {
  const formData = await request.formData();
  const email = formData.get("email");
  const password = formData.get("password");

  if (!email || !password) {
    return { error: "Udfyld venligst begge felter før du logger ind." };
  }

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    console.error("Login failed:", error);
    return { error: error.message };
  }
  console.log("Login succecsful! User:", data.user.email);
  console.log("JWT token has been stored in localStorage");

  const url = new URL(request.url);
  const redirectTo = url.searchParams.get("redirectTo") || "/";
  return redirect(redirectTo);
}
export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  return (
    <div className="login-page">
      <header className="login-header">
        <img
          src={plantMateLogo}
          alt="Plant Mate Logo"
          className="logo-image-login"
        />
        <div className="login-header-content">
          <h1>Log in</h1>
        </div>
      </header>
      <Form method="post">
        <div className="login-input-section">
          <div className="input-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              name="email"
              placeholder="Enter your email"
              className="login-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="input-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              placeholder="* * * * *"
              name="password"
              className="login-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="login-options">
            <label className="remember-me">
              <input type="checkbox" />
              Remember me
            </label>

            <p className="forgot-password">Forgot password?</p>
          </div>

          {error && <p className="login-error">{error}</p>}
        </div>

        <div className="login-btn-section">
          <button className="login-btn" type="submit">
            Log in
          </button>

          <Link to="/start" className="cancel-text">
            Cancel
          </Link>
        </div>
      </Form>
    </div>
  );
}

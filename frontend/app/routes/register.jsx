import {
  Form,
  Link,
  redirect,
  useActionData,
  useNavigation,
} from "react-router";
import { supabase } from "../lib/client";
import plantMateLogo from "../assets/plant-mate-logo.svg";

export async function clientAction({ request }) {
  const formData = await request.formData();
  const email = formData.get("email");
  const password = formData.get("password");
  const confirmPassword = formData.get("confirmPassword");
  if (!email || !password || !confirmPassword) {
    return { error: "All fields are required" };
  }
  if (password !== confirmPassword) {
    return { error: "Passwords do not match" };
  }
  if (password.length < 6) {
    return { error: "Password must be at lest 6 characters" };
  }
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });
  if (error) {
    console.error("Registration error:", error);
    return { error: error.message };
  }
  return redirect("/");
}

export default function Register() {
  const actionData = useActionData();

  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";

  return (
    <div className="register-page">
      <div className="logo-register">
        <img
          src={plantMateLogo}
          alt="Plant Mate Logo"
          className="logo-image-login"
        />
      </div>
      Register side
      <Form method="post" className="auth-form">
        <article className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            required
            autoComplete="email"
            placeholder="you@example.com"
          />
        </article>

        <article className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            required
            autoComplete="new-password"
            minLength={6}
            placeholder="At least 6 characters"
          />
        </article>

        <article className="form-group">
          <label htmlFor="confirmPassword">Confirm Password</label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            required
            autoComplete="new-password"
            minLength={6}
            placeholder="Re-enter your password"
          />
        </article>

        {actionData?.error && (
          <div className="error-message">{actionData.error}</div>
        )}

        <button type="submit" disabled={isSubmitting} className="btn-primary">
          {isSubmitting ? "Creating account..." : "Create Account"}
        </button>
      </Form>
    </div>
  );
}

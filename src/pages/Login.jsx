import { useState } from "react";
import { Navigate } from "react-router-dom";
import toast from "react-hot-toast";
import { loginUser, loginWithGoogle, registerUser } from "../firebase/auth";
import { useAuth } from "../contexts/AuthContext";
import { hasFirebaseConfig } from "../firebase/config";

export function Login() {
  const { user } = useAuth();
  const [mode, setMode] = useState("login");
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    className: "",
    role: "student",
    email: "",
    password: "",
  });

  if (user) {
    return <Navigate to="/" replace />;
  }

  function updateField(event) {
    setFormData((current) => ({
      ...current,
      [event.target.name]: event.target.value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setLoading(true);

    try {
      if (mode === "login") {
        await loginUser({
          email: formData.email,
          password: formData.password,
        });
        toast.success("Welcome back.");
      } else {
        await registerUser(formData);
        toast.success("Library account created.");
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogleLogin() {
    try {
      setLoading(true);
      await loginWithGoogle();
      toast.success("Signed in with Google.");
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="page-shell"
      style={{
        minHeight: "100vh",
        display: "grid",
        alignItems: "center",
      }}
    >
      <div
        style={{
          display: "grid",
          gap: 24,
          gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
          alignItems: "stretch",
        }}
      >
        <section
          className="glass-card"
          style={{ borderRadius: 32, padding: 32, position: "relative", overflow: "hidden" }}
        >
          <div
            style={{
              position: "absolute",
              inset: "auto -80px -80px auto",
              width: 220,
              height: 220,
              borderRadius: "50%",
              background: "rgba(222, 159, 73, 0.18)",
              filter: "blur(12px)",
            }}
          />
          <p
            style={{
              marginTop: 0,
              fontSize: 12,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: "var(--accent-strong)",
            }}
          >
            Namma-Pustaka
          </p>
          <h1
            style={{
              marginTop: 0,
              fontFamily: '"Fraunces", serif',
              fontSize: "clamp(2.2rem, 5vw, 4rem)",
              maxWidth: 520,
            }}
          >
            Smart library management for every rural classroom.
          </h1>
          <p style={{ color: "var(--muted)", maxWidth: 560 }}>
            Browse books, scan QR codes, read Kannada AI summaries, and track real reading
            habits with a live library dashboard.
          </p>
          <div
            style={{
              display: "grid",
              gap: 14,
              marginTop: 28,
              gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
            }}
          >
            {[
              "QR-based borrowing",
              "Kannada summaries",
              "Real-time overdue alerts",
              "Reading leaderboard",
            ].map((feature) => (
              <div
                key={feature}
                style={{
                  borderRadius: 20,
                  padding: 16,
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid var(--line)",
                }}
              >
                {feature}
              </div>
            ))}
          </div>
        </section>

        <section className="glass-card" style={{ borderRadius: 32, padding: 32 }}>
          <div style={{ display: "flex", gap: 12, marginBottom: 20 }}>
            <button
              type="button"
              onClick={() => setMode("login")}
              style={modeButtonStyle(mode === "login")}
            >
              Sign in
            </button>
            <button
              type="button"
              onClick={() => setMode("register")}
              style={modeButtonStyle(mode === "register")}
            >
              Create account
            </button>
          </div>

          {!hasFirebaseConfig ? (
            <div
              style={{
                borderRadius: 20,
                padding: 18,
                background: "rgba(239, 125, 122, 0.14)",
                border: "1px solid rgba(239, 125, 122, 0.25)",
                color: "#ffd5d3",
              }}
            >
              Add your Firebase keys to `.env` before signing in.
            </div>
          ) : null}

          <form onSubmit={handleSubmit} style={{ display: "grid", gap: 14, marginTop: 18 }}>
            {mode === "register" ? (
              <>
                <input
                  name="name"
                  value={formData.name}
                  onChange={updateField}
                  placeholder="Full name"
                  required
                  style={fieldStyle}
                />
                <div style={{ display: "grid", gap: 14, gridTemplateColumns: "1fr 1fr" }}>
                  <input
                    name="className"
                    value={formData.className}
                    onChange={updateField}
                    placeholder="Class / Grade"
                    style={fieldStyle}
                  />
                  <select
                    name="role"
                    value={formData.role}
                    onChange={updateField}
                    style={fieldStyle}
                  >
                    <option value="student">Student</option>
                    <option value="teacher">Teacher</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
              </>
            ) : null}

            <input
              name="email"
              type="email"
              value={formData.email}
              onChange={updateField}
              placeholder="Email address"
              required
              style={fieldStyle}
            />
            <input
              name="password"
              type="password"
              value={formData.password}
              onChange={updateField}
              placeholder="Password"
              required
              minLength={6}
              style={fieldStyle}
            />
            <button type="submit" style={primaryActionStyle} disabled={loading}>
              {loading ? "Please wait..." : mode === "login" ? "Sign in" : "Create account"}
            </button>
          </form>

          <div style={{ display: "grid", gap: 14, marginTop: 18 }}>
            <button type="button" onClick={handleGoogleLogin} style={secondaryActionStyle}>
              Continue with Google
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}

const fieldStyle = {
  width: "100%",
  borderRadius: 18,
  border: "1px solid var(--line)",
  background: "rgba(255,255,255,0.04)",
  color: "var(--text)",
  padding: "14px 16px",
};

const primaryActionStyle = {
  border: 0,
  borderRadius: 18,
  background: "linear-gradient(135deg, #de9f49, #f4c06a)",
  color: "#10231f",
  fontWeight: 800,
  padding: "14px 18px",
  marginTop: 4,
};

const secondaryActionStyle = {
  borderRadius: 18,
  border: "1px solid var(--line)",
  background: "rgba(255,255,255,0.04)",
  color: "var(--text)",
  fontWeight: 700,
  padding: "14px 18px",
};

function modeButtonStyle(active) {
  return {
    borderRadius: 999,
    border: "1px solid var(--line)",
    background: active ? "rgba(222, 159, 73, 0.16)" : "rgba(255,255,255,0.03)",
    color: active ? "var(--accent-strong)" : "var(--muted)",
    padding: "10px 16px",
  };
}

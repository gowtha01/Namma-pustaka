import { NavLink } from "react-router-dom";
import { FiBookOpen, FiHome, FiLogOut, FiPlusCircle, FiShield } from "react-icons/fi";
import { useAuth } from "../contexts/AuthContext";
import { logoutUser } from "../firebase/auth";

const linkStyle = ({ isActive }) => ({
  padding: "12px 16px",
  borderRadius: 999,
  background: isActive ? "rgba(222, 159, 73, 0.18)" : "transparent",
  color: isActive ? "var(--accent-strong)" : "var(--muted)",
  border: `1px solid ${isActive ? "rgba(222, 159, 73, 0.24)" : "transparent"}`,
  display: "inline-flex",
  gap: 8,
  alignItems: "center",
});

export function AppShell({ title, subtitle, children, actions }) {
  const { profile } = useAuth();
  const isTeacher = ["teacher", "admin"].includes(profile?.role);

  return (
    <div className="page-shell">
      <header
        className="glass-card"
        style={{
          borderRadius: 28,
          padding: 24,
          marginBottom: 28,
          position: "sticky",
          top: 16,
          zIndex: 10,
        }}
      >
        <div
          style={{
            display: "flex",
            gap: 20,
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
          }}
        >
          <div>
            <div
              style={{
                fontSize: 12,
                textTransform: "uppercase",
                letterSpacing: "0.22em",
                color: "var(--accent-strong)",
                marginBottom: 8,
              }}
            >
              Smart Library Management
            </div>
            <h1
              style={{
                margin: 0,
                fontFamily: '"Fraunces", serif',
                fontSize: "clamp(2rem, 3vw, 3.2rem)",
              }}
            >
              {title}
            </h1>
            <p style={{ margin: "10px 0 0", color: "var(--muted)", maxWidth: 680 }}>
              {subtitle}
            </p>
          </div>

          <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
            {actions}
            <button
              onClick={logoutUser}
              style={{
                borderRadius: 999,
                border: "1px solid var(--line)",
                background: "rgba(255,255,255,0.03)",
                color: "var(--text)",
                padding: "12px 16px",
                display: "inline-flex",
                gap: 8,
                alignItems: "center",
              }}
            >
              <FiLogOut />
              Sign out
            </button>
          </div>
        </div>

        <nav style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 22 }}>
          <NavLink to="/" style={linkStyle}>
            <FiHome />
            Catalog
          </NavLink>
          <NavLink to="/leaderboard" style={linkStyle}>
            <FiBookOpen />
            Leaderboard
          </NavLink>
          {isTeacher ? (
            <>
              <NavLink to="/teacher" style={linkStyle}>
                <FiShield />
                Teacher Dashboard
              </NavLink>
              <NavLink to="/teacher/add-book" style={linkStyle}>
                <FiPlusCircle />
                Add Book
              </NavLink>
            </>
          ) : null}
        </nav>
      </header>

      {children}
    </div>
  );
}

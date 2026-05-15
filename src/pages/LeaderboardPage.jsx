import { AppShell } from "../components/AppShell";
import { LoadingScreen } from "../components/LoadingScreen";
import { useLeaderboard } from "../hooks/useLeaderboard";

export function LeaderboardPage() {
  const { leaders, loading } = useLeaderboard(10);

  if (loading) {
    return <LoadingScreen message="Calculating the reading leaderboard..." />;
  }

  return (
    <AppShell
      title="Reading leaderboard"
      subtitle="Celebrate the students who read the most pages this month and build a stronger reading culture."
    >
      <section
        style={{
          display: "grid",
          gap: 18,
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
        }}
      >
        {leaders.map((leader) => (
          <article
            key={leader.id}
            className="glass-card"
            style={{
              borderRadius: 28,
              padding: 24,
              position: "relative",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                position: "absolute",
                top: -30,
                right: -20,
                fontSize: 100,
                color: "rgba(255,255,255,0.05)",
                fontWeight: 800,
              }}
            >
              {leader.rank}
            </div>
            <p
              style={{
                marginTop: 0,
                color: "var(--accent-strong)",
                textTransform: "uppercase",
                letterSpacing: "0.16em",
                fontSize: 12,
              }}
            >
              Rank #{leader.rank}
            </p>
            <h3 style={{ margin: "8px 0 6px" }}>{leader.name || "Student"}</h3>
            <p style={{ margin: 0, color: "var(--muted)" }}>{leader.className || "Class not set"}</p>
            <p style={{ margin: "18px 0 0", fontSize: 28, fontWeight: 800 }}>
              {leader.pagesReadThisMonth || 0}
              <span style={{ fontSize: 14, color: "var(--muted)", marginLeft: 8 }}>pages this month</span>
            </p>
          </article>
        ))}
      </section>
    </AppShell>
  );
}

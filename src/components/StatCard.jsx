export function StatCard({ label, value, accent = "var(--accent)" }) {
  return (
    <div
      className="glass-card"
      style={{
        borderRadius: 24,
        padding: 20,
        minWidth: 0,
      }}
    >
      <div
        style={{
          width: 42,
          height: 6,
          borderRadius: 999,
          background: accent,
          marginBottom: 16,
        }}
      />
      <p style={{ margin: 0, color: "var(--muted)", fontSize: 14 }}>{label}</p>
      <h3 style={{ margin: "8px 0 0", fontSize: 28 }}>{value}</h3>
    </div>
  );
}

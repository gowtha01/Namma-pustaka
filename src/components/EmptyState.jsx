export function EmptyState({ title, description, action }) {
  return (
    <div
      className="glass-card"
      style={{
        borderRadius: 24,
        padding: 28,
        textAlign: "center",
      }}
    >
      <h3 style={{ marginTop: 0 }}>{title}</h3>
      <p style={{ color: "var(--muted)", margin: "0 0 18px" }}>{description}</p>
      {action}
    </div>
  );
}

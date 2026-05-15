export function LoadingScreen({ message = "Loading..." }) {
  return (
    <div
      className="page-shell"
      style={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
      }}
    >
      <div
        className="glass-card"
        style={{
          borderRadius: 28,
          padding: 28,
          minWidth: 280,
          textAlign: "center",
        }}
      >
        <div
          style={{
            width: 56,
            height: 56,
            borderRadius: "50%",
            border: "4px solid rgba(255,255,255,0.12)",
            borderTopColor: "var(--accent)",
            margin: "0 auto 18px",
            animation: "spin 1s linear infinite",
          }}
        />
        <p style={{ margin: 0, color: "var(--muted)" }}>{message}</p>
      </div>
    </div>
  );
}

import { Link } from "react-router-dom";

export function BookCard({ book }) {
  return (
    <Link
      to={`/book/${book.id}`}
      className="glass-card"
      style={{
        borderRadius: 26,
        overflow: "hidden",
        display: "block",
        transition: "transform 160ms ease, border-color 160ms ease",
      }}
    >
      <div
        style={{
          aspectRatio: "4 / 5",
          background:
            book.coverUrl
              ? `linear-gradient(180deg, rgba(16,35,31,0.08), rgba(16,35,31,0.48)), url(${book.coverUrl}) center / cover`
              : "linear-gradient(135deg, rgba(222,159,73,0.35), rgba(61,114,83,0.4))",
          padding: 18,
          display: "flex",
          alignItems: "flex-end",
        }}
      >
        <span
          style={{
            borderRadius: 999,
            background: book.available ? "rgba(114, 197, 140, 0.18)" : "rgba(239, 125, 122, 0.18)",
            color: book.available ? "var(--success)" : "var(--danger)",
            padding: "8px 12px",
            fontSize: 12,
            border: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          {book.available ? "Available" : "Issued"}
        </span>
      </div>

      <div style={{ padding: 18 }}>
        <p
          style={{
            margin: 0,
            color: "var(--accent-strong)",
            fontSize: 12,
            textTransform: "uppercase",
            letterSpacing: "0.16em",
          }}
        >
          {book.category}
        </p>
        <h3 style={{ margin: "8px 0 6px", fontSize: 20 }}>{book.title}</h3>
        <p style={{ margin: 0, color: "var(--muted)" }}>{book.author}</p>
      </div>
    </Link>
  );
}

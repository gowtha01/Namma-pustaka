export function RatingStars({ rating, onChange, size = 26 }) {
  return (
    <div style={{ display: "flex", gap: 4 }}>
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onChange?.(star)}
          style={{
            border: 0,
            padding: 0,
            background: "transparent",
            color: star <= rating ? "#ffd56b" : "rgba(255,255,255,0.25)",
            fontSize: size,
            lineHeight: 1,
          }}
        >
          ★
        </button>
      ))}
    </div>
  );
}

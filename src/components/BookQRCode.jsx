import QRCode from "react-qr-code";

export function BookQRCode({ bookId, bookTitle }) {
  const qrValue = `namma-pustaka://book/${bookId}`;

  return (
    <div
      className="glass-card"
      style={{
        borderRadius: 24,
        padding: 24,
        textAlign: "center",
      }}
    >
      <p
        style={{
          marginTop: 0,
          fontSize: 12,
          textTransform: "uppercase",
          letterSpacing: "0.16em",
          color: "var(--accent-strong)",
        }}
      >
        Print and stick on the physical book
      </p>
      <div
        style={{
          borderRadius: 20,
          padding: 20,
          background: "#f9f2df",
          display: "inline-flex",
        }}
      >
        <QRCode value={qrValue} size={180} />
      </div>
      <h3 style={{ marginBottom: 6 }}>{bookTitle}</h3>
      <p style={{ margin: 0, color: "var(--muted)", fontSize: 14 }}>{qrValue}</p>
    </div>
  );
}

import { useCallback, useState } from "react";
import toast from "react-hot-toast";
import { AppShell } from "../components/AppShell";
import { QRScanner } from "../components/QRScanner";
import { useAuth } from "../contexts/AuthContext";
import { borrowBook } from "../firebase/firestore";

export function QRScanPage() {
  const { user, profile } = useAuth();
  const [lastScan, setLastScan] = useState("");
  const [busy, setBusy] = useState(false);

  const handleScan = useCallback(
    async (decodedText) => {
      if (busy) {
        return;
      }

      const bookId = decodedText.split("/").pop();
      if (!bookId) {
        toast.error("Invalid QR code.");
        return;
      }

      try {
        setBusy(true);
        await borrowBook(bookId, user?.uid);
        setLastScan(bookId);
        toast.success(`Book issued to ${profile?.name || "student"}.`);
      } catch (error) {
        toast.error(error.message);
      } finally {
        setBusy(false);
      }
    },
    [busy, profile?.name, user?.uid],
  );

  return (
    <AppShell
      title="Borrow by QR scan"
      subtitle="Point the camera at a book QR code to issue it to the signed-in student profile."
    >
      <section
        style={{
          display: "grid",
          gap: 24,
          gridTemplateColumns: "minmax(0, 1.2fr) minmax(280px, 0.8fr)",
        }}
      >
        <div className="glass-card" style={{ borderRadius: 28, padding: 24 }}>
          <QRScanner onScan={handleScan} />
        </div>
        <aside className="glass-card" style={{ borderRadius: 28, padding: 24 }}>
          <h3 style={{ marginTop: 0 }}>How it works</h3>
          <ol style={{ color: "var(--muted)", paddingLeft: 20, lineHeight: 1.8 }}>
            <li>Open the scanner on a student account.</li>
            <li>Scan the QR sticker on the physical book.</li>
            <li>The app creates a 14-day loan instantly in Firestore.</li>
            <li>Teachers will see overdue books highlighted in red.</li>
          </ol>
          <p style={{ color: "var(--muted)", marginBottom: 0 }}>
            Last successful scan: {lastScan || "None yet"}
          </p>
        </aside>
      </section>
    </AppShell>
  );
}

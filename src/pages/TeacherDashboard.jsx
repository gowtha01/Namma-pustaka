import toast from "react-hot-toast";
import { AppShell } from "../components/AppShell";
import { EmptyState } from "../components/EmptyState";
import { LoadingScreen } from "../components/LoadingScreen";
import { StatCard } from "../components/StatCard";
import { returnBook } from "../firebase/firestore";
import { useActiveTransactions } from "../hooks/useTransactions";
import { formatDisplayDate } from "../lib/utils";

export function TeacherDashboard() {
  const { transactions, loading } = useActiveTransactions();

  if (loading) {
    return <LoadingScreen message="Reviewing issued books..." />;
  }

  const overdueCount = transactions.filter((transaction) => transaction.isOverdue).length;

  async function handleReturn(transactionId) {
    try {
      await returnBook(transactionId);
      toast.success("Book returned to shelf.");
    } catch (error) {
      toast.error(error.message);
    }
  }

  return (
    <AppShell
      title="Teacher dashboard"
      subtitle="Monitor all active borrowings, spot overdue books instantly, and return books back to the catalog."
    >
      <section
        style={{
          display: "grid",
          gap: 18,
          gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
          marginBottom: 24,
        }}
      >
        <StatCard label="Active loans" value={transactions.length} />
        <StatCard label="Overdue now" value={overdueCount} accent="var(--danger)" />
        <StatCard
          label="On-time books"
          value={transactions.length - overdueCount}
          accent="var(--success)"
        />
      </section>

      {transactions.length ? (
        <section
          className="glass-card"
          style={{
            borderRadius: 28,
            padding: 16,
            overflow: "hidden",
          }}
        >
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ color: "var(--muted)", textAlign: "left" }}>
                  <th style={cellStyle}>Book ID</th>
                  <th style={cellStyle}>Student</th>
                  <th style={cellStyle}>Issue Date</th>
                  <th style={cellStyle}>Due Date</th>
                  <th style={cellStyle}>Status</th>
                  <th style={cellStyle}>Action</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((transaction) => (
                  <tr key={transaction.id} style={{ borderTop: "1px solid var(--line)" }}>
                    <td style={cellStyle}>{transaction.bookId}</td>
                    <td style={cellStyle}>{transaction.studentId}</td>
                    <td style={cellStyle}>{formatDisplayDate(transaction.issueDate)}</td>
                    <td style={cellStyle}>{formatDisplayDate(transaction.dueDate)}</td>
                    <td style={cellStyle}>
                      <span
                        style={{
                          borderRadius: 999,
                          padding: "8px 12px",
                          background: transaction.isOverdue
                            ? "rgba(239,125,122,0.18)"
                            : "rgba(114,197,140,0.18)",
                          color: transaction.isOverdue ? "var(--danger)" : "var(--success)",
                          border: "1px solid rgba(255,255,255,0.08)",
                        }}
                      >
                        {transaction.isOverdue ? "Overdue" : "Issued"}
                      </span>
                    </td>
                    <td style={cellStyle}>
                      <button onClick={() => handleReturn(transaction.id)} style={returnButtonStyle}>
                        Mark returned
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      ) : (
        <EmptyState
          title="No active borrowings"
          description="Once students scan QR codes, the live loan list will appear here."
        />
      )}
    </AppShell>
  );
}

const cellStyle = {
  padding: "16px 12px",
};

const returnButtonStyle = {
  borderRadius: 14,
  border: "1px solid var(--line)",
  background: "rgba(255,255,255,0.04)",
  color: "var(--text)",
  padding: "10px 12px",
};

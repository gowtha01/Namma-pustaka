import { Link } from "react-router-dom";
import { FiCamera, FiSearch } from "react-icons/fi";
import { useMemo, useState } from "react";
import { AppShell } from "../components/AppShell";
import { BookCard } from "../components/BookCard";
import { EmptyState } from "../components/EmptyState";
import { LoadingScreen } from "../components/LoadingScreen";
import { StatCard } from "../components/StatCard";
import { useAuth } from "../contexts/AuthContext";
import { useBooks } from "../hooks/useBooks";

export function Home() {
  const [searchTerm, setSearchTerm] = useState("");
  const { books, loading } = useBooks(searchTerm);
  const { profile } = useAuth();
  const isTeacher = ["teacher", "admin"].includes(profile?.role);

  const stats = useMemo(() => {
    const available = books.filter((book) => book.available).length;
    return [
      { label: "Books in catalog", value: books.length },
      { label: "Available now", value: available, accent: "var(--success)" },
      { label: "Student pages this month", value: profile?.pagesReadThisMonth || 0, accent: "var(--accent-strong)" },
    ];
  }, [books, profile]);

  if (loading) {
    return <LoadingScreen message="Gathering the library shelf..." />;
  }

  return (
    <AppShell
      title="Browse the library"
      subtitle="Search by title, author, or category and discover Kannada-ready book summaries."
      actions={
        <Link to="/scan" style={scanButtonStyle}>
          Borrow by QR scan
        </Link>
      }
    >
      <section
        style={{
          display: "grid",
          gap: 18,
          gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
          marginBottom: 24,
        }}
      >
        {stats.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </section>

      <section
        className="glass-card"
        style={{
          borderRadius: 26,
          padding: 20,
          marginBottom: 24,
          display: "flex",
          gap: 14,
          alignItems: "center",
          flexWrap: "wrap",
        }}
      >
        <div style={{ position: "relative", flex: "1 1 320px" }}>
          <FiSearch
            style={{ position: "absolute", top: "50%", left: 16, transform: "translateY(-50%)" }}
          />
          <input
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Search by title, author, or category"
            style={{
              width: "100%",
              padding: "14px 16px 14px 46px",
              borderRadius: 18,
              border: "1px solid var(--line)",
              background: "rgba(255,255,255,0.03)",
              color: "var(--text)",
            }}
          />
        </div>
        {isTeacher ? (
          <Link to="/teacher/add-book" style={addBookLinkStyle}>
            <FiCamera />
            Camera-assisted entry
          </Link>
        ) : null}
      </section>

      {books.length ? (
        <section
          style={{
            display: "grid",
            gap: 18,
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          }}
        >
          {books.map((book) => (
            <BookCard key={book.id} book={book} />
          ))}
        </section>
      ) : (
        <EmptyState
          title="No books match this search yet"
          description="Try a broader keyword, or add the first book from the teacher workflow."
        />
      )}
    </AppShell>
  );
}

const scanButtonStyle = {
  borderRadius: 18,
  padding: "14px 18px",
  background: "linear-gradient(135deg, #de9f49, #f4c06a)",
  color: "#10231f",
  fontWeight: 800,
};

const addBookLinkStyle = {
  borderRadius: 18,
  padding: "14px 16px",
  border: "1px solid var(--line)",
  background: "rgba(255,255,255,0.03)",
  color: "var(--text)",
  display: "inline-flex",
  gap: 8,
  alignItems: "center",
};

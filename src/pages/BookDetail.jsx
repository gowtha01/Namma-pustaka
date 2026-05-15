import { useParams } from "react-router-dom";
import { AppShell } from "../components/AppShell";
import { BookQRCode } from "../components/BookQRCode";
import { EmptyState } from "../components/EmptyState";
import { LoadingScreen } from "../components/LoadingScreen";
import { RatingStars } from "../components/RatingStars";
import { ReviewForm } from "../components/ReviewForm";
import { useAuth } from "../contexts/AuthContext";
import { useBook } from "../hooks/useBook";
import { useReviews } from "../hooks/useReviews";
import { averageRating } from "../lib/utils";

export function BookDetail() {
  const { id } = useParams();
  const { book, loading } = useBook(id);
  const { reviews, loading: reviewsLoading } = useReviews(id);
  const { profile } = useAuth();

  if (loading) {
    return <LoadingScreen message="Opening the book details..." />;
  }

  if (!book) {
    return (
      <AppShell
        title="Book not found"
        subtitle="The requested book could not be loaded from the catalog."
      >
        <EmptyState
          title="Missing catalog entry"
          description="Check whether the book still exists in Firestore, or return to the catalog."
        />
      </AppShell>
    );
  }

  const average = averageRating(reviews);
  const isStudent = profile?.role === "student";

  return (
    <AppShell
      title={book.title}
      subtitle={`${book.author} · ${book.category} · ${book.totalPages || 0} pages`}
    >
      <section
        style={{
          display: "grid",
          gap: 24,
          gridTemplateColumns: "minmax(0, 1.2fr) minmax(320px, 0.8fr)",
        }}
      >
        <div
          className="glass-card"
          style={{ borderRadius: 28, padding: 24, display: "grid", gap: 22 }}
        >
          <div
            style={{
              display: "grid",
              gap: 20,
              gridTemplateColumns: "minmax(180px, 240px) minmax(0, 1fr)",
            }}
          >
            <div
              style={{
                borderRadius: 24,
                minHeight: 300,
                background:
                  book.coverUrl
                    ? `linear-gradient(180deg, rgba(16,35,31,0.08), rgba(16,35,31,0.48)), url(${book.coverUrl}) center / cover`
                    : "linear-gradient(135deg, rgba(222,159,73,0.35), rgba(61,114,83,0.4))",
              }}
            />

            <div>
              <div
                style={{
                  display: "inline-flex",
                  borderRadius: 999,
                  padding: "8px 12px",
                  background: book.available ? "rgba(114,197,140,0.18)" : "rgba(239,125,122,0.18)",
                  color: book.available ? "var(--success)" : "var(--danger)",
                  border: "1px solid rgba(255,255,255,0.08)",
                }}
              >
                {book.available ? "Available for borrowing" : "Currently issued"}
              </div>
              <h2 style={{ marginBottom: 8 }}>Kannada Summary</h2>
              <p className="kannada-text" style={{ color: "var(--muted)", marginTop: 0 }}>
                {book.summaryKannada || "ಸಾರಾಂಶ ಇನ್ನೂ ಸೇರಿಸಲಾಗಿಲ್ಲ."}
              </p>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 18 }}>
                <RatingStars rating={Math.round(average)} size={24} />
                <span style={{ color: "var(--muted)" }}>
                  {reviews.length ? `${average.toFixed(1)} from ${reviews.length} reviews` : "No reviews yet"}
                </span>
              </div>
            </div>
          </div>

          <section>
            <h3 style={{ marginTop: 0 }}>Reader notes</h3>
            {reviewsLoading ? (
              <p style={{ color: "var(--muted)" }}>Loading reviews...</p>
            ) : reviews.length ? (
              <div style={{ display: "grid", gap: 14 }}>
                {reviews.map((review) => (
                  <div
                    key={review.id}
                    style={{
                      borderRadius: 20,
                      padding: 18,
                      background: "rgba(255,255,255,0.03)",
                      border: "1px solid var(--line)",
                    }}
                  >
                    <RatingStars rating={Number(review.rating)} size={20} />
                    <p style={{ margin: "10px 0 0", color: "var(--muted)" }}>
                      {review.reviewText || "Loved reading this book."}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ color: "var(--muted)" }}>Students can add the first review here.</p>
            )}
          </section>
        </div>

        <div style={{ display: "grid", gap: 24 }}>
          <BookQRCode bookId={book.id} bookTitle={book.title} />
          {isStudent ? <ReviewForm bookId={book.id} /> : null}
        </div>
      </section>
    </AppShell>
  );
}

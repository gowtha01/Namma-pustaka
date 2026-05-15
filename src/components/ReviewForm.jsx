import { useState } from "react";
import toast from "react-hot-toast";
import { addReview } from "../firebase/firestore";
import { RatingStars } from "./RatingStars";

export function ReviewForm({ bookId }) {
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [saving, setSaving] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    if (!rating) {
      toast.error("Please add a star rating.");
      return;
    }

    try {
      setSaving(true);
      await addReview({ bookId, rating, reviewText });
      setRating(0);
      setReviewText("");
      toast.success("Review saved.");
    } catch (error) {
      toast.error(error.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="glass-card"
      style={{
        borderRadius: 24,
        padding: 24,
      }}
    >
      <h3 style={{ marginTop: 0 }}>Review Corner</h3>
      <p style={{ color: "var(--muted)", marginTop: 0 }}>
        Leave a star rating and one short line after reading.
      </p>
      <RatingStars rating={rating} onChange={setRating} size={30} />
      <textarea
        value={reviewText}
        onChange={(event) => setReviewText(event.target.value)}
        rows={4}
        maxLength={200}
        placeholder="What did you like about this book?"
        style={textareaStyle}
      />
      <button type="submit" style={primaryButtonStyle} disabled={saving}>
        {saving ? "Saving..." : "Submit review"}
      </button>
    </form>
  );
}

const primaryButtonStyle = {
  border: 0,
  borderRadius: 18,
  background: "linear-gradient(135deg, #de9f49, #f4c06a)",
  color: "#10231f",
  fontWeight: 800,
  padding: "14px 18px",
};

const textareaStyle = {
  width: "100%",
  marginTop: 18,
  marginBottom: 16,
  borderRadius: 18,
  border: "1px solid var(--line)",
  background: "rgba(255,255,255,0.03)",
  color: "var(--text)",
  padding: 14,
  resize: "vertical",
};

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { AppShell } from "../components/AppShell";
import { addBook, extractBookDetailsFromImage } from "../firebase/firestore";

const initialForm = {
  title: "",
  author: "",
  category: "Story",
  totalPages: "",
  coverFile: null,
};

export function AddBook() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState(initialForm);
  const [detecting, setDetecting] = useState(false);
  const [saving, setSaving] = useState(false);

  function updateField(event) {
    const { name, value, files } = event.target;
    setFormData((current) => ({
      ...current,
      [name]: files ? files[0] : value,
    }));
  }

  async function handleExtract() {
    if (!formData.coverFile) {
      toast.error("Upload a cover image first.");
      return;
    }

    try {
      setDetecting(true);
      const extracted = await extractBookDetailsFromImage(formData.coverFile);
      setFormData((current) => ({
        ...current,
        title: extracted.title || current.title,
        author: extracted.author || current.author,
        category: extracted.category || current.category,
        totalPages: extracted.totalPages || current.totalPages,
      }));
      toast.success("AI suggestions added to the form.");
    } catch (error) {
      toast.error(error.message);
    } finally {
      setDetecting(false);
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();
    try {
      setSaving(true);
      const bookId = await addBook(formData);
      toast.success("Book added to the catalog.");
      navigate(`/book/${bookId}`);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <AppShell
      title="Add a new book"
      subtitle="Teachers can upload a cover image, use AI to suggest details, and store a Kannada summary automatically."
    >
      <form
        onSubmit={handleSubmit}
        className="glass-card"
        style={{
          borderRadius: 28,
          padding: 28,
          display: "grid",
          gap: 18,
          maxWidth: 780,
        }}
      >
        <div
          style={{
            display: "grid",
            gap: 18,
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
          }}
        >
          <label style={labelStyle}>
            <span>Title</span>
            <input
              name="title"
              value={formData.title}
              onChange={updateField}
              required
              style={fieldStyle}
            />
          </label>
          <label style={labelStyle}>
            <span>Author</span>
            <input
              name="author"
              value={formData.author}
              onChange={updateField}
              required
              style={fieldStyle}
            />
          </label>
          <label style={labelStyle}>
            <span>Category</span>
            <select name="category" value={formData.category} onChange={updateField} style={fieldStyle}>
              <option>Story</option>
              <option>Science</option>
              <option>History</option>
              <option>Language</option>
              <option>General</option>
            </select>
          </label>
          <label style={labelStyle}>
            <span>Total pages</span>
            <input
              name="totalPages"
              type="number"
              min="1"
              value={formData.totalPages}
              onChange={updateField}
              required
              style={fieldStyle}
            />
          </label>
        </div>

        <label style={labelStyle}>
          <span>Book cover image</span>
          <input name="coverFile" type="file" accept="image/*" onChange={updateField} style={fieldStyle} />
        </label>

        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          <button type="button" onClick={handleExtract} style={secondaryButtonStyle} disabled={detecting}>
            {detecting ? "Reading cover..." : "Use AI to read cover"}
          </button>
          <button type="submit" style={primaryButtonStyle} disabled={saving}>
            {saving ? "Saving book..." : "Save book with Kannada summary"}
          </button>
        </div>
      </form>
    </AppShell>
  );
}

const labelStyle = {
  display: "grid",
  gap: 8,
  color: "var(--muted)",
};

const fieldStyle = {
  borderRadius: 18,
  border: "1px solid var(--line)",
  background: "rgba(255,255,255,0.04)",
  color: "var(--text)",
  padding: "14px 16px",
};

const primaryButtonStyle = {
  border: 0,
  borderRadius: 18,
  background: "linear-gradient(135deg, #de9f49, #f4c06a)",
  color: "#10231f",
  fontWeight: 800,
  padding: "14px 18px",
};

const secondaryButtonStyle = {
  borderRadius: 18,
  border: "1px solid var(--line)",
  background: "rgba(255,255,255,0.04)",
  color: "var(--text)",
  padding: "14px 18px",
};

import { useEffect, useMemo, useState } from "react";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { db, hasFirebaseConfig } from "../firebase/config";

export function useBooks(searchTerm = "") {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!hasFirebaseConfig || !db) {
      setLoading(false);
      return undefined;
    }

    const booksQuery = query(collection(db, "books"), orderBy("title", "asc"));
    const unsubscribe = onSnapshot(
      booksQuery,
      (snapshot) => {
        setBooks(snapshot.docs.map((entry) => ({ id: entry.id, ...entry.data() })));
        setLoading(false);
      },
      (snapshotError) => {
        setError(snapshotError.message);
        setLoading(false);
      },
    );

    return () => unsubscribe();
  }, []);

  const filteredBooks = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) {
      return books;
    }

    return books.filter((book) =>
      [book.title, book.author, book.category]
        .filter(Boolean)
        .some((value) => value.toLowerCase().includes(term)),
    );
  }, [books, searchTerm]);

  return {
    books: filteredBooks,
    loading,
    error,
  };
}

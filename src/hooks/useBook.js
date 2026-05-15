import { useEffect, useState } from "react";
import { watchBook } from "../firebase/firestore";
import { hasFirebaseConfig } from "../firebase/config";

export function useBook(bookId) {
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!bookId || !hasFirebaseConfig) {
      setLoading(false);
      return undefined;
    }

    const unsubscribe = watchBook(bookId, (nextBook) => {
      setBook(nextBook);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [bookId]);

  return { book, loading };
}

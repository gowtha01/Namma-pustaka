import { useEffect, useState } from "react";
import { watchReviews } from "../firebase/firestore";
import { hasFirebaseConfig } from "../firebase/config";

export function useReviews(bookId) {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!bookId || !hasFirebaseConfig) {
      setLoading(false);
      return undefined;
    }

    const unsubscribe = watchReviews(bookId, (snapshot) => {
      setReviews(snapshot.docs.map((entry) => ({ id: entry.id, ...entry.data() })));
      setLoading(false);
    });

    return () => unsubscribe();
  }, [bookId]);

  return { reviews, loading };
}

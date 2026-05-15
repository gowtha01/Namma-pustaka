import { useEffect, useState } from "react";
import {
  collection,
  limit,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { db, hasFirebaseConfig } from "../firebase/config";

export function useLeaderboard(topN = 10) {
  const [leaders, setLeaders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!hasFirebaseConfig || !db) {
      setLoading(false);
      return undefined;
    }

    const leaderboardQuery = query(
      collection(db, "users"),
      where("role", "==", "student"),
      orderBy("pagesReadThisMonth", "desc"),
      limit(topN),
    );

    const unsubscribe = onSnapshot(leaderboardQuery, (snapshot) => {
      setLeaders(
        snapshot.docs.map((entry, index) => ({
          rank: index + 1,
          id: entry.id,
          ...entry.data(),
        })),
      );
      setLoading(false);
    });

    return () => unsubscribe();
  }, [topN]);

  return { leaders, loading };
}

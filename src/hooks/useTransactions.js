import { useEffect, useState } from "react";
import {
  collection,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { db, hasFirebaseConfig } from "../firebase/config";

function enrichTransaction(docSnapshot) {
  const data = docSnapshot.data();
  const dueDate = data.dueDate?.toDate?.() || null;
  const returnDate = data.returnDate?.toDate?.() || null;
  return {
    id: docSnapshot.id,
    ...data,
    dueDate,
    returnDate,
    isOverdue: Boolean(dueDate && dueDate < new Date() && !returnDate),
  };
}

export function useActiveTransactions() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!hasFirebaseConfig || !db) {
      setLoading(false);
      return undefined;
    }

    const txQuery = query(
      collection(db, "transactions"),
      where("status", "==", "issued"),
      orderBy("dueDate", "asc"),
    );

    const unsubscribe = onSnapshot(txQuery, (snapshot) => {
      setTransactions(snapshot.docs.map(enrichTransaction));
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return { transactions, loading };
}

export function useMyTransactions(studentId) {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!studentId || !hasFirebaseConfig || !db) {
      setLoading(false);
      return undefined;
    }

    const txQuery = query(
      collection(db, "transactions"),
      where("studentId", "==", studentId),
      orderBy("issueDate", "desc"),
    );

    const unsubscribe = onSnapshot(txQuery, (snapshot) => {
      setTransactions(snapshot.docs.map(enrichTransaction));
      setLoading(false);
    });

    return () => unsubscribe();
  }, [studentId]);

  return { transactions, loading };
}

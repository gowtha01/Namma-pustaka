import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { doc, onSnapshot } from "firebase/firestore";
import { auth, db, hasFirebaseConfig } from "../firebase/config";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [authState, setAuthState] = useState({
    user: null,
    profile: null,
    loading: true,
  });

  useEffect(() => {
    if (!hasFirebaseConfig || !auth || !db) {
      setAuthState({
        user: null,
        profile: null,
        loading: false,
      });
      return undefined;
    }

    let profileUnsubscribe = null;

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (profileUnsubscribe) {
        profileUnsubscribe();
        profileUnsubscribe = null;
      }

      if (!user) {
        setAuthState({
          user: null,
          profile: null,
          loading: false,
        });
        return;
      }

      profileUnsubscribe = onSnapshot(doc(db, "users", user.uid), (snapshot) => {
        setAuthState({
          user,
          profile: snapshot.exists() ? { id: snapshot.id, ...snapshot.data() } : null,
          loading: false,
        });
      });
    });

    return () => {
      unsubscribe();
      if (profileUnsubscribe) {
        profileUnsubscribe();
      }
    };
  }, []);

  const value = useMemo(() => authState, [authState]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const value = useContext(AuthContext);
  if (!value) {
    throw new Error("useAuth must be used inside AuthProvider.");
  }
  return value;
}

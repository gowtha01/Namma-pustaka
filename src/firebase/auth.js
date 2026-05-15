import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import { auth, db, googleProvider, hasFirebaseConfig } from "./config";

async function upsertUserProfile(user, overrides = {}) {
  if (!db || !user) {
    return null;
  }

  const userRef = doc(db, "users", user.uid);
  const existing = await getDoc(userRef);

  const baseProfile = {
    name: user.displayName || overrides.name || user.email?.split("@")[0] || "Reader",
    email: user.email || overrides.email || "",
    role: overrides.role || existing.data()?.role || "student",
    className: overrides.className || existing.data()?.className || "",
    pagesReadThisMonth: existing.data()?.pagesReadThisMonth || 0,
    totalBooksRead: existing.data()?.totalBooksRead || 0,
    createdAt: existing.exists() ? existing.data().createdAt : serverTimestamp(),
    updatedAt: serverTimestamp(),
  };

  await setDoc(userRef, baseProfile, { merge: true });
  return baseProfile;
}

export async function registerUser({ email, password, name, role, className }) {
  if (!hasFirebaseConfig || !auth) {
    throw new Error("Firebase is not configured yet.");
  }

  const credential = await createUserWithEmailAndPassword(auth, email, password);
  await upsertUserProfile(credential.user, { name, email, role, className });
  return credential.user;
}

export async function loginUser({ email, password }) {
  if (!auth) {
    throw new Error("Firebase is not configured yet.");
  }

  const credential = await signInWithEmailAndPassword(auth, email, password);
  await upsertUserProfile(credential.user);
  return credential.user;
}

export async function loginWithGoogle() {
  if (!auth) {
    throw new Error("Firebase is not configured yet.");
  }

  const result = await signInWithPopup(auth, googleProvider);
  await upsertUserProfile(result.user);
  return result.user;
}

export async function logoutUser() {
  if (!auth) {
    return;
  }

  await signOut(auth);
}

import {
  Timestamp,
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  increment,
  onSnapshot,
  orderBy,
  query,
  runTransaction,
  serverTimestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { auth, db, hasFirebaseConfig, storage } from "./config";

const GEMINI_API_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent";

function assertFirebase() {
  if (!hasFirebaseConfig || !db) {
    throw new Error("Firebase is not configured yet. Add the VITE_ keys first.");
  }
}

async function callGemini(parts) {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error("Missing VITE_GEMINI_API_KEY.");
  }

  const response = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      contents: [
        {
          parts,
        },
      ],
    }),
  });

  if (!response.ok) {
    throw new Error("Gemini request failed.");
  }

  const data = await response.json();
  return data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || "";
}

function fileToInlineData(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const base64 = String(reader.result).split(",")[1];
      resolve({
        inlineData: {
          mimeType: file.type || "image/jpeg",
          data: base64,
        },
      });
    };
    reader.onerror = () => reject(new Error("Failed to read image file."));
    reader.readAsDataURL(file);
  });
}

export async function extractBookDetailsFromImage(imageFile) {
  const imagePart = await fileToInlineData(imageFile);
  const text = await callGemini([
    {
      text: [
        "You are extracting book metadata from a cover image for a rural school library app.",
        "Return JSON only with keys: title, author, category, totalPages.",
        "If a field is unclear, return an empty string for text or 0 for totalPages.",
        "Category must be one of Story, Science, History, Language, General.",
      ].join(" "),
    },
    imagePart,
  ]);

  try {
    return JSON.parse(text);
  } catch {
    return {
      title: "",
      author: "",
      category: "General",
      totalPages: 0,
    };
  }
}

export async function generateKannadaSummary(title, author) {
  const summary = await callGemini([
    {
      text: `Generate a 3 to 5 sentence summary in Kannada for the book "${title}" by "${author}". Keep the wording simple for school students and avoid spoilers.`,
    },
  ]);

  return summary || "ಸಾರಾಂಶ ಈಗ ಲಭ್ಯವಿಲ್ಲ.";
}

async function uploadCover(coverFile) {
  if (!coverFile || !storage) {
    return "";
  }

  const storageRef = ref(storage, `covers/${Date.now()}_${coverFile.name}`);
  await uploadBytes(storageRef, coverFile);
  return getDownloadURL(storageRef);
}

export async function addBook({
  title,
  author,
  category,
  totalPages,
  coverFile,
}) {
  assertFirebase();

  const [coverUrl, summaryKannada] = await Promise.all([
    uploadCover(coverFile),
    generateKannadaSummary(title, author).catch(() => "ಸಾರಾಂಶ ಈಗ ಲಭ್ಯವಿಲ್ಲ."),
  ]);

  const payload = {
    title: title.trim(),
    author: author.trim(),
    category,
    totalPages: Number(totalPages) || 0,
    coverUrl,
    summaryKannada,
    available: true,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };

  const docRef = await addDoc(collection(db, "books"), payload);
  await updateDoc(doc(db, "books", docRef.id), {
    qrCode: `namma-pustaka://book/${docRef.id}`,
  });
  return docRef.id;
}

export async function borrowBook(bookId, studentId) {
  assertFirebase();

  if (!studentId) {
    throw new Error("A student must be logged in to borrow a book.");
  }

  const bookRef = doc(db, "books", bookId);

  await runTransaction(db, async (transaction) => {
    const bookSnap = await transaction.get(bookRef);

    if (!bookSnap.exists()) {
      throw new Error("Book not found.");
    }

    if (!bookSnap.data().available) {
      throw new Error("This book is already issued.");
    }

    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 14);

    const transactionRef = doc(collection(db, "transactions"));
    transaction.set(transactionRef, {
      bookId,
      studentId,
      issueDate: serverTimestamp(),
      dueDate: Timestamp.fromDate(dueDate),
      returnDate: null,
      status: "issued",
      createdAt: serverTimestamp(),
    });

    transaction.update(bookRef, {
      available: false,
      currentBorrowerId: studentId,
      updatedAt: serverTimestamp(),
    });
  });
}

export async function returnBook(transactionId) {
  assertFirebase();

  const transactionRef = doc(db, "transactions", transactionId);

  await runTransaction(db, async (transaction) => {
    const txSnap = await transaction.get(transactionRef);

    if (!txSnap.exists()) {
      throw new Error("Transaction not found.");
    }

    const txData = txSnap.data();
    if (txData.returnDate) {
      return;
    }

    const bookRef = doc(db, "books", txData.bookId);
    const userRef = doc(db, "users", txData.studentId);
    const bookSnap = await transaction.get(bookRef);

    transaction.update(transactionRef, {
      returnDate: serverTimestamp(),
      status: "returned",
      updatedAt: serverTimestamp(),
    });

    transaction.update(bookRef, {
      available: true,
      currentBorrowerId: null,
      updatedAt: serverTimestamp(),
    });

    if (bookSnap.exists()) {
      transaction.update(userRef, {
        pagesReadThisMonth: increment(bookSnap.data().totalPages || 0),
        totalBooksRead: increment(1),
        updatedAt: serverTimestamp(),
      });
    }
  });
}

export async function addReview({ bookId, rating, reviewText }) {
  assertFirebase();

  const studentId = auth?.currentUser?.uid;
  if (!studentId) {
    throw new Error("Log in as a student to leave a review.");
  }

  await addDoc(collection(db, "reviews"), {
    bookId,
    studentId,
    rating,
    reviewText: reviewText.trim(),
    createdAt: serverTimestamp(),
  });
}

export function watchBook(bookId, callback) {
  assertFirebase();
  return onSnapshot(doc(db, "books", bookId), (snapshot) => {
    callback(snapshot.exists() ? { id: snapshot.id, ...snapshot.data() } : null);
  });
}

export function watchReviews(bookId, callback) {
  assertFirebase();
  const reviewsQuery = query(
    collection(db, "reviews"),
    where("bookId", "==", bookId),
    orderBy("createdAt", "desc"),
  );
  return onSnapshot(reviewsQuery, callback);
}

export async function deleteReview(reviewId) {
  assertFirebase();
  await deleteDoc(doc(db, "reviews", reviewId));
}

export async function getUserProfile(userId) {
  assertFirebase();
  const snapshot = await getDoc(doc(db, "users", userId));
  return snapshot.exists() ? { id: snapshot.id, ...snapshot.data() } : null;
}

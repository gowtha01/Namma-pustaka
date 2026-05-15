# Namma-Pustaka

Namma-Pustaka is a React + Firebase implementation of the rural school smart library app described in the project documents. It includes:

- Firebase Auth for student and teacher sign-in
- Firestore real-time catalog, transactions, reviews, and leaderboard data
- Firebase Storage for book cover uploads
- Gemini-powered Kannada summaries and image-assisted book metadata extraction
- QR-based borrowing flow with overdue highlighting for teachers
- Offline-friendly Firestore persistence

## Stack

- React 19 + Vite
- Firebase Auth, Firestore, Storage
- Gemini API
- `html5-qrcode` and `react-qr-code`

## Local setup

1. Install dependencies:

```bash
npm install
```

2. Copy `.env.example` to `.env` and fill in:

```bash
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
VITE_GEMINI_API_KEY=
```

3. Start the app:

```bash
npm run dev
```

## Firestore collections

- `books`
- `users`
- `transactions`
- `reviews`

## Notes

- Teacher and admin users can add books and access the dashboard.
- Students can borrow books through the QR scanner and leave reviews.
- Returning a book increments `pagesReadThisMonth` to feed the leaderboard.
- If Gemini is not configured, AI-assisted entry and Kannada summaries will fail until the API key is added.

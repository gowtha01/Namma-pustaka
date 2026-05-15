# Running Namma-Pustaka

## Prerequisites

- Node.js 18+
- npm

## Setup

1. Install dependencies:

```bash
npm install
```

2. Create a `.env` file from the template and fill in your Firebase and Gemini API keys:

```bash
cp .env.example .env
```

Required variables:
```
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
VITE_GEMINI_API_KEY=
```

## Run

Start the dev server:

```bash
npm run dev
```

Open the URL shown in the terminal (default: `http://localhost:5173`).

## Build for production

```bash
npm run build
npm run preview
```

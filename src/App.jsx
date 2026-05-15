import { Suspense, lazy } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { LoadingScreen } from "./components/LoadingScreen";
import { ProtectedRoute } from "./components/ProtectedRoute";

const Login = lazy(() => import("./pages/Login").then((module) => ({ default: module.Login })));
const Home = lazy(() => import("./pages/Home").then((module) => ({ default: module.Home })));
const BookDetail = lazy(() =>
  import("./pages/BookDetail").then((module) => ({ default: module.BookDetail })),
);
const QRScanPage = lazy(() =>
  import("./pages/QRScanPage").then((module) => ({ default: module.QRScanPage })),
);
const LeaderboardPage = lazy(() =>
  import("./pages/LeaderboardPage").then((module) => ({ default: module.LeaderboardPage })),
);
const TeacherDashboard = lazy(() =>
  import("./pages/TeacherDashboard").then((module) => ({ default: module.TeacherDashboard })),
);
const AddBook = lazy(() =>
  import("./pages/AddBook").then((module) => ({ default: module.AddBook })),
);

export default function App() {
  return (
    <Suspense fallback={<LoadingScreen message="Preparing the next page..." />}>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route
          path="/book/:id"
          element={
            <ProtectedRoute>
              <BookDetail />
            </ProtectedRoute>
          }
        />
        <Route
          path="/scan"
          element={
            <ProtectedRoute>
              <QRScanPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/leaderboard"
          element={
            <ProtectedRoute>
              <LeaderboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/teacher"
          element={
            <ProtectedRoute allowedRoles={["teacher", "admin"]}>
              <TeacherDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/teacher/add-book"
          element={
            <ProtectedRoute allowedRoles={["teacher", "admin"]}>
              <AddBook />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
}

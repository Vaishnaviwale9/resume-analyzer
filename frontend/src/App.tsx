import { Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { useTheme } from "@/context/ThemeContext";
import ErrorBoundary from "@/components/layout/ErrorBoundary";
import ProtectedRoute from "@/components/layout/ProtectedRoute";
import Landing from "@/pages/Landing";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import Dashboard from "@/pages/Dashboard";
import AnalysisDetail from "@/pages/AnalysisDetail";
import NotFound from "@/pages/NotFound";

export default function App() {
  const { theme } = useTheme();

  return (
    <ErrorBoundary>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: theme === "dark" ? "#161622" : "#fff",
            color: theme === "dark" ? "#fff" : "#0f172a",
            border: theme === "dark" ? "1px solid rgba(255,255,255,0.1)" : "1px solid #e2e8f0",
            borderRadius: "12px",
            fontSize: "14px",
          },
        }}
      />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/analysis/:id"
          element={
            <ProtectedRoute>
              <AnalysisDetail />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </ErrorBoundary>
  );
}

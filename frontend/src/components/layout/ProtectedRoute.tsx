import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import Loader from "@/components/ui/Loader";

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  const hasToken = !!localStorage.getItem("access_token");

  if (!hasToken) return <Navigate to="/login" replace />;
  if (isLoading && !user) return <Loader label="Checking your session..." />;

  return <>{children}</>;
}

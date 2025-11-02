import { useSelector } from "react-redux";

export function useAuth() {
  const { user, loading, error } = useSelector((state) => state.auth);
  return { user, loading, error, isAuthenticated: !!user };
}

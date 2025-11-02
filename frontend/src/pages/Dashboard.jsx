import { motion } from "framer-motion";
import { useAuth } from "../hooks/useAuth";
import { Card } from "../components/ui/card";

export default function Dashboard() {
  const { user } = useAuth();

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="flex justify-center mt-10"
    >
      <Card className="w-full max-w-md text-center space-y-4">
        <h2 className="text-2xl font-semibold text-blue-600">Dashboard</h2>
        {user ? (
          <p>Welcome back, <span className="font-bold">{user.name}</span> 👋</p>
        ) : (
          <p>You are not logged in.</p>
        )}
      </Card>
    </motion.div>
  );
}

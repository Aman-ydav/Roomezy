import { motion } from "framer-motion";
import React from "react";
import { useDispatch } from "react-redux";
import { logoutUser } from "../features/auth/authSlice";
import { Button } from "../components/ui/button";

export default function Dashboard() {
  const dispatch = useDispatch();

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="flex justify-center mt-10"
    >
      <div className="min-h-screen bg-linear-to-br from-purple-50 to-purple-100 dark:from-gray-900 dark:to-gray-800 flex flex-col items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl p-6 w-full max-w-md text-center">
        <h1 className="text-3xl font-bold text-purple-600 dark:text-fuchsia-400 mb-4">
          Welcome to Dashboard
        </h1>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          You are logged in! Access your features securely.
        </p>
        <Button
          onClick={() => dispatch(logoutUser())}
          className="bg-purple-600 hover:bg-fuchsia-500 text-white rounded-full px-6 py-2"
        >
          Logout
        </Button>
      </div>
    </div>
    </motion.div>
  );
}

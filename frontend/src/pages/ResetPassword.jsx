import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { resetPassword } from "@/features/auth/authSlice";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const ResetPassword = () => {
  const { token } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading } = useSelector((state) => state.auth);

  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!password.trim()) return toast.error("Password cannot be empty");
    dispatch(resetPassword({ token, password }))
      .unwrap()
      .then(() => {
        toast.success("Password reset successfully!");
        navigate("/login");
      })
      
      .catch((err) => toast.error(err || "Failed to reset password"));
  };

  return (
    <div className="flex items-center justify-center h-screen bg-linear-to-br from-zinc-50 to-purple-50 dark:from-zinc-900 dark:to-purple-950">
      <form
        onSubmit={handleSubmit}
        className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 p-8 rounded-2xl shadow-xl w-[90%] sm:w-[400px]"
      >
        <h1 className="text-2xl font-bold text-center bg-linear-to-r from-purple-600 to-fuchsia-500 bg-clip-text text-transparent">
          Reset Your Password
        </h1>
        <p className="text-center text-sm text-zinc-500 mt-2 mb-4">
          Enter your new password below.
        </p>
        <Input
          type="password"
          placeholder="New Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mb-4"
        />
        <Button
          type="submit"
          disabled={loading}
          className="w-full bg-linear-to-r from-purple-600 to-fuchsia-600 hover:from-purple-700 hover:to-fuchsia-700"
        >
          {loading ? "Resetting..." : "Reset Password"}
        </Button>
      </form>
    </div>
  );
};

export default ResetPassword;

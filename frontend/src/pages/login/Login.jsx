import { useState } from "react";
import LoginModal from "@/components/Auth/LoginModal.jsx";

export default function Login() {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="min-h-screen bg-zinc-500 flex justify-center items-center fixed">
      <LoginModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </div>
  );
}

import { useState } from "react";
import RegisterModal from "@/components/Auth/RegisterModel.jsx";

export default function Register() {
  const [isOpen, setIsOpen] = useState(true);

  return (
      <div className="min-h-screen bg-zinc-500 flex justify-center items-center fixed">
        <RegisterModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
      </div>
    
  );
}

import { useState } from "react";
import { buyPostCredits } from "@/utils/razorpay";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "./dialog";
import { Button } from "./button";

const PACKS = [
  { quantity: 1, label: "1 post",   price: "₹49" },
  { quantity: 3, label: "3 posts",  price: "₹147" },
  { quantity: 5, label: "5 posts",  price: "₹245" },
  { quantity: 10, label: "10 posts", price: "₹490" },
];

export default function BuyCreditsModal({ open, onClose, onSuccess }) {
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);

  async function handleBuy(quantity) {
    setError(null);
    setLoading(true);
    try {
      const result = await buyPostCredits(quantity);
      onSuccess?.(result);
      onClose?.();
    } catch (err) {
      setError(err.message || "Payment failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Buy Post Credits</DialogTitle>
          <DialogDescription>
            You've used your 5 free posts. Each additional post costs ₹49.
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-3 mt-2">
          {PACKS.map((pack) => (
            <button
              key={pack.quantity}
              disabled={loading}
              onClick={() => handleBuy(pack.quantity)}
              className="flex flex-col items-center justify-center p-4 border rounded-xl hover:border-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-950 transition-colors disabled:opacity-50"
            >
              <span className="text-lg font-bold">{pack.label}</span>
              <span className="text-sm text-muted-foreground">{pack.price}</span>
            </button>
          ))}
        </div>

        {error && (
          <p className="text-sm text-red-500 mt-2">{error}</p>
        )}

        <Button variant="ghost" onClick={onClose} disabled={loading} className="mt-1 w-full">
          Cancel
        </Button>
      </DialogContent>
    </Dialog>
  );
}

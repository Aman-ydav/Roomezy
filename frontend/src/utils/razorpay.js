import axiosInstance from "./axiosInterceptor";

/**
 * Opens a Razorpay checkout popup.
 * @param {object} opts
 * @param {string} opts.orderId       - Razorpay order ID from backend
 * @param {number} opts.amount        - Amount in paise
 * @param {string} opts.description   - Popup description text
 * @param {string} opts.userName      - User's display name
 * @param {string} opts.userEmail     - User's email
 * @param {function} opts.onSuccess   - Called with { razorpayOrderId, razorpayPaymentId, razorpaySignature }
 * @param {function} opts.onFailure   - Called with error message
 */
export function openRazorpay({ orderId, amount, keyId, description, userName, userEmail, onSuccess, onFailure }) {
  if (!window.Razorpay) {
    onFailure?.("Razorpay SDK not loaded. Please refresh the page.");
    return;
  }

  const key = keyId || import.meta.env.VITE_RAZORPAY_KEY_ID;
  if (!key) {
    onFailure?.("Razorpay key not configured.");
    return;
  }

  const options = {
    key,
    amount,
    currency: "INR",
    name: "Roomezy",
    description,
    order_id: orderId,
    prefill: {
      name:  userName  || "",
      email: userEmail || "",
    },
    theme: { color: "#4f46e5" },
    handler(response) {
      onSuccess?.({
        razorpayOrderId:   response.razorpay_order_id,
        razorpayPaymentId: response.razorpay_payment_id,
        razorpaySignature: response.razorpay_signature,
      });
    },
    modal: {
      ondismiss() {
        onFailure?.("Payment cancelled");
      },
    },
  };

  const rz = new window.Razorpay(options);
  rz.on("payment.failed", (response) => {
    onFailure?.(response.error?.description || "Payment failed");
  });
  rz.open();
}

export async function buyPostCredits(quantity) {
  const { data: orderData } = await axiosInstance.post(
    "/payments/post-credits/order",
    { quantity }
  );
  const order = orderData.data;

  return new Promise((resolve, reject) => {
    openRazorpay({
      orderId:     order.orderId,
      amount:      order.amount,
      keyId:       order.keyId,
      description: `${order.quantity} post credit(s)`,
      onSuccess: async (payload) => {
        try {
          const { data } = await axiosInstance.post(
            "/payments/post-credits/verify",
            payload
          );
          resolve(data.data);
        } catch (err) {
          reject(err);
        }
      },
      onFailure: (msg) => reject(new Error(msg)),
    });
  });
}

export async function payForKyc() {
  const { data: orderData } = await axiosInstance.post("/kyc/payment/order");
  const order = orderData.data;

  return new Promise((resolve, reject) => {
    openRazorpay({
      orderId:     order.orderId,
      amount:      order.amount,
      keyId:       order.keyId,
      description: "Roomezy Identity Verification Badge (₹99)",
      onSuccess: async (payload) => {
        try {
          const { data } = await axiosInstance.post(
            "/kyc/payment/verify",
            payload
          );
          resolve(data.data);
        } catch (err) {
          reject(err);
        }
      },
      onFailure: (msg) => reject(new Error(msg)),
    });
  });
}

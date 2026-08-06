export const loadRazorpayScript = () => {
  if (typeof window === "undefined") {
    return Promise.resolve(false);
  }

  if (window.Razorpay) {
    return Promise.resolve(true);
  }

  return new Promise((resolve) => {
    const existingScript = document.querySelector('script[src="https://checkout.razorpay.com/v1/checkout.js"]');

    if (existingScript) {
      existingScript.addEventListener("load", () => resolve(true), { once: true });
      existingScript.addEventListener("error", () => resolve(false), { once: true });
      return;
    }

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

export const openRazorpayCheckout = async ({
  keyId,
  key,
  orderId,
  amount,
  currency = "INR",
  name = "Vedic India",
  description = "Order payment",
  prefill = {},
  notes = {},
  themeColor = "#0f3d2e",
  handler,
  modal,
}) => {
  const loaded = await loadRazorpayScript();

  if (!loaded || typeof window === "undefined" || !window.Razorpay) {
    throw new Error("Unable to load Razorpay checkout.");
  }

  const resolvedKey = keyId || key || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;

  if (!resolvedKey) {
    throw new Error("Razorpay key is missing.");
  }

  const options = {
    key: resolvedKey,
    amount,
    currency,
    name,
    description,
    order_id: orderId,
    prefill,
    notes,
    theme: {
      color: themeColor,
    },
    handler,
    modal,
  };

  const razorpay = new window.Razorpay(options);
  razorpay.open();

  return razorpay;
};
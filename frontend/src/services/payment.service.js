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
  currency,
  name,
  description,
  prefill = {},
  notes = {},
  themeColor,
  handler,
  modal,
}) => {
  const loaded = await loadRazorpayScript();

  if (!loaded || typeof window === "undefined" || !window.Razorpay) {
    throw new Error("Unable to load Razorpay checkout.");
  }

  const resolvedKey = keyId || key;

  if (!resolvedKey) {
    throw new Error("Razorpay key is missing.");
  }

  const options = {
    key: resolvedKey,
    amount,
    currency,
    order_id: orderId,
    handler,
    modal,
  };

  if (name) {
    options.name = name;
  }

  if (description) {
    options.description = description;
  }

  if (prefill && Object.keys(prefill).length > 0) {
    options.prefill = prefill;
  }

  if (notes && Object.keys(notes).length > 0) {
    options.notes = notes;
  }

  if (themeColor) {
    options.theme = {
      color: themeColor,
    };
  }

  const razorpay = new window.Razorpay(options);

  razorpay.open();

  return razorpay;
};
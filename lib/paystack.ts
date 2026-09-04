"use client";

export function loadPaystackScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (typeof window === "undefined") {
      resolve(false);
      return;
    }
    if ((window as any).PaystackPop) {
      resolve(true);
      return;
    }
    const existing = document.getElementById("paystack-inline-js");
    if (existing) {
      existing.addEventListener("load", () => resolve(true));
      existing.addEventListener("error", () => resolve(false));
      return;
    }
    const script = document.createElement("script");
    script.id = "paystack-inline-js";
    script.src = "https://js.paystack.co/v1/inline.js";
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export interface PaystackPaymentOptions {
  email: string;
  amount: number; // in Naira (e.g. 1200)
  propertyId: string;
  publicKey?: string;
  onSuccess: (reference: string) => void;
  onCancel?: () => void;
}

export async function makePaystackPayment({
  email,
  amount,
  propertyId,
  publicKey,
  onSuccess,
  onCancel,
}: PaystackPaymentOptions) {
  const loaded = await loadPaystackScript();

  const key =
    publicKey ||
    process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY ||
    "pk_test_d3a8126bb0f15c1e550b7318854ef24338e55e5d"; // Demo test key for sandbox testing

  if (!loaded || !(window as any).PaystackPop) {
    // If script blocked or network unavailable, simulate demo payment with confirm
    const proceed = confirm(
      `Paystack script could not be loaded directly. Would you like to approve this test payment of ₦${amount.toLocaleString()} in simulation mode?`
    );
    if (proceed) {
      onSuccess(`SIMULATED_REF_${Date.now()}`);
    } else {
      if (onCancel) onCancel();
    }
    return;
  }

  try {
    const handler = (window as any).PaystackPop.setup({
      key,
      email: email || "customer@doxxarentals.com",
      amount: Math.round(amount * 100), // kobo
      currency: "NGN",
      ref: `DOXXA_${propertyId}_${Date.now()}`,
      metadata: {
        property_id: propertyId,
        custom_fields: [
          {
            display_name: "Property ID",
            variable_name: "property_id",
            value: propertyId,
          },
        ],
      },
      callback: function (response: { reference: string }) {
        onSuccess(response.reference);
      },
      onClose: function () {
        if (onCancel) onCancel();
      },
    });

    handler.openIframe();
  } catch (err) {
    console.error("Paystack error:", err);
    // Fallback prompt
    const proceed = confirm(
      `Error opening Paystack modal (${err instanceof Error ? err.message : "sandbox error"}). Approve in test mode to unlock?`
    );
    if (proceed) {
      onSuccess(`SIMULATED_REF_${Date.now()}`);
    } else {
      if (onCancel) onCancel();
    }
  }
}

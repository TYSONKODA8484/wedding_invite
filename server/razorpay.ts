import Razorpay from "razorpay";
import crypto from "crypto";

// Lazily initialize Razorpay client using env at call-time.
function getRazorpayClient() {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;

  if (!keyId || !keySecret) {
    console.warn(
      "Razorpay credentials not configured. Falling back to development mock. Set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in .env to enable real Razorpay."
    );
    return null;
  }

  try {
    return new Razorpay({ key_id: keyId, key_secret: keySecret });
  } catch (err) {
    console.error("Failed to initialize Razorpay client:", err);
    return null;
  }
}

/**
 * Create a Razorpay order
 * @param amount Amount in INR (will be converted to paise)
 * @param currency Currency code (default: INR)
 * @param receipt Receipt/Order number for reference
 * @returns Razorpay order object
 */
export async function createRazorpayOrder(
  amount: number,
  currency: string = "INR",
  receipt: string
) {
  // Razorpay expects amount in smallest currency unit (paise for INR)
  const amountInPaise = Math.round(amount * 100);

  const client = getRazorpayClient();
  if (!client) {
    // Development fallback: return a mock order object so UI can continue.
    const mockOrder = {
      id: `mock_order_${Date.now()}`,
      amount: amountInPaise,
      currency,
      receipt,
      status: "created",
    } as any;
    console.info("Razorpay not configured — returning mock order for local development", mockOrder.id);
    return mockOrder;
  }

  try {
    const order = await client.orders.create({
      amount: amountInPaise,
      currency: currency,
      receipt: receipt,
    });
    return order;
  } catch (error) {
    console.error("Error creating Razorpay order:", error);
    throw error;
  }
}

/**
 * Verify Razorpay payment signature
 * This ensures the payment callback is authentic and not tampered with
 * @param razorpayOrderId Order ID from Razorpay
 * @param razorpayPaymentId Payment ID from Razorpay
 * @param razorpaySignature Signature from Razorpay
 * @returns true if signature is valid, false otherwise
 */
export function verifyRazorpaySignature(
  razorpayOrderId: string,
  razorpayPaymentId: string,
  razorpaySignature: string
): boolean {
  try {
    // If secret not set, accept signature in non-production (development) to allow testing.
    const keySecret = process.env.RAZORPAY_KEY_SECRET;
    const text = `${razorpayOrderId}|${razorpayPaymentId}`;
    if (!keySecret) {
      console.warn("RAZORPAY_KEY_SECRET not set — skipping strict signature verification in dev");
      return process.env.NODE_ENV !== "production";
    }

    const expectedSignature = crypto.createHmac("sha256", keySecret).update(text).digest("hex");
    return expectedSignature === razorpaySignature;
  } catch (error) {
    console.error("Error verifying Razorpay signature:", error);
    return false;
  }
}

/**
 * Fetch payment details from Razorpay
 * @param paymentId Razorpay payment ID
 * @returns Payment details
 */
export async function fetchPaymentDetails(paymentId: string) {
  try {
    const client = getRazorpayClient();
    if (!client) {
      console.info("Razorpay client not configured — returning mock payment details for local development");
      return { id: paymentId, status: "captured" } as any;
    }

    const payment = await client.payments.fetch(paymentId);
    return payment;
  } catch (error) {
    console.error("Error fetching payment details:", error);
    throw error;
  }
}

// Export the lazy initializer as default for compatibility
export default getRazorpayClient;

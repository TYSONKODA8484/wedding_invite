import Razorpay from "razorpay";
import crypto from "crypto";

// Initialize Razorpay instance
const keyId = process.env.RAZORPAY_KEY_ID;
const keySecret = process.env.RAZORPAY_KEY_SECRET;

console.log("Razorpay Key ID exists:", !!keyId);
console.log("Razorpay Key ID starts with:", keyId?.substring(0, 8));
console.log("Razorpay Key Secret exists:", !!keySecret);

if (!keyId || !keySecret) {
  throw new Error("Razorpay credentials not configured. Please set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in Replit Secrets.");
}

const razorpay = new Razorpay({
  key_id: keyId,
  key_secret: keySecret,
});

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
  try {
    // Razorpay expects amount in smallest currency unit (paise for INR)
    const amountInPaise = Math.round(amount * 100);

    const order = await razorpay.orders.create({
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
    // Create expected signature
    const text = `${razorpayOrderId}|${razorpayPaymentId}`;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
      .update(text)
      .digest("hex");

    // Compare signatures
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
    const payment = await razorpay.payments.fetch(paymentId);
    return payment;
  } catch (error) {
    console.error("Error fetching payment details:", error);
    throw error;
  }
}

export default razorpay;

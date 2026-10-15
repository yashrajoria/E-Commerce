import type { NextApiRequest, NextApiResponse } from "next";

/** Request body accepted by the return submission route. */
export interface ReturnSubmitRequest {
  /** Identifier of the order being returned. */
  orderId: string;
  /** Human-readable order number shown to the customer; defaults to `"ORD-000"` when omitted. */
  orderNumber: string;
  /** Customer name recorded on the return; defaults to `"Customer"` when omitted. */
  customerName?: string;
  /** Customer email recorded on the return; defaults to `"customer@example.com"` when omitted. */
  customerEmail?: string;
  /** Name of the product being returned. */
  productName: string;
  /** Refund or exchange amount in GBP. */
  amount: number;
  /** Customer-stated reason for the return; defaults to `"Not specified"` when omitted. */
  reason: string;
  /** Requested resolution — a standard refund or an instant exchange with bonus store credit. */
  resolutionType: "standard_refund" | "instant_exchange";
  /** Optional free-text notes for an exchange (e.g. the requested size). */
  exchangeNotes?: string;
}

/** Response body returned by the return submission route. */
export interface ReturnSubmitResponse {
  /** Whether the return was accepted. */
  success: boolean;
  /** Generated return reference, e.g. `RET-2026-1234`. */
  returnNumber: string;
  /** Resolution that was issued for the return. */
  resolutionType: "standard_refund" | "instant_exchange";
  /** Lifecycle status of the return (`exchange_issued` or `pending_dropoff`). */
  status: string;
  /** Coupon code carrying the instant-exchange credit; present only for instant exchanges. */
  exchangeCouponCode?: string;
  /** Bonus loyalty credit granted on top of the refund for an instant exchange. */
  bonusCreditAmount?: number;
  /** Total credit granted for an instant exchange (refund plus bonus). */
  totalCreditAmount?: number;
  /** Refund amount for a standard-refund resolution. */
  refundAmount?: number;
  /** Path to the generated prepaid shipping label PDF for the return. */
  shippingLabelUrl: string;
  /** Customer-facing confirmation message describing the issued resolution. */
  message: string;
}

/**
 * Handles `POST /api/user/returns/submit` — registers a product return as a standard refund or an instant exchange.
 *
 * @remarks
 * Standalone route with no persistence layer: the return number, coupon code and totals are computed in memory and a prepaid-label URL is generated (`/api/returns/<returnNumber>/prepaid-label.pdf`); nothing is written to a database. Only `orderId` and `productName` are required — `orderNumber`, `customerName`, `customerEmail`, `reason` and `exchangeNotes` fall back to defaults. Instant exchanges add a fixed £5.00 bonus credit to `amount`.
 *
 * @param req - The Next.js API request; must be a `POST` whose JSON body matches {@link ReturnSubmitRequest}.
 * @param res - The Next.js API response; `405` for non-POST methods, `400` when `orderId` or `productName` is missing, `200` with a {@link ReturnSubmitResponse}, or `500` on unexpected failure.
 * @returns A promise that resolves once the response has been sent.
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ReturnSubmitResponse | { error: string }>,
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const {
      orderId,
      orderNumber = "ORD-000",
      customerName = "Customer",
      customerEmail = "customer@example.com",
      productName,
      amount,
      reason = "Not specified",
      resolutionType,
      exchangeNotes = "",
    }: ReturnSubmitRequest = req.body || {};

    if (!orderId || !productName) {
      return res
        .status(400)
        .json({ error: "Missing required return details." });
    }

    console.info(
      `[Return Request] Order: ${orderNumber} (${orderId}), Customer: ${customerName} <${customerEmail}>, Reason: ${reason}, Resolution: ${resolutionType}, Notes: ${exchangeNotes}`,
    );

    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const returnNumber = `RET-${new Date().getFullYear()}-${randomSuffix}`;
    const bonusCredit = 5.0; // £5 bonus loyalty exchange credit

    if (resolutionType === "instant_exchange") {
      const totalCredit = Number((amount + bonusCredit).toFixed(2));
      const couponCode = `EXCHANGE-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;

      // In production with pg, insert into returns and promotions
      // Here we provide the full robust response
      return res.status(200).json({
        success: true,
        returnNumber,
        resolutionType: "instant_exchange",
        status: "exchange_issued",
        exchangeCouponCode: couponCode,
        bonusCreditAmount: bonusCredit,
        totalCreditAmount: totalCredit,
        shippingLabelUrl: `/api/returns/${returnNumber}/prepaid-label.pdf`,
        message: `Instant exchange approved! You have received a £${bonusCredit.toFixed(2)} bonus credit. Use code ${couponCode} on your next order.`,
      });
    }

    return res.status(200).json({
      success: true,
      returnNumber,
      resolutionType: "standard_refund",
      status: "pending_dropoff",
      refundAmount: Number(amount.toFixed(2)),
      shippingLabelUrl: `/api/returns/${returnNumber}/prepaid-label.pdf`,
      message: `Return registered. Your prepaid shipping label is ready. Refund of £${amount.toFixed(2)} will process upon carrier drop-off.`,
    });
  } catch (err) {
    console.error("Return submit error:", err);
    return res.status(500).json({ error: "Failed to process return request" });
  }
}

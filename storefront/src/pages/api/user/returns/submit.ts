import type { NextApiRequest, NextApiResponse } from "next";

export interface ReturnSubmitRequest {
  orderId: string;
  orderNumber: string;
  customerName?: string;
  customerEmail?: string;
  productName: string;
  amount: number;
  reason: string;
  resolutionType: "standard_refund" | "instant_exchange";
  exchangeNotes?: string;
}

export interface ReturnSubmitResponse {
  success: boolean;
  returnNumber: string;
  resolutionType: "standard_refund" | "instant_exchange";
  status: string;
  exchangeCouponCode?: string;
  bonusCreditAmount?: number;
  totalCreditAmount?: number;
  refundAmount?: number;
  shippingLabelUrl: string;
  message: string;
}

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
      return res.status(400).json({ error: "Missing required return details." });
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

import { NextResponse } from "next/server";
import {
  getOrderByExternalId,
  updateOrderByExternalId,
} from "@/lib/orders";
import {
  isPaidStatus,
  isXenditTestMode,
  verifyWebhookToken,
  type XenditWebhookPayload,
} from "@/lib/xendit";

/**
 * Xendit Invoice webhook — update status order otomatis.
 *
 * Setup (Test Mode):
 * 1. Dashboard → Developers → Webhooks → Add URL
 * 2. URL: https://<domain>/api/webhook/xendit
 * 3. Event: Invoices
 * 4. Copy Verification Token → XENDIT_TEST_WEBHOOK_TOKEN di .env
 *
 * Local dev: pakai ngrok/cloudflared, arahkan ke localhost:3000
 */
export async function POST(req: Request) {
  if (!verifyWebhookToken(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let payload: XenditWebhookPayload;
  try {
    payload = (await req.json()) as XenditWebhookPayload;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { external_id: externalId, status } = payload;
  if (!externalId || !status) {
    return NextResponse.json(
      { error: "Missing external_id or status" },
      { status: 400 },
    );
  }

  const order = getOrderByExternalId(externalId);
  if (!order) {
    return NextResponse.json({ received: true, note: "order_not_found" });
  }

  if (order.status === "PAID" || order.status === "CANCELLED") {
    return NextResponse.json({ received: true, note: "terminal_status" });
  }

  if (isPaidStatus(status)) {
    updateOrderByExternalId(externalId, {
      status: "PAID",
      paidAt: new Date(),
    });
  } else if (status === "EXPIRED") {
    updateOrderByExternalId(externalId, {
      status: "EXPIRED",
      expiredAt: new Date(),
    });
  }

  return NextResponse.json({
    received: true,
    mode: isXenditTestMode() ? "test" : "live",
  });
}

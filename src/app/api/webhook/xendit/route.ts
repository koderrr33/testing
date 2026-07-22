import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
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

export async function POST(req: Request) {
  if (!verifyWebhookToken(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let rawBody: string;
  let payload: XenditWebhookPayload;
  try {
    rawBody = await req.text();
    payload = JSON.parse(rawBody) as XenditWebhookPayload;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { id: eventId, external_id: externalId, status } = payload;
  if (!eventId || !externalId || !status) {
    return NextResponse.json(
      { error: "Missing event id, external_id or status" },
      { status: 400 },
    );
  }

  // Idempotency: skip if already processed
  const existing = await prisma.webhookEvent.findUnique({
    where: { eventId },
  });
  if (existing) {
    return NextResponse.json({ received: true, note: "duplicate" });
  }

  // Persist event immediately for audit trail
  await prisma.webhookEvent.create({
    data: {
      eventId,
      type: "invoice",
      status: "received",
      payload: JSON.parse(rawBody),
    },
  });

  const order = await getOrderByExternalId(externalId);
  if (!order) {
    return NextResponse.json({ received: true, note: "order_not_found" });
  }

  if (order.status === "PAID" || order.status === "CANCELLED") {
    return NextResponse.json({ received: true, note: "terminal_status" });
  }

  try {
    if (isPaidStatus(status)) {
      await updateOrderByExternalId(externalId, {
        status: "PAID",
        paidAt: new Date(),
      });
    } else if (status === "EXPIRED") {
      await updateOrderByExternalId(externalId, {
        status: "EXPIRED",
        expiredAt: new Date(),
      });
    }

    await prisma.webhookEvent.update({
      where: { eventId },
      data: { status: "processed", processedAt: new Date() },
    });

    return NextResponse.json({
      received: true,
      mode: isXenditTestMode() ? "test" : "live",
    });
  } catch {
    await prisma.webhookEvent.update({
      where: { eventId },
      data: { status: "failed", processedAt: new Date() },
    });
    return NextResponse.json(
      { error: "Processing failed" },
      { status: 500 },
    );
  }
}

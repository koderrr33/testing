import { NextResponse } from "next/server";
import { createPaymentSchema } from "@/schemas/payment";
import { createInvoice, isXenditTestMode, toCheckoutErrorMessage } from "@/lib/xendit";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";
import { auth } from "@/lib/next-auth";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const ip = getClientIp(req);
  const rateLimit = checkRateLimit(`payment:${ip}`, 10, 60_000);

  if (!rateLimit.allowed) {
    return NextResponse.json(
      { error: "Too many requests. Try again later." },
      { status: 429 },
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = createPaymentSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", details: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const data = parsed.data;

  try {
    const invoice = await createInvoice({
      externalId: data.externalId,
      amount: data.amount,
      payerEmail: data.payerEmail,
      description: data.description,
      customer: data.customer,
      items: data.items,
      successRedirectUrl: data.successRedirectUrl,
      failureRedirectUrl: data.failureRedirectUrl,
      invoiceDurationSeconds: data.invoiceDurationSeconds,
    });

    return NextResponse.json({
      ok: true,
      mode: isXenditTestMode() ? "test" : "live",
      invoice: {
        id: invoice.id,
        external_id: invoice.external_id,
        status: invoice.status,
        amount: invoice.amount,
        invoice_url: invoice.invoice_url,
        expiry_date: invoice.expiry_date,
      },
    });
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: toCheckoutErrorMessage(err) },
      { status: 502 },
    );
  }
}

import { NextResponse } from "next/server";
import { createPaymentSchema } from "@/schemas/payment";
import { createInvoice, isXenditTestMode, toCheckoutErrorMessage } from "@/lib/xendit";

/**
 * REST endpoint alternatif untuk create Invoice (hosted checkout).
 * Flow utama tetap lewat Server Action di actions/checkout.ts.
 *
 * Webhook URL (Test Mode):
 *   {NEXT_PUBLIC_APP_URL}/api/webhook/xendit
 */
export async function POST(req: Request) {
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

import { WebhooksMonitor } from "@/components/admin/webhooks-monitor";
import { prisma } from "@/lib/prisma";

export default async function AdminWebhooksPage() {

  const events = await prisma.webhookEvent.findMany({
    orderBy: { processedAt: "desc" },
    take: 50,
  });

  return (
    <WebhooksMonitor
      initialEvents={events.map((e) => ({
        id: e.id,
        eventId: e.eventId,
        type: e.type,
        status: e.status,
        payload: e.payload,
        processedAt: e.processedAt?.toISOString() ?? null,
      }))}
    />
  );
}

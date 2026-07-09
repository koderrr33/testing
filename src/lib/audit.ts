import { prisma } from "@/lib/prisma";
import type { AdminSession } from "@/lib/auth";
import type { Prisma } from "@/generated/prisma/client";

export async function logAudit(
  session: AdminSession,
  action: string,
  entity: string,
  entityId?: string,
  details?: Record<string, unknown>,
): Promise<void> {
  await prisma.auditLog.create({
    data: {
      adminId: session.sub,
      adminEmail: session.email,
      action,
      entity,
      entityId,
      details: details as Prisma.InputJsonValue ?? undefined,
    },
  });
}

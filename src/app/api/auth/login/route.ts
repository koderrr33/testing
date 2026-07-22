import { NextResponse } from "next/server";
import {
  authenticateAdmin,
  createSessionToken,
  setSessionCookie,
} from "@/lib/auth";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";
import { loginSchema } from "@/schemas/admin";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  const ip = getClientIp(request);
  const rateLimit = checkRateLimit(`login:${ip}`, 5, 60_000);

  if (!rateLimit.allowed) {
    return NextResponse.json(
      { error: "Too many login attempts. Try again later." },
      {
        status: 429,
        headers: {
          "Retry-After": String(Math.ceil(rateLimit.retryAfterMs / 1000)),
        },
      },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = loginSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid input" },
      { status: 400 },
    );
  }

  const session = await authenticateAdmin(parsed.data.email, parsed.data.password);
  if (!session) {
    await prisma.auditLog.create({
      data: {
        adminId: "system",
        adminEmail: parsed.data.email,
        action: "LOGIN_FAILED",
        entity: "AdminUser",
        details: { ip },
      },
    });
    return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
  }

  const token = await createSessionToken(session);
  await setSessionCookie(token);

  await prisma.auditLog.create({
    data: {
      adminId: session.sub,
      adminEmail: session.email,
      action: "LOGIN_SUCCESS",
      entity: "AdminUser",
    },
  });

  return NextResponse.json({
    success: true,
    user: { email: session.email, name: session.name, role: session.role },
  });
}

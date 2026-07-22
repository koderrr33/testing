import Link from "next/link";
import {
  DataTable,
  DataTableBody,
  DataTableCell,
  DataTableHead,
  DataTableHeaderCell,
  DataTableRow,
  EmptyState,
} from "@/components/admin/data-table";
import { StatusBadge } from "@/components/admin/status-badge";
import { formatDate, formatIdr } from "@/lib/format-admin";
import { prisma } from "@/lib/prisma";
import type { OrderStatus } from "@/generated/prisma/enums";

type PageProps = {
  searchParams: Promise<{
    page?: string;
    status?: string;
    q?: string;
    from?: string;
    to?: string;
  }>;
};

export default async function AdminOrdersPage({ searchParams }: PageProps) {

  const params = await searchParams;
  const page = Math.max(1, Number(params.page) || 1);
  const perPage = 10;
  const status = params.status?.trim() ?? "";
  const q = params.q?.trim() ?? "";
  const from = params.from ? new Date(params.from) : undefined;
  const to = params.to ? new Date(params.to) : undefined;

  const where = {
    ...(status && status !== "all" ? { status: status as OrderStatus } : {}),
    ...(from || to
      ? {
          createdAt: {
            ...(from ? { gte: from } : {}),
            ...(to ? { lte: new Date(to.getTime() + 86400000 - 1) } : {}),
          },
        }
      : {}),
    ...(q
      ? {
          OR: [
            { externalId: { contains: q, mode: "insensitive" as const } },
            { customerEmail: { contains: q, mode: "insensitive" as const } },
          ],
        }
      : {}),
  };

  const [orders, total] = await Promise.all([
    prisma.order.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * perPage,
      take: perPage,
    }),
    prisma.order.count({ where }),
  ]);

  const totalPages = Math.max(1, Math.ceil(total / perPage));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-white">Orders</h1>
        <p className="mt-1 text-sm text-zinc-400">{total} orders total</p>
      </div>

      <form className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        <input
          name="q"
          defaultValue={q}
          placeholder="External ID or email…"
          className="rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-white outline-none focus:border-zinc-500 lg:col-span-2"
        />
        <select
          name="status"
          defaultValue={status || "all"}
          className="rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-white outline-none focus:border-zinc-500"
        >
          <option value="all">All statuses</option>
          <option value="PENDING">Pending</option>
          <option value="PAID">Paid</option>
          <option value="EXPIRED">Expired</option>
          <option value="CANCELLED">Cancelled</option>
        </select>
        <input
          name="from"
          type="date"
          defaultValue={params.from ?? ""}
          className="rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-white outline-none focus:border-zinc-500"
        />
        <input
          name="to"
          type="date"
          defaultValue={params.to ?? ""}
          className="rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-white outline-none focus:border-zinc-500"
        />
        <button
          type="submit"
          className="rounded-lg border border-zinc-700 px-4 py-2 text-sm text-zinc-300 hover:bg-zinc-800 sm:col-span-2 lg:col-span-5 lg:w-fit"
        >
          Apply filters
        </button>
      </form>

      {orders.length === 0 ? (
        <EmptyState message="No orders found." />
      ) : (
        <DataTable>
          <DataTableHead>
            <tr>
              <DataTableHeaderCell>External ID</DataTableHeaderCell>
              <DataTableHeaderCell>Customer</DataTableHeaderCell>
              <DataTableHeaderCell>Amount</DataTableHeaderCell>
              <DataTableHeaderCell>Status</DataTableHeaderCell>
              <DataTableHeaderCell>Date</DataTableHeaderCell>
              <DataTableHeaderCell>Actions</DataTableHeaderCell>
            </tr>
          </DataTableHead>
          <DataTableBody>
            {orders.map((order) => (
              <DataTableRow key={order.id}>
                <DataTableCell className="font-mono text-xs">
                  {order.externalId}
                </DataTableCell>
                <DataTableCell>
                  <div>
                    <p>{order.customerName}</p>
                    <p className="text-xs text-zinc-500">{order.customerEmail}</p>
                  </div>
                </DataTableCell>
                <DataTableCell>{formatIdr(order.amount)}</DataTableCell>
                <DataTableCell>
                  <StatusBadge status={order.status} />
                </DataTableCell>
                <DataTableCell>{formatDate(order.createdAt)}</DataTableCell>
                <DataTableCell>
                  <Link
                    href={`/admin/orders/${order.externalId}`}
                    className="text-sm text-zinc-300 hover:text-white hover:underline"
                  >
                    View
                  </Link>
                </DataTableCell>
              </DataTableRow>
            ))}
          </DataTableBody>
        </DataTable>
      )}

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          {page > 1 && (
            <Link
              href={`/admin/orders?page=${page - 1}&status=${status}&q=${q}&from=${params.from ?? ""}&to=${params.to ?? ""}`}
              className="rounded-lg border border-zinc-700 px-3 py-1.5 text-sm text-zinc-300 hover:bg-zinc-800"
            >
              Previous
            </Link>
          )}
          <span className="text-sm text-zinc-500">
            Page {page} of {totalPages}
          </span>
          {page < totalPages && (
            <Link
              href={`/admin/orders?page=${page + 1}&status=${status}&q=${q}&from=${params.from ?? ""}&to=${params.to ?? ""}`}
              className="rounded-lg border border-zinc-700 px-3 py-1.5 text-sm text-zinc-300 hover:bg-zinc-800"
            >
              Next
            </Link>
          )}
        </div>
      )}
    </div>
  );
}

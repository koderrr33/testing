import Link from "next/link";
import { notFound } from "next/navigation";
import { ProductForm } from "@/components/admin/product-form";
import { prisma } from "@/lib/prisma";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditProductPage({ params }: PageProps) {
  const { id } = await params;

  const product = await prisma.product.findUnique({ where: { id } });
  if (!product) notFound();

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <Link
          href="/admin/products"
          className="text-sm text-zinc-400 hover:text-white"
        >
          ← Back to products
        </Link>
        <h1 className="mt-2 text-2xl font-semibold text-white">Edit Product</h1>
        <p className="mt-1 text-sm text-zinc-400">{product.name}</p>
      </div>
      <ProductForm product={product} />
    </div>
  );
}

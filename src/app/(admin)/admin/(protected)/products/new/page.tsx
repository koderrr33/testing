import Link from "next/link";
import { ProductForm } from "@/components/admin/product-form";

export default async function NewProductPage() {

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <Link
          href="/admin/products"
          className="text-sm text-zinc-400 hover:text-white"
        >
          ← Back to products
        </Link>
        <h1 className="mt-2 text-2xl font-semibold text-white">New Product</h1>
      </div>
      <ProductForm />
    </div>
  );
}

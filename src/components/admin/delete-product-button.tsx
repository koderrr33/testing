"use client";

import { ConfirmDialog } from "@/components/admin/confirm-dialog";
import { deleteProductAction } from "@/lib/admin-actions";

type DeleteProductButtonProps = {
  productId: string;
  productName: string;
};

export function DeleteProductButton({
  productId,
  productName,
}: DeleteProductButtonProps) {
  return (
    <ConfirmDialog
      title="Delete product"
      description={`Delete "${productName}"? This cannot be undone.`}
      confirmLabel="Delete"
      variant="danger"
      onConfirm={async () => { await deleteProductAction(productId); }}
      trigger={
        <button type="button" className="text-sm text-red-400 hover:text-red-300">
          Delete
        </button>
      }
    />
  );
}

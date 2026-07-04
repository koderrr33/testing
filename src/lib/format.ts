export function formatIdr(price: number): string {
  return `Rp.${price.toLocaleString("id-ID")}`;
}

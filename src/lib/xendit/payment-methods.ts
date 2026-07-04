/**
 * Semua channel pembayaran Indonesia yang didukung Invoice (hosted checkout).
 * Aktifkan juga di Xendit Dashboard → Settings → Payment Methods (Test Mode).
 *
 * Kalau array ini dikosongkan, Xendit pakai semua method yang aktif di dashboard.
 */
export const INDONESIA_INVOICE_PAYMENT_METHODS = [
  // QR & e-wallet
  "QRIS",
  "GOPAY",
  "OVO",
  "DANA",
  "SHOPEEPAY",
  "LINKAJA",
  "ASTRAPAY",
  // Virtual Account — bank utama
  "BCA",
  "BNI",
  "BRI",
  "MANDIRI",
  "PERMATA",
  "BSI",
  "CIMB",
  "SAHABAT_SAMPOERNA",
  // Kartu
  "CREDIT_CARD",
] as const;

export type IndonesiaInvoicePaymentMethod =
  (typeof INDONESIA_INVOICE_PAYMENT_METHODS)[number];

export const PAYMENT_METHOD_LABELS: Record<
  IndonesiaInvoicePaymentMethod,
  string
> = {
  QRIS: "QRIS",
  GOPAY: "GoPay",
  OVO: "OVO",
  DANA: "DANA",
  SHOPEEPAY: "ShopeePay",
  LINKAJA: "LinkAja",
  ASTRAPAY: "AstraPay",
  BCA: "BCA Virtual Account",
  BNI: "BNI Virtual Account",
  BRI: "BRI Virtual Account",
  MANDIRI: "Mandiri Virtual Account",
  PERMATA: "Permata Virtual Account",
  BSI: "BSI Virtual Account",
  CIMB: "CIMB Virtual Account",
  SAHABAT_SAMPOERNA: "Sampoerna VA",
  CREDIT_CARD: "Kartu Kredit/Debit",
};

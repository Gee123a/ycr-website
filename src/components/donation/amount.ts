// Accepts 50000, 50.000, 50,000 and "Rp 50.000". Anything unclear is NaN, so the contract rejects it.
export function parseRupiah(raw: string): number {
  const text = raw.trim().replace(/^rp\.?\s*/i, "");
  return /^(\d+|\d{1,3}([.,]\d{3})+)$/.test(text) ? Number(text.replace(/[.,]/g, "")) : NaN;
}

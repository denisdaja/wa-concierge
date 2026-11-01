import { createHmac, timingSafeEqual } from "crypto";

export function verifySignature(rawBody: string, signatureHeader: string | null): boolean {
  const secret = process.env.WHATSAPP_APP_SECRET;

  // 1. Nëse mungon header-i ose sekreti → refuzo
  if (!signatureHeader || !secret) {
    return false;
  }

  // 2. Llogarit vulën tonë
  const expected = "sha256=" + createHmac("sha256", secret)
    .update(rawBody, "utf8")
    .digest("hex");

  // 3. Krahaso në mënyrë të sigurt
  const a = Buffer.from(expected);
  const b = Buffer.from(signatureHeader);

  if (a.length !== b.length) {
    return false;
  }

  return timingSafeEqual(a, b);
}
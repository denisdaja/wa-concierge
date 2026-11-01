import { verifySignature } from "@/lib/whatsapp/signature";

export async function POST(request: Request) {
  // 1. Trupi si tekst bruto
  const rawBody = await request.text();

  // 2. Header-i i firmës
  const signature = request.headers.get("x-hub-signature-256");

  // 3. Verifiko
  if (!verifySignature(rawBody, signature)) {
    console.warn(" Firmë e pavlefshme, kërkesa u refuzua");
    return new Response("Invalid signature", { status: 401 });
  }

  // 4. Vetëm tani e kthejmë në JSON
  const body = JSON.parse(rawBody);
  console.log(JSON.stringify(body, null, 2));

  return new Response("OK", { status: 200 });
}
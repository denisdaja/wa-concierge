import { NextRequest } from "next/server";
import { verifySignature } from "@/lib/whatsapp/signature";
import { parseWebhook } from "@/lib/whatsapp/parse";
import { sendText } from "@/lib/whatsapp/send";

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;

  const mode = params.get("hub.mode");
  const token = params.get("hub.verify_token");
  const challenge = params.get("hub.challenge");

  const tokenOk = token === process.env.WHATSAPP_VERIFY_TOKEN;
  console.log({ mode, tokenOk });

  if (mode === "subscribe" && tokenOk) {
    return new Response(challenge, { status: 200 });
  } else {
    return new Response("Error, wrong validation token", { status: 403 });
  }
}

export async function POST(request: NextRequest) {
  // 1. Trupi si tekst bruto
  const rawBody = await request.text();

  // 2. Header-i i firmës
  const signature = request.headers.get("x-hub-signature-256");

  // 3. Verifiko
  if (!verifySignature(rawBody, signature)) {
    console.warn("⚠️ Firmë e pavlefshme, kërkesa u refuzua");
    return new Response("Invalid signature", { status: 401 });
  }

  // 4. Vetëm tani e kthejmë në JSON
  const body = JSON.parse(rawBody);
  const events = parseWebhook(body);

  for (const event of events) {
    if (event.kind === "message") {
      console.log(`📩 ${event.name} (${event.from}): ${event.text ?? `[${event.type}]`}`);

      await sendText(
        event.phoneNumberId,
        event.from,
        `Përshëndetje ${event.name ?? "mik"}! Faleminderit për mesazhin tuaj. Do të përgjigjemi sa më shpejt të jetë e mundur.`
      );
    } else {
      console.log(`📬 Status ${event.messageId}: ${event.status} ${event.errorCode ?? ""} ${event.errorTitle ?? ""}`);
    }
  }

  return new Response("OK", { status: 200 });
}

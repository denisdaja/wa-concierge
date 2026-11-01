const API_VERSION = "v26.0";

export async function sendText(
  phoneNumberId: string,
  to: string,
  text: string
): Promise<void> {
  // 1. Dry-run: vetëm printo
  if (process.env.WHATSAPP_SEND_ENABLED !== "true") {
    console.log(`🧪 [DRY-RUN] → ${to}: ${text}`);
    return;
  }

  // 2. Dërgimi i vërtetë
  const url = `https://graph.facebook.com/${API_VERSION}/${phoneNumberId}/messages`;

  const res = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.WHATSAPP_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      messaging_product: "whatsapp",
      to: to,
      type: "text",
      text: { body: text },
    }),
  });

  // 3. Kontrollo nëse Meta e pranoi
  if (!res.ok) {
    console.error(`❌ Dërgimi dështoi (${res.status}):`, await res.text());
    return;
  }

  const data = await res.json();
  console.log(`✅ U pranua nga Meta: ${data.messages?.[0]?.id}`);
}
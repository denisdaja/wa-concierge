import type { WhatsAppEvent } from "./types";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function parseWebhook(body: any): WhatsAppEvent[] {
  const events: WhatsAppEvent[] = [];

  // Mund të ketë disa entry dhe disa changes, prandaj i kalojmë të gjitha
  for (const entry of body?.entry ?? []) {
    for (const change of entry?.changes ?? []) {
      const value = change?.value;
      if (!value) continue;

      const phoneNumberId = value.metadata?.phone_number_id;

      // --- Mesazhet hyrëse ---
      for (const msg of value.messages ?? []) {
        // emri gjendet te "contacts", jo te mesazhi
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const contact = value.contacts?.find((c: any) => c.wa_id === msg.from);

        events.push({
          kind: "message",
          phoneNumberId,
          from: msg.from,
          name: contact?.profile?.name,
          messageId: msg.id,
          type: msg.type,
          text: msg.text?.body,           // ⚠️ kujdes: mund të mungojë (foto!)
          timestamp: Number(msg.timestamp),
        });
      }

      // --- Statuset e mesazheve tona ---
      for (const st of value.statuses ?? []) {
        events.push({
          kind: "status",
          messageId: st.id,
          status: st.status,
          errorCode: st.errors?.[0]?.code,
          errorTitle: st.errors?.[0]?.title,
        });
      }
    }
  }

  return events;
}
export type IncomingMessage = {
  kind: "message";
  phoneNumberId: string;
  from: string;
  name?: string;
  messageId: string;
  type: string;        // "text", "image", "audio", "location"...
  text?: string;       // vetëm kur type === "text"
  timestamp: number;
};

export type StatusUpdate = {
  kind: "status";
  messageId: string;
  status: string;      // "sent", "delivered", "read", "failed"
  errorCode?: number;
  errorTitle?: string;
};

export type WhatsAppEvent = IncomingMessage | StatusUpdate;
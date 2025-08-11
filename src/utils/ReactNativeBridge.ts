// nativeBridge.ts
// A tiny, reusable util for bridging WebView/native messaging across apps.

/**
 * Augment global Window with the NativeBridge shape.
 * (If your project already has this elsewhere, remove this block.)
 */
declare global {
  interface Window {
    NativeBridge?: {
      send: (msg: object) => void;
    };
  }

  interface Document {
    // Some iOS WebViews dispatch `message` on `document`.
    // We keep this permissive to avoid having to "as any" at call sites.
    addEventListener(
      type: "message",
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      listener: (this: Document, ev: any) => void,
      options?: boolean | AddEventListenerOptions
    ): void;
    removeEventListener(
      type: "message",
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      listener: (this: Document, ev: any) => void,
      options?: boolean | EventListenerOptions
    ): void;
  }
}

/** Outgoing messages you can send to the native layer. */
export type OutgoingMessage =
  | { action: "openCamera" }
  | {
      action: "scheduleNotification";
      payload: { message: string; delayMs: number };
    }
  | {
      action: "haptic";
      /** Keep it open-ended; your native side can validate supported types. */
      payload: string;
    };

/** Known incoming messages from native -> web. Extend as you add more. */
export type IncomingMessage =
  | { action: "cameraResult"; data: string } // base64 image
  | { action: string; [k: string]: unknown }; // fallback/unknown actions

type IncomingHandler = (msg: IncomingMessage) => void;

const isBrowser = typeof window !== "undefined";

const subscribers = new Set<IncomingHandler>();

/** Safely parse a `message` event payload (string or object). */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function toIncomingMessage(e: MessageEvent | any): IncomingMessage | null {
  try {
    const raw = typeof e?.data === "string" ? JSON.parse(e.data) : e?.data;
    if (!raw || typeof raw !== "object") return null;
    if (typeof raw.action !== "string") return null;
    return raw as IncomingMessage;
  } catch {
    return null;
  }
}

let teardownFn: (() => void) | null = null;

/**
 * Initialize listeners (idempotent). Listens on both window and document
 * because some iOS WebViews dispatch on document.
 *
 * Returns a teardown function to remove listeners.
 */
export function initNativeBridge(): () => void {
  if (!isBrowser) return () => {};

  if (teardownFn) return teardownFn; // already initialized

  // Single handler instance so removeEventListener works.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handler = (e: any) => {
    const msg = toIncomingMessage(e);
    if (!msg) return;
    subscribers.forEach((fn) => {
      try {
        fn(msg);
      } catch {
        /* swallow subscriber errors */
      }
    });
  };

  window.addEventListener("message", handler);
  // Some iOS/webview setups send on document:
  document.addEventListener("message", handler);

  teardownFn = () => {
    window.removeEventListener("message", handler);
    document.removeEventListener("message", handler);
    teardownFn = null;
  };

  return teardownFn;
}

/** Subscribe to all incoming native messages. Returns an unsubscribe. */
export function onMessage(fn: IncomingHandler): () => void {
  subscribers.add(fn);
  return () => subscribers.delete(fn);
}

/** Subscribe to a specific incoming action (e.g., "cameraResult"). */
export function onAction<A extends IncomingMessage["action"]>(
  action: A,
  fn: (msg: Extract<IncomingMessage, { action: A }>) => void
): () => void {
  const wrapped: IncomingHandler = (msg) => {
    if (msg.action === action)
      fn(msg as Extract<IncomingMessage, { action: A }>);
  };
  return onMessage(wrapped);
}

/** Low-level send (typed). No-ops if NativeBridge is unavailable. */
export function send(msg: OutgoingMessage): void {
  if (!isBrowser) return;
  try {
    window.NativeBridge?.send(msg);
  } catch {
    // Intentionally swallow; caller can feature-detect if needed
  }
}

/** Convenience helpers (nicer ergonomics). */
export const NativeBridge = {
  init: initNativeBridge,
  onMessage,
  onAction,
  send,
  openCamera() {
    send({ action: "openCamera" });
  },
  scheduleNotification(message: string, delayMs: number) {
    send({ action: "scheduleNotification", payload: { message, delayMs } });
  },
  haptic(effect: string) {
    send({ action: "haptic", payload: effect });
  },
};

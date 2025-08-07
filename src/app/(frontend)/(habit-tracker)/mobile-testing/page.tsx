"use client";
import { useEffect } from "react";

declare global {
  interface Window {
    NativeBridge: {
      send: (msg: object) => void;
    };
  }
}

export default function Home() {
  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handler = (e: any) => {
      try {
        const data = typeof e.data === "string" ? JSON.parse(e.data) : e.data;
        if (data?.action === "cameraResult") {
          console.log("Got photo as base64:", data.data);
        }
      } catch {}
    };

    window.addEventListener("message", handler);
    // iOS/WebView sometimes emits on document:
    // @ts-error
    document.addEventListener("message", handler);

    return () => {
      window.removeEventListener("message", handler);
      // @ts-error
      document.removeEventListener("message", handler);
    };
  }, []);

  const takePhoto = () => {
    window.NativeBridge.send({ action: "openCamera" });
  };

  const notifyLater = () => {
    window.NativeBridge.send({
      action: "scheduleNotification",
      payload: { message: "Hey from Next.js!", delayMs: 5000 },
    });
  };

  const vibrate = () => {
    window.NativeBridge.send({
      action: "haptic",
      payload: "impactMedium",
    });
  };

  return (
    <div>
      <button
        onClick={takePhoto}
        className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
      >
        Open Camera
      </button>
      <button
        onClick={notifyLater}
        className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
      >
        Notify Me in 5s
      </button>
      <button
        onClick={vibrate}
        className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
      >
        Haptic Effect
      </button>
    </div>
  );
}

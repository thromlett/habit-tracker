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
    // listen for responses from React Native
    window.addEventListener("message", (e) => {
      const msg = JSON.parse(e.data);
      if (msg.action === "cameraResult") {
        console.log("Got photo as base64:", msg.data);
        // you can display it, upload it, etc.
      }
    });
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

  return (
    <div>
      <button onClick={takePhoto}>Open Camera</button>
      <button onClick={notifyLater}>Notify Me in 5s</button>
    </div>
  );
}

// components/DirectUploadForm.tsx
"use client";

import { useState } from "react";

export default function DirectUploadForm({ userId }: { userId: string }) {
  const [file, setFile] = useState<File | null>(null);

  async function handleUpload() {
    if (!file) return;
    // 1. Get signed URL
    const { url, filename } = await fetch(
      `/api/upload/gcs-url?name=${encodeURIComponent(file.name)}&type=${
        file.type
      }`
    ).then((r) => r.json());

    console.log("GCS signed URL:", url);

    // 2. PUT the file directly to GCS
    await fetch(url, {
      method: "PUT",
      mode: "cors",
      headers: { "Content-Type": file.type },
      body: file,
    });

    // 3. Construct the public URL
    const publicUrl = `https://storage.googleapis.com/${process.env.GCS_BUCKET_NAME}/${filename}`;

    // 4. Tell our backend to save it
    await fetch("/api/upload/save-photo-url", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, imageUrl: publicUrl }),
    });
  }

  return (
    <>
      <input
        type="file"
        accept="image/*"
        onChange={(e) => setFile(e.target.files?.[0] ?? null)}
      />
      <button onClick={handleUpload} disabled={!file}>
        Upload Directly to GCS
      </button>
    </>
  );
}

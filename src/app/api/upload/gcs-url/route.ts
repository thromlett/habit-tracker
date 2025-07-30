import { Storage } from "@google-cloud/storage";
import path from "path";
import fs from "fs";

export const runtime = "nodejs";

// process.cwd() is the folder with package.json
const keyFile = path.join(
  process.cwd(),
  process.env.GOOGLE_APPLICATION_CREDENTIALS!
);

// Optional debug to confirm the SDK finds your key:
console.log("🔑 keyFile path:", keyFile, "exists?", fs.existsSync(keyFile));

const storage = new Storage({
  projectId: process.env.GOOGLE_CLOUD_PROJECT,
  keyFilename: keyFile,
});
const bucket = storage.bucket(process.env.GCS_BUCKET_NAME!);

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const name = searchParams.get("name")!;
  const type = searchParams.get("type")!;

  const filename = `profiles/${Date.now()}_${name}`;
  const file = bucket.file(filename);

  const [url] = await file.getSignedUrl({
    version: "v4",
    action: "write",
    expires: Date.now() + 60 * 1000,
    contentType: type,
  });

  return new Response(JSON.stringify({ url, filename }), {
    headers: { "Content-Type": "application/json" },
  });
}

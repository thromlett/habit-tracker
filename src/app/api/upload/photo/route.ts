// app/api/upload/route.ts
import { PrismaClient } from "@prisma/client";
import { Storage } from "@google-cloud/storage";

export const runtime = "nodejs"; // ensures Node APIs are available

const prisma = new PrismaClient();
const storage = new Storage(); // picks up GOOGLE_ env vars
const bucket = storage.bucket(process.env.GCS_BUCKET_NAME!);

export async function POST(req: Request) {
  // 1. Parse the multipart form-data
  const formData = await req.formData();
  const photo = formData.get("photo") as File;
  const userId = formData.get("userId") as string;

  if (!photo || !userId) {
    return new Response("Missing file or userId", { status: 400 });
  }

  // 2. Read file into a Buffer
  const arrayBuffer = await photo.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  // 3. Compose a unique GCS object name
  const filename = `profiles/${Date.now()}_${photo.name}`;

  // 4. Upload to GCS
  const file = bucket.file(filename);
  await file.save(buffer, {
    contentType: photo.type,
    resumable: false,
    public: true, // makes the file publicly readable
    metadata: { cacheControl: "public, max-age=31536000" },
  });

  // 5. Derive the public URL
  const publicUrl = `https://storage.googleapis.com/${process.env.GCS_BUCKET_NAME}/${filename}`;

  // 6. Save the URL in MongoDB via Prisma
  await prisma.user.update({
    where: { id: userId },
    data: { avatarUrl: publicUrl },
  });

  return new Response(JSON.stringify({ imageUrl: publicUrl }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}

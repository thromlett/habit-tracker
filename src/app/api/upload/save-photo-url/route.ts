// app/api/save-photo-url/route.ts
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  const { userId, imageUrl } = await req.json();
  if (!userId || !imageUrl) {
    return new Response("Missing userId or imageUrl", { status: 400 });
  }

  await prisma.user.update({
    where: { id: userId },
    data: { image: imageUrl },
  });

  return new Response(null, { status: 204 });
}

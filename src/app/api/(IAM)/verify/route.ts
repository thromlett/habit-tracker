import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const token = searchParams.get("token");
  if (!token) {
    return NextResponse.json({ error: "Token is required" }, { status: 400 });
  }

  const record = await prisma.verificationToken.findUnique({
    where: { token },
  });
  if (!record || record.expires < new Date()) {
    return NextResponse.json(
      { error: "Invalid or expired token" },
      { status: 400 }
    );
  }

  await prisma.user.update({
    where: { email: record.identifier || undefined },
    data: { emailVerified: new Date() },
  });

  await prisma.verificationToken.delete({ where: { token } });
  const { origin } = new URL(req.url);
  return NextResponse.redirect(`${origin}/verified`);
}

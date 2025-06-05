import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../../lib/prisma";
import { sendPasswordResetEmail } from "../../../../../lib/email";
import { nanoid } from "nanoid";

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return NextResponse.json({
        message:
          "If that email is registered, you will receive a password reset email.",
      });
    }

    // Generate token and expiry
    const token = nanoid(32);
    const expires = new Date(Date.now() + 1000 * 60 * 30); // 30 mins

    await prisma.passwordResetToken.create({
      data: {
        identifier: email,
        token,
        expires,
      },
    });

    const resetUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/reset-password?token=${token}`;
    await sendPasswordResetEmail({ to: email, resetUrl });

    return NextResponse.json({
      message:
        "If that email is registered, you will receive a password reset email.",
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Error handling forgot password." },
      { status: 500 }
    );
  }
}

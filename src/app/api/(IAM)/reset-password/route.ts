import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
  try {
    const { token, newPassword } = await req.json();

    // Validate input,
    if (!token || !newPassword) {
      return NextResponse.json(
        { error: "Token and new password are required" },
        { status: 400 }
      );
    }

    // Find the reset token
    const resetToken = await prisma.passwordResetToken.findUnique({
      where: { token },
    });

    if (!resetToken || resetToken.expires < new Date()) {
      return NextResponse.json(
        { error: "Invalid or expired token" },
        { status: 400 }
      );
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update the user's password
    try {
      await prisma.user.update({
        where: { email: resetToken.identifier },
        data: { password: hashedPassword },
      });
    } catch (updateError) {
      console.error("Failed to update user password:", updateError);
      return NextResponse.json(
        { error: "Failed to update user password" },
        { status: 500 }
      );
    }

    // Delete the reset token
    try {
      await prisma.passwordResetToken.delete({ where: { token } });
    } catch (deleteError) {
      console.error("Failed to delete reset token:", deleteError);
      // Not a critical error, so continue
    }

    return NextResponse.json(
      { message: "Password reset successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("General error in reset-password route:", error);
    return NextResponse.json(
      { error: "Failed to reset password" },
      { status: 500 }
    );
  }
}

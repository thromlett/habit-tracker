import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";
import bcrypt from "bcryptjs";
import { sendVerificationEmail } from "../../../../lib/email";

// Helper for tests (avoids ESM)
function testNanoid(length = 21) {
  return Math.random()
    .toString(36)
    .slice(2, 2 + length);
  console.log(`used testNanoid to generate ID: ${length}`);
}

export async function POST(req: NextRequest) {
  // Setup ID function based on env
  let makeId: (size?: number) => string;
  if (process.env.NODE_ENV === "test") {
    makeId = testNanoid;
  } else {
    // Dynamic import for dev/prod
    const { nanoid } = await import("nanoid");
    makeId = nanoid;
    console.log("nanoid imported for ID generation");
  }

  try {
    const data = await req.json();
    const { email, userName, password } = data;

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        userName,
        emailVerified: null,
      },
    });

    const verificationToken = makeId(32);
    const expires = new Date(Date.now() + 1000 * 60 * 60); // 1 hour

    await prisma.verificationToken.create({
      data: {
        identifier: user.email,
        token: verificationToken,
        expires,
      },
    });

    const verificationUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/api/verify?token=${verificationToken}`;
    await sendVerificationEmail({ to: email, verificationUrl });

    return NextResponse.json(
      { message: "User created. Please verify your email." },
      { status: 201 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to create user" },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';
import bcrypt from 'bcryptjs';
import { sendVerificationEmail } from "../../../../lib/email";
import { nanoid } from 'nanoid';

export async function POST(req: NextRequest) {
    try {
        const data = await req.json();
        const { email, password, role } = data;
    
        const hashedPassword = await bcrypt.hash(password, 10);

        const allowedRoles = ["USER", "ADMIN", "PAID_USER"];
        
            if (!allowedRoles.includes(role)) {
      return NextResponse.json({ error: "Invalid role" }, { status: 400 });
    }
       
        const user = await prisma.user.create({
        data: {
            email,
            password: hashedPassword,
            role,
            emailVerified: null,
        },
        });
    
        const verificationToken = nanoid(32);
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

    return NextResponse.json({ message: "User created. Please verify your email." }, { status: 201 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Failed to create user' }, { status: 500 });
    }
    }
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';
import bcrypt from 'bcryptjs';

export async function POST(req: NextRequest) {
    try {
        const data = await req.json();
        const { email, password } = data;
    
        const hashedPassword = await bcrypt.hash(password, 10);
    
        const user = await prisma.user.create({
        data: {
            email,
            password: hashedPassword,
        },
        });
    
        return NextResponse.json(user, { status: 201 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Failed to create user' }, { status: 500 });
    }
    }
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';

export async function POST(req: NextRequest) {
  
  try {

    const data = await req.json();
    const { title, author, pages, genres, rating } = data;

    const book = await prisma.book.create({
      data: {
        title,
        author,
        pages,
        genres,
        rating,
      },
    });

    return NextResponse.json(book, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to create book' }, { status: 500 });
  }
}

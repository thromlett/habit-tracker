import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import { prisma } from "@/lib/prisma";

const MAX_RESULTS = 20;

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.id) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }
    const me = session.user.id;

    const { query } = await req.json().catch(() => ({} as { query?: string }));
    const q = String(query ?? "").trim();

    if (!q) {
      return NextResponse.json({ users: [] }, { status: 200 });
    }

    // Find users by username (case-insensitive), excluding self
    const candidates = await prisma.user.findMany({
      where: {
        id: { not: me },
        userName: { contains: q, mode: "insensitive" as const },
      },
      select: {
        id: true,
        userName: true,
        image: true,
      },
      take: MAX_RESULTS,
      orderBy: { userName: "asc" },
    });

    // For each candidate, get followerCount (bounded by MAX_RESULTS so N+1 is fine)
    const users = await Promise.all(
      candidates.map(async (u) => {
        const followerCount = await prisma.follow.count({
          where: { followingId: u.id },
        });
        return {
          id: u.id,
          userName: u.userName,
          image: u.image,
          followerCount,
        };
      })
    );

    return NextResponse.json({ users }, { status: 200 });
  } catch (err) {
    console.error("Search error:", err);
    return NextResponse.json({ error: "Search failed" }, { status: 500 });
  }
}

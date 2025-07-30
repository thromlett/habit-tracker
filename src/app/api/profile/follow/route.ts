import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import { getServerSession } from "next-auth";

async function getUserName(name: string): Promise<string | null> {
  const user = await prisma.user.findUnique({ where: { userName: name } });
  return user?.id ?? null;
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.id) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }
    const userId = session.user.id;

    const follows = await prisma.follow.findMany({
      where: { followerId: userId },
      include: {
        following: {
          select: {
            userName: true,
            id: true,
          },
        },
      },
    });

    // For each following user, get their follower count
    const usersWithFollowerCount = await Promise.all(
      follows.map(async (follow) => {
        const followerCount = await prisma.follow.count({
          where: { followingId: follow.following.id },
        });
        return {
          ...follow.following,
          followerCount,
        };
      })
    );

    return NextResponse.json(
      { following: usersWithFollowerCount },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching user name:", error);
    return NextResponse.json(
      { error: "Failed to fetch user name" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.id) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }
    const userId = session.user.id;
    const data = await req.json();

    const following = await getUserName(data.name);
    if (!following) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    // add following to users followers list
    await prisma.follow.create({
      data: {
        follower: { connect: { id: userId } },
        following: { connect: { id: following } },
      },
    });

    return NextResponse.json({ following }, { status: 200 });
  } catch (error) {
    console.error("Error fetching user:", error);
    return NextResponse.json(
      { error: "Failed to fetch user" },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.id) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }
    const userId = session.user.id;

    const user = await prisma.follow.delete({
      where: { id: userId },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({}, { status: 200 });
  } catch (error) {
    console.error("Error deleting user:", error);
    return NextResponse.json(
      { error: "Failed to delete user" },
      { status: 500 }
    );
  }
}

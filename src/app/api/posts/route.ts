import { prisma } from "@/prisma";
import { auth } from "@clerk/nextjs/server";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const userProfileId = searchParams.get("userProfileId");
    const page = searchParams.get("cursor") || "1"; // Default to 1
    const LIMIT = 3;

    const { userId } = await auth();
    if (!userId) {
        return new Response("Unauthorized", { status: 401 });
    }

    const pageNumber = Number(page);
    if (isNaN(pageNumber)) {
        return new Response("Invalid cursor", { status: 400 });
    }

    const whereCondition = userProfileId && userProfileId !== "undefined"
        ? { parentPostId: null, userId: userProfileId }
        : {
            parentPostId: null,
            userId: {
                in: [
                    userId,
                    ...(await prisma.follow.findMany({
                        where: { followerId: userId },
                        select: { followingId: true },
                    })).map((follow) => follow.followingId),
                ],
            },
        };

    const posts = await prisma.post.findMany({
        where: whereCondition,
        include: {
            user: {select: { displayName: true, username: true, img: true }},
            rePost: {
                include: {
                user: {select: { displayName: true, username: true, img: true }},
                }
            }
        },
        take: LIMIT,
        skip: (pageNumber - 1) * LIMIT,
    });

    const totalPosts = await prisma.post.count({ where: whereCondition });
    const hasMore = pageNumber * LIMIT < totalPosts;

    // await new Promise((resolve) => setTimeout(resolve, 3000));

    return Response.json({ posts, hasMore });
}
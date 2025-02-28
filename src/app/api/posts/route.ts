import { prisma } from "@/prisma";
import { auth } from "@clerk/nextjs/server";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {

    const searchParams = request.nextUrl.searchParams;

    const userProfileId = searchParams.get("userProfileId");

    const { userId } = await auth(); 
    if(!userId) return;

    const whereCondition = userProfileId ? { parentPostId: null, userId: userProfileId } : {
    parentPostId: null,
    userId: {
    in:[userId,...(await prisma.follow.findMany({ where: {followerId: userId}, select: {followingId: true} })).map(follow => follow.followingId)]
    }}
    const posts = await prisma.post.findMany({where: whereCondition})
    
    return Response.json(posts);
}
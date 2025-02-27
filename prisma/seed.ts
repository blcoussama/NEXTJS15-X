import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
async function main() {
    // Delete existing data (in the correct order to respect foreign key constraints)
    await prisma.savedPosts.deleteMany({});
    await prisma.like.deleteMany({});
    await prisma.follow.deleteMany({});
    await prisma.post.deleteMany({});
    await prisma.user.deleteMany({});
    
    console.log("Existing data deleted");

    const users = [];
    for (let i = 1; i <= 5; i++) {
        const user = await prisma.user.create({
            data: {
                id: `user${i}`,
                email: `user${i}@example.com`,
                username: `user${i}`,
                displayName: `User ${i}`,
                bio: `Hi im User ${i}, Welcome to Prisma!`,
                location: `USA`,
                job: `developer`,
                website: `google.com`,
            }
        });
        users.push(user);
    }
    console.log("5 Users Created.");

    const posts = [];
    for (let i = 0; i < users.length; i++) {
        for (let j = 0; j < 5; j++) {
            const post = await prisma.post.create({
                data: {
                    description: `Post ${i + 1} by User ${i + 1}`,
                    userId: users[i].id,
                }
            });
            posts.push(post);
        }
        
    }
    console.log("Posts Created.");

    await prisma.follow.createMany({
        data: [
            { followerId: users[0].id, followingId: users[1].id },
            { followerId: users[0].id, followingId: users[2].id },
            { followerId: users[1].id, followingId: users[3].id },
            { followerId: users[2].id, followingId: users[4].id },
            { followerId: users[3].id, followingId: users[1].id },
        ]
    })
    console.log('Follows Created.')


    await prisma.like.createMany({
        data: [
            { userId: users[0].id, postId: posts[0].id },
            { userId: users[1].id, postId: posts[1].id },
            { userId: users[2].id, postId: posts[2].id },
            { userId: users[3].id, postId: posts[3].id },
            { userId: users[4].id, postId: posts[4].id },
        ]
    })
    console.log('Likes Created.')

    const comments = [];
    for(let i = 0; i < posts.length; i++) {
        const comment = await prisma.post.create({
            data: {
                description: `Comment on Post ${posts[i].id} by ${users[(i + 1) % users.length].username}`,
                userId: users[(i + 1) % users.length].id,
                parentPostId: posts[i].id
            }
        })
        comments.push(comment);
    }
    console.log("Comment Created.");

    const reposts = [];
    for (let i = 0; i < posts.length; i++) {
        const repost = await prisma.post.create({
            data: {
                description: `Repost of Post ${posts[i].id} by ${users[(i + 2) % users.length].username}`,
                userId: users[(i + 2) % users.length].id,
                rePostId: posts[i].id,
            }
        })
        reposts.push(repost);
    }
    console.log("Reposts Created.");

    await prisma.savedPosts.createMany({
        data: [
            { userId: users[0].id, postId: posts[1].id },
            { userId: users[1].id, postId: posts[2].id },
            { userId: users[2].id, postId: posts[3].id },
            { userId: users[3].id, postId: posts[4].id },
            { userId: users[4].id, postId: posts[0].id },
        ]
    })
    console.log("SavedPosts Created.");
    
}

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    })
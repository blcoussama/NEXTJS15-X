"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import InfiniteScroll from "react-infinite-scroll-component";
import Post from "./Post";

const fetchPosts = async (pageParam: number, userProfileId?: string) => {
    const queryParams = new URLSearchParams();
    queryParams.append("cursor", pageParam.toString());
    if (userProfileId) {
        queryParams.append("userProfileId", userProfileId);
    }
    const response = await fetch(`http://localhost:3000/api/posts?${queryParams.toString()}`);
    return response.json();
};

const InfiniteFeed = ({ userProfileId }: { userProfileId?: string }) => {
    const { data, error, status, hasNextPage, fetchNextPage } = useInfiniteQuery({
        queryKey: ["posts", userProfileId], // Include userProfileId in key for cache differentiation
        queryFn: ({ pageParam = 1 }) => fetchPosts(pageParam, userProfileId),
        initialPageParam: 1,
        getNextPageParam: (lastPage, pages) => (lastPage.hasMore ? pages.length + 1 : undefined),
    });

    if (error) return "Something went wrong";
    if (status === "pending") return "Loading...";

    const allPosts = data?.pages?.flatMap((page) => page.posts) || [];

    return (
        <InfiniteScroll
            dataLength={allPosts.length}
            next={fetchNextPage}
            hasMore={!!hasNextPage}
            loader={<h1>Posts are Loading...</h1>}
            endMessage={<h1>All Posts are loaded.</h1>}
        >
            {allPosts.map((post) => (
                <Post key={post.id} post={post} />
            ))}
        </InfiniteScroll>
    );
};

export default InfiniteFeed;
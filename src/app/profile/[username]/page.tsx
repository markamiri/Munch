import {
  getProfileByUsername,
  getUserLikedPosts,
} from "@/actions/profile.actions";
import { notFound } from "next/navigation";
import React from "react";
import { getUserPosts } from "@/actions/profile.actions";
import { isFollowing } from "@/actions/profile.actions";
import ProfilePageClient from "./ProfilePageClient";
export async function generateMetadata({
  params,
}: {
  params: { username: string };
}) {
  const user = await getProfileByUsername(params.username);
  if (!user)
    return {
      title: "User not found",
      description: "This user profile does not exist",
    };
  return {
    title: `${user.name ?? user.username}`,
    description: user.bio || `check out ${user.username}'s profile`,
  };
}

async function ProfilePageServer({ params }: { params: { username: string } }) {
  const user = await getProfileByUsername(params.username);
  if (!user) notFound();

  const [posts, likedPosts, isCurrentUserFollowing] = await Promise.all([
    getUserPosts(user.id),
    getUserLikedPosts(user.id),
    isFollowing(user.id),
  ]);
  return (
    <ProfilePageClient
      user={user}
      posts={posts}
      likedPosts={likedPosts}
      isFollowing={isCurrentUserFollowing}
    />
  );
}

export default ProfilePageServer;

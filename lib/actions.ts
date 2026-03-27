"use server";

import { prisma } from "./prisma";
import { revalidatePath } from "next/cache";

export async function saveGame(gameId: string, data: { title?: string, code?: string, scene?: string }) {
  try {
    // For now, we update or create a project linked to a game
    // If gameId is 'demo', we just simulate success until auth is fully wired
    if (gameId === "demo") return { success: true, message: "Demo saved locally!" };

    const project = await prisma.project.upsert({
      where: { id: gameId },
      update: {
        files_json: JSON.stringify({ "main.js": data.code }),
        scene_json: data.scene || "{}",
        last_saved: new Date(),
      },
      create: {
        id: gameId,
        files_json: JSON.stringify({ "main.js": data.code }),
        scene_json: data.scene || "{}",
        gameId: "some-game-id", // This would be the FK
        userId: "some-user-id", // This would come from session
      },
    });

    revalidatePath("/editor");
    return { success: true, project };
  } catch (error) {
    console.error("Failed to save game:", error);
    return { success: false, error: "Database error" };
  }
}

export async function createGame(data: { title: string, description: string, status: string, userId?: string }) {
  try {
    const game = await prisma.game.create({
      data: {
        title: data.title,
        description: data.description,
        status: data.status,
        userId: data.userId || "demo-user-id", // Fallback for mockup
        thumbnail: "bg-purple-600/20", // Default thumb
      }
    });

    revalidatePath("/explore");
    return { success: true, game };
  } catch (error) {
    console.error("Failed to create game:", error);
    return { success: false, error: "Database error" };
  }
}

export async function toggleFollow(followerId: string, followingId: string) {
  try {
    const existing = await prisma.follow.findUnique({
      where: { followerId_followingId: { followerId, followingId } }
    });

    if (existing) {
      await prisma.follow.delete({
        where: { id: existing.id }
      });
      revalidatePath(`/profile/[username]`);
      return { success: true, following: false };
    } else {
      await prisma.follow.create({
        data: { followerId, followingId }
      });
      revalidatePath(`/profile/[username]`);
      return { success: true, following: true };
    }
  } catch (error) {
    console.error("Failed to toggle follow:", error);
    return { success: false, error: "Database error" };
  }
}

export async function updateUserProfile(userId: string, data: { bio?: string, username?: string, avatarColor?: string, coverImage?: string }) {
  try {
    await prisma.user.update({
      where: { username: userId },
      data: {
        bio: data.bio,
        username: data.username,
      }
    });

    revalidatePath(`/profile/[username]`);
    return { success: true };
  } catch (error) {
    console.error("Failed to update profile:", error);
    return { success: false, error: "Database error" };
  }
}

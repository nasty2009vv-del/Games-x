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

export async function publishGame(gameId: string) {
  // Logic to change status to 'published'
  return { success: true };
}

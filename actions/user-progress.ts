"use server";

import { auth, currentUser } from "@clerk/nextjs";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import db from "@/db/drizzle";
import { getUserProfile } from "@/db/queries";
import { challengeProgress, challenges, userProfile } from "@/db/schema";

export const upsertUserProfile = async (activeUnitId?: number) => {
  const { userId } = auth();
  const user = await currentUser();

  if (!userId || !user) throw new Error("Unauthorized.");

  const existingUserProfile = await getUserProfile();

  if (existingUserProfile) {
    // Update existing user profile with activeUnitId if it already exists
    await db
      .update(userProfile)
      .set({
        userName: user.firstName || "User",
        profileImageSrc: user.imageUrl || "/book_5221784.png",
        activeUnitId: activeUnitId ?? existingUserProfile.activeUnitId,
      })
      .where(eq(userProfile.userId, userId));

    revalidatePath("/learn");
    redirect("/learn");
  } else {
    // Create new user profile with activeUnitId
    await db.insert(userProfile).values({
      userId: userId,
      userName: user.firstName || "User",
      profileImageSrc: user.imageUrl || "/book_5221784.png",
      activeUnitId: activeUnitId || 1,
    });

    // Fetch all challenge IDs from the challenges table
    const allChallenges = await db.query.challenges.findMany({
      columns: { id: true },
    });
    const allChallengeIds = allChallenges.map((challenge) => challenge.id);

    // Check which challenges already have progress entries for the user
    const existingProgress = await db.query.challengeProgress.findMany({
      where: eq(challengeProgress.userId, userId),
      columns: { challengeId: true },
    });
    const existingChallengeIds = existingProgress.map(
      (progress) => progress.challengeId
    );

    // Determine which challenge IDs need to be inserted
    const newChallengeIds = allChallengeIds.filter(
      (id) => !existingChallengeIds.includes(id)
    );

    // Insert progress entries only for challenges not yet completed by the user
    if (newChallengeIds.length > 0) {
      await db.insert(challengeProgress).values(
        newChallengeIds.map((challengeId) => ({
          userId,
          challengeId,
          completed: false,
        }))
      );
    }

    revalidatePath("/learn");
    redirect("/learn");
  }
};

export const markChallengeComplete = async (challengeId: number) => {
  const { userId } = auth();

  if (!userId) throw new Error("Unauthorized.");

  const challenge = await db.query.challenges.findFirst({
    where: eq(challenges.id, challengeId),
  });

  if (!challenge) throw new Error("Challenge not found.");

  const existingChallengeProgress = await db.query.challengeProgress.findFirst({
    where: eq(challengeProgress.challengeId, challengeId),
  });

  if (!existingChallengeProgress) {
    // Mark challenge as completed if not already done
    await db.insert(challengeProgress).values({
      userId,
      challengeId,
      completed: true,
    });

    revalidatePath(`/lesson/${challenge.lessonId}`);
  } else {
    // Update existing challenge progress to completed
    await db
      .update(challengeProgress)
      .set({ completed: true })
      .where(eq(challengeProgress.id, existingChallengeProgress.id));

    revalidatePath(`/lesson/${challenge.lessonId}`);
  }
};

export const markLessonComplete = async (lessonId: number) => {
  const { userId } = auth();
  
  if (!userId) throw new Error("Unauthorized.");

  // Retrieve all challenges in the lesson
  const lessonChallenges = await db.query.challenges.findMany({
    where: eq(challenges.lessonId, lessonId),
  });

  if (lessonChallenges.length === 0) throw new Error("No challenges found for this lesson.");

  // Loop through challenges and mark each as completed
  for (const challenge of lessonChallenges) {
    const existingProgress = await db.query.challengeProgress.findFirst({
      where: eq(challengeProgress.challengeId, challenge.id),
    });

    if (!existingProgress) {
      await db.insert(challengeProgress).values({
        userId,
        challengeId: challenge.id,
        completed: true,
      });
    } else {
      await db
        .update(challengeProgress)
        .set({ completed: true })
        .where(eq(challengeProgress.id, existingProgress.id));
    }


  }

  revalidatePath(`/lesson/${lessonId}`);
};
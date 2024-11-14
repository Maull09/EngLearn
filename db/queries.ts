import { cache } from "react";
import { auth } from "@clerk/nextjs";
import { eq } from "drizzle-orm";
import db from "./drizzle";
import { units, lessons, challenges, challengeProgress, userProfile } from "./schema";

export const getUserProfile = cache(async () => {
  const { userId } = auth();
  if (!userId) return null;

  const data = await db.query.userProfile.findFirst({
    where: eq(userProfile.userId, userId),
  });

  return data;
});

export const getUserChallengeProgress = cache(async () => {
  const { userId } = auth();
  if (!userId) return null;

  const data = await db.query.challengeProgress.findMany({
    where: eq(challengeProgress.userId, userId),
  });

  return data;
});

export const getUnits = cache(async () => {
  const { userId } = auth();
  const userProgress = await getUserProfile();
  if (!userId || !userProgress) return [];

  const data = await db.query.units.findMany({
    orderBy: (units, { asc }) => [asc(units.order)],
    with: {
      lessons: {
        orderBy: (lessons, { asc }) => [asc(lessons.order)],
        with: {
          challenges: {
            with: {
              challengeProgress: {
                where: eq(challengeProgress.userId, userId),
              },
            },
          },
        },
      },
    },
  });

  const normalizedData = data.map((unit) => {
    const lessonsWithCompletedStatus = unit.lessons.map((lesson) => {
      const allCompletedChallenges = lesson.challenges.every((challenge) => {
        return (
          challenge.challengeProgress &&
          challenge.challengeProgress.length > 0 &&
          challenge.challengeProgress.every((progress) => progress.completed)
        );
      });
      return { ...lesson, completed: allCompletedChallenges };
    });

    return { ...unit, lessons: lessonsWithCompletedStatus };
  });

  return normalizedData;
});

export const getUnitById = cache(async (unitId: number) => {
  const data = await db.query.units.findFirst({
    where: eq(units.id, unitId),
    with: {
      lessons: {
        orderBy: (lessons, { asc }) => [asc(lessons.order)],
      },
    },
  });
  return data;
});

export const getLesson = cache(async (id?: number) => {
  const { userId } = auth();
  if (!userId) return null;

  if (!id) return null;

  const data = await db.query.lessons.findFirst({
    where: eq(lessons.id, id),
    with: {
      challenges: {
        with: {
          challengeOptions: true,
          challengeProgress: {
            where: eq(challengeProgress.userId, userId),
          },
        },
      },
    },
  });

  if (!data || !data.challenges) return null;

  const normalizedChallenges = data.challenges.map((challenge) => {
    const completed =
      challenge.challengeProgress &&
      challenge.challengeProgress.length > 0 &&
      challenge.challengeProgress.every((progress) => progress.completed);
    return { ...challenge, completed };
  });

  return { ...data, challenges: normalizedChallenges };
});

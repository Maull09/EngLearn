import { lessons } from "@/db/schema";
import { LessonButton } from "./lesson-button";
import { UnitBanner } from "./unit-banner";

type UnitProps = {
  id: number;
  title: string;
  order: number;
  description: string;
  lessons: (typeof lessons.$inferSelect & {
    completed: boolean;
    challenges: { id: number }[];
  })[];
  userChallengeProgress: { challengeId: number; completed: boolean }[]; // Use user's progress data
};

export const Unit = ({ title, description, lessons, userChallengeProgress }: UnitProps) => {
  // Create a set of completed challenge IDs for quick lookup
  const completedChallengeIds = new Set(
    userChallengeProgress
      .filter((progress) => progress.completed)
      .map((progress) => progress.challengeId)
  );

  return (
    <>
      <UnitBanner title={title} description={description} />

      <div className="relative flex flex-col items-center">
        {lessons.map((lesson, i) => {
          // Determine if the lesson is completed by checking all its challenges
          const isLessonCompleted = lesson.challenges.every(
            (challenge) => completedChallengeIds.has(challenge.id)
          );

          const isCurrent = !isLessonCompleted; // Next lesson to work on if incomplete
          const isLocked = !isLessonCompleted && !isCurrent;

          return (
            <LessonButton
              key={lesson.id}
              id={lesson.id}
              index={i}
              totalCount={lessons.length - 1}
              current={isCurrent}
              locked={isLocked}
              completed={isLessonCompleted}
            />
          );
        })}
      </div>
    </>
  );
};

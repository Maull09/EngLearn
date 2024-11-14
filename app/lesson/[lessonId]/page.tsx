import { redirect } from "next/navigation";

import { getLesson, getUserChallengeProgress } from "@/db/queries";

import { Quiz } from "../quiz";
import { VideoPlayer } from "../video";

type LessonIdPageProps = {
  params: {
    lessonId: number;
  };
};

const LessonIdPage = async ({ params }: LessonIdPageProps) => {
  const lessonData = getLesson(params.lessonId);
  const userChallengeProgressData = getUserChallengeProgress();

  const [lesson, userChallengeProgress] = await Promise.all([
    lessonData,
    userChallengeProgressData,
  ]);

  if (!lesson || !userChallengeProgress) return redirect("/learn");

  // Check if the entire lesson is completed
  const isLessonCompleted = lesson.challenges.every((challenge) =>
    userChallengeProgress.some(
      (progress) => progress.challengeId === challenge.id && progress.completed
    )
  );

  return (
    <>
      {lesson.lessonType === "QUIZ" ? (
        <Quiz
          lesson={{
            id: lesson.id,
            title: lesson.title,
            challenges: lesson.challenges.map((challenge: any) => ({
              ...challenge,
              challengeOptions: challenge.challengeOptions, // Ensure challengeOptions is included
              completed: userChallengeProgress.some(
                (progress) => progress.challengeId === challenge.id && progress.completed
              ),
            })),
          }}
          isLessonCompleted={isLessonCompleted}
        />
      ) : (
          <VideoPlayer
          lesson={{
            id: lesson.id,
            title: lesson.title,
            videoUrl: lesson.videoUrl,
          }}
          isLessonCompleted={false} // Initial state for VideoPlayer; it will handle completion status itself
        />      )}
    </>
  );
};

export default LessonIdPage;

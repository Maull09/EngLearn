import { redirect } from "next/navigation";
import { getLesson, getUserChallengeProgress } from "@/db/queries";

import { Quiz } from "./quiz";
import { VideoPlayer } from "./video";

const LessonPage = async ({ params }: { params: { id: number } }) => {
  const lessonData = getLesson(params.id); // Fetch the specific lesson using its ID
  const userChallengeProgressData = getUserChallengeProgress();

  const [lesson, userChallengeProgress] = await Promise.all([
    lessonData,
    userChallengeProgressData,
  ]);

  // Redirect if lesson or user challenge progress is not available
  if (!lesson || !userChallengeProgress) return redirect("/learn");

  // Check if the entire lesson is completed by verifying user progress on each challenge
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

export default LessonPage;

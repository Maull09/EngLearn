"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useWindowSize } from "react-use";
import Confetti from "react-confetti";
import { Footer } from "./footer";
import { Header } from "./header";
import Image from "next/image";
import { markChallengeComplete, markLessonComplete } from "@/actions/user-progress";

type VideoPlayerProps = {
  lesson: {
    id: number;
    title: string;
    videoUrl: string | null;
  };
  isLessonCompleted: boolean;
};

export const VideoPlayer = ({ lesson, isLessonCompleted }: VideoPlayerProps) => {
  const { width, height } = useWindowSize();
  const router = useRouter();
  const [isCompleted, setIsCompleted] = useState(isLessonCompleted);
  const [showConfetti, setShowConfetti] = useState(false);

  // Initialize YouTube player (if video URL is available)
  useEffect(() => {
    if (!lesson.videoUrl || isLessonCompleted) return;

    const initializePlayer = () => {
      if ((window as any).YT && (window as any).YT.Player) {
        new (window as any).YT.Player("youtube-player", {
          videoId: lesson.videoUrl ? lesson.videoUrl.split("/").pop() : "",
        });
      }
    };

    if (!(window as any).YT) {
      const script = document.createElement("script");
      script.src = "https://www.youtube.com/iframe_api";
      document.body.appendChild(script);
      (window as any).onYouTubeIframeAPIReady = initializePlayer;
    } else {
      initializePlayer();
    }
  }, [lesson.videoUrl]);

  // Trigger confetti and completion state when "Complete" is clicked
  const onComplete = async () => {
    setIsCompleted(true);
    setShowConfetti(true);
    await markLessonComplete(lesson.id);
  };

  const onContinue = () => {
    router.push("/learn");
  };

  if (showConfetti) {
    return (
      <>
        <Confetti
          recycle={false}
          numberOfPieces={500}
          tweenDuration={10000}
          width={width}
          height={height}
        />
        <div className="mx-auto flex h-full max-w-lg flex-col items-center justify-center gap-y-4 text-center lg:gap-y-8">
          <Image
            src="/finish.svg"
            alt="Finish"
            className="hidden lg:block"
            height={100}
            width={100}
          />
          <h1 className="text-lg font-bold text-neutral-700 lg:text-3xl">
            Great job! <br /> You've completed the lesson.
          </h1>
        </div>
        <Footer onCheck={onContinue} status="completed" />
      </>
    );
  }

  return (
    <>
      <Header title={lesson.title} />

      <div className="flex flex-1 items-center justify-center p-8">
        <div className="relative w-full max-w-3xl">
          {lesson.videoUrl ? (
            <div id="youtube-player" className="w-full aspect-video rounded-md shadow-lg"></div>
          ) : (
            <p className="text-center text-red-500">Video not available.</p>
          )}
        </div>
      </div>

      <Footer
        disabled={false} // Allow immediate "Complete" action
        status={isCompleted ? "completed" : "none"}
        onCheck={onComplete} // Trigger confetti and complete lesson
        isVideoLesson
      />
    </>
  );
};

"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Confetti from "react-confetti";
import { useWindowSize } from "react-use";
import { toast } from "sonner";
import Image from "next/image";

import { markChallengeComplete } from "@/actions/user-progress";
import { Footer } from "./footer";
import { Header } from "./header";
import { Challenge } from "./challenge";

type QuizProps = {
  lesson: {
    id: number;
    title: string;
    challenges: {
      id: number;
      question: string;
      challengeOptions: { id: number; challengeId: number; text: string; correct: boolean }[];
      completed: boolean;
    }[];
  };
  isLessonCompleted: boolean;
};

export const Quiz = ({ lesson, isLessonCompleted }: QuizProps) => {
  const { width, height } = useWindowSize();
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  const initialIndex = lesson.challenges.findIndex((challenge) => !challenge.completed) === -1 ? 0 : 
                       lesson.challenges.findIndex((challenge) => !challenge.completed);
  const [activeIndex, setActiveIndex] = useState(initialIndex);
  const [status, setStatus] = useState<"correct" | "wrong" | "none" | "completed">(
    isLessonCompleted ? "completed" : "none"
  );
  const [selectedOption, setSelectedOption] = useState<number | undefined>(undefined);
  const [showConfetti, setShowConfetti] = useState(false);

  const challenge = lesson.challenges[activeIndex];
  const options = challenge?.challengeOptions ?? [];

  const onSelect = (id: number) => {
    setSelectedOption(id);
    setStatus("none");
  };

  const onContinue = () => {
    if (!challenge) return;

    const correctOption = options.find((option) => option.correct);
    if (correctOption?.id === selectedOption) {
      setStatus("correct");
      startTransition(() => {
        markChallengeComplete(challenge.id)
          .then(() => {
            if (activeIndex < lesson.challenges.length - 1) {
              setActiveIndex((prev) => prev + 1);
              setSelectedOption(undefined);
              setStatus("none");
            } else {
              // Last question answered correctly, show confetti
              setStatus("completed");
              setShowConfetti(true);
            }
          })
          .catch(() => toast.error("Something went wrong. Please try again."));
      });
    } else {
      setStatus("wrong");
      toast.error("Incorrect answer. Try again.");
    }
  };

  if (showConfetti) {
    return (
      <>
        <Confetti recycle={false} numberOfPieces={500} tweenDuration={10000} width={width} height={height} />
        <div className="mx-auto flex h-full max-w-lg flex-col items-center justify-center gap-y-4 text-center lg:gap-y-8">
          <Image src="/finish.svg" alt="Finish" className="hidden lg:block" height={100} width={100} />
          <h1 className="text-lg font-bold text-neutral-700 lg:text-3xl">
            Great job! <br /> You've completed the lesson.
          </h1>
        </div>
        <Footer onCheck={() => router.push("/learn")} status="completed" />
      </>
    );
  }

  return (
    <>
      <Header title={lesson.title} />
      <div className="flex-1">
        <div className="flex h-full items-center justify-center">
          <div className="flex w-full flex-col gap-y-12 px-6 lg:min-h-[350px] lg:w-[600px] lg:px-0">
            <Challenge
              options={options}
              question={challenge.question}
              onSelect={onSelect}
              selectedOption={selectedOption}
              disabled={pending}
              status={status}
            />
          </div>
        </div>
      </div>
      <Footer disabled={pending || selectedOption === undefined} status={status} onCheck={onContinue} />
    </>
  );
};

import { useCallback } from "react";
import { cn } from "@/lib/utils";

type CardProps = {
  id: number;
  text: string;
  selected?: boolean;
  onClick: () => void;
  status?: "correct" | "wrong" | "none" | "completed";
  disabled?: boolean;
};

export const Card = ({
  text,
  selected,
  onClick,
  status,
  disabled,
}: CardProps) => {
  const handleClick = useCallback(() => {
    if (disabled) return;
    onClick();
  }, [disabled, onClick]);

  return (
    <div
      onClick={handleClick}
      className={cn(
        "h-full cursor-pointer rounded-xl border-2 border-b-4 p-4 hover:bg-black/5 active:border-b-2 lg:p-6",
        selected && "border-sky-300 bg-sky-100 hover:bg-sky-100",
        selected && status === "correct" && "border-green-300 bg-green-100 hover:bg-green-100",
        selected && status === "wrong" && "border-rose-300 bg-rose-100 hover:bg-rose-100",
        disabled && "pointer-events-none hover:bg-white"
      )}
    >
      <p
        className={cn(
          "text-sm text-neutral-600 lg:text-base",
          selected && "text-sky-500",
          selected && status === "correct" && "text-green-500",
          selected && status === "wrong" && "text-rose-500"
        )}
      >
        {text}
      </p>
    </div>
  );
};

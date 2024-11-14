import { challengeOptions } from "@/db/schema";
import { cn } from "@/lib/utils";
import { Card } from "./card";
import { QuestionBubble } from "./question-bubble"; // Import the QuestionBubble component

type ChallengeProps = {
  options: (typeof challengeOptions.$inferSelect)[]; // List of challenge options
  question: string; // Question text for the challenge
  onSelect: (id: number) => void; // Function to call when an option is selected
  status: "correct" | "wrong" | "none" | "completed"; // Current status of the selection
  selectedOption?: number; // Currently selected option ID
  disabled?: boolean; // If the challenge is disabled
};

export const Challenge = ({
  options,
  question,
  onSelect,
  status,
  selectedOption,
  disabled,
}: ChallengeProps) => {
  return (
    console.log("Options data:", options),
    <div>
      {/* Question Bubble */}
      <QuestionBubble question={question} />

      {/* Challenge Options */}
      <div className={cn("grid gap-2", "grid-cols-2 lg:grid-cols-[repeat(auto-fit,minmax(0,1fr))]")}>
        {options.map((option) => (
          <Card
            key={option.id}
            id={option.id}
            text={option.text} // Display text of the option
            selected={selectedOption === option.id} // Check if this option is selected
            onClick={() => onSelect(option.id)} // Call onSelect when an option is clicked
            status={status} // Show status as correct, wrong, or none
            disabled={disabled} // Disable if necessary
          />
        ))}
      </div>
    </div>
  );
};

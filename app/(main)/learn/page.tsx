import { redirect } from "next/navigation";

import { FeedWrapper } from "@/components/feed-wrapper";
import { StickyWrapper } from "@/components/sticky-wrapper";
import { getUnits, getUserProfile, getUserChallengeProgress } from "@/db/queries";
import { Header } from "./header";
import { Unit } from "./unit";
import { upsertUserProfile } from "@/actions/user-progress";

const LearnPage = async () => {
  // Fetch user profile, units, and challenge progress
  const userProfileData = getUserProfile();
  const unitsData = getUnits();
  const userChallengeProgressData = getUserChallengeProgress();

  const [userProfile, units, userChallengeProgress] = await Promise.all([
    userProfileData,
    unitsData,
    userChallengeProgressData,
  ]);

  if (!userProfile) {
    await upsertUserProfile();
  }

  // Redirect if user profile or units are not available
  if (!userProfile) {
    return null;
  }

  return (
    <div className="flex flex-row-reverse gap-[48px] px-6">
      <FeedWrapper>
        <Header title="English Course" userName={userProfile.userName} profileImageSrc={userProfile.profileImageSrc ?? "/book_5221784.png"}/>
        {units.map((unit) => (
          <div key={unit.id} className="mb-10">
            <Unit
              id={unit.id}
              order={unit.order}
              description={unit.description}
              title={unit.title}
              lessons={unit.lessons}
              userChallengeProgress={userChallengeProgress ?? []}
            />
          </div>
        ))}
      </FeedWrapper>
    </div>
  );
};

export default LearnPage;

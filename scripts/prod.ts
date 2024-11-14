import { neon } from "@neondatabase/serverless";
import "dotenv/config";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "@/db/schema";

const sql = neon(process.env.DATABASE_URL);
const db = drizzle(sql, { schema });

const main = async () => {
  try {
    console.log("Seeding database");

    // Delete all existing data
    await Promise.all([
      db.delete(schema.challengeProgress),
      db.delete(schema.challengeOptions),
      db.delete(schema.challenges),
      db.delete(schema.lessons),
      db.delete(schema.units),
      db.delete(schema.userProfile),
    ]);

    // Insert user profiles (for sample users)
    await db.insert(schema.userProfile).values([
      { userId: "1", userName: "Alice", profileImageSrc: "/alice.jpg", activeUnitId: 1 },
      { userId: "2", userName: "Bob", profileImageSrc: "/bob.jpg", activeUnitId: 1 },
    ]);

    // Insert units
    const units = await db
      .insert(schema.units)
      .values([
        { title: "Simple Present Tense", description: "Basics of Simple Present Tense", order: 1 },
        { title: "Present Continuous Tense", description: "Basics of Present Continuous Tense", order: 2 },
      ])
      .returning();

    // Define lessons structure for each unit
    const lessonStructures: { title: string; lessonType: "VIDEO" | "QUIZ"; videoUrl?: string; order: number }[] = [
      { title: "Introduction", lessonType: "VIDEO", videoUrl: "/intro.mp4", order: 1 },
      { title: "Positive Form", lessonType: "QUIZ", order: 2 },
      { title: "Negative Form", lessonType: "QUIZ", order: 3 },
      { title: "Interrogative Form", lessonType: "QUIZ", order: 4 },
    ];

    // Define challenges and options for quiz lessons
    const challengeStructures = [
      {
        question: "Which sentence is in the positive form?",
        options: [
          { text: "I play football.", correct: true },
          { text: "I don't play football.", correct: false },
          { text: "Do I play football?", correct: false },
        ],
      },
      {
        question: "Which sentence is in the negative form?",
        options: [
          { text: "She likes pizza.", correct: false },
          { text: "She doesn't like pizza.", correct: true },
          { text: "Does she like pizza?", correct: false },
        ],
      },
      {
        question: "Which sentence is in the interrogative form?",
        options: [
          { text: "He runs fast.", correct: false },
          { text: "He doesn't run fast.", correct: false },
          { text: "Does he run fast?", correct: true },
        ],
      },
    ];

    // Loop through each unit and add lessons and challenges
    for (const unit of units) {
      const lessons = await db
        .insert(schema.lessons)
        .values(
          lessonStructures.map((lesson, index) => ({
            unitId: unit.id,
            title: lesson.title,
            lessonType: lesson.lessonType,
            videoUrl: lesson.videoUrl,
            order: index + 1,
          }))
        )
        .returning();

      // For each lesson, add challenges and options (for quiz lessons only)
      for (const lesson of lessons) {
        if (lesson.lessonType === "QUIZ") {
          for (const [index, challengeStruct] of challengeStructures.entries()) {
            const [challenge] = await db
              .insert(schema.challenges)
              .values({
                lessonId: lesson.id,
                question: challengeStruct.question,
                order: index + 1,
              })
              .returning();

            // Insert options for each challenge
            await db.insert(schema.challengeOptions).values(
              challengeStruct.options.map((option) => ({
                challengeId: challenge.id,
                text: option.text,
                correct: option.correct,
              }))
            );

            // Add completion tracking for sample users
            await db.insert(schema.challengeProgress).values([
              { userId: "1", challengeId: challenge.id, completed: false },
              { userId: "2", challengeId: challenge.id, completed: false },
            ]);
          }
        } else {
          // Add a single completion entry for video lessons
          const [challenge] = await db
            .insert(schema.challenges)
            .values({
              lessonId: lesson.id,
              question: "Watch the video",
              order: 1,
            })
            .returning();

          await db.insert(schema.challengeProgress).values([
            { userId: "1", challengeId: challenge.id, completed: false },
            { userId: "2", challengeId: challenge.id, completed: false },
          ]);
        }
      }
    }

    console.log("Database seeded successfully");
  } catch (error) {
    console.error("Failed to seed database:", error);
    throw new Error("Database seeding failed");
  }
};

void main();

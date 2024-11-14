import { relations } from "drizzle-orm";
import {
  boolean,
  integer,
  pgEnum,
  pgTable,
  serial,
  text,
  uuid,
} from "drizzle-orm/pg-core";

// Units Table (No longer tied to a course)
export const units = pgTable("units", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(), // E.g., "Simple Tenses"
  description: text("description").notNull(), // E.g., "Learn the basics of English tenses"
  order: integer("order").notNull(),
});

export const unitsRelations = relations(units, ({ many }) => ({
  lessons: many(lessons),
}));

// Lessons Table
export const lessonTypeEnum = pgEnum("lesson_type", ["QUIZ", "VIDEO"]);

export const lessons = pgTable("lessons", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(), // E.g., "Introduction to Simple Tenses"
  unitId: integer("unit_id")
    .references(() => units.id, {
      onDelete: "cascade",
    })
    .notNull(),
  lessonType: lessonTypeEnum("lesson_type").notNull(),
  videoUrl: text("video_url"), // Only if lessonType is "VIDEO"
  order: integer("order").notNull(),
});

export const lessonsRelations = relations(lessons, ({ one, many }) => ({
  unit: one(units, {
    fields: [lessons.unitId],
    references: [units.id],
  }),
  challenges: many(challenges),
}));

// Challenges Table (Multiple Choice Only)
export const challenges = pgTable("challenges", {
  id: serial("id").primaryKey(),
  lessonId: integer("lesson_id")
    .references(() => lessons.id, {
      onDelete: "cascade",
    })
    .notNull(),
  question: text("question").notNull(), // E.g., "What is the past tense of 'go'?"
  order: integer("order").notNull(),
});

export const challengesRelations = relations(challenges, ({ one, many }) => ({
  lesson: one(lessons, {
    fields: [challenges.lessonId],
    references: [lessons.id],
  }),
  challengeOptions: many(challengeOptions),
  challengeProgress: many(challengeProgress),
}));

// Challenge Options Table (Multiple Choice Options)
export const challengeOptions = pgTable("challenge_options", {
  id: serial("id").primaryKey(),
  challengeId: integer("challenge_id")
    .references(() => challenges.id, {
      onDelete: "cascade",
    })
    .notNull(),
  text: text("text").notNull(), // Option text, e.g., "went"
  correct: boolean("correct").notNull(), // Indicates if this option is correct
});

export const challengeOptionsRelations = relations(challengeOptions, ({ one }) => ({
  challenge: one(challenges, {
    fields: [challengeOptions.challengeId],
    references: [challenges.id],
  }),
}));

// Challenge Progress Table (Tracks Completion by User)
export const challengeProgress = pgTable("challenge_progress", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull(), // User identifier
  challengeId: integer("challenge_id")
    .references(() => challenges.id, {
      onDelete: "cascade",
    })
    .notNull(),
  completed: boolean("completed").notNull().default(false),
});

export const challengeProgressRelations = relations(challengeProgress, ({ one }) => ({
  challenge: one(challenges, {
    fields: [challengeProgress.challengeId],
    references: [challenges.id],
  }),
}));

// User Profile Table (Basic User Info)
export const userProfile = pgTable("user_profile", {
  userId: text("user_id").primaryKey(). notNull(), // User identifier
  userName: text("user_name").notNull().default("User"), // Default name
  profileImageSrc: text("profile_image_src").default("/default_avatar.png"),
  activeUnitId: integer("active_unit_id")
});

export const userProfileRelations = relations(userProfile, ({ many }) => ({
  quizCompletions: many(challengeProgress),
}));

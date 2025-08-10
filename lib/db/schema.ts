import {
  pgTable,
  serial,
  text,
  timestamp,
  boolean,
  jsonb,
  uuid,
  integer,
} from "drizzle-orm/pg-core";

// Users table
export const users = pgTable("users", {
  id: text("id").primaryKey(),
  name: text("name"),
  email: text("email"),
  walletId: text("wallet_id").notNull().unique(),
  walletAddress: text("wallet_address"),
  encryptedData: jsonb("encrypted_data"), // Encrypted personal/health data
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// Therapy sessions
export const therapySessions = pgTable("therapy_sessions", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: text("user_id").references(() => users.id),
  scheduledTime: timestamp("scheduled_time").notNull(),
  status: text("status").notNull(), // scheduled, completed, cancelled, in_progress
  type: text("type").notNull(), // video, audio, text, in-person
  notes: text("notes"),
  summary: text("summary"), // Session summary
  aiRecommendations: jsonb("ai_recommendations"), // AI-generated recommendations
  mood: text("mood"), // User's mood during session
  createdAt: timestamp("created_at").defaultNow(),
  completedAt: timestamp("completed_at"),
  title: text("title"),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// IoT device settings
export const deviceSettings = pgTable("device_settings", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: text("user_id").references(() => users.id),
  deviceType: text("device_type").notNull(), // philips_hue, alexa, etc.
  settings: jsonb("settings").notNull(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Health metrics
export const healthMetrics = pgTable("health_metrics", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: text("user_id").references(() => users.id),
  metricType: text("metric_type").notNull(), // heart_rate, stress_level, etc.
  value: jsonb("value").notNull(),
  timestamp: timestamp("timestamp").defaultNow(),
});

// User preferences
export const userPreferences = pgTable("user_preferences", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: text("user_id")
    .references(() => users.id)
    .unique(),
  notifications: boolean("notifications").default(true),
  aiInterventions: boolean("ai_interventions").default(true),
  preferences: jsonb("preferences").default({}),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// AI Chat History
export const chatHistory = pgTable("chat_history", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: text("user_id").references(() => users.id),
  message: text("message").notNull(),
  role: text("role").notNull(), // 'user' or 'assistant'
  timestamp: timestamp("timestamp").defaultNow(),
  sentiment: text("sentiment"), // Optional sentiment analysis
  context: jsonb("context"), // Store any relevant context
});

// Wearable Devices
export const wearableDevices = pgTable("wearable_devices", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: text("user_id").references(() => users.id),
  deviceType: text("device_type").notNull(), // 'fitbit', 'apple_watch', etc.
  deviceId: text("device_id").notNull(),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  lastSynced: timestamp("last_synced"),
  settings: jsonb("settings"),
});

// Health Metrics from Wearables
export const wearableMetrics = pgTable("wearable_metrics", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: text("user_id").references(() => users.id),
  deviceId: uuid("device_id").references(() => wearableDevices.id),
  metricType: text("metric_type").notNull(), // heart_rate, steps, sleep, etc.
  value: jsonb("value").notNull(),
  timestamp: timestamp("timestamp").defaultNow(),
  source: text("source").notNull(), // 'fitbit', 'manual', etc.
});

// Activities and Tasks
export const activities = pgTable("activities", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: text("user_id").references(() => users.id),
  type: text("type").notNull(), // 'mood', 'meditation', 'exercise', 'therapy', etc.
  name: text("name").notNull(),
  description: text("description"),
  timestamp: timestamp("timestamp").notNull().defaultNow(),
  duration: integer("duration"), // in minutes
  completed: boolean("completed").notNull().default(false),
  moodScore: integer("mood_score"), // 1-100 if type is 'mood'
  moodNote: text("mood_note"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// Activity Progress
export const activityProgress = pgTable("activity_progress", {
  id: uuid("id").primaryKey().defaultRandom(),
  activityId: uuid("activity_id").references(() => activities.id),
  userId: text("user_id").references(() => users.id),
  status: text("status").notNull(),
  startedAt: timestamp("started_at").notNull(),
  completedAt: timestamp("completed_at"),
  notes: text("notes"),
  metrics: jsonb("metrics"),
});

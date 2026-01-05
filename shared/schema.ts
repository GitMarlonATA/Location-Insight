export * from "./models/chat";

import { pgTable, text, serial, numeric, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const locationQueries = pgTable("location_queries", {
  id: serial("id").primaryKey(),
  latitude: text("latitude").notNull(), // Store as text to preserve precision
  longitude: text("longitude").notNull(),
  address: text("address"),
  description: text("description").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertLocationQuerySchema = createInsertSchema(locationQueries).omit({
  id: true,
  createdAt: true,
});

export type LocationQuery = typeof locationQueries.$inferSelect;
export type InsertLocationQuery = z.infer<typeof insertLocationQuerySchema>;

// Types for API
export const describeLocationSchema = z.object({
  latitude: z.number(),
  longitude: z.number(),
});

export type DescribeLocationRequest = z.infer<typeof describeLocationSchema>;

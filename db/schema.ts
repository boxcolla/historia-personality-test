import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const accessOrders = sqliteTable("access_orders", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  orderHash: text("order_hash").notNull().unique(),
  deviceHash: text("device_hash"),
  status: text("status").notNull().default("active"),
  activatedAt: integer("activated_at"),
  createdAt: integer("created_at").notNull(),
  expiresAt: integer("expires_at"),
  accessType: text("access_type").notNull().default("order"),
  completedCount: integer("completed_count").notNull().default(0),
  maxCompletions: integer("max_completions"),
});

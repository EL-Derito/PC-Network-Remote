import { pgTable, text, serial, integer, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const computers = pgTable("computers", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  processor: text("processor").notNull(),
  ram: text("ram").notNull(),
  storage: text("storage").notNull(),
  ipAddress: text("ip_address").notNull(),
  remoteEnabled: boolean("remote_enabled").notNull().default(false),
  remotePassword: text("remote_password"),
  status: text("status").notNull().default("offline"), // online, offline, warning
});

export const insertComputerSchema = createInsertSchema(computers).omit({
  id: true,
});

export const updateComputerSchema = insertComputerSchema.partial();

export type InsertComputer = z.infer<typeof insertComputerSchema>;
export type UpdateComputer = z.infer<typeof updateComputerSchema>;
export type Computer = typeof computers.$inferSelect;

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

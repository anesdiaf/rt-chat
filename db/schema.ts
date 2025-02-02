import { sql } from "drizzle-orm";
import { integer, pgTable, text, timestamp, varchar } from "drizzle-orm/pg-core";

export const messagesTable = pgTable("messages", {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    name: varchar({ length: 255 }).notNull(),
    message: text().notNull(),
    createdAt: timestamp().default(sql`now()`),
});


export type messageType = typeof messagesTable.$inferSelect;
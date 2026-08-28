import {
  mysqlTable,
  mysqlEnum,
  serial,
  varchar,
  text,
  timestamp,
} from "drizzle-orm/mysql-core";

export const rsvps = mysqlTable("rsvps", {
  id: serial("id").primaryKey(),
  eventSlug: varchar("event_slug", { length: 64 }).notNull(),
  name: varchar("name", { length: 120 }).notNull(),
  email: varchar("email", { length: 255 }).notNull(),
  whatsapp: varchar("whatsapp", { length: 40 }),
  level: varchar("level", { length: 40 }),
  message: text("message"),
  status: mysqlEnum("status", ["confirmed", "waitlist", "interest"])
    .notNull()
    .default("confirmed"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const contactMessages = mysqlTable("contact_messages", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 120 }).notNull(),
  email: varchar("email", { length: 255 }).notNull(),
  topic: varchar("topic", { length: 64 }),
  message: text("message").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export type Rsvp = typeof rsvps.$inferSelect;
export type ContactMessage = typeof contactMessages.$inferSelect;

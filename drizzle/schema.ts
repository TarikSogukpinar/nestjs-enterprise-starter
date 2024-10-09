import { pgTable, serial, text } from "drizzle-orm/pg-core"
  import { sql } from "drizzle-orm"




export const users = pgTable("users", {
	id: serial("id").primaryKey().notNull(),
	title: text("title"),
	content: text("content"),
});